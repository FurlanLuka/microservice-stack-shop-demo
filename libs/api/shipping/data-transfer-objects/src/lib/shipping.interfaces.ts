export interface OrderShipmentFailedEventPayload {
  orderId: string;
  customerId: string;
}

export interface OrderShipmentSucceededEventPayload {
  orderId: string;
  customerId: string
}