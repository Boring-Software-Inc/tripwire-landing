import type { CSSProperties } from "react";
import "@/components/glaze/styles.css";
import "./landing.css";
import { ThemeScript } from "@/components/landing/theme-script";
import { ClosingCta, Footer, Forges, Hero, Nav, Outcomes, Product, Rules } from "@/components/landing/sections";
import { geist, geistMono } from "@/lib/fonts";

const FONTS = {
  "--font-sans": `${geist.style.fontFamily}, ui-sans-serif, system-ui, sans-serif`,
  "--font-mono": `${geistMono.style.fontFamily}, ui-monospace, monospace`,
} as CSSProperties;

export default function Home() {
  return (
    <div className="glaze lander" style={FONTS} suppressHydrationWarning>
      <ThemeScript />
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Product />
        <Outcomes />
        <Rules />
        <Forges />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
}
