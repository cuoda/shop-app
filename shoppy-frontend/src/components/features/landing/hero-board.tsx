"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, CreditCard, Tag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductImage } from "@/components/features/products/product-image";
import { StatusBadge } from "@/components/features/products/status-badge";
import { LiveIndicator } from "@/components/features/realtime/live-indicator";
import { useProducts } from "@/hooks/use-products";
import { routes } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

const steps = [
  { icon: Tag, label: "Listed", note: "Visible to everyone straight away" },
  { icon: CreditCard, label: "Paying", note: "Buyer checks out on Stripe" },
  { icon: Check, label: "Sold", note: "Every open screen updates at once" },
];

/** Walks through the life of a sale. Shown to visitors who aren't signed in yet. */
function SaleWalkthrough() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setStep((s) => (s + 1) % steps.length), 2600);
    return () => clearInterval(timer);
  }, []);
  const sold = step === 2;

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">How a sale plays out</p>
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <ProductImage id={3} name="Example item" src={null} grayscale={sold} className="size-16 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1">
            <p className="font-display font-semibold">Example listing</p>
            <p className="tabular text-sm text-muted-foreground">$89</p>
          </div>
          <StatusBadge sold={sold} />
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${((step + 1) / steps.length) * 100}%` }} transition={{ duration: 0.6, ease: "easeInOut" }} />
        </div>
      </div>
      <ol className="space-y-2">
        {steps.map(({ icon: Icon, label, note }, i) => (
          <li key={label} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-500", i === step ? "bg-primary/12 opacity-100" : "opacity-45")}>
            <span className={cn("grid size-8 place-items-center rounded-lg", i === step ? "bg-primary text-primary-foreground" : "bg-muted")}>
              <Icon className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-xs text-muted-foreground">{note}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Signed-in users see the real newest listings, updating over the socket. */
function LiveBoard() {
  const { data, isPending } = useProducts("all");
  const latest = data?.slice(0, 4) ?? [];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Latest listings</p>
        <LiveIndicator />
      </div>
      {isPending ? (
        <div className="space-y-2" aria-hidden>{[0, 1, 2].map((i) => <div key={i} className="glass h-[74px] animate-pulse rounded-2xl" />)}</div>
      ) : latest.length === 0 ? (
        <p className="glass rounded-2xl p-6 text-sm text-muted-foreground">Nothing listed yet. Yours could be first.</p>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence initial={false} mode="popLayout">
            {latest.map((p) => (
              <motion.li key={p.id} layout initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                <Link href={routes.product(p.id)} className="glass flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-[var(--glass-strong)]">
                  <ProductImage id={p.id} name={p.name} src={p.imageUrl} grayscale={p.sold} className="size-14 shrink-0 rounded-xl" />
                  <span className="min-w-0 flex-1 truncate font-semibold">{p.name}</span>
                  <span className="tabular text-sm text-muted-foreground">{formatPrice(p.price)}</span>
                  <StatusBadge sold={p.sold} className="hidden sm:inline-flex" />
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

export function HeroBoard() {
  const { status } = useAuth();
  return (
    <div className="glass-strong rounded-3xl p-5 sm:p-6">
      {status === "authenticated" ? <LiveBoard /> : <SaleWalkthrough />}
    </div>
  );
}
