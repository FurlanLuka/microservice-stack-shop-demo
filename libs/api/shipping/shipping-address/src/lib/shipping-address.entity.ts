import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'shipping-address',
})
export class ShippingAddressEntity {
  @PrimaryColumn('uuid')
  customerId: string;

  @Column('varchar')
  address: string;
}
