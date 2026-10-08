"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { routes } from "@/lib/config";
import { useAuth } from "@/providers/auth-provider";

/** Client-side session check. proxy.ts only looks for the cookie; this catches expired ones. */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") router.replace(`${routes.login}?next=${encodeURIComponent(pathname)}`);
  }, [status, pathname, router]);

  if (status !== "authenticated") {
    return (
      <div className="grid min-h-[60dvh] place-items-center" role="status" aria-label="Checking your session">
        <Loader2 className="size-7 animate-spin text-primary" />
      </div>
    );
  }
  return <>{children}</>;
}
