import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingAddressController } from './shipping-address.controller';
import { ShippingAddressEntity } from './shipping-address.entity';
import { ShippingAddressService } from './shipping-address.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingAddressEntity])],
  controllers: [ShippingAddressController],
  providers: [ShippingAddressService],
  exports: [ShippingAddressService],
})
export class ShippingAddressModule {}
