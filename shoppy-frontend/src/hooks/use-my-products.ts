"use client";

import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import { queryKeys } from "@/lib/query-keys";
import { useAuth } from "@/providers/auth-provider";

/** The backend has no "my products" route, so we filter the full list by owner. */
export function useMyProducts() {
  const { user } = useAuth();
  const userId = user?.id;
  return useQuery({
    queryKey: queryKeys.products.list("all"),
    queryFn: () => productsApi.list("all"),
    select: (items) => items.filter((p) => p.userId === userId),
    enabled: userId !== undefined,
  });
}
