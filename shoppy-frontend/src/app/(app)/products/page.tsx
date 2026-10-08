import type { Metadata } from "next";
import { Marketplace } from "@/components/features/products/marketplace";

export const metadata: Metadata = { title: "Marketplace" };

export default function ProductsPage() {
  return <Marketplace />;
}
