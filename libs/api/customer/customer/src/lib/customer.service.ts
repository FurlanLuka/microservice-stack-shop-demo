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
import { ConfigVariables } from '@microservice-stack-shop-demo/api/customer/constants';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
    private configService: ConfigService
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
    userId: string
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
        subject: userId,
      }
    );

    return {
      accessToken,
      expiry: Math.floor(Date.now() / 1000) + expiresIn,
    };
  }

  public async getCustomerUsername(
    userId: string
  ): Promise<GetCustomerUsernameResponse> {
    const customer: CustomerEntity | null =
      await this.customerRepository.findOneBy({
        id: userId,
      });

    if (customer === null) {
      throw new NotFoundException('Customer not found');
    }

    return {
      username: customer.username,
    };
  }
}
