import Image from "next/image";
import heroDashboard from "@/public/visuals/hero-dashboard.webp";
import heroBackdrop from "@/public/visuals/hero-backdrop.webp";
import { HERO } from "@/lib/content";
import Reveal from "@/components/Reveal";
import WaitlistCta from "@/components/WaitlistCta";
import InteractiveShot from "@/components/InteractiveShot";

export default function Hero() {
  return (
    <section id="hero" className="scroll-mt-20 pt-16">
      {/* py halved on mobile — the full 96px top and bottom left the hero
          stranded from the section below on a small screen. */}
      <div className="mx-auto w-full max-w-[1536px] px-8 sm:px-12 lg:px-20 py-12 md:py-24">
        <Reveal className="mb-12 max-w-[654px]">
          <h1 className="mb-4 text-[36px]/[1.25] font-medium text-balance text-foreground">
            {HERO.headline}
          </h1>
          <p className="mb-8 max-w-2xl text-lg/[1.56] text-muted">
            {HERO.subhead}
          </p>
          <WaitlistCta label={HERO.cta} size="md" />
        </Reveal>
        <Reveal delay={100}>
          {/*
           * The frame bakes the dashboard into a padded backdrop frame. That
           * padding is rebuilt here in CSS so the screenshot fills its own
           * container — and the frame's flat dark backdrop is replaced by the
           * landscape painting, which shows through the padding around the app.
           *
           * The painting is decorative (alt=""): it carries no information the
           * page doesn't already say in text.
           */}
          <div className="relative overflow-hidden rounded-tight bg-backdrop p-5 sm:p-10 md:rounded-ui lg:p-16">
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
            <InteractiveShot
              src={heroDashboard}
              alt={HERO.screenshotAlt}
              priority
              sizes="(max-width: 1536px) 100vw, 1440px"
              hotspots={HERO.hotspots}
              className="relative overflow-hidden rounded-tight shadow-2xl ring-1 ring-black/20 md:rounded-ui"
              imageClassName="h-auto w-full"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
