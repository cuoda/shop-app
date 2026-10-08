import { Compass } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { SiteShell } from "@/components/shared/site-shell";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <SiteShell>
      <EmptyState icon={Compass} title="Page not found" description="That address doesn't lead anywhere. It may have moved, or the link is mistyped." action={<Button asChild><Link href="/">Go home</Link></Button>} />
    </SiteShell>
  );
}
