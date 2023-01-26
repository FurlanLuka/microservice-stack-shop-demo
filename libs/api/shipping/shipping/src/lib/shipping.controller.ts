import { Controller, Get } from "@nestjs/common";
import { ShippingService } from "./shipping.service";

@Controller('v1/shipping')
export class ShippingController {

  constructor(private shippingService: ShippingService) {}

  @Get()
  public hello(): string {
    return this.shippingService.hello();
  }
}