import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCustomerDto,
  AuthenticateCustomerDto,
  TokenData,
  GetCustomerResponse,
  RefreshCustomerTokenDto,
} from '@microservice-stack-shop-demo/api/customer/data-transfer-objects';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from './customer.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@microservice-stack/nest-config';
import {
  ORDER_PAYMENT_RESERVED_EVENT,
  ORDER_PAYMENT_FAILED_EVENT,
} from '@microservice-stack-shop-demo/api/customer/constants';
import {
  AddCustomerCreditsDto,
  OrderCreatedEventPayload,
} from '@microservice-stack-shop-demo/api/order/data-transfer-objects';
import { RabbitmqService } from '@microservice-stack/nest-rabbitmq';
import { ReservedCreditsEntity } from './reserved-credits.entity';
import {
  OrderShipmentFailedEventPayload,
  OrderShipmentSucceededEventPayload,
} from '@microservice-stack-shop-demo/api/shipping/data-transfer-objects';
import { TokenService } from '@microservice-stack-shop-demo/api/customer/token';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
    @InjectRepository(ReservedCreditsEntity)
    private reservedCreditsRepository: Repository<ReservedCreditsEntity>,
    private configService: ConfigService,
    private rabbitmqService: RabbitmqService,
    private tokenService: TokenService
  ) {}

  public async createCustomer(body: CreateCustomerDto): Promise<TokenData> {
    const existingCustomer: CustomerEntity | null =
      await this.customerRepository.findOneBy({
        username: body.username,
      });

    if (existingCustomer !== null) {
      throw new BadRequestException(
        `Customer with username ${body.username} already exists`
      );
    }

    /**
     * This is just an example, please hash
     * your passwords before inserting them
     * into the database
     */
    const customer = await this.customerRepository.save(body);

    return this.tokenService.createAccessToken(customer.username, customer.id);
  }

  public async authenticateCustomer(
    body: AuthenticateCustomerDto
  ): Promise<TokenData> {
    const customer: CustomerEntity | null =
      await this.customerRepository.findOneBy({
        username: body.username,
        password: body.password,
      });

    if (customer === null) {
      throw new BadRequestException(
        'Invalid username or password for customer'
      );
    }

    return this.tokenService.createAccessToken(customer.username, customer.id);
  }

  public async refreshCustomerToken(
    body: RefreshCustomerTokenDto
  ): Promise<TokenData> {
    return this.tokenService.refreshAccessToken(body.refreshToken);
  }

  public async getCustomer(customerId: string): Promise<GetCustomerResponse> {
    const customer: CustomerEntity | null =
      await this.customerRepository.findOneBy({
        id: customerId,
      });

    if (customer === null) {
      throw new NotFoundException('Customer not found');
    }

    return {
      username: customer.username,
      creditAmount: customer.availableCredits,
    };
  }

  public async addCustomerCredits(
    customerId: string,
    body: AddCustomerCreditsDto
  ): Promise<void> {
    await this.customerRepository.increment(
      { id: customerId },
      'availableCredits',
      body.amount
    );
  }

  public async reserveOrderPayment(
    payload: OrderCreatedEventPayload
  ): Promise<void> {
    const customer: CustomerEntity | null =
      await this.customerRepository.findOneBy({
        id: payload.customerId,
      });

    if (payload.price > customer.availableCredits) {
      return this.rabbitmqService.publishEvent(ORDER_PAYMENT_FAILED_EVENT, {
        orderId: payload.orderId,
        customerId: payload.customerId,
      });
    }

    await this.customerRepository.decrement(
      { id: payload.customerId },
      'availableCredits',
      payload.price
    );

    await this.reservedCreditsRepository.save({
      orderId: payload.orderId,
      reservedAmount: payload.price,
    });

    this.rabbitmqService.publishEvent(ORDER_PAYMENT_RESERVED_EVENT, {
      orderId: payload.orderId,
      customerId: payload.customerId,
    });
  }

  public async returnReservedCredits(
    payload: OrderShipmentFailedEventPayload
  ): Promise<void> {
    const customer: CustomerEntity | null =
      await this.customerRepository.findOneBy({
        id: payload.customerId,
      });

    if (customer === null) {
      return;
    }

    const reservedCredits: ReservedCreditsEntity | null =
      await this.reservedCreditsRepository.findOneBy({
        orderId: payload.orderId,
      });

    if (reservedCredits === null) {
      return;
    }

    await this.customerRepository.increment(
      { id: payload.customerId },
      'availableCredits',
      reservedCredits.reservedAmount
    );

    await this.reservedCreditsRepository.delete({
      orderId: payload.orderId,
    });
  }

  public async applyReservedCredits(
    payload: OrderShipmentSucceededEventPayload
  ): Promise<void> {
    await this.reservedCreditsRepository.delete({
      orderId: payload.orderId,
    });
  }
}
