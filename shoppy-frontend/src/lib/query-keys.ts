import type { ProductStatusFilter } from "@/types";

export const queryKeys = {
  me: ["me"] as const,
  products: {
    all: ["products"] as const,
    list: (status: ProductStatusFilter) => ["products", "list", status] as const,
    detail: (id: number) => ["products", "detail", id] as const,
  },
};
