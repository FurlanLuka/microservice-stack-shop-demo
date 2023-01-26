import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  CreateOrderDto,
  CreateOrderResponse,
} from '@microservice-stack-shop-demo/api/order/data-transfer-objects';
import { AuthenticationGuard } from '@microservice-stack-shop-demo/api/utils/authentication';
import { OrderService } from './order.service';
import { OrderEntity } from './order.entity';

@Controller('v1/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  public async createOrder(
    @Body() body: CreateOrderDto
  ): Promise<CreateOrderResponse> {
    return this.orderService.createOrder(body);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  public async getOrder(@Param('id') orderId: string): Promise<OrderEntity> {
    return this.orderService.getOrder(orderId);
  }
}
