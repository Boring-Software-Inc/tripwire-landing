import type { ReactNode } from "react";
import { cn } from "@/lib/glaze/utils";

export type Rule = {
  title: string;
  words: string[];
  value?: ReactNode;
  mono?: boolean;
  matches: number;
  spikes: number[];
};

export const RULES: Record<"crypto" | "age" | "honeypot" | "files", Rule> = {
  crypto: {
    title: "Crypto address",
    words: ["Catches", "cryptocurrency", "addresses", "in", "titles,", "comments", "and", "diffs."],
    matches: 2,
    spikes: [9.3, 17.3],
  },
  age: {
    title: "Account age",
    words: ["Flags", "change", "requests", "from", "accounts", "younger", "than"],
    value: "7 days",
    matches: 0,
    spikes: [],
  },
  honeypot: {
    title: "Honeypot paths",
    words: ["Catches", "change", "requests", "that", "touch"],
    value: ".github/workflows/**",
    mono: true,
    matches: 0,
    spikes: [],
  },
  files: {
    title: "Max files changed",
    words: ["Flags", "change", "requests", "that", "touch", "more", "than"],
    value: "200 files",
    matches: 1,
    spikes: [9.3],
  },
};

function sparkPoints(spikes: number[]) {
  const pts = ["0,15"];
  for (let i = 0; i < 24; i++) {
    const x = Math.round(((4 + 8 * i) / 3) * 10) / 10;
    pts.push(`${x},${spikes.some((s) => Math.abs(s - x) < 0.2) ? 2 : 15}`);
  }
  pts.push("64,15");
  return pts.join(" ");
}

function Switch() {
  return (
    <span
      className="flex h-[18px] w-8 shrink-0 items-center justify-end rounded-pill p-0.5"
      style={{ backgroundImage: "linear-gradient(in oklab 180deg, var(--glaze-sm-top) 0%, var(--glaze-sm-mid) 50%, var(--glaze-sm-bottom) 100%)" }}
    >
      <span className="size-3.5 rounded-pill bg-paper" />
    </span>
  );
}

export function RuleCard({
  rule,
  width,
  compact = false,
  hover = false,
  className,
}: {
  rule: Rule;
  width: number | string;
  compact?: boolean;
  hover?: boolean;
  className?: string;
}) {
  const meta = compact ? "text-[13px] leading-[18px]" : "text-[12px] leading-4";
  return (
    <div
      className={cn("flex shrink-0 flex-col rounded-shell bg-shell p-[3px]", !compact && "h-36", hover && "card-hover", className)}
      style={{ width }}
    >
      <div className="flex grow flex-col gap-1.5 rounded-panel bg-paper px-[13px] py-[11px]">
        <div className="flex h-[21px] shrink-0 items-center gap-2">
          <span className="line-clamp-1 text-[14px] leading-[21px] font-medium text-text-1">{rule.title}</span>
          <span className="grow" />
          <Switch />
        </div>
        <p className="flex h-[39px] shrink-0 flex-wrap gap-x-[3.5px] overflow-clip text-[13px] leading-[19.5px] text-text-2">
          {rule.words.map((w, i) => (
            <span key={i}>{w}</span>
          ))}
          {rule.value ? (
            <span className="flex">
              <span
                className={cn(
                  "slot h-[18px] font-medium text-text-1",
                  rule.mono ? "font-mono text-[11.5px] leading-[19.5px]" : "text-[13px] leading-[19.5px]",
                )}
              >
                {rule.value}
              </span>
              <span>.</span>
            </span>
          ) : null}
        </p>
      </div>
      <div className="flex items-center justify-between px-[13px] pt-2 pb-1.5">
        <span className="flex items-center gap-1.5">
          <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" className="shrink-0 text-text-2">
            <circle cx="7" cy="7" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <path d="M3.3 10.7L10.7 3.3" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          <span className={cn(meta, "font-medium text-text-2")}>Blocks</span>
        </span>
        <span className="flex items-center gap-2">
          <svg aria-hidden width="64" height="16" viewBox="0 0 64 16" className="shrink-0">
            {rule.matches ? (
              <polyline
                points={sparkPoints(rule.spikes)}
                fill="none"
                stroke="var(--ink-45)"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path d="M0 15H64" stroke="var(--ink-10)" strokeWidth="1.2" strokeDasharray="2 3" />
            )}
          </svg>
          {rule.matches ? (
            <span className="flex items-baseline gap-1">
              <span className="text-[13px] leading-[19.5px] font-medium text-text-1">{rule.matches}</span>
              <span className={cn(meta, "text-text-2")}>{rule.matches === 1 ? "match, last 24 h" : "matches, last 24 h"}</span>
            </span>
          ) : (
            <span className={cn(meta, "text-text-2")}>No matches, last 24 h</span>
          )}
        </span>
      </div>
    </div>
  );
}
