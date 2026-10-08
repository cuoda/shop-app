"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/shared/logo";

export function AuthCard({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-md">
      <Logo className="mb-8 justify-center" />
      <div className="glass-strong rounded-3xl p-7 sm:p-9">
        <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-7">{children}</div>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
    </motion.div>
  );
}
