export interface WisePaymentData {
  userId: string;
  amount: number;
}

export interface WiseQuoteResponse {
  id: string;
  paymentUrl: string;
}