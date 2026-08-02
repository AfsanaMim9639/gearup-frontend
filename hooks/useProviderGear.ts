import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { GearItem } from "@/types/gear";

export interface CreateGearInput {
  name: string;
  description: string;
  brand: string;
  pricePerDay: number;
  stock: number;
  isAvailable: boolean;
  imageUrl?: string;
  categoryId: string;
}

export type UpdateGearInput = Partial<CreateGearInput>;

export function useProviderGear() {
  return useQuery({
    queryKey: ["provider-gear"],
    queryFn: () => api.get<GearItem[]>("/provider/gear"),
  });
}

export function useCreateGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateGearInput) =>
      api.post<GearItem>("/provider/gear", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-gear"] });
    },
  });
}

export function useUpdateGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGearInput }) =>
      api.put<GearItem>(`/provider/gear/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-gear"] });
    },
  });
}

export function useDeleteGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/provider/gear/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-gear"] });
    },
  });
}