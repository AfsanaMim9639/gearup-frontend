"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Clock, Wallet } from "lucide-react";
import { useGearList, useCategories } from "@/hooks/useGear";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Weekend Hiker",
    quote:
      "GearUp made it so easy to try camping without buying all the gear upfront. Booking took two minutes.",
  },
  {
    name: "David K.",
    role: "Cyclist",
    quote:
      "I listed my extra bikes as a provider and started earning within the first week. Super smooth dashboard.",
  },
  {
    name: "Priya R.",
    role: "Traveler",
    quote:
      "Loved the transparent pricing and quick checkout. Payment was secure and the whole flow felt trustworthy.",
  },
];

export default function Home() {
  const { data: gearItems, isLoading } = useGearList({ available: true });
  const { data: categories } = useCategories();
  const featured = (gearItems ?? []).slice(0, 6);

  return (
    <div>
      {/* 1. Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Gear up for your next{" "}
            <span className="logo-text">adventure</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Rent quality sports and outdoor equipment from trusted local
            providers. No commitment, no clutter — just adventure.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/gear" />}
            >
              Browse Gear
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/auth/register" />}
            >
              Become a Provider
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Browse by Category */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl font-bold">Browse by Category</h2>
        <p className="mt-1 text-muted-foreground">
          Find exactly what you need for your next outing
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(categories ?? []).map((cat) => (
            <Link
              key={cat.id}
              href={`/gear?category=${cat.id}`}
              className="flex items-center justify-center rounded-lg border bg-card p-6 text-center font-medium transition-colors hover:bg-muted"
            >
              {cat.name}
            </Link>
          ))}
          {(!categories || categories.length === 0) && (
            <p className="col-span-full text-muted-foreground">
              Categories will appear here once available.
            </p>
          )}
        </div>
      </section>

      {/* 3. Featured Gear */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Featured Gear</h2>
            <p className="mt-1 text-muted-foreground">
              Popular picks available right now
            </p>
          </div>
          <Link
            href="/gear"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all →
          </Link>
        </div>

        {isLoading && (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg border">
                <div className="aspect-square w-full animate-pulse bg-muted" />
                <div className="space-y-2 p-4">
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && featured.length === 0 && (
          <p className="mt-6 text-muted-foreground">
            No gear available right now. Check back soon!
          </p>
        )}

        {!isLoading && featured.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {featured.map((item) => (
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
                </div>
                <div className="space-y-1 p-4">
                  <p className="text-xs text-muted-foreground">
                    {item.category?.name}
                  </p>
                  <h3 className="font-semibold">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="font-bold">
                      ${item.pricePerDay.toFixed(2)}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        / day
                      </span>
                    </p>
                    <Badge variant="outline">{item.brand}</Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 4. How It Works */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold">How GearUp Works</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                1
              </div>
              <h3 className="mt-4 font-semibold">Browse & Select</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Find the perfect gear and pick your rental dates.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                2
              </div>
              <h3 className="mt-4 font-semibold">Pay Securely</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Confirm your order and pay safely through Stripe.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                3
              </div>
              <h3 className="mt-4 font-semibold">Pick Up & Enjoy</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Grab your gear and head out on your adventure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold">Why Choose GearUp</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">
                Every transaction is processed securely through Stripe.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
              <Clock className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">Flexible Rentals</h3>
              <p className="text-sm text-muted-foreground">
                Choose your own dates, from a single day to a full week.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
              <Wallet className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">Fair Pricing</h3>
              <p className="text-sm text-muted-foreground">
                Transparent per-day pricing with no hidden fees.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold">
            What Our Users Say
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="py-6">
                  <div className="flex gap-0.5 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="mt-4 text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="relative overflow-hidden rounded-2xl border bg-card p-10 text-center sm:p-16">
          <h2 className="text-3xl font-bold">Ready to get outdoors?</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Join GearUp today and rent everything you need for your next
            adventure — or start earning by listing your own gear.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/auth/register" />}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/gear" />}
            >
              Explore Gear
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}