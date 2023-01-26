import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from '@microservice-stack-shop-demo/api/order/data-transfer-objects';

@Entity({
  name: 'order',
})
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  price: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.CREATED,
  })
  status: OrderStatus;
}
