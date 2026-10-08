import { cn } from "@/lib/utils";

export const fieldStyles =
  "w-full rounded-xl border border-input bg-[var(--glass)] px-4 text-sm text-foreground backdrop-blur-md transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:opacity-50";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return <input type={type} className={cn(fieldStyles, "h-11", className)} {...props} />;
}
