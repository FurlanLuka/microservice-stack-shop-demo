import { Controller, Get } from "@nestjs/common";
import { CustomerService } from "./customer.service";

@Controller('v1/customer')
export class CustomerController {

  constructor(private customerService: CustomerService) {}

  @Get()
  public hello(): string {
    return this.customerService.hello();
  }
}