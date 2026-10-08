"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError, getErrorMessage } from "@/lib/api/client";
import { checkoutApi } from "@/lib/api/checkout";
import { savePendingCheckout } from "@/lib/pending-checkout";
import type { Product } from "@/types";

/** Creates a Stripe Checkout session and sends the buyer to Stripe's hosted page. */
export function useCheckout() {
  const mutation = useMutation({
    mutationFn: async (product: Pick<Product, "id" | "name" | "price">) => {
      const session = await checkoutApi.createSession(product.id);
      if (!session.url) throw new ApiError(502, "Stripe didn't return a checkout link. Try again.");
      savePendingCheckout({ productId: product.id, name: product.name, price: product.price });
      return session.url;
    },
    onSuccess: (url) => window.location.assign(url),
    onError: (error) => toast.error("Couldn't start checkout", { description: getErrorMessage(error) }),
  });

  // stay in the loading state while the browser navigates to Stripe
  return { ...mutation, isRedirecting: mutation.isPending || mutation.isSuccess };
}
