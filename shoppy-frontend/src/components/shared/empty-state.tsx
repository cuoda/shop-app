import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass flex flex-col items-center rounded-2xl px-6 py-16 text-center", className)}>
      <span className="mb-5 grid size-14 place-items-center rounded-2xl bg-primary/15 text-primary">
        <Icon className="size-7" />
      </span>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
