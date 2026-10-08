"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { navItems } from "./nav-items";

/** Bottom tab bar for signed-in users on small screens. */
export function MobileNav() {
  const { status } = useAuth();
  const pathname = usePathname();
  if (status !== "authenticated") return null;
  return (
    <nav aria-label="Main" className="glass-strong fixed inset-x-3 bottom-3 z-40 grid grid-cols-3 rounded-2xl p-1.5 md:hidden">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn("flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-semibold transition-colors", active ? "bg-primary/15 text-primary" : "text-muted-foreground")}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
