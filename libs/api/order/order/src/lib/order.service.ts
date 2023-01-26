import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { Repository } from 'typeorm';
import {
  CreateOrderDto,
  CreateOrderResponse,
  OrderStatus,
} from '@microservice-stack-shop-demo/api/order/data-transfer-objects';
import { ORDER_CREATED_EVENT } from '@microservice-stack-shop-demo/api/order/constants';
import { RabbitmqService } from '@microservice-stack/nest-rabbitmq';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    private rabbitmqService: RabbitmqService
  ) {}

  public async createOrder(
    customerId: string,
    body: CreateOrderDto
  ): Promise<CreateOrderResponse> {
    const order: OrderEntity = await this.orderRepository.save({
      customerId,
      price: body.orderPrice,
    });

    this.rabbitmqService.publishEvent(ORDER_CREATED_EVENT, {
      orderId: order.id,
      customerId,
      price: order.price,
    });

    return {
      id: order.id,
    };
  }

  public async getOrder(
    customerId: string,
    orderId: string
  ): Promise<OrderEntity> {
    const order: OrderEntity | null = await this.orderRepository.findOneBy({
      customerId,
      id: orderId,
    });

    if (order === null) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  public async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    failureReason?: string
  ): Promise<void> {
    await this.orderRepository.update(
      {
        id: orderId,
      },
      {
        status,
        failureReason,
      }
    );
  }
}
