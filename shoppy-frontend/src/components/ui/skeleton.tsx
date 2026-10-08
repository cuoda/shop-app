import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer rounded-xl bg-[linear-gradient(110deg,var(--muted)_30%,var(--glass-strong)_50%,var(--muted)_70%)] bg-[length:200%_100%]",
        className,
      )}
      {...props}
    />
  );
}
