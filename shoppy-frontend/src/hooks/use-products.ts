"use client";

import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import { queryKeys } from "@/lib/query-keys";
import type { ProductStatusFilter } from "@/types";

export function useProducts(status: ProductStatusFilter = "all") {
  return useQuery({ queryKey: queryKeys.products.list(status), queryFn: () => productsApi.list(status) });
}
