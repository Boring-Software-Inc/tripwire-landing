import Image from "next/image";
import heroBackdrop from "@/public/visuals/hero-backdrop.webp";
import { HERO } from "@/lib/content";
import Reveal from "@/components/Reveal";
import RequestAccessCta from "@/components/RequestAccessCta";
import HeroDemo from "@/components/HeroDemo";

export default function Hero() {
  return (
    <section id="hero" className="scroll-mt-20 pt-16">
      {/* py halved on mobile — the full 96px top and bottom left the hero
          stranded from the section below on a small screen. */}
      <div className="mx-auto w-full max-w-[1536px] px-8 sm:px-12 lg:px-20 py-12 md:py-24">
        <Reveal className="mb-12 max-w-[654px]">
          {/*
           * Sets expectations up front: the CTA band says "Install the GitHub
           * App", which you can't actually do yet. The badge makes the gating
           * read as deliberate rather than broken.
           */}
          <p className="mb-5 inline-flex items-center gap-2 rounded-tight border border-line-strong bg-surface px-2.5 py-1 text-xs/[1.4] font-medium text-muted md:rounded-ui">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-foreground"
            />
            {HERO.badge}
          </p>
          <h1 className="mb-4 text-[36px]/[1.25] font-medium text-balance text-foreground">
            {HERO.headline}
          </h1>
          <p className="mb-8 max-w-2xl text-lg/[1.56] text-muted">
            {HERO.subhead}
          </p>
          <RequestAccessCta label={HERO.cta} size="md" />
        </Reveal>
        <Reveal delay={100}>
          {/*
           * OUTSET — the backdrop-painting frame that holds the demo. It's
           * padded on the top and sides only; the bottom is flush, and its
           * `overflow-hidden` clips the INSET's lower edge. The painting is
           * decorative (alt="") — it carries no information the page doesn't
           * already say in text.
           */}
          <div className="relative overflow-hidden rounded-tight bg-backdrop md:rounded-ui">
            {/*
             * Decoration, so it is tuned for weight over fidelity: the source is
             * pre-cropped to this container's aspect (no pixels thrown away by
             * object-cover) and served at q=65. At full res it was a 736 kB
             * download sitting right next to the LCP.
             */}
            <Image
              src={heroBackdrop}
              alt=""
              aria-hidden="true"
              fill
              priority
              quality={65}
              sizes="(max-width: 1536px) 100vw, 1472px"
              className="object-cover"
            />
            {/*
             * Top + side padding frames the inset with the painting; no bottom
             * padding, so the demo runs to the outset's bottom edge and is
             * concealed there. `-mb-px` bleeds it a hair past the edge so the
             * outset's clip — not the inset's own border — hides the bottom.
             */}
            <div className="relative -mb-px px-5 pt-5 sm:px-10 sm:pt-10 lg:px-16 lg:pt-16">
              {/*
               * The moderation dashboard, formerly a flat screenshot, is now a
               * live recreation whose stat-card wells carry real dither-kit
               * sparklines. Only the top corners round — the bottom tucks under
               * the outset, which owns the concealment and the scroll reveal.
               */}
              <HeroDemo
                aria-label={HERO.screenshotAlt}
                className="rounded-t-tight shadow-2xl ring-1 ring-black/20 md:rounded-t-ui"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
