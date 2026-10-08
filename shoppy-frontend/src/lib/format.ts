const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usdWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number) {
  return Number.isInteger(value) ? usdWhole.format(value) : usd.format(value);
}

/** "jane.doe@mail.com" -> "jane.doe" */
export function sellerName(email: string) {
  return email.split("@")[0] ?? email;
}

export function initials(email: string) {
  const name = sellerName(email).replace(/[^a-zA-Z0-9]+/g, " ").trim();
  const parts = name.split(" ").filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
  return letters.toUpperCase() || "?";
}

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
