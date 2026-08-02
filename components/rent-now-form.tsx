"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format, differenceInCalendarDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/context/AuthContext";
import { useCreateRental } from "@/hooks/useRentals";
import { ApiError } from "@/lib/api-client";
import { GearItem } from "@/types/gear";

export function RentNowForm({ gear }: { gear: GearItem }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const createRental = useCreateRental();

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const days =
    startDate && endDate
      ? Math.max(differenceInCalendarDays(endDate, startDate), 0)
      : 0;
  const totalAmount = days * gear.pricePerDay;

  const handleRentNow = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to rent gear");
      router.push("/auth/login");
      return;
    }

    if (user?.role !== "CUSTOMER") {
      toast.error("Only customers can rent gear");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (days <= 0) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      const order = await createRental.mutateAsync({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        items: [{ gearItemId: gear.id, quantity: 1 }],
      });

      toast.success("Rental order placed successfully!");
      router.push(`/dashboard/customer`);
      void order;
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="mt-6 space-y-4 rounded-lg border p-4">
      <p className="font-semibold">Select rental dates</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Popover>
          <PopoverTrigger
            render={
              <Button variant="outline" className="justify-start font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Start date"}
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              disabled={(date) => date < new Date(new Date().toDateString())}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger
            render={
              <Button variant="outline" className="justify-start font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "End date"}
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              disabled={(date) =>
                date < (startDate ?? new Date(new Date().toDateString()))
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      {days > 0 && (
        <p className="text-sm text-muted-foreground">
          {days} day(s) × ${gear.pricePerDay.toFixed(2)} ={" "}
          <span className="font-semibold text-foreground">
            ${totalAmount.toFixed(2)}
          </span>
        </p>
      )}

      <Button
        className="w-full"
        size="lg"
        disabled={!gear.isAvailable || createRental.isPending}
        onClick={handleRentNow}
      >
        {createRental.isPending
          ? "Placing order..."
          : gear.isAvailable
          ? "Rent Now"
          : "Currently Unavailable"}
      </Button>
    </div>
  );
}