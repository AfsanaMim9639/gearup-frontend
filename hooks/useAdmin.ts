import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { User } from "@/types/auth";
import { GearItem } from "@/types/gear";
import { RentalOrder } from "@/types/rental";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: () => api.get<User[]>("/admin/users"),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "suspended" }) =>
      api.patch<User>(`/admin/users/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useAdminGear() {
  return useQuery({
    queryKey: ["admin-gear"],
    queryFn: () => api.get<GearItem[]>("/admin/gear"),
  });
}

export function useAdminRentals() {
  return useQuery({
    queryKey: ["admin-rentals"],
    queryFn: () => api.get<RentalOrder[]>("/admin/rentals"),
  });
}