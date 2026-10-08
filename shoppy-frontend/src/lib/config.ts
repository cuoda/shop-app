export const APP_NAME = "Shoppy";

/** socket.io talks to the backend directly (Next rewrites can't proxy WebSockets). */
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3001";

/** Cookie set by the backend on login (see AUTH_COOKIE in auth.service.ts). */
export const AUTH_COOKIE = "Authentication";

export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  products: "/products",
  product: (id: number) => `/products/${id}`,
  sell: "/sell",
  dashboard: "/dashboard",
  checkoutSuccess: "/checkout/success",
  checkoutCancel: "/checkout/cancel",
} as const;

export const IMAGE_RULES = {
  maxBytes: 2 * 1024 * 1024,
  types: ["image/jpeg", "image/png", "image/gif"],
} as const;

export const PRICE_MAX = 999_999.99; // Stripe USD per-item ceiling
