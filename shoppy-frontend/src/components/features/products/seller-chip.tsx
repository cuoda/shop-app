import { UserAvatar } from "@/components/shared/user-avatar";
import { sellerName } from "@/lib/format";
import type { Seller } from "@/types";

export function SellerChip({ seller }: { seller: Seller }) {
  return (
    <span className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
      <UserAvatar email={seller.email} className="size-6 text-[9px]" />
      <span className="truncate">{sellerName(seller.email)}</span>
    </span>
  );
}
