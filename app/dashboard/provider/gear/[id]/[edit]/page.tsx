"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { gearSchema } from "@/lib/validations/gear";
import { useUpdateGear } from "@/hooks/useProviderGear";
import { useGearDetails } from "@/hooks/useGear";
import { useCategories } from "@/hooks/useGear";
import { ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditGearPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: gear, isLoading: isGearLoading } = useGearDetails(id);
  const { data: categories } = useCategories();
  const updateGear = useUpdateGear();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(gearSchema),
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      pricePerDay: 0,
      stock: 0,
      isAvailable: true,
      imageUrl: "",
      categoryId: "",
    },
  });

  useEffect(() => {
    if (gear) {
      reset({
        name: gear.name,
        description: gear.description,
        brand: gear.brand,
        pricePerDay: gear.pricePerDay,
        stock: gear.stock,
        isAvailable: gear.isAvailable,
        imageUrl: gear.imageUrl ?? "",
        categoryId: gear.categoryId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gear]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateGear.mutateAsync({
        id,
        data: { ...values, imageUrl: values.imageUrl || undefined },
      });
      toast.success("Gear updated successfully!");
      router.push("/dashboard/provider");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  });

  if (isGearLoading) {
    return (
      <div className="mx-auto max-w-2xl p-8 text-center text-muted-foreground">
        Loading gear details...
      </div>
    );
  }

  if (!gear) {
    return (
      <div className="mx-auto max-w-2xl p-8 text-center text-destructive">
        Gear item not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Gear</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register("description")} />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" {...register("brand")} />
              {errors.brand && (
                <p className="text-sm text-destructive">
                  {errors.brand.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricePerDay">Price per day ($)</Label>
                <Input
                  id="pricePerDay"
                  type="number"
                  step="0.01"
                  {...register("pricePerDay")}
                />
                {errors.pricePerDay && (
                  <p className="text-sm text-destructive">
                    {errors.pricePerDay.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" {...register("stock")} />
                {errors.stock && (
                  <p className="text-sm text-destructive">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                placeholder="https://..."
                {...register("imageUrl")}
              />
              {errors.imageUrl && (
                <p className="text-sm text-destructive">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="categoryId" className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="text-sm text-destructive">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="isAvailable">Availability</Label>
              <Controller
                name="isAvailable"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? "true" : "false"}
                    onValueChange={(v) => field.onChange(v === "true")}
                  >
                    <SelectTrigger id="isAvailable" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Available</SelectItem>
                      <SelectItem value="false">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}