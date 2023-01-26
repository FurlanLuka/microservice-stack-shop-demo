import { DynamicModule, Global, Module } from '@nestjs/common';
import { AuthenticationOptions } from './authentication.interfaces';
import { JwtStrategy } from './jwt.strategy';

@Global()
@Module({})
export class AuthenticationModule {
  static register(options: AuthenticationOptions): DynamicModule {
    return {
      module: AuthenticationModule,
      imports: [...options.imports],
      providers: [
        {
          inject: options.inject,
          provide: 'AUTHENTICATION_OPTIONS',
          useFactory: options.useFactory,
        },
        JwtStrategy,
      ],
      exports: [JwtStrategy],
      global: true,
    };
  }
}
