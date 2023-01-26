import { Module } from '@nestjs/common';
import { HealthModule } from '@microservice-stack/nest-health';
import { ConfigModule, ConfigService } from '@microservice-stack/nest-config';
import { ConfigVariables } from '@microservice-stack-shop-demo/api/shipping/constants';
import { ShippingModule } from '@microservice-stack-shop-demo/api/shipping/shipping';
import { TypeOrmModule } from '@nestjs/typeorm';
import { migrations } from './migrations';
import { RabbitmqModule } from '@microservice-stack/nest-rabbitmq';
import { ShippingAddressModule } from '@microservice-stack-shop-demo/api/shipping/shipping-address';
import { AuthenticationModule } from '@microservice-stack-shop-demo/api/utils/authentication';

@Module({
  imports: [
    ConfigModule.register({
      requiredEnvironmentVariables: [
        ConfigVariables.AUTHENTICATION_SECRET,
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
    AuthenticationModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        authenticationSecret: configService.get(
          ConfigVariables.AUTHENTICATION_SECRET
        ),
      }),
    }),
    HealthModule,
    ShippingModule,
    ShippingAddressModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
