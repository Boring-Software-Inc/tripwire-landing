"use client";

import { useState } from "react";
import { Logo } from "@/components/landing/logo";
import { RuleCard } from "@/components/landing/rule-card";
import { RULES } from "@/components/landing/rules-data";
import { cn } from "@/lib/glaze/utils";

const TABS = ["Moderation", "Activity", "Rules", "Workflows", "Customize", "Analytics"];

function Sort({ className }: { className?: string }) {
  return (
    <svg aria-hidden width="12" height="12" viewBox="0 0 14 14" className={cn("shrink-0", className)}>
      <path d="M4.5 5.5L7 3l2.5 2.5M4.5 8.5L7 11l2.5-2.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Segment({ label, count, on = false }: { label: string; count: number; on?: boolean }) {
  return (
    <span
      className={cn(
        "flex h-7 items-center gap-1.5 rounded-pill px-3 text-[13px] leading-[18px]",
        on && "glass glass-ink",
      )}
    >
      <span className={cn("font-medium", on ? "text-(--glass-ink-text)" : "text-text-2")}>{label}</span>
      <span className={on ? "font-medium text-(--glass-ink-text) opacity-70" : "text-text-3"}>{count}</span>
    </span>
  );
}

export function AppWindow() {
  const [off, setOff] = useState(0);
  const count = (on: boolean) => setOff((n) => n + (on ? -1 : 1));
  return (
    <div className="relative flex h-[620px] w-full rounded-t-[16px] bg-shell px-1 pt-1 select-none">
      <div className="flex grow flex-col overflow-clip rounded-t-[12px] bg-page text-[14px] leading-[18px]">
        <div className="flex h-[52px] shrink-0 items-center gap-5 border-b border-line-faint px-4">
          <div className="flex items-center gap-2.5">
            <Logo size={24} />
            <span className="text-text-disabled">/</span>
            <span className="size-5 shrink-0 rounded-[6px] bg-[linear-gradient(135deg,#d9d9d6,#8f8f8a)]" />
            <span className="text-text-2">acme</span>
            <span className="text-text-disabled">/</span>
            <span className="font-medium text-text-1">widgets</span>
            <Sort className="text-text-3" />
          </div>
          <div className="flex h-[52px] gap-5 pl-3">
            {TABS.map((tab) =>
              tab === "Rules" ? (
                <span key={tab} className="flex items-center border-b-2 border-text-1 pt-0.5 font-medium text-text-1">
                  {tab}
                </span>
              ) : (
                <span key={tab} className="flex items-center text-text-2">
                  {tab}
                </span>
              ),
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-6 pt-10">
          <div className="flex w-[768px] items-start justify-between">
            <div className="flex flex-col gap-1.5">
              <span className="text-[28px] leading-[34px] font-medium tracking-[-0.02em] text-text-1">Rules</span>
              <span className="text-text-2">Requirements that every contributor outside your org must meet on every change request.</span>
            </div>
            <span className="glass glass-ink flex h-8 items-center rounded-pill px-3.5 font-medium">Create rule</span>
          </div>
          <div className="flex w-[768px] flex-col rounded-shell bg-shell p-[3px] ring-1 ring-line-faint">
            <div className="flex rounded-panel bg-paper">
              {[
                ["Matches", "8"],
                ["Actions taken", "8"],
              ].map(([label, value], i) => (
                <div key={label} className={cn("flex flex-1 flex-col gap-1 p-3", i === 0 && "border-r border-line-faint")}>
                  <span className="text-[12px] leading-4 font-medium text-text-2">{label}</span>
                  <span className="text-[20px] leading-6 font-medium text-text-1">{value}</span>
                </div>
              ))}
            </div>
            <span className="px-3 pt-2 pb-1.5 text-[12px] leading-4 text-text-2">Last 24 hours</span>
          </div>
          <div className="flex w-[768px] items-center justify-between">
            <span className="flex rounded-pill bg-paper p-0.5 ring-1 ring-line-faint">
              <Segment label="All" count={9} on />
              <Segment label="Active" count={9 - off} />
              <Segment label="Custom" count={0} />
            </span>
            <span className="flex h-[30px] items-center gap-2 rounded-pill bg-paper pr-2.5 pl-3 text-[13px] leading-[18px] text-text-1 ring-1 ring-line-control">
              Most active
              <Sort className="text-text-3" />
            </span>
          </div>
          <div className="flex w-[768px] flex-wrap gap-3">
            <RuleCard rule={RULES.crypto} width={378} onToggle={count} />
            <RuleCard rule={RULES.age} width={378} onToggle={count} />
            <RuleCard rule={RULES.honeypot} width={378} onToggle={count} />
            <RuleCard rule={RULES.files} width={378} onToggle={count} />
          </div>
        </div>
      </div>
    </div>
  );
}
