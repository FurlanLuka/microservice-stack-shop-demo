import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CreateOrderDto,
  CreateOrderResponse,
  OrderStatus,
} from '@microservice-stack-shop-demo/api/order/data-transfer-objects';
import { AuthenticationGuard } from '@microservice-stack-shop-demo/api/utils/authentication';
import { OrderService } from './order.service';
import { OrderEntity } from './order.entity';
import { SERVICE_NAME } from '@microservice-stack-shop-demo/api/order/constants';
import { Subscribe } from '@microservice-stack/nest-rabbitmq';
import {
  ORDER_PAYMENT_FAILED_EVENT,
  ORDER_PAYMENT_RESERVED_EVENT,
} from '@microservice-stack-shop-demo/api/customer/constants';
import { OrderPaymentFailedEventPayload } from '@microservice-stack-shop-demo/api/customer/data-transfer-objects';
import {
  ORDER_SHIPMENT_FAILED_EVENT,
  ORDER_SHIPMENT_SUCCEEDED_EVENT,
} from '@microservice-stack-shop-demo/api/shipping/constants';
import {
  OrderShipmentFailedEventPayload,
  OrderShipmentSucceededEventPayload,
} from '@microservice-stack-shop-demo/api/shipping/data-transfer-objects';

@Controller('v1/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  public async createOrder(
    @Req() req,
    @Body() body: CreateOrderDto
  ): Promise<CreateOrderResponse> {
    return this.orderService.createOrder(req.user.sub, body);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  public async getOrder(
    @Param('id') orderId: string,
    @Req() req
  ): Promise<OrderEntity> {
    return this.orderService.getOrder(req.user.sub, orderId);
  }
}

@Controller()
export class OrderQueueController {
  static QUEUE_NAME = `${SERVICE_NAME}-queue`;

  constructor(private orderService: OrderService) {}

  @Subscribe(ORDER_PAYMENT_FAILED_EVENT, OrderQueueController.QUEUE_NAME, {})
  async orderPaymentFailedEventHandler(
    payload: OrderPaymentFailedEventPayload
  ): Promise<void> {
    this.orderService.updateOrderStatus(
      payload.orderId,
      OrderStatus.FAILED,
      'Not enough credits'
    );
  }

  @Subscribe(ORDER_PAYMENT_RESERVED_EVENT, OrderQueueController.QUEUE_NAME, {})
  async orderPaymentReservedEventHandler(
    payload: OrderPaymentFailedEventPayload
  ): Promise<void> {
    this.orderService.updateOrderStatus(
      payload.orderId,
      OrderStatus.PAYMENT_RESERVED
    );
  }

  @Subscribe(ORDER_SHIPMENT_FAILED_EVENT, OrderQueueController.QUEUE_NAME, {})
  async orderShipmentFailedEventHandler(
    payload: OrderShipmentFailedEventPayload
  ): Promise<void> {
    this.orderService.updateOrderStatus(
      payload.orderId,
      OrderStatus.FAILED,
      'Shipping address not found'
    );
  }

  @Subscribe(
    ORDER_SHIPMENT_SUCCEEDED_EVENT,
    OrderQueueController.QUEUE_NAME,
    {}
  )
  async orderShipmentSucceededEventHandler(
    payload: OrderShipmentSucceededEventPayload
  ): Promise<void> {
    this.orderService.updateOrderStatus(payload.orderId, OrderStatus.SHIPPED);
  }
}
