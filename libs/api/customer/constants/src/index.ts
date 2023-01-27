import { Event } from '@microservice-stack/nest-rabbitmq';
import {
  OrderPaymentReservedEventPayload,
  OrderPaymentFailedEventPayload,
} from '@microservice-stack-shop-demo/api/customer/data-transfer-objects';

export const SERVICE_NAME = 'customer';

export const SERVICE_QUEUE_NAME = `${SERVICE_NAME}-queue`;

export enum RedisConnection {
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}

export enum ConfigVariables {
  AUTHENTICATION_SECRET = 'AUTHENTICATION_SECRET',
  QUEUE_URL = 'QUEUE_URL',
  REDIS_URL = 'REDIS_URL',
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_PORT = 'TYPEORM_PORT',
}

export const ORDER_PAYMENT_RESERVED_EVENT =
  new Event<OrderPaymentReservedEventPayload>('order.payment.reserved', 1);
export const ORDER_PAYMENT_FAILED_EVENT =
  new Event<OrderPaymentFailedEventPayload>('order.payment.failed', 1);
