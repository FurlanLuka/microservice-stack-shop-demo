import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'reserved-credits',
})
export class ReservedCreditsEntity {
  @PrimaryGeneratedColumn('uuid')
  orderId: string;

  @Column('int')
  reservedAmount: number;
}
