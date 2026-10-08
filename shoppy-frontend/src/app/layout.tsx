import type { Metadata, Viewport } from "next";
import { AuroraBackground } from "@/components/shared/aurora-background";
import { APP_NAME } from "@/lib/config";
import { Providers } from "@/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${APP_NAME}: buy and sell, live`, template: `%s · ${APP_NAME}` },
  description: "A marketplace where listings update live and payments run through Stripe.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef0fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1020" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuroraBackground />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
