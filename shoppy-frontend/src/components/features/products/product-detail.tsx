"use client";

import { ArrowLeft, PackageX } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/hooks/use-product";
import { ApiError } from "@/lib/api/client";
import { routes } from "@/lib/config";
import { BuyPanel } from "./buy-panel";
import { ProductImage } from "./product-image";
import { SellerChip } from "./seller-chip";
import { StatusBadge } from "./status-badge";

export function ProductDetailView({ id }: { id: number }) {
  const { data: product, isPending, isError, error, refetch } = useProduct(id);

  const back = (
    <Link href={routes.products} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
      <ArrowLeft className="size-4" /> Marketplace
    </Link>
  );

  if (isPending) {
    return (
      <div>
        {back}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]" role="status" aria-label="Loading product">
          <Skeleton className="aspect-[4/3] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    const missing = error instanceof ApiError && error.status === 404;
    return (
      <div>
        {back}
        {missing ? (
          <EmptyState icon={PackageX} title="This product doesn't exist" description="It may have been removed, or the link is wrong." action={<Button asChild><Link href={routes.products}>Back to marketplace</Link></Button>} />
        ) : (
          <ErrorState title="Couldn't load this product" error={error} onRetry={() => void refetch()} />
        )}
      </div>
    );
  }

  return (
    <div>
      {back}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div className="glass overflow-hidden rounded-3xl p-2">
          <ProductImage id={product.id} name={product.name} src={product.imageUrl} grayscale={product.sold} className="aspect-[4/3] rounded-2xl" />
        </div>
        <div className="space-y-6 lg:sticky lg:top-28">
          <div className="space-y-4">
            <StatusBadge sold={product.sold} />
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight">{product.name}</h1>
            <SellerChip seller={product.user} />
          </div>
          <BuyPanel product={product} />
          <div>
            <h2 className="mb-2 font-display text-lg font-semibold">About this item</h2>
            <p className="max-w-prose whitespace-pre-wrap leading-relaxed text-muted-foreground">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
