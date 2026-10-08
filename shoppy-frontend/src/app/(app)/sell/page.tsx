import type { Metadata } from "next";
import { SellForm } from "@/components/features/products/sell-form";

export const metadata: Metadata = { title: "Sell something" };

export default function SellPage() {
  return <SellForm />;
}
