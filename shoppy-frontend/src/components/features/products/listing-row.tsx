"use client";

import { ArrowUpRight, Camera, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useUploadImage } from "@/hooks/use-upload-image";
import { IMAGE_RULES, routes } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";
import { ProductImage } from "./product-image";
import { StatusBadge } from "./status-badge";

export function ListingRow({ product }: { product: Product }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadImage();

  return (
    <li className="glass flex flex-col gap-4 rounded-2xl p-3 sm:flex-row sm:items-center">
      <ProductImage id={product.id} name={product.name} src={product.imageUrl} grayscale={product.sold} className="aspect-[4/3] w-full shrink-0 rounded-xl sm:aspect-square sm:size-20" />
      <div className="min-w-0 flex-1">
        <Link href={routes.product(product.id)} className="line-clamp-1 font-display text-lg font-semibold hover:underline">
          {product.name}
        </Link>
        <div className="mt-1.5 flex items-center gap-3">
          <StatusBadge sold={product.sold} />
          <span className="tabular text-sm text-muted-foreground">{formatPrice(product.price)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_RULES.types.join(",")}
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload.mutate({ id: product.id, file });
            e.target.value = "";
          }}
        />
        <Button variant="glass" size="sm" disabled={upload.isPending} onClick={() => inputRef.current?.click()}>
          {upload.isPending ? <Loader2 className="animate-spin" /> : <Camera />}
          {product.imageUrl ? "Change photo" : "Add photo"}
        </Button>
        <Button asChild variant="ghost" size="icon" aria-label={`Open ${product.name}`}>
          <Link href={routes.product(product.id)}>
            <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </li>
  );
}
