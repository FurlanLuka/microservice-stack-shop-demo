import { BadRequestException, Injectable } from '@nestjs/common';
import { TokenData } from '@microservice-stack-shop-demo/api/customer/data-transfer-objects';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@microservice-stack/nest-config';
import {
  ConfigVariables,
  RedisConnection,
} from '@microservice-stack-shop-demo/api/customer/constants';
import { RedisService } from '@microservice-stack/nest-redis';
import { randomBytes } from 'crypto';

@Injectable()
export class TokenService {
  static REFRESH_TOKEN_KEY_PREFIX = 'refresh_token_';

  constructor(
    private configService: ConfigService,
    private redisService: RedisService
  ) {}

  public createAccessToken(username: string, customerId: string): TokenData {
    const expiresIn = 3600 * 2;

    const accessToken: string = sign(
      {
        username,
      },
      this.configService.get(ConfigVariables.AUTHENTICATION_SECRET),
      {
        algorithm: 'HS256',
        expiresIn,
        subject: customerId,
      }
    );

    const refreshToken = this.createRefreshToken(username, customerId);

    return {
      accessToken,
      refreshToken,
      expiry: Math.floor(Date.now() / 1000) + expiresIn,
    };
  }

  private createRefreshToken(username: string, customerId: string): string {
    const refreshToken = randomBytes(20).toString('hex');

    this.redisService
      .forConnection(RedisConnection.REFRESH_TOKEN)
      .getClient()
      .setex(
        `${TokenService.REFRESH_TOKEN_KEY_PREFIX}${refreshToken}`,
        3600 * 24 * 7, // 7 days
        JSON.stringify({
          customerId,
          username,
        })
      );

    return refreshToken;
  }

  public async refreshAccessToken(refreshToken: string) {
    const customerData = await this.redisService
      .forConnection(RedisConnection.REFRESH_TOKEN)
      .getClient()
      .getdel(`${TokenService.REFRESH_TOKEN_KEY_PREFIX}${refreshToken}`);

    if (customerData === null) {
      throw new BadRequestException('Invalid refresh token');
    }

    const { username, customerId } = JSON.parse(customerData);

    return this.createAccessToken(username, customerId);
  }
}
