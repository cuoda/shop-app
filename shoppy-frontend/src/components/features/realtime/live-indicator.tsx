"use client";

import { useSocketStatus, type SocketStatus } from "@/providers/socket-provider";
import { cn } from "@/lib/utils";

const copy: Record<SocketStatus, { label: string; hint: string; dot: string }> = {
  idle: { label: "", hint: "", dot: "" },
  connecting: { label: "Connecting", hint: "Connecting to live updates", dot: "bg-muted-foreground" },
  live: { label: "Live", hint: "You'll see new listings and sales as they happen", dot: "bg-primary" },
  offline: { label: "Offline", hint: "Live updates are paused. Refresh to reconnect.", dot: "bg-destructive" },
};

export function LiveIndicator({ className }: { className?: string }) {
  const status = useSocketStatus();
  if (status === "idle") return null;
  const { label, hint, dot } = copy[status];
  return (
    <span title={hint} className={cn("inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold text-muted-foreground", className)}>
      <span className="relative flex size-2">
        {status === "live" && <span className={cn("absolute inset-0 animate-pulse-ring rounded-full", dot)} />}
        <span className={cn("relative size-2 rounded-full", dot)} />
      </span>
      {label}
    </span>
  );
}
