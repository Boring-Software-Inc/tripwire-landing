import { CTA_BAND } from "@/lib/content";
import Reveal from "@/components/Reveal";
import WaitlistCta from "@/components/WaitlistCta";

export default function CtaBand() {
  return (
    <section id="cta" className="scroll-mt-20 border-t border-line">
      <div className="px-8 py-24 sm:px-12 lg:px-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-5xl/[1] font-medium tracking-[-1.2px] text-foreground">
            {CTA_BAND.headline}
          </h2>
          <p className="mt-6 text-lg/[1.625] text-faint">{CTA_BAND.subhead}</p>
          <div className="mt-10">
            <WaitlistCta label={CTA_BAND.cta} size="sm" align="center" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
