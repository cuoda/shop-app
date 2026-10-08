import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { APP_NAME } from "@/lib/config";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5 font-display text-xl font-bold tracking-tight", className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_6px_18px_-6px_var(--primary)] transition-transform group-hover:-rotate-6">
        <ShoppingBag className="size-5" />
      </span>
      {APP_NAME}
    </Link>
  );
}
