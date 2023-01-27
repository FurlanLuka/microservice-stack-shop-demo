import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CustomerController,
  CustomerQueueController,
} from './customer.controller';
import { CustomerEntity } from './customer.entity';
import { CustomerService } from './customer.service';
import { ReservedCreditsEntity } from './reserved-credits.entity';
import { TokenModule } from '@microservice-stack-shop-demo/api/customer/token';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity, ReservedCreditsEntity]),
    TokenModule,
  ],
  controllers: [CustomerController, CustomerQueueController],
  providers: [CustomerService],
})
export class CustomerModule {}
