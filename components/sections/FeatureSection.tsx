import { Fragment } from "react";
import type { Feature } from "@/lib/content";
import Reveal from "@/components/Reveal";
import InteractiveShot from "@/components/InteractiveShot";
import { ArrowRight } from "@/components/icons";

/**
 * Shared two-column layout for the four feature sections. `visual` picks the
 * desktop side of the image (per the frame); on mobile copy always stacks
 * above the visual.
 */
export default function FeatureSection({
  feature,
  bordered = true,
}: {
  feature: Feature;
  bordered?: boolean;
}) {
  const { id, title, body, linkLabel, linkHref, visual, image } = feature;

  return (
    <section
      id={id}
      className={`scroll-mt-20 ${bordered ? "border-b border-line" : ""}`}
    >
      <div className="mx-auto w-full max-w-[1280px] px-8 sm:px-12 lg:px-20 py-12 md:py-24">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <Reveal className={visual === "left" ? "md:order-2" : undefined}>
            <div className="flex flex-col gap-5">
              <h2 className="text-[36px]/[1.25] font-medium text-foreground">
                {title}
              </h2>
              <p className="max-w-[512px] text-[16px]/[1.625] text-muted">
                {body.map((line, i) => (
                  <Fragment key={line}>
                    {i > 0 && <br />}
                    {line}
                  </Fragment>
                ))}
              </p>
              <a
                href={linkHref}
                className="flex w-fit items-center gap-2 text-sm/[1.43] font-medium text-foreground transition-opacity duration-150 hover:opacity-75"
              >
                {linkLabel}
                <ArrowRight />
              </a>
            </div>
          </Reveal>
          <Reveal
            delay={100}
            className={visual === "left" ? "md:order-1" : undefined}
          >
            <InteractiveShot
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(max-width: 768px) 100vw, 576px"
              hotspots={image.hotspots}
              avatars={image.avatars}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
