"use client";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./auth-provider";
import { QueryProvider } from "./query-provider";
import { SocketProvider } from "./socket-provider";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <SocketProvider>
            {children}
            <Toaster />
          </SocketProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
