import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, routes } from "@/lib/config";

/**
 * Fast first gate: no auth cookie, no protected page.
 * The cookie can still be expired, so <AuthGuard> re-validates against /users/me.
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has(AUTH_COOKIE)) return NextResponse.next();

  const url = new URL(routes.login, request.url);
  url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/products/:path*", "/sell", "/dashboard/:path*", "/checkout/:path*"],
};
