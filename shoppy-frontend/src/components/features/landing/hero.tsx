"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/config";
import { useAuth } from "@/providers/auth-provider";
import { HeroBoard } from "./hero-board";

const headline = ["Buy", "and", "sell,", "live."];

export function Hero() {
  const { status } = useAuth();
  const authed = status === "authenticated";

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-12 pt-16 lg:grid-cols-[1.15fr_1fr] lg:pt-24">
      <div>
        <h1 className="font-display text-6xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
          {headline.map((word, i) => (
            <motion.span key={word} className="mr-[0.25em] inline-block" initial={{ opacity: 0, y: 40, rotateX: -50 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.7, delay: 0.1 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}>
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} className="mt-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
          List an item in about a minute. Buyers pay through Stripe, and the listing flips to sold on every screen the moment the payment lands.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }} className="mt-10 flex flex-wrap gap-3">
          {authed ? (
            <>
              <Button asChild size="lg"><Link href={routes.products}>Browse marketplace <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="glass"><Link href={routes.sell}>Sell something</Link></Button>
            </>
          ) : (
            <>
              <Button asChild size="lg"><Link href={routes.register}>Create free account <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="glass"><Link href={routes.login}>Sign in</Link></Button>
            </>
          )}
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
        <HeroBoard />
      </motion.div>
    </section>
  );
}
