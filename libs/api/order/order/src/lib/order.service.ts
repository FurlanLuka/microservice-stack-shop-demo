import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { Repository } from 'typeorm';
import {
  CreateOrderDto,
  CreateOrderResponse,
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

  public async createOrder(body: CreateOrderDto): Promise<CreateOrderResponse> {
    const order: OrderEntity = await this.orderRepository.save({
      price: body.orderPrice,
    });

    this.rabbitmqService.publishEvent(ORDER_CREATED_EVENT, {
      id: order.id,
      price: order.price,
    });

    return {
      id: order.id,
    };
  }

  public async getOrder(orderId: string): Promise<OrderEntity> {
    const order: OrderEntity | null = await this.orderRepository.findOneBy({
      id: orderId,
    });

    if (order === null) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
