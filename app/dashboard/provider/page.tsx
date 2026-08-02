"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useProviderGear } from "@/hooks/useProviderGear";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function ProviderDashboardPage() {
  const { user, logout } = useAuth();
  const { data: gearItems, isLoading, isError } = useProviderGear();

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Provider Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome, {user?.name ?? "Guest"}
          </p>
        </div>
        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </div>

      <div className="mt-8">
        
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Gear Listings</h2>
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href="/dashboard/provider/gear/new" />}
          >
            + Add Gear
          </Button>
        </div>

        {isLoading && (
          <p className="mt-4 text-muted-foreground">Loading your gear...</p>
        )}

        {isError && (
          <p className="mt-4 text-destructive">
            Failed to load your gear. Please try again later.
          </p>
        )}

        {!isLoading && !isError && gearItems?.length === 0 && (
          <p className="mt-4 text-muted-foreground">
            You haven&apos;t listed any gear yet.
          </p>
        )}

        {!isLoading && gearItems && gearItems.length > 0 && (
          <div className="mt-4 space-y-3">
            {gearItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <div className="relative h-16 w-16 flex-shrink:0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={item.imageUrl || "/file.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>

                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.category?.name} • ${item.pricePerDay.toFixed(2)}/day
                    • Stock: {item.stock}
                  </p>
                </div>

                {item.isAvailable ? (
                  <Badge>Available</Badge>
                ) : (
                  <Badge variant="destructive">Unavailable</Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}