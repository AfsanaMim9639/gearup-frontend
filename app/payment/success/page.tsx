"use client";

import { use } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = use(searchParams);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-20 text-center">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center gap-4 py-10">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Your rental order has been paid for successfully.
            {orderId && (
              <>
                <br />
                Order ID: {orderId.slice(0, 8)}
              </>
            )}
          </p>
          <Button
            className="mt-4 w-full"
            nativeButton={false}
            render={<Link href="/dashboard/customer" />}
          >
            View My Orders
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}