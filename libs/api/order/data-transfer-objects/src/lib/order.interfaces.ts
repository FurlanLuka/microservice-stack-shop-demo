export enum OrderStatus {
  CREATED = 'CREATED',
  PAYMENT_RESERVED = 'PAYMENT_RESERVED',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  FAILED = 'FAILED',
}

export interface CreateOrderResponse {
  id: string;
}

export interface OrderCreatedEventPayload {
  orderId: string;
  customerId: string;
  price: number;
}
