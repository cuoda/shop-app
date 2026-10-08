"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2, Undo2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/use-product";
import { clearPendingCheckout, readPendingCheckout, type PendingCheckout } from "@/lib/pending-checkout";
import { routes } from "@/lib/config";
import { formatPrice } from "@/lib/format";

const WAIT_MS = 30_000;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid min-h-[55dvh] max-w-lg place-items-center">
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="glass-strong w-full rounded-3xl p-8 text-center sm:p-10">
        {children}
      </motion.div>
    </div>
  );
}

function CheckDraw() {
  return (
    <motion.svg viewBox="0 0 52 52" className="mx-auto mb-6 size-20" initial="hidden" animate="visible">
      <motion.circle cx="26" cy="26" r="23" fill="none" stroke="var(--primary)" strokeWidth="3" variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }} transition={{ duration: 0.6 }} />
      <motion.path d="M15 27l8 8 14-16" fill="none" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }} transition={{ duration: 0.4, delay: 0.5 }} />
    </motion.svg>
  );
}

/** Stripe redirects here after payment; the backend webhook flips the product to sold. */
export function CheckoutSuccess() {
  const [pending, setPending] = useState<PendingCheckout | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    setPending(readPendingCheckout());
    setLoaded(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), WAIT_MS);
    return () => clearTimeout(timer);
  }, []);

  const { data: product } = useProduct(pending?.productId ?? 0, { enabled: !!pending, refetchInterval: timedOut ? false : 2000 });
  const confirmed = !!pending && !!product?.sold;

  useEffect(() => {
    if (confirmed) clearPendingCheckout();
  }, [confirmed]);

  if (!loaded) return null;

  if (!pending) {
    return (
      <Shell>
        <CheckDraw />
        <h1 className="font-display text-3xl font-bold">Payment complete</h1>
        <p className="mt-3 text-muted-foreground">Thanks for your purchase. The listing is marked as sold as soon as Stripe confirms it.</p>
        <Button asChild className="mt-8"><Link href={routes.products}>Back to marketplace <ArrowRight /></Link></Button>
      </Shell>
    );
  }

  return (
    <Shell>
      {confirmed ? <CheckDraw /> : timedOut ? <CheckDraw /> : <Loader2 className="mx-auto mb-6 size-12 animate-spin text-primary" />}
      <h1 className="font-display text-3xl font-bold">{confirmed ? "It's yours" : timedOut ? "Payment received" : "Confirming your payment"}</h1>
      <p className="mt-3 text-muted-foreground">
        {confirmed
          ? `${pending.name} is marked as sold and your payment of ${formatPrice(pending.price)} went through.`
          : timedOut
            ? `Stripe took your payment for ${pending.name}, but the sale hasn't shown up here yet. Check back in a minute.`
            : `Waiting for Stripe to confirm the payment for ${pending.name}. This usually takes a few seconds.`}
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild variant="glass"><Link href={routes.product(pending.productId)}>View the listing</Link></Button>
        <Button asChild><Link href={routes.products}>Keep browsing <ArrowRight /></Link></Button>
      </div>
    </Shell>
  );
}

export function CheckoutCancelled() {
  const [pending, setPending] = useState<PendingCheckout | null>(null);
  useEffect(() => {
    setPending(readPendingCheckout());
    clearPendingCheckout();
  }, []);

  return (
    <Shell>
      <span className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-muted text-muted-foreground"><Undo2 className="size-8" /></span>
      <h1 className="font-display text-3xl font-bold">Checkout cancelled</h1>
      <p className="mt-3 text-muted-foreground">No payment was taken. {pending ? `${pending.name} is still available if you change your mind.` : "You can go back and try again whenever you like."}</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        {pending && <Button asChild><Link href={routes.product(pending.productId)}>Back to {pending.name}</Link></Button>}
        <Button asChild variant={pending ? "glass" : "default"}><Link href={routes.products}>Marketplace</Link></Button>
      </div>
    </Shell>
  );
}
