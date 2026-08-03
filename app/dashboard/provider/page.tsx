"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useProviderGear, useDeleteGear } from "@/hooks/useProviderGear";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProviderDashboardPage() {
  const { user, logout } = useAuth();
  const { data: gearItems, isLoading, isError } = useProviderGear();
  const deleteGear = useDeleteGear();

  const handleDelete = async (id: string) => {
    try {
      await deleteGear.mutateAsync(id);
      toast.success("Gear item deleted");
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Provider Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome, {user?.name ?? "Guest"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/dashboard/provider/orders" />}
          >
            Manage Orders
          </Button>
          <Button variant="destructive" onClick={logout}>
            Logout
          </Button>
        </div>
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
                className="flex flex-wrap items-center gap-4 rounded-lg border p-4"
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

                <div className="min-w-37.5 flex-1">
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

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    nativeButton={false}
                    render={
                      <Link
                        href={`/dashboard/provider/gear/${item.id}/edit`}
                      />
                    }
                  >
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={deleteGear.isPending}
                        />
                      }
                    >
                      Delete
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this gear item?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove &ldquo;{item.name}
                          &rdquo; from your listings. This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}