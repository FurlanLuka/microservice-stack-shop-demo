import { Module } from "@nestjs/common";
import { ShippingAddressModule } from "@microservice-stack-shop-demo/api/shipping/shipping-address";
import { ShippingQueueController } from "./shipping.controller";
import { ShippingService } from "./shipping.service";

@Module({
  imports: [ShippingAddressModule],
  controllers: [ShippingQueueController],
  providers: [ShippingService],
})
export class ShippingModule {}