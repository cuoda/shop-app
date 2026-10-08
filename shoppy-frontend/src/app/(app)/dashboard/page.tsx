import type { Metadata } from "next";
import { MyListings } from "@/components/features/products/my-listings";

export const metadata: Metadata = { title: "My listings" };

export default function DashboardPage() {
  return <MyListings />;
}
