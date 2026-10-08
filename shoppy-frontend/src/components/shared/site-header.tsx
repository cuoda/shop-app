"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "@/components/features/auth/user-menu";
import { LiveIndicator } from "@/components/features/realtime/live-indicator";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/config";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { Logo } from "./logo";
import { navItems } from "./nav-items";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const { status } = useAuth();
  const pathname = usePathname();
  const authed = status === "authenticated";

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
      <div className="glass-strong mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl px-4 sm:px-5">
        <div className="flex items-center gap-8">
          <Logo />
          {authed && (
            <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
              {navItems.map(({ href, label }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn("relative rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors", active ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
                  >
                    {active && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-lg bg-muted" transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />}
                    <span className="relative">{label}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {authed && <LiveIndicator className="hidden sm:inline-flex" />}
          <ThemeToggle />
          {authed ? (
            <UserMenu />
          ) : status === "unauthenticated" ? (
            <div className="ml-1 flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href={routes.login}>Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href={routes.register}>Get started</Link>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
