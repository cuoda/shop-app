import { SiteShell } from "@/components/shared/site-shell";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell padded={false}>{children}</SiteShell>;
}
