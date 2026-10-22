"use client";

import { useState } from "react";
import type { Rule } from "@/components/landing/rules-data";
import { cn } from "@/lib/glaze/utils";

function sparkPoints(spikes: number[]) {
  const pts = ["0,15"];
  for (let i = 0; i < 24; i++) {
    const x = Math.round(((4 + 8 * i) / 3) * 10) / 10;
    pts.push(`${x},${spikes.some((s) => Math.abs(s - x) < 0.2) ? 2 : 15}`);
  }
  pts.push("64,15");
  return pts.join(" ");
}

function Switch({ on, name, onFlip }: { on: boolean; name: string; onFlip: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={name}
      onClick={onFlip}
      className="flex h-[18px] w-8 shrink-0 items-center rounded-pill p-0.5 focus-visible:outline-offset-1"
      style={{
        justifyContent: on ? "flex-end" : "flex-start",
        backgroundImage: on
          ? "linear-gradient(in oklab 180deg, var(--glaze-sm-top) 0%, var(--glaze-sm-mid) 50%, var(--glaze-sm-bottom) 100%)"
          : "linear-gradient(var(--switch-off), var(--switch-off))",
      }}
    >
      <span className="size-3.5 rounded-pill" style={{ backgroundColor: on ? "var(--paper)" : "var(--switch-knob)" }} />
    </button>
  );
}

export function RuleCard({
  rule,
  width,
  compact = false,
  phone = false,
  hover = false,
  className,
  onToggle,
}: {
  rule: Rule;
  width?: number;
  compact?: boolean;
  phone?: boolean;
  hover?: boolean;
  className?: string;
  onToggle?: (on: boolean) => void;
}) {
  const [on, setOn] = useState(true);
  const flip = () => {
    setOn(!on);
    onToggle?.(!on);
  };
  const meta = compact ? "text-[13px] leading-[18px]" : "text-[12px] leading-4";
  const head = (
    <>
      <div className="flex h-[21px] shrink-0 items-center gap-2">
        <span className="line-clamp-1 text-[14px] leading-[21px] font-medium text-text-1">{rule.title}</span>
        <span className="grow" />
        <Switch on={on} name={rule.title} onFlip={flip} />
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
            {rule.after ? null : <span>.</span>}
          </span>
        ) : null}
        {rule.after?.map((w, i) => (
          <span key={`a${i}`}>{w}</span>
        ))}
      </p>
    </>
  );
  const foot = (
    <>
      <span className="flex items-center gap-1.5">
        <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" className="shrink-0 text-text-2">
          <circle cx="7" cy="7" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path d="M3.3 10.7L10.7 3.3" stroke="currentColor" strokeWidth="1.3" />
        </svg>
        <span className={cn(meta, "font-medium text-text-2")}>{rule.label ?? "Blocks"}</span>
      </span>
      <span className="flex min-w-0 items-center gap-2">
        <svg aria-hidden width="64" height="16" viewBox="0 0 64 16" preserveAspectRatio="none" className={cn("min-w-0 shrink", !on && "hidden")}>
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
        {!on ? (
          <span className={cn(meta, "whitespace-nowrap text-text-2")}>Off</span>
        ) : rule.matches ? (
          <span className="flex items-baseline gap-1">
            <span className="text-[13px] leading-[19.5px] font-medium text-text-1">{rule.matches}</span>
            <span className={cn(meta, "whitespace-nowrap text-text-2")}>{rule.matches === 1 ? "match, last 24 h" : "matches, last 24 h"}</span>
          </span>
        ) : (
          <span className={cn(meta, "whitespace-nowrap text-text-2")}>No matches, last 24 h</span>
        )}
      </span>
    </>
  );
  if (phone) {
    return (
      <div
        className={cn(
          "rule-card phone-card flex h-36 w-full shrink-0 flex-col gap-1.5 rounded-[14px] border bg-paper px-4 pt-3.5 pb-3",
          hover && "card-hover",
          className,
        )}
        data-queued={on ? undefined : ""}
      >
        {head}
        <span className="grow" />
        <div className="flex h-7 shrink-0 items-center justify-between gap-2 border-t border-line-faint pt-2.5">{foot}</div>
      </div>
    );
  }
  return (
    <div
      className={cn("rule-card flex shrink-0 flex-col rounded-shell bg-shell p-[3px]", !compact && "h-36", hover && "card-hover", className)}
      data-queued={on ? undefined : ""}
      style={{ width }}
    >
      <div className="flex grow flex-col gap-1.5 rounded-panel bg-paper px-[13px] py-[11px]">{head}</div>
      <div className="flex items-center justify-between gap-2 px-[13px] pt-2 pb-1.5">{foot}</div>
    </div>
  );
}
