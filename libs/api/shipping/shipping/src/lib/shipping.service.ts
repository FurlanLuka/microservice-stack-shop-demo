import { Injectable, Logger } from '@nestjs/common';
import { ShippingAddressService } from '@microservice-stack-shop-demo/api/shipping/shipping-address';
import { RabbitmqService } from '@microservice-stack/nest-rabbitmq';
import { OrderPaymentReservedEventPayload } from '@microservice-stack-shop-demo/api/customer/data-transfer-objects';
import { GetShippingAddressResponse } from '@microservice-stack-shop-demo/api/shipping/data-transfer-objects';
import {
  ORDER_SHIPMENT_FAILED_EVENT,
  ORDER_SHIPMENT_SUCCEEDED_EVENT,
} from '@microservice-stack-shop-demo/api/shipping/constants';

@Injectable()
export class ShippingService {
  constructor(
    private shippingAddressService: ShippingAddressService,
    private rabbitmqService: RabbitmqService
  ) {}

  public async shipOrder(
    payload: OrderPaymentReservedEventPayload
  ): Promise<void> {
    try {
      const shippingAddress: GetShippingAddressResponse =
        await this.shippingAddressService.getShippingAddress(
          payload.customerId
        );

      Logger.log(`Order shipped to ${shippingAddress}`);

      this.rabbitmqService.publishEvent(
        ORDER_SHIPMENT_SUCCEEDED_EVENT,
        payload
      );
    } catch (error) {
      this.rabbitmqService.publishEvent(ORDER_SHIPMENT_FAILED_EVENT, payload);
    }
  }
}
