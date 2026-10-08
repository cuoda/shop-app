"use client";

import { PackageOpen, Plus } from "lucide-react";
import Link from "next/link";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyProducts } from "@/hooks/use-my-products";
import { routes } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { ListingRow } from "./listing-row";

export function MyListings() {
  const { data, isPending, isError, error, refetch } = useMyProducts();

  const sold = data?.filter((p) => p.sold) ?? [];
  const stats = [
    { label: "Listed", value: data?.length ?? 0 },
    { label: "Available", value: (data?.length ?? 0) - sold.length },
    { label: "Sold", value: sold.length },
    { label: "Earned", value: sold.reduce((sum, p) => sum + p.price, 0), format: formatPrice },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="My listings"
        description="Everything you've put up for sale. Sales update here the moment a payment goes through."
        actions={
          <Button asChild>
            <Link href={routes.sell}>
              <Plus /> New listing
            </Link>
          </Button>
        }
      />

      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-5">
            <dt className="text-sm text-muted-foreground">{stat.label}</dt>
            <dd className="mt-1 font-display text-3xl font-bold">{isPending ? <Skeleton className="mt-2 h-8 w-16" /> : <AnimatedNumber value={stat.value} format={stat.format} />}</dd>
          </div>
        ))}
      </dl>

      {isPending ? (
        <div className="space-y-3" role="status" aria-label="Loading your listings">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
      ) : isError ? (
        <ErrorState title="Couldn't load your listings" error={error} onRetry={() => void refetch()} />
      ) : data.length === 0 ? (
        <EmptyState icon={PackageOpen} title="You haven't listed anything yet" description="Add your first product and it will show up in the marketplace straight away." action={<Button asChild><Link href={routes.sell}>List a product</Link></Button>} />
      ) : (
        <ul className="space-y-3">
          {data.map((product) => (
            <ListingRow key={product.id} product={product} />
          ))}
        </ul>
      )}
    </div>
  );
}
