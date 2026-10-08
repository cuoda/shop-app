"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, Loader2, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/use-checkout";
import { routes } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { useAuth } from "@/providers/auth-provider";
import type { ProductDetail } from "@/types";

export function BuyPanel({ product }: { product: ProductDetail }) {
  const { user } = useAuth();
  const checkout = useCheckout();
  const isOwner = user?.id === product.userId;

  return (
    <div className="glass-strong space-y-5 rounded-2xl p-5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">Price</span>
        <span className="tabular font-display text-3xl font-bold">{formatPrice(product.price)}</span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {product.sold ? (
          <motion.div key="sold" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <Button size="lg" className="w-full" disabled>
              Sold
            </Button>
            <p className="mt-3 text-center text-sm text-muted-foreground">This one has a new owner.</p>
          </motion.div>
        ) : isOwner ? (
          <motion.div key="own" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">This is your listing. You can't buy your own product.</p>
            <Button asChild variant="glass" size="lg" className="w-full">
              <Link href={routes.dashboard}>Manage my listings</Link>
            </Button>
          </motion.div>
        ) : (
          <motion.div key="buy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Button size="lg" className="w-full" disabled={checkout.isRedirecting} onClick={() => checkout.mutate(product)}>
              {checkout.isRedirecting ? <Loader2 className="animate-spin" /> : <CreditCard />}
              {checkout.isRedirecting ? "Taking you to Stripe" : "Buy now"}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <LockKeyhole className="size-3.5" /> Secure payment by Stripe. You'll return here afterwards.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
