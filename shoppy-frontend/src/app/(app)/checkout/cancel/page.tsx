import type { Metadata } from "next";
import { CheckoutCancelled } from "@/components/features/checkout/checkout-result";

export const metadata: Metadata = { title: "Checkout cancelled" };

export default function CheckoutCancelPage() {
  return <CheckoutCancelled />;
}
