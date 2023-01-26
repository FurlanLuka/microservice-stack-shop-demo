import { Event } from '@microservice-stack/nest-rabbitmq';
import { OrderCreatedEventPayload } from '@microservice-stack-shop-demo/api/order/data-transfer-objects';

export const SERVICE_NAME = 'order';

export const SERVICE_QUEUE_NAME = `${SERVICE_NAME}-queue`;

export enum ConfigVariables {
  AUTHENTICATION_SECRET = 'AUTHENTICATION_SECRET',
  QUEUE_URL = 'QUEUE_URL',
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_PORT = 'TYPEORM_PORT',
}

export const ORDER_CREATED_EVENT = new Event<OrderCreatedEventPayload>(
  'order.created',
  1
);
