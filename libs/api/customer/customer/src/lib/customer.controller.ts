import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import {
  CreateCustomerDto,
  TokenData,
  GetCustomerResponse,
  RefreshCustomerTokenDto,
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
import {
  ORDER_SHIPMENT_FAILED_EVENT,
  ORDER_SHIPMENT_SUCCEEDED_EVENT,
} from '@microservice-stack-shop-demo/api/shipping/constants';
import {
  OrderShipmentFailedEventPayload,
  OrderShipmentSucceededEventPayload,
} from '@microservice-stack-shop-demo/api/shipping/data-transfer-objects';

@Controller('v1/customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post()
  public async createCustomer(
    @Body() body: CreateCustomerDto
  ): Promise<TokenData> {
    return this.customerService.createCustomer(body);
  }

  @Post('token')
  public async authenticateCustomer(
    @Body() body: CreateCustomerDto
  ): Promise<TokenData> {
    return this.customerService.authenticateCustomer(body);
  }

  @Post('token/refresh')
  public async refreshCustomerToken(
    @Body() body: RefreshCustomerTokenDto
  ): Promise<TokenData> {
    return this.customerService.refreshCustomerToken(body);
  }

  @Get('me')
  @UseGuards(AuthenticationGuard)
  public async getCustomer(@Req() req): Promise<GetCustomerResponse> {
    return this.customerService.getCustomer(req.user.sub);
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

  @Subscribe(
    ORDER_SHIPMENT_FAILED_EVENT,
    CustomerQueueController.QUEUE_NAME,
    {}
  )
  async orderShipmentFailedEventHandler(
    payload: OrderShipmentFailedEventPayload
  ): Promise<void> {
    this.customerService.returnReservedCredits(payload);
  }

  @Subscribe(
    ORDER_SHIPMENT_SUCCEEDED_EVENT,
    CustomerQueueController.QUEUE_NAME,
    {}
  )
  async orderShipmentSucceededEventHandler(
    payload: OrderShipmentSucceededEventPayload
  ): Promise<void> {
    this.customerService.applyReservedCredits(payload);
  }
}
