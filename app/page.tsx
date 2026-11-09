import type { CSSProperties } from "react";
import "@/components/glaze/styles.css";
import "./landing.css";
import { Nav } from "@/components/landing/navigation";
import { ThemeScript } from "@/components/landing/theme-script";
import { ClosingCta, Features, Footer, Forges, Hero, Outcomes, Product, Rules } from "@/components/landing/sections";
import { geist, geistMono } from "@/lib/fonts";
import { GlazePortalProvider } from "@/lib/glaze/portal";

const FONTS = {
  "--font-sans": `${geist.style.fontFamily}, ui-sans-serif, system-ui, sans-serif`,
  "--font-mono": `${geistMono.style.fontFamily}, ui-monospace, monospace`,
} as CSSProperties;

export default function Home() {
  return (
    <div className="glaze lander" style={FONTS} suppressHydrationWarning>
      <ThemeScript />
      <GlazePortalProvider>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Product />
        <Rules />
        <Features />
        <Outcomes />
        <Forges />
        <ClosingCta />
      </main>
      <Footer />
      </GlazePortalProvider>
    </div>
  );
}
