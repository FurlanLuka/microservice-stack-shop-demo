import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import {
  CreateCustomerDto,
  CustomerTokenData,
  GetCustomerUsernameResponse,
} from '@microservice-stack-shop-demo/api/customer/data-transfer-objects';
import { CustomerService } from './customer.service';
import { UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '@microservice-stack-shop-demo/api/utils/authentication';
import { SERVICE_NAME } from '@microservice-stack-shop-demo/api/customer/constants';
import { Subscribe } from '@microservice-stack/nest-rabbitmq';
import { ORDER_CREATED_EVENT } from '@microservice-stack-shop-demo/api/order/constants';
import {
  AddCustomerCreditsDto,
  OrderCreatedEventPayload,
} from '@microservice-stack-shop-demo/api/order/data-transfer-objects';

@Controller('v1/customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post()
  public async createCustomer(
    @Body() body: CreateCustomerDto
  ): Promise<CustomerTokenData> {
    return this.customerService.createCustomer(body);
  }

  @Post('authenticate')
  public async authenticateCustomer(
    @Body() body: CreateCustomerDto
  ): Promise<CustomerTokenData> {
    return this.customerService.authenticateCustomer(body);
  }

  @Get('me')
  @UseGuards(AuthenticationGuard)
  public async getCustomerUsername(
    @Req() req
  ): Promise<GetCustomerUsernameResponse> {
    return this.customerService.getCustomerUsername(req.user.sub);
  }

  @Post('credits')
  @UseGuards(AuthenticationGuard)
  public async addCustomerCredits(
    @Req() req,
    @Body() body: AddCustomerCreditsDto
  ): Promise<void> {
    return this.customerService.addCustomerCredits(req.user.sub, body);
  }
}

@Controller()
export class CustomerQueueController {
  static QUEUE_NAME = `${SERVICE_NAME}-queue`;

  constructor(private customerService: CustomerService) {}

  @Subscribe(ORDER_CREATED_EVENT, CustomerQueueController.QUEUE_NAME, {})
  async orderCreatedEventHandler(
    payload: OrderCreatedEventPayload
  ): Promise<void> {
    return this.customerService.reserveOrderPayment(payload);
  }
}
