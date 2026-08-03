import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Rating is required").max(5),
  comment: z.string().max(500, "Comment is too long").optional(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;