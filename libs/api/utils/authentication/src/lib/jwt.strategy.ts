import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthenticationConfig } from './authentication.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-auth') {
  constructor(@Inject('AUTHENTICATION_OPTIONS') options: AuthenticationConfig) {
    super({
      secretOrKey: options.authenticationSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['HS256'],
    });
  }

  validate(payload: any, done: VerifiedCallback): void {
    if (!payload) {
      done(new UnauthorizedException(), false);
    }

    return done(null, payload);
  }
}
