"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, ReviewFormValues } from "@/lib/validations/review";
import { useCreateReview } from "@/hooks/useReviews";
import { ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ReviewDialog({
  gearItemId,
  gearName,
}: {
  gearItemId: string;
  gearName: string;
}) {
  const [open, setOpen] = useState(false);
  const createReview = useCreateReview();

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  const onSubmit = async (values: ReviewFormValues) => {
    try {
      await createReview.mutateAsync({
        gearItemId,
        rating: values.rating,
        comment: values.comment,
      });
      toast.success("Review submitted. Thanks for your feedback!");
      reset();
      setOpen(false);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        Leave Review
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review {gearName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => field.onChange(star)}
                      className="p-0.5"
                    >
                      <Star
                        className={cn(
                          "h-6 w-6",
                          star <= Number(field.value)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-muted-foreground"
                        )}
                      />
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.rating && (
              <p className="text-sm text-destructive">
                {errors.rating.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment (optional)</Label>
            <Input
              id="comment"
              placeholder="Share your experience..."
              {...register("comment")}
            />
            {errors.comment && (
              <p className="text-sm text-destructive">
                {errors.comment.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createReview.isPending}
          >
            {createReview.isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}