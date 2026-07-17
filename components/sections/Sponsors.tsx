import { SPONSORS } from "@/lib/content";
import Reveal from "@/components/Reveal";
import { SPONSOR_LOGOS } from "@/components/sponsor-logos";

/**
 * Social-proof strip between the hero and the feature sections. Logos render
 * in `text-faint` and lift to full foreground on hover, so they read as a
 * quiet endorsement rather than competing with the hero.
 */
export default function Sponsors() {
  return (
    <section
      id="sponsors"
      aria-label="Sponsors"
      className="scroll-mt-20 border-b border-line"
    >
      <div className="mx-auto w-full max-w-[1280px] px-8 sm:px-12 lg:px-20 py-10 md:py-14">
        <Reveal className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
          <p className="text-xs/[1.4] font-medium tracking-[0.08em] uppercase text-faint">
            {SPONSORS.heading}
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {SPONSORS.items.map((sponsor) => {
              const SponsorLogo = SPONSOR_LOGOS[sponsor.logo];
              return (
                <li key={sponsor.name}>
                  <a
                    href={sponsor.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={sponsor.name}
                    className="block text-faint transition-colors duration-150 hover:text-foreground"
                  >
                    <SponsorLogo className="h-7 w-auto" />
                  </a>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
