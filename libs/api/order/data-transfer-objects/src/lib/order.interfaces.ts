export enum OrderStatus {
  CREATED = 'CREATED',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  FAILED = 'FAILED',
}

export interface CreateOrderResponse {
  id: string;
}

export interface OrderCreatedEventPayload {
  id: string;
  price: number;
}