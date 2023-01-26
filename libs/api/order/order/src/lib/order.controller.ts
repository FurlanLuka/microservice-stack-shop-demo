import { Controller, Get } from "@nestjs/common";
import { OrderService } from "./order.service";

@Controller('v1/order')
export class OrderController {

  constructor(private orderService: OrderService) {}

  @Get()
  public hello(): string {
    return this.orderService.hello();
  }
}