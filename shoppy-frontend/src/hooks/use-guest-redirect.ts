"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { routes } from "@/lib/config";
import { useAuth } from "@/providers/auth-provider";

/** Only same-site relative paths are allowed as post-login targets. */
export function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : routes.products;
}

/** Sends already-signed-in users away from /login and /register. */
export function useGuestRedirect() {
  const { status } = useAuth();
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  useEffect(() => {
    if (status === "authenticated") router.replace(next);
  }, [status, next, router]);
  return next;
}
