"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/config";
import { useAuth } from "@/providers/auth-provider";

export function ClosingCta() {
  const { status } = useAuth();
  const authed = status === "authenticated";
  return (
    <section className="mx-auto max-w-6xl px-6">
      <div className="glass-strong flex flex-col items-start justify-between gap-6 rounded-3xl p-8 sm:flex-row sm:items-center sm:p-12">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">{authed ? "Got something to sell?" : "Ready when you are"}</h2>
          <p className="mt-2 text-muted-foreground">{authed ? "Your next listing is a minute away." : "Free to join. Start with one listing or one purchase."}</p>
        </div>
        <Button asChild size="lg">
          <Link href={authed ? routes.sell : routes.register}>{authed ? "Create a listing" : "Create free account"}</Link>
        </Button>
      </div>
    </section>
  );
}
