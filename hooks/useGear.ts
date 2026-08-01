import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { GearItem, Category, GearFilters } from "@/types/gear";

function buildQueryString(filters: GearFilters): string {
  const params = new URLSearchParams();

  if (filters.category) params.set("category", filters.category);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.minPrice !== undefined)
    params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined)
    params.set("maxPrice", String(filters.maxPrice));
  if (filters.available !== undefined)
    params.set("available", String(filters.available));

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function useGearList(filters: GearFilters = {}) {
  return useQuery({
    queryKey: ["gear", filters],
    queryFn: () =>
      api.get<GearItem[]>(`/gear${buildQueryString(filters)}`),
  });
}

export function useGearDetails(id: string) {
  return useQuery({
    queryKey: ["gear", id],
    queryFn: () => api.get<GearItem>(`/gear/${id}`),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<Category[]>("/categories"),
  });
}