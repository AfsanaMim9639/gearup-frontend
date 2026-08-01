"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGearList, useCategories } from "@/hooks/useGear";
import { GearFilters } from "@/types/gear";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GearListingPage() {
  const [filters, setFilters] = useState<GearFilters>({});
  const { data: gearItems, isLoading, isError } = useGearList(filters);
  const { data: categories } = useCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold">Browse Gear</h1>
      <p className="mt-1 text-muted-foreground">
        Find the perfect sports and outdoor equipment for your next adventure
      </p>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <aside className="space-y-4 lg:col-span-1">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={filters.category ?? "all"}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  category: value === "all" ? undefined : value,
                }))
              }
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              placeholder="Search by brand"
              value={filters.brand ?? ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  brand: e.target.value || undefined,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="minPrice">Min Price</Label>
              <Input
                id="minPrice"
                type="number"
                min={0}
                placeholder="0"
                value={filters.minPrice ?? ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minPrice: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPrice">Max Price</Label>
              <Input
                id="maxPrice"
                type="number"
                min={0}
                placeholder="1000"
                value={filters.maxPrice ?? ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxPrice: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
              />
            </div>
          </div>
        </aside>

        {/* Gear Grid */}
        <div className="lg:col-span-3">
          {isLoading && <GearGridSkeleton />}

          {isError && (
            <p className="text-center text-destructive">
              Failed to load gear items. Please try again later.
            </p>
          )}

          {!isLoading && !isError && gearItems?.length === 0 && (
            <p className="text-center text-muted-foreground">
              No gear found matching your filters.
            </p>
          )}

          {!isLoading && gearItems && gearItems.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {gearItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/gear/${item.id}`}
                  className="group overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-square w-full bg-muted">
                    <Image
                      src={item.imageUrl || "/file.svg"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {!item.isAvailable && (
                      <Badge
                        variant="destructive"
                        className="absolute right-2 top-2"
                      >
                        Unavailable
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1 p-4">
                    <p className="text-xs text-muted-foreground">
                      {item.category?.name}
                    </p>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.brand}
                    </p>
                    <p className="font-bold">
                      ${item.pricePerDay.toFixed(2)}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        / day
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GearGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border">
          <div className="aspect-square w-full animate-pulse bg-muted" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}