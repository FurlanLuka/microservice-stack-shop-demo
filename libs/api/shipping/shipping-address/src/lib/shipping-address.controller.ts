import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  CreateShippingAddressDto,
  GetShippingAddressResponse,
} from '@microservice-stack-shop-demo/api/shipping/data-transfer-objects';
import { AuthenticationGuard } from '@microservice-stack-shop-demo/api/utils/authentication';
import { ShippingAddressService } from './shipping-address.service';

@Controller('/v1/shipping-address')
export class ShippingAddressController {
  constructor(private shippingAddressService: ShippingAddressService) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  async createShippingAddress(
    @Req() req,
    @Body() body: CreateShippingAddressDto
  ): Promise<void> {
    return this.shippingAddressService.createShippingAddress(
      req.user.sub,
      body
    );
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  async getShippingAddress(@Req() req): Promise<GetShippingAddressResponse> {
    return this.shippingAddressService.getShippingAddress(req.user.sub);
  }
}
