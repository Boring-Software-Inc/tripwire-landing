import heroDashboard from "@/public/visuals/hero-dashboard.webp";
import { HERO } from "@/lib/content";
import Reveal from "@/components/Reveal";
import WaitlistCta from "@/components/WaitlistCta";
import InteractiveShot from "@/components/InteractiveShot";

export default function Hero() {
  return (
    <section id="hero" className="scroll-mt-20 pt-16">
      <div className="mx-auto w-full max-w-[1536px] px-8 py-24">
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
           * padding is rebuilt here in CSS (bg + radial gradient + radius, per
           * the frame) so the screenshot itself can fill the container instead
           * of being inset inside the exported image.
           */}
          <div className="overflow-hidden rounded-shot bg-backdrop bg-[radial-gradient(circle_farthest-corner_at_50%_50%_in_oklab,oklab(64.7%_-0.047_-0.165_/_10%)_0%,oklab(14.5%_0.0006_-0.002_/_0%)_55%)] p-4 sm:p-6 lg:p-8">
            <InteractiveShot
              src={heroDashboard}
              alt={HERO.screenshotAlt}
              priority
              sizes="(max-width: 1536px) 100vw, 1472px"
              hotspots={HERO.hotspots}
              className="overflow-hidden rounded-panel"
              imageClassName="h-auto w-full"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
