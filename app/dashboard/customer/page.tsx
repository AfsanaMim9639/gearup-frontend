"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { useMyRentals } from "@/hooks/useRentals";
import { RentalStatusBadge } from "@/components/rental-status-badge";
import { Button } from "@/components/ui/button";

export default function CustomerDashboardPage() {
  const { user, logout } = useAuth();
  const { data: rentals, isLoading, isError } = useMyRentals();

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome, {user?.name ?? "Guest"}
          </p>
        </div>
        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Your Rental Orders</h2>

        {isLoading && (
          <p className="mt-4 text-muted-foreground">Loading your orders...</p>
        )}

        {isError && (
          <p className="mt-4 text-destructive">
            Failed to load your orders. Please try again later.
          </p>
        )}

        {!isLoading && !isError && rentals?.length === 0 && (
          <p className="mt-4 text-muted-foreground">
            You haven&apos;t placed any rental orders yet.
          </p>
        )}

        {!isLoading && rentals && rentals.length > 0 && (
          <div className="mt-4 space-y-4">
            {rentals.map((order) => (
              <div key={order.id} className="rounded-lg border p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* Thumbnail(s) */}
                  <div className="flex gap-2">
                    {order.items.slice(0, 1).map((item) => (
                      <div
                        key={item.id}
                        className="relative h-24 w-24 flex-shrink:0 overflow-hidden rounded-md bg-muted"
                      >
                        <Image
                          src={item.gearItem.imageUrl || "/file.svg"}
                          alt={item.gearItem.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Order #{order.id.slice(0, 8)}
                        </p>
                        <p className="font-semibold">
                          {order.items
                            .map((item) => item.gearItem.name)
                            .join(", ")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.startDate), "PPP")} -{" "}
                          {format(new Date(order.endDate), "PPP")}
                        </p>
                      </div>
                      <RentalStatusBadge status={order.status} />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">
                        Total: ${order.totalAmount.toFixed(2)}
                      </p>

                      {order.status === "CONFIRMED" && (
                        <Button
                          size="sm"
                          nativeButton={false}
                          render={
                            <Link
                              href={`/dashboard/customer/orders/${order.id}/pay`}
                            />
                          }
                        >
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}