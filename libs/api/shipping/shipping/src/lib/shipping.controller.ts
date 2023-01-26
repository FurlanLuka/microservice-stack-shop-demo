import { Controller } from '@nestjs/common';
import { SERVICE_NAME } from '@microservice-stack-shop-demo/api/shipping/constants';
import { ShippingService } from './shipping.service';
import { Subscribe } from '@microservice-stack/nest-rabbitmq';
import { ORDER_PAYMENT_RESERVED_EVENT } from '@microservice-stack-shop-demo/api/customer/constants';
import { OrderPaymentReservedEventPayload } from '@microservice-stack-shop-demo/api/customer/data-transfer-objects';

@Controller()
export class ShippingQueueController {
  static QUEUE_NAME = `${SERVICE_NAME}-queue`;

  constructor(private shippingService: ShippingService) {}

  @Subscribe(
    ORDER_PAYMENT_RESERVED_EVENT,
    ShippingQueueController.QUEUE_NAME,
    {}
  )
  public async shipOrder(
    payload: OrderPaymentReservedEventPayload
  ): Promise<void> {
    return this.shippingService.shipOrder(payload);
  }
}
