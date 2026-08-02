"use client";

import { use, useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { useRentalDetails } from "@/hooks/useRentals";
import { useCreatePaymentIntent } from "@/hooks/usePayment";
import { StripePaymentForm } from "@/components/stripe-payment-form";
import { ApiError } from "@/lib/api-client";
import { toast } from "sonner";

export default function PayOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: order, isLoading: isOrderLoading } = useRentalDetails(id);
  const createPaymentIntent = useCreatePaymentIntent();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (!order || order.status !== "CONFIRMED" || clientSecret) return;

    createPaymentIntent.mutate(
      { rentalOrderId: order.id },
      {
        onSuccess: (data) => setClientSecret(data.clientSecret),
        onError: (error) => {
          if (error instanceof ApiError) {
            toast.error(error.message);
          } else {
            toast.error("Failed to initiate payment.");
          }
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  if (isOrderLoading) {
    return (
      <div className="mx-auto max-w-md p-8 text-center text-muted-foreground">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-md p-8 text-center text-destructive">
        Order not found.
      </div>
    );
  }

  if (order.status !== "CONFIRMED") {
    return (
      <div className="mx-auto max-w-md p-8 text-center text-muted-foreground">
        This order is not ready for payment yet (current status:{" "}
        {order.status}).
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-bold">Complete Payment</h1>
      <p className="mt-1 text-muted-foreground">
        Order #{order.id.slice(0, 8)} · $
        {order.totalAmount.toFixed(2)}
      </p>

      <div className="mt-6">
        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripePaymentForm
              rentalOrderId={order.id}
              amount={order.totalAmount}
            />
          </Elements>
        ) : (
          <p className="text-muted-foreground">Preparing payment form...</p>
        )}
      </div>
    </div>
  );
}