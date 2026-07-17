import { FEATURES } from "@/lib/content";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Sponsors from "@/components/sections/Sponsors";
import FeatureSection from "@/components/sections/FeatureSection";
import CtaBand from "@/components/sections/CtaBand";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      {/* tabIndex -1 so the skip link can move focus here, not just scroll */}
      <main id="main" tabIndex={-1}>
        <Hero />
        <Sponsors />
        {FEATURES.map((feature) => (
          <FeatureSection
            key={feature.id}
            feature={feature}
            /* the PR-surface section has no bottom hairline in the frame */
            bordered={feature.id !== "pr-surface"}
          />
        ))}
        <CtaBand />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
