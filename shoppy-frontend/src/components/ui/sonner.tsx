"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      theme={(resolvedTheme as ToasterProps["theme"]) ?? "system"}
      position="bottom-right"
      offset={{ bottom: 88, right: 16 }}
      mobileOffset={{ bottom: 88 }}
      toastOptions={{
        classNames: {
          toast: "!glass-strong !rounded-2xl !border-[var(--glass-border)] !text-foreground !font-sans",
          description: "!text-muted-foreground",
          actionButton: "!bg-primary !text-primary-foreground !rounded-lg",
        },
      }}
      {...props}
    />
  );
}
