import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productsApi } from "@/lib/api/products";
import { formatPrice } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { routes } from "@/lib/config";
import type { ProductEvent } from "@/types";

interface Context {
  qc: QueryClient;
  userId: number;
  navigate: (path: string) => void;
}

/** Reacts to the backend's `productUpdated` socket event. */
export async function handleProductEvent(event: ProductEvent, { qc, userId, navigate }: Context) {
  await qc.invalidateQueries({ queryKey: queryKeys.products.all });

  if (event.type === "updated") return;

  try {
    const product = await qc.fetchQuery({
      queryKey: queryKeys.products.detail(event.productId),
      queryFn: () => productsApi.get(event.productId),
      staleTime: 0,
    });
    const mine = product.userId === userId;

    if (event.type === "sold" && mine) {
      toast.success(`${product.name} just sold`, { description: `${formatPrice(product.price)} is on its way to you.` });
    }
    if (event.type === "created" && !mine) {
      toast(`New listing: ${product.name}`, {
        description: formatPrice(product.price),
        action: { label: "View", onClick: () => navigate(routes.product(product.id)) },
      });
    }
  } catch {
    /* product vanished or request failed: the list refresh above is enough */
  }
}
