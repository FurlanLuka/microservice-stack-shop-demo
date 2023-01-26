import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'customer',
})
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    unique: true,
    nullable: false,
  })
  username: string;

  @Column('varchar', {
    nullable: false,
  })
  password: string;

  @Column('int', {
    default: 0,
  })
  availableCredits: number;
}
