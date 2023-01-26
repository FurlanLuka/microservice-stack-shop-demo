import {
  Type,
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
} from '@nestjs/common';

export interface AuthenticationConfig {
  authenticationSecret: string;
}

export interface AuthenticationOptions {
  imports: Array<
    Type | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  inject: (InjectionToken | OptionalFactoryDependency)[];
  useFactory: (...args: unknown[]) => AuthenticationConfig;
}
