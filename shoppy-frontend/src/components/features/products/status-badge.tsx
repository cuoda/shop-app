import { Check, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function StatusBadge({ sold, className }: { sold: boolean; className?: string }) {
  return sold ? (
    <Badge variant="sold" className={className}>
      <Check className="size-3" /> Sold
    </Badge>
  ) : (
    <Badge variant="available" className={className}>
      <Circle className="size-2 fill-current" /> Available
    </Badge>
  );
}
