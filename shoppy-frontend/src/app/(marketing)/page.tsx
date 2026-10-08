import { ClosingCta } from "@/components/features/landing/closing-cta";
import { Hero } from "@/components/features/landing/hero";
import { HowItWorks } from "@/components/features/landing/how-it-works";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <ClosingCta />
    </>
  );
}
