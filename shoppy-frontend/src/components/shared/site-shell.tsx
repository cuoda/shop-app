import { MobileNav } from "./mobile-nav";
import { PageTransition } from "./page-transition";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function SiteShell({ children, padded = true }: { children: React.ReactNode; padded?: boolean }) {
  return (
    <>
      <SiteHeader />
      <main className={padded ? "mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6" : undefined}>
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
      <MobileNav />
    </>
  );
}
