"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { routes } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Seller } from "@/types";
import { ProductImage } from "./product-image";
import { SellerChip } from "./seller-chip";
import { StatusBadge } from "./status-badge";

export interface ProductCardData {
  id: number;
  name: string;
  price: number;
  sold: boolean;
  imageUrl: string | null;
  user: Seller;
}

export function ProductCardBody({ product, className }: { product: ProductCardData; className?: string }) {
  return (
    <div className={cn("glass group overflow-hidden rounded-2xl transition-shadow duration-300 group-hover:shadow-[0_16px_48px_-12px_var(--primary)]", className)}>
      <div className="relative aspect-[4/3]">
        <ProductImage id={product.id} name={product.name} src={product.imageUrl} grayscale={product.sold} className="size-full transition-transform duration-500 group-hover:scale-[1.04]" />
        <StatusBadge sold={product.sold} className="absolute left-3 top-3" />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug">{product.name || "Untitled product"}</h3>
          <p className={cn("tabular shrink-0 font-display text-lg font-bold", product.sold && "text-muted-foreground line-through")}>{formatPrice(product.price)}</p>
        </div>
        <SellerChip seller={product.user} />
      </div>
    </div>
  );
}

export function ProductCard({ product, index = 0 }: { product: ProductCardData; index?: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04, ease: "easeOut" }}
      whileHover={{ y: -4 }}
    >
      <Link href={routes.product(product.id)} className="group block rounded-2xl">
        <ProductCardBody product={product} />
      </Link>
    </motion.div>
  );
}
