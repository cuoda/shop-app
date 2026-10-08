import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md",
  {
    variants: {
      variant: {
        available: "bg-primary/15 text-primary ring-1 ring-primary/30",
        sold: "bg-sold/15 text-sold ring-1 ring-sold/30",
        neutral: "bg-muted text-muted-foreground ring-1 ring-border",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
