"use client";

import { AnimatePresence } from "framer-motion";
import { PackageOpen, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/hooks/use-products";
import { routes } from "@/lib/config";
import { fieldStyles } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ProductStatusFilter } from "@/types";
import { ProductCard } from "./product-card";
import { gridClass, ProductGridSkeleton } from "./product-grid";

type Sort = "newest" | "price-asc" | "price-desc";

export function Marketplace() {
  const [status, setStatus] = useState<ProductStatusFilter>("available");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const { data, isPending, isError, error, refetch, isFetching } = useProducts(status);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = (data ?? []).filter((p) => !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    return [...filtered].sort((a, b) => (sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : b.id - a.id));
  }, [data, query, sort]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Marketplace"
        description="Everything listed right now. New items and sales show up here as they happen."
        actions={
          <Button asChild>
            <Link href={routes.sell}>
              <Plus /> Sell something
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or description" aria-label="Search products" className="h-12 pl-11" />
          <Search className="pointer-events-none absolute left-4 z-10 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl
            label="Show"
            value={status}
            onChange={setStatus}
            options={[
              { value: "available", label: "Available" },
              { value: "all", label: "All" },
            ]}
          />
          <select aria-label="Sort by" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={cn(fieldStyles, "h-12 w-auto cursor-pointer pr-8 font-semibold")}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>

      {isPending ? (
        <ProductGridSkeleton />
      ) : isError ? (
        <ErrorState title="Couldn't load the marketplace" error={error} onRetry={() => void refetch()} />
      ) : items.length === 0 ? (
        query ? (
          <EmptyState icon={Search} title="No matches" description={`Nothing matches "${query.trim()}". Try a different word or clear the search.`} action={<Button variant="glass" onClick={() => setQuery("")}>Clear search</Button>} />
        ) : (
          <EmptyState
            icon={PackageOpen}
            title={status === "available" ? "Nothing for sale right now" : "No listings yet"}
            description="Be the first to list something. It takes about a minute."
            action={
              <Button asChild>
                <Link href={routes.sell}>List a product</Link>
              </Button>
            }
          />
        )
      ) : (
        <>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {items.length} {items.length === 1 ? "listing" : "listings"}
            {isFetching && " · updating"}
          </p>
          <div className={gridClass}>
            <AnimatePresence mode="popLayout">
              {items.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
