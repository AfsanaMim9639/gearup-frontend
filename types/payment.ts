export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface Payment {
  id: string;
  transactionId: string;
  rentalOrderId: string;
  amount: number;
  method: string;
  provider: string;
  status: PaymentStatus;
  paidAt?: string | null;
  createdAt: string;
}

export interface CreatePaymentIntentInput {
  rentalOrderId: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  payment: Payment;
}

export interface ConfirmPaymentInput {
  transactionId: string;
}