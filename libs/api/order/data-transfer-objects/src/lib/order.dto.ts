import { IsNumber, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  orderPrice: number;
}

export class AddCustomerCreditsDto {
  @IsNumber()
  @IsPositive()
  amount: number;
}