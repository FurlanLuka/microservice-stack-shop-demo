import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'reserved-credits',
})
export class ReservedCreditsEntity {
  @PrimaryColumn('uuid')
  orderId: string;

  @Column('int')
  reservedAmount: number;
}
