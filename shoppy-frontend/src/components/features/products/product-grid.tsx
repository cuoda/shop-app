import { Skeleton } from "@/components/ui/skeleton";

export const gridClass = "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={gridClass} role="status" aria-label="Loading products">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass overflow-hidden rounded-2xl">
          <Skeleton className="aspect-[4/3] rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
