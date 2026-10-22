import type { AsciiArt as Art } from "@/components/landing/ascii-art-data";
import { cn } from "@/lib/glaze/utils";

const GAIN = 1.65;

const TONE: Record<string, string> = {
  "#F4F4F3": "var(--ink)",
  "#F97316": "var(--brand-fire-body)",
  "#E8461C": "var(--brand-fire-hot)",
};

export function AsciiArt({ art, stretch = false, className }: { art: Art; stretch?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden
      width={stretch ? "100%" : art.width}
      height={art.height}
      viewBox={`0 0 ${art.width} ${art.height}`}
      preserveAspectRatio={stretch ? "none" : "xMidYMax slice"}
      className={cn("pointer-events-none select-none", className)}
      fontSize={art.fontSize}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {art.groups.map((g, i) => (
        <g key={i} fill={TONE[g.fill] ?? g.fill} fillOpacity={Math.min(1, g.opacity * GAIN)}>
          {g.rows.map(([y, text]) => (
            <text key={y} x={0} y={y} xmlSpace="preserve" style={{ whiteSpace: "pre" }}>
              {text}
            </text>
          ))}
        </g>
      ))}
    </svg>
  );
}
