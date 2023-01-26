export interface CustomerTokenData {
  accessToken: string;
  expiry: number;
}

export interface GetCustomerUsernameResponse {
  username: string;
}

export interface OrderPaymentReservedEventPayload {
  orderId: string;
}

export interface OrderPaymentFailedEventPayload {
  orderId: string;
}