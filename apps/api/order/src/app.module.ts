import { Module } from '@nestjs/common';
import { HealthModule } from '@microservice-stack/nest-health';
import { ConfigModule, ConfigService } from '@microservice-stack/nest-config';
import { ConfigVariables } from '@microservice-stack-shop-demo/api/order/constants';
import { OrderModule } from '@microservice-stack-shop-demo/api/order/order';
import { TypeOrmModule } from '@nestjs/typeorm';
import { migrations } from './migrations';
import { RabbitmqModule } from '@microservice-stack/nest-rabbitmq';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [
        ConfigVariables.REQUIRED_ENVIRONMENT_VARIABLE,
        ConfigVariables.QUEUE_URL,
        ConfigVariables.TYPEORM_DATABASE,
        ConfigVariables.TYPEORM_HOST,
        ConfigVariables.TYPEORM_PASSWORD,
        ConfigVariables.TYPEORM_PORT,
        ConfigVariables.TYPEORM_USERNAME,
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: `postgres`,
        host: configService.get(ConfigVariables.TYPEORM_HOST),
        username: configService.get(ConfigVariables.TYPEORM_USERNAME),
        password: configService.get(ConfigVariables.TYPEORM_PASSWORD),
        database: configService.get(ConfigVariables.TYPEORM_DATABASE),
        port: configService.get(ConfigVariables.TYPEORM_PORT),
        synchronize: false,
        keepConnectionAlive: true,
        autoLoadEntities: true,
        migrations: migrations,
        migrationsRun: true,
      }),
      inject: [ConfigService],
    }),
    RabbitmqModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get(ConfigVariables.QUEUE_URL),
      }),
    }),
    HealthModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
