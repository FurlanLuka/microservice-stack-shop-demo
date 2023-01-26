import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import {
  CreateCustomerDto,
  CustomerTokenData,
  GetCustomerUsernameResponse,
} from '@microservice-stack-shop-demo/api/customer/data-transfer-objects';
import { CustomerService } from './customer.service';
import { UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '@microservice-stack-shop-demo/api/utils/authentication';

@Controller('v1/customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post()
  public async createCustomer(
    @Body() body: CreateCustomerDto
  ): Promise<CustomerTokenData> {
    return this.customerService.createCustomer(body);
  }

  @Post('authenticate')
  public async authenticateCustomer(
    @Body() body: CreateCustomerDto
  ): Promise<CustomerTokenData> {
    return this.customerService.authenticateCustomer(body);
  }

  @Get('me')
  @UseGuards(AuthenticationGuard)
  public async getCustomerUsername(
    @Req() req
  ): Promise<GetCustomerUsernameResponse> {
    return this.customerService.getCustomerUsername(req.user.sub);
  }
}
