import { LayoutDashboard, Plus, Store, type LucideIcon } from "lucide-react";
import { routes } from "@/lib/config";

export const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: routes.products, label: "Marketplace", icon: Store },
  { href: routes.sell, label: "Sell", icon: Plus },
  { href: routes.dashboard, label: "My listings", icon: LayoutDashboard },
];
