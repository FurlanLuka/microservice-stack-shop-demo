export interface CustomerTokenData {
  accessToken: string;
  expiry: number;
}

export interface GetCustomerResponse {
  username: string;
  creditAmount: number;
}

export interface OrderPaymentReservedEventPayload {
  orderId: string;
  customerId: string;
}

export interface OrderPaymentFailedEventPayload {
  orderId: string;
  customerId: string;
}