"use client";

import { format } from "date-fns";
import { toast } from "sonner";
import { useProviderOrders, useUpdateOrderStatus } from "@/hooks/useProviderOrders";
import { RentalStatusBadge } from "@/components/rental-status-badge";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { RentalStatus } from "@/types/rental";

const nextStatusMap: Partial<Record<RentalStatus, { label: string; next: RentalStatus }>> = {
  PLACED: { label: "Confirm", next: "CONFIRMED" },
  PAID: { label: "Mark Picked Up", next: "PICKED_UP" },
  PICKED_UP: { label: "Mark Returned", next: "RETURNED" },
};

export default function ProviderOrdersPage() {
  const { data: orders, isLoading, isError } = useProviderOrders();
  const updateStatus = useUpdateOrderStatus();

  const handleUpdate = async (id: string, status: RentalStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Order updated");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-8">
      <h1 className="text-2xl font-bold">Manage Orders</h1>
      <p className="mt-1 text-muted-foreground">
        Incoming rental orders for your gear
      </p>

      {isLoading && (
        <p className="mt-4 text-muted-foreground">Loading orders...</p>
      )}

      {isError && (
        <p className="mt-4 text-destructive">
          Failed to load orders. Please try again later.
        </p>
      )}

      {!isLoading && !isError && orders?.length === 0 && (
        <p className="mt-4 text-muted-foreground">
          No orders yet for your gear.
        </p>
      )}

      {!isLoading && orders && orders.length > 0 && (
        <div className="mt-4 space-y-4">
          {orders.map((order) => {
            const action = nextStatusMap[order.status];
            return (
              <div key={order.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="font-semibold">
                      {order.customer?.name} ({order.customer?.email})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.startDate), "PPP")} -{" "}
                      {format(new Date(order.endDate), "PPP")}
                    </p>
                  </div>
                  <RentalStatusBadge status={order.status} />
                </div>

                <div className="mt-3 space-y-1 text-sm">
                  {order.items.map((item) => (
                    <p key={item.id}>
                      {item.gearItem.name} × {item.quantity}
                    </p>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="font-semibold">
                    Total: ${order.totalAmount.toFixed(2)}
                  </p>

                  {action && (
                    <Button
                      size="sm"
                      disabled={updateStatus.isPending}
                      onClick={() => handleUpdate(order.id, action.next)}
                    >
                      {action.label}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}