import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Initials on a hue derived from the email, so each seller looks consistent everywhere. */
export function UserAvatar({ email, className }: { email: string; className?: string }) {
  const hue = [...email].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 360, 7);
  return (
    <span
      aria-hidden
      className={cn("grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white", className)}
      style={{ background: `linear-gradient(135deg, oklch(0.65 0.15 ${hue}), oklch(0.5 0.17 ${(hue + 50) % 360}))` }}
    >
      {initials(email)}
    </span>
  );
}
