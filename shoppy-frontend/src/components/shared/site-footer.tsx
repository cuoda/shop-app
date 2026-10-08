import { APP_NAME } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-24 max-w-6xl px-6 pb-28 text-sm text-muted-foreground md:pb-10">
      <div className="flex flex-col justify-between gap-2 border-t pt-6 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}</p>
        <p>Payments are processed securely by Stripe.</p>
      </div>
    </footer>
  );
}
