import { ConfigModule, ConfigService } from '@microservice-stack/nest-config';
import { RedisModule } from '@microservice-stack/nest-redis';
import { Module } from '@nestjs/common';
import {
  ConfigVariables,
  RedisConnection,
} from '@microservice-stack-shop-demo/api/customer/constants';
import { TokenService } from './token.service';

@Module({
  imports: [
    RedisModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connections: [
          {
            connectionName: RedisConnection.REFRESH_TOKEN,
            connectionUrl: configService.get(ConfigVariables.REDIS_URL),
          },
        ],
      }),
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
