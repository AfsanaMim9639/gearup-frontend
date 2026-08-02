import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { RentalOrder, RentalStatus } from "@/types/rental";

export function useProviderOrders() {
  return useQuery({
    queryKey: ["provider-orders"],
    queryFn: () => api.get<RentalOrder[]>("/provider/orders"),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: RentalStatus }) =>
      api.patch<RentalOrder>(`/provider/orders/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-orders"] });
    },
  });
}