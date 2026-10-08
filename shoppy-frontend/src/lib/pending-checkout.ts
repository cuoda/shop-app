// The backend's STRIPE_SUCCESS_URL carries no product info, so we remember
// which product the buyer was paying for in this tab and read it on return.
const KEY = "shoppy:pending-checkout";

export interface PendingCheckout {
  productId: number;
  name: string;
  price: number;
  startedAt: number;
}

export function savePendingCheckout(value: Omit<PendingCheckout, "startedAt">) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...value, startedAt: Date.now() }));
  } catch {
    /* storage unavailable: the success page falls back to a generic message */
  }
}

export function readPendingCheckout(): PendingCheckout | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PendingCheckout) : null;
  } catch {
    return null;
  }
}

export function clearPendingCheckout() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
