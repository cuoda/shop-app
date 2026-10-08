"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api/client";
import { productsApi } from "@/lib/api/products";
import { queryKeys } from "@/lib/query-keys";
import { validateImage } from "@/lib/validators";

export function useUploadImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const problem = validateImage(file);
      if (problem) throw new Error(problem);
      return productsApi.uploadImage(id, file);
    },
    onSuccess: () => {
      toast.success("Photo updated");
      return qc.invalidateQueries({ queryKey: queryKeys.products.all });
    },
    onError: (error) => toast.error("Couldn't upload the photo", { description: getErrorMessage(error) }),
  });
}
