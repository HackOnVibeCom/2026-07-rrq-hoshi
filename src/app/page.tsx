import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ProblemAgitation } from "@/components/landing/ProblemAgitation";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeatureDeepDive } from "@/components/landing/FeatureDeepDive";
import { LiveDemoWidget } from "@/components/landing/LiveDemoWidget";
import { Pricing } from "@/components/landing/Pricing";
import { FeatureReference } from "@/components/landing/FeatureReference";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemAgitation />
        <HowItWorks />
        <FeatureDeepDive />
        <LiveDemoWidget />
        <Pricing />
        <FeatureReference />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}