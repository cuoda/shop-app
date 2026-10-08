import type { CheckoutSession } from "@/types";
import { api } from "./client";

export const checkoutApi = {
  createSession: (productId: number) =>
    api<CheckoutSession>("/checkout/session", { method: "POST", json: { productId } }),
};
