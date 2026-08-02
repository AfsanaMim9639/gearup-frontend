"use client";

import { use } from "react";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = use(searchParams);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-20 text-center">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center gap-4 py-10">
          <XCircle className="h-16 w-16 text-destructive" />
          <h1 className="text-2xl font-bold">Payment Failed</h1>
          <p className="text-muted-foreground">
            Something went wrong with your payment. Please try again.
            {orderId && (
              <>
                <br />
                Order ID: {orderId.slice(0, 8)}
              </>
            )}
          </p>
          <div className="mt-4 flex w-full gap-2">
            {orderId && (
              <Button
                variant="outline"
                className="flex-1"
                nativeButton={false}
                render={
                  <Link href={`/dashboard/customer/orders/${orderId}/pay`} />
                }
              >
                Retry Payment
              </Button>
            )}
            <Button
              className="flex-1"
              nativeButton={false}
              render={<Link href="/dashboard/customer" />}
            >
              My Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}