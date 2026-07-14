import { FEATURES } from "@/lib/content";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import FeatureSection from "@/components/sections/FeatureSection";
import CtaBand from "@/components/sections/CtaBand";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
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
