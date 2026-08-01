"use client";

import { use } from "react";
import Image from "next/image";
import { useGearDetails } from "@/hooks/useGear";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function GearDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: gear, isLoading, isError } = useGearDetails(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-lg bg-muted" />
          <div className="space-y-4">
            <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-24 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !gear) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-destructive">
          Gear item not found or failed to load.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={gear.imageUrl || "/file.svg"}
            alt={gear.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-muted-foreground">
            {gear.category?.name}
          </p>
          <h1 className="mt-1 text-3xl font-bold">{gear.name}</h1>
          <p className="mt-1 text-muted-foreground">{gear.brand}</p>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold">
              ${gear.pricePerDay.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">/ day</span>
            {gear.isAvailable ? (
              <Badge>Available</Badge>
            ) : (
              <Badge variant="destructive">Unavailable</Badge>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-muted-foreground">
            {gear.description}
          </p>

          <div className="mt-6 space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Stock:</span>{" "}
              {gear.stock} unit(s)
            </p>
            <p>
              <span className="text-muted-foreground">Listed by:</span>{" "}
              {gear.provider?.name}
            </p>
          </div>

          <Button className="mt-6 w-full" size="lg" disabled={!gear.isAvailable}>
            {gear.isAvailable ? "Rent Now" : "Currently Unavailable"}
          </Button>
        </div>
      </div>

      {/* Reviews */}
      {gear.reviews && gear.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold">Reviews</h2>
          <div className="mt-4 space-y-4">
            {gear.reviews.map((review) => (
              <div key={review.id} className="rounded-lg border p-4">
                <p className="font-semibold">Rating: {review.rating} / 5</p>
                {review.comment && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}