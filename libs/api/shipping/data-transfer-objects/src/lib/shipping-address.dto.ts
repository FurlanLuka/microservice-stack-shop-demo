import { IsString } from 'class-validator';

export class CreateShippingAddressDto {
  @IsString()
  address: string;
}
