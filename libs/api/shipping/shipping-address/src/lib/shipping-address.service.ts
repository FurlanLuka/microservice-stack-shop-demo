import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateShippingAddressDto,
  GetShippingAddressResponse,
} from '@microservice-stack-shop-demo/api/shipping/data-transfer-objects';
import { ShippingAddressEntity } from './shipping-address.entity';

@Injectable()
export class ShippingAddressService {
  constructor(
    @InjectRepository(ShippingAddressEntity)
    private shippingAddressRepository: Repository<ShippingAddressEntity>
  ) {}

  public async createShippingAddress(
    customerId: string,
    body: CreateShippingAddressDto
  ): Promise<void> {
    const existingAddress: ShippingAddressEntity | null =
      await this.shippingAddressRepository.findOneBy({
        customerId,
      });

    if (existingAddress !== null) {
      throw new BadRequestException('Shipping address already exists');
    }

    await this.shippingAddressRepository.save({
      customerId,
      address: body.address,
    });
  }

  public async getShippingAddress(
    customerId: string
  ): Promise<GetShippingAddressResponse> {
    const shippingAddress: ShippingAddressEntity | null =
      await this.shippingAddressRepository.findOneBy({
        customerId,
      });

    if (shippingAddress === null) {
      throw new NotFoundException('Shipping address not found');
    }

    return {
      address: shippingAddress.address,
    };
  }
}
