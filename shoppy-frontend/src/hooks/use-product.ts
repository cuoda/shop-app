"use client";

import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import { queryKeys } from "@/lib/query-keys";

export function useProduct(id: number, options?: { refetchInterval?: number | false; enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsApi.get(id),
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled ?? true,
  });
}
