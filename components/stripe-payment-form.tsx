"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useConfirmPayment } from "@/hooks/usePayment";

export function StripePaymentForm({
  rentalOrderId,
  amount,
}: {
  rentalOrderId: string;
  amount: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const confirmPayment = useConfirmPayment();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message ?? "Payment failed. Please try again.");
      setIsProcessing(false);
      router.push(`/payment/cancel?orderId=${rentalOrderId}`);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        await confirmPayment.mutateAsync({
          transactionId: paymentIntent.id,
        });
        router.push(`/payment/success?orderId=${rentalOrderId}`);
      } catch {
        toast.error(
          "Payment succeeded but confirmation failed. Please contact support."
        );
        router.push(`/payment/cancel?orderId=${rentalOrderId}`);
      }
    } else {
      router.push(`/payment/cancel?orderId=${rentalOrderId}`);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  );
}