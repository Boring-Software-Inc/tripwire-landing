import Image, { type StaticImageData } from "next/image";
import type { Hotspot } from "@/lib/content";

/**
 * A product screenshot with hover hotspots laid over the elements that would be
 * interactive in the real app (list rows, rule cards, workflow nodes, buttons).
 *
 * The screenshots stay as exported images — per the brief they are not rebuilt
 * in HTML — so the hotspots are positioned in percentages taken from the actual
 * node geometry in the Paper frame, which keeps them aligned at every width.
 *
 * Hover only: these are not real controls, so they are aria-hidden and never
 * enter the tab order. The image's alt text already describes the content.
 * Tailwind's `hover:` compiles under `@media (hover: hover)`, so touch devices
 * never get a stuck hover state.
 */
export default function InteractiveShot({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  hotspots = [],
  className,
  imageClassName,
}: {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  hotspots?: Hotspot[];
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        {...(typeof src === "string" ? { width, height } : {})}
        sizes={sizes}
        priority={priority}
        className={imageClassName ?? "h-auto w-full"}
      />

      {hotspots.length > 0 && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {hotspots.map((spot, i) => (
            <span
              key={i}
              className="pointer-events-auto absolute cursor-pointer transition-[background-color,box-shadow] duration-150 ease-out hover:bg-white/[0.06] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] motion-reduce:transition-none"
              style={{
                left: `${spot.left}%`,
                top: `${spot.top}%`,
                width: `${spot.width}%`,
                height: `${spot.height}%`,
                borderRadius: `${spot.radius ?? 8}px`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
