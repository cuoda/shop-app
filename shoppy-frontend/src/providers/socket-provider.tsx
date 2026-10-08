"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { WS_URL } from "@/lib/config";
import { queryKeys } from "@/lib/query-keys";
import { handleProductEvent } from "@/lib/realtime";
import type { ProductEvent } from "@/types";
import { useAuth } from "./auth-provider";

export type SocketStatus = "idle" | "connecting" | "live" | "offline";

const SocketContext = createContext<SocketStatus>("idle");

/** Opens one socket per signed-in user and keeps React Query in sync with backend events. */
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const router = useRouter();
  const [status, setStatus] = useState<SocketStatus>("idle");
  const userId = user?.id ?? null;

  useEffect(() => {
    if (userId === null) {
      setStatus("idle");
      return;
    }
    setStatus("connecting");
    const socket = io(WS_URL, { withCredentials: true });

    socket.on("connect", () => setStatus("live"));
    socket.on("disconnect", () => setStatus("offline"));
    socket.on("connect_error", () => setStatus("offline"));
    // backend rejects sockets without a valid cookie, so re-check the session
    socket.on("unauthorized", () => {
      setStatus("offline");
      qc.invalidateQueries({ queryKey: queryKeys.me });
    });
    socket.on("productUpdated", (event: ProductEvent) => {
      void handleProductEvent(event, { qc, userId, navigate: (path) => router.push(path) });
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [userId, qc, router]);

  return <SocketContext.Provider value={status}>{children}</SocketContext.Provider>;
}

export function useSocketStatus() {
  return useContext(SocketContext);
}
