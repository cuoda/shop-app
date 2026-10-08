import { CircleAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";

export function ErrorState({
  title = "Couldn't load this",
  error,
  onRetry,
  className,
}: {
  title?: string;
  error: unknown;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div role="alert" className={cn("glass flex flex-col items-center rounded-2xl px-6 py-14 text-center", className)}>
      <span className="mb-5 grid size-14 place-items-center rounded-2xl bg-destructive/15 text-destructive">
        <CircleAlert className="size-7" />
      </span>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{getErrorMessage(error)}</p>
      {onRetry && (
        <Button variant="glass" className="mt-6" onClick={onRetry}>
          <RefreshCw /> Try again
        </Button>
      )}
    </div>
  );
}
