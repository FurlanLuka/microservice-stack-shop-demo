import { Event } from '@microservice-stack/nest-rabbitmq';
import {
  OrderShipmentFailedEventPayload,
  OrderShipmentSucceededEventPayload,
} from '@microservice-stack-shop-demo/api/shipping/data-transfer-objects';

export const SERVICE_NAME = 'shipping';

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

export const ORDER_SHIPMENT_FAILED_EVENT =
  new Event<OrderShipmentFailedEventPayload>('order.shipment.failed', 1);

export const ORDER_SHIPMENT_SUCCEEDED_EVENT =
  new Event<OrderShipmentSucceededEventPayload>('order.shipment.succeeded', 1);
