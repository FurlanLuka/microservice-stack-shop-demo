import { Injectable } from '@nestjs/common';
import { ConfigService } from '@microservice-stack/nest-config';
import { ConfigVariables } from '@microservice-stack-shop-demo/api/order/constants';
   
@Injectable()
export class OrderService {
  constructor(private configService: ConfigService) {}

  public hello(): string {
    return this.configService.get<string>(ConfigVariables.REQUIRED_ENVIRONMENT_VARIABLE);
  }
}
