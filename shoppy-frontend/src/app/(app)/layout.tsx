import { AuthGuard } from "@/components/features/auth/auth-guard";
import { SiteShell } from "@/components/shared/site-shell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell>
      <AuthGuard>{children}</AuthGuard>
    </SiteShell>
  );
}
