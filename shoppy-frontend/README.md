# Shoppy frontend

Next.js 16 (App Router) + TypeScript, Tailwind v4, shadcn/ui-style primitives, Framer Motion,
TanStack Query, react-hook-form + zod, socket.io-client, next-themes.

## Run it

```bash
pnpm install          # or npm install
cp .env.example .env.local
pnpm dev              # http://localhost:3000
```

Start the backend first (port 3001). In the **backend** `.env` set:

```
FRONTEND_URL=http://localhost:3000
STRIPE_SUCCESS_URL=http://localhost:3000/checkout/success
STRIPE_CANCEL_URL=http://localhost:3000/checkout/cancel
```

For a listing to flip to "sold" after payment, Stripe's webhook must reach the backend:

```bash
stripe listen --forward-to localhost:3001/checkout/webhook
```

(copy the printed signing secret into `STRIPE_WEBHOOK_SECRET`).

## How it talks to the backend

- The browser calls **same-origin** `/api/*` and `/images/*`. `next.config.ts` rewrites them to `BACKEND_URL`,
  so the httpOnly `Authentication` cookie stays first-party and REST needs no CORS setup.
- **socket.io** connects straight to `NEXT_PUBLIC_WS_URL` with cookies (Next rewrites can't proxy WebSockets).
  In production keep frontend and backend on the same site (same parent domain, or one reverse proxy that also
  routes `/socket.io`) so the cookie is sent.
- Stripe: the backend creates a hosted Checkout session and the app redirects to its `url`.
  No Stripe.js or publishable key is needed.
- The product a buyer is paying for is kept in `sessionStorage`; `/checkout/success` uses it to wait for the
  `sold` flag (the backend success URL carries no product info).

## Structure

```
src/
  app/                 routes: (marketing) (auth) (app) groups; proxy.ts gates protected pages
  components/
    ui/                shadcn-style primitives (button, input, dropdown-menu, ...)
    shared/            header, nav, empty/error states, form-field, aurora background
    features/          auth, products, checkout, landing, realtime
  hooks/               React Query hooks and checkout / upload mutations
  lib/api/             typed fetch client + endpoint modules (auth, products, checkout)
  lib/                 zod validators (mirror backend DTOs), realtime handler, format, config
  providers/           theme, query, auth, socket
  types/               types matching backend responses
```

## Backend gaps (the UI works around them; fixes are optional)

1. No "my products" route: the dashboard filters `GET /products` by the signed-in user's id.
2. `STRIPE_SUCCESS_URL` has no product/session id. Adding `?session_id={CHECKOUT_SESSION_ID}` would allow a more exact success page.
3. No orders/purchase-history endpoint, so there is no "My purchases" page.
4. `GET /products` has no pagination or text search (search is client-side).
