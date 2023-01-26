import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCustomerDto,
  AuthenticateCustomerDto,
  CustomerTokenData,
  GetCustomerUsernameResponse,
} from '@microservice-stack-shop-demo/api/customer/data-transfer-objects';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from './customer.entity';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@microservice-stack/nest-config';
import {
  ConfigVariables,
  ORDER_PAYMENT_RESERVED_EVENT,
  ORDER_PAYMENT_FAILED_EVENT,
} from '@microservice-stack-shop-demo/api/customer/constants';
import {
  AddCustomerCreditsDto,
  OrderCreatedEventPayload,
} from '@microservice-stack-shop-demo/api/order/data-transfer-objects';
import { RabbitmqService } from '@microservice-stack/nest-rabbitmq';
import { ReservedCreditsEntity } from './reserved-credits.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
    @InjectRepository(ReservedCreditsEntity)
    private reservedCreditsRepository: Repository<ReservedCreditsEntity>,
    private configService: ConfigService,
    private rabbitmqService: RabbitmqService
  ) {}

  public async createCustomer(
    body: CreateCustomerDto
  ): Promise<CustomerTokenData> {
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

    return this.createAccessToken(customer.username, customer.id);
  }

  public async authenticateCustomer(
    body: AuthenticateCustomerDto
  ): Promise<CustomerTokenData> {
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

    return this.createAccessToken(customer.username, customer.id);
  }

  private createAccessToken(
    username: string,
    customerId: string
  ): CustomerTokenData {
    const expiresIn = 3600 * 2;

    const accessToken: string = sign(
      {
        username,
      },
      this.configService.get(ConfigVariables.AUTHENTICATION_SECRET),
      {
        algorithm: 'HS256',
        expiresIn,
        subject: customerId,
      }
    );

    return {
      accessToken,
      expiry: Math.floor(Date.now() / 1000) + expiresIn,
    };
  }

  public async getCustomerUsername(
    customerId: string
  ): Promise<GetCustomerUsernameResponse> {
    const customer: CustomerEntity | null =
      await this.customerRepository.findOneBy({
        id: customerId,
      });

    if (customer === null) {
      throw new NotFoundException('Customer not found');
    }

    return {
      username: customer.username,
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
    });
  }
}
