import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { RentalOrder, CreateRentalInput } from "@/types/rental";

export function useMyRentals() {
  return useQuery({
    queryKey: ["rentals"],
    queryFn: () => api.get<RentalOrder[]>("/rentals"),
  });
}

export function useRentalDetails(id: string) {
  return useQuery({
    queryKey: ["rentals", id],
    queryFn: () => api.get<RentalOrder>(`/rentals/${id}`),
    enabled: !!id,
  });
}

export function useCreateRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRentalInput) =>
      api.post<RentalOrder>("/rentals", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
    },
  });
}