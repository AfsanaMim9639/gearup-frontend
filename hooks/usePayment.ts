import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import {
  CreatePaymentIntentInput,
  CreatePaymentIntentResponse,
  ConfirmPaymentInput,
  Payment,
} from "@/types/payment";

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: (input: CreatePaymentIntentInput) =>
      api.post<CreatePaymentIntentResponse>("/payments/create", input),
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ConfirmPaymentInput) =>
      api.post<Payment>("/payments/confirm", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
    },
  });
}