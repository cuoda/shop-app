"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import { queryKeys } from "@/lib/query-keys";
import type { ProductInput } from "@/types";

interface Variables {
  input: ProductInput;
  image: File | null;
}

export interface CreateProductResult {
  id: number;
  imageFailed: string | null;
}

/** Creates the product, then uploads the optional photo (backend uses two endpoints). */
export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation<CreateProductResult, Error, Variables>({
    mutationFn: async ({ input, image }) => {
      const product = await productsApi.create(input);
      let imageFailed: string | null = null;
      if (image) {
        try {
          await productsApi.uploadImage(product.id, image);
        } catch (error) {
          imageFailed = error instanceof Error ? error.message : "Photo upload failed";
        }
      }
      return { id: product.id, imageFailed };
    },
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.products.all }),
  });
}
