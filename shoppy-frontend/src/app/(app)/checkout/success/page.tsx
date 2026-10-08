import type { Metadata } from "next";
import { CheckoutSuccess } from "@/components/features/checkout/checkout-result";

export const metadata: Metadata = { title: "Payment" };

export default function CheckoutSuccessPage() {
  return <CheckoutSuccess />;
}
