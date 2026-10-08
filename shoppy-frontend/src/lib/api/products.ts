import type { CreatedProduct, Product, ProductDetail, ProductInput, ProductStatusFilter } from "@/types";
import { api } from "./client";

export const productsApi = {
  list: (status: ProductStatusFilter = "all") =>
    api<Product[]>(`/products${status === "available" ? "?status=available" : ""}`),

  get: (id: number) => api<ProductDetail>(`/products/${id}`),

  create: (input: ProductInput) => api<CreatedProduct>("/products", { method: "POST", json: input }),

  uploadImage: (id: number, file: File) => {
    const form = new FormData();
    form.append("image", file); // field name expected by FileInterceptor('image')
    return api<{ imageUrl: string }>(`/products/${id}/image`, { method: "POST", form });
  },
};
