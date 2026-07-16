"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Sparkline } from "@/components/dither-kit";
import type { DitherColor } from "@/components/dither-kit";
import { Logo } from "@/components/icons";

/*
 * Live recreation of the Tripwire moderation dashboard that used to sit in the
 * hero as a flat screenshot (hero-dashboard.webp). Rebuilt in the DOM so the
 * four stat-card wells — empty in the export — carry real dither-kit sparklines.
 *
 * The dashboard is authored at a fixed design size (DESIGN_W × DESIGN_H) and
 * scaled uniformly to the container, exactly like the image it replaces: no
 * reflow, so it reads as a product shot at every breakpoint.
 *
 * It then sits inside a shorter WINDOW (WINDOW_H), pinned to that window's
 * bottom edge. On load it's pushed down so the lower rows are tucked below the
 * fold; scrolling eases it up until the bottom pins — the demo never rises above
 * the frame's bottom edge. See the export at the foot of this file.
 */

const DESIGN_W = 1120;
const DESIGN_H = 900;
/** Visible window — shorter than the dashboard, leaving room to reveal. */
const WINDOW_H = 680;
/** Scroll distance (px from page top) over which the demo eases fully up. */
const REVEAL_PX = 520;

/* --- inline icons, lucide-weight to match the traced set in icons.tsx --- */

function Icon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? "h-[18px] w-[18px] shrink-0"}
    >
      {children}
    </svg>
  );
}

const QueueIcon = (p: { className?: string }) => (
  <Icon className={p.className}>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
  </Icon>
);
const EventsIcon = (p: { className?: string }) => (
  <Icon className={p.className}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </Icon>
);
const RulesIcon = (p: { className?: string }) => (
  <Icon className={p.className}>
    <path d="m3 17 2 2 4-4" />
    <path d="m3 7 2 2 4-4" />
    <path d="M13 6h8M13 12h8M13 18h8" />
  </Icon>
);
const WorkflowsIcon = (p: { className?: string }) => (
  <Icon className={p.className}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </Icon>
);
const ModerationIcon = (p: { className?: string }) => (
  <Icon className={p.className}>
    <path d="m14.5 12.5-8 8a2.12 2.12 0 1 1-3-3l8-8" />
    <path d="m16 16 6-6M8 8l6-6M9 7l8 8M21 11l-8-8" />
  </Icon>
);
const SearchIcon = (p: { className?: string }) => (
  <Icon className={p.className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </Icon>
);
const SunIcon = (p: { className?: string }) => (
  <Icon className={p.className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </Icon>
);
const CommentIcon = (p: { className?: string }) => (
  <Icon className={p.className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Icon>
);
const PrIcon = (p: { className?: string }) => (
  <Icon className={p.className}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M6 9v6" />
    <path d="M13 6h3a2 2 0 0 1 2 2v7" />
    <path d="m15 9-2-3 2-3" />
  </Icon>
);
const IssueIcon = (p: { className?: string }) => (
  <Icon className={p.className}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

/* --- data lifted straight off the export --- */

type Delta = "up" | "down";
type Stat = {
  label: string;
  value: string;
  delta: number;
  trend: Delta;
  bad: boolean; // an up-arrow that's red rather than green
  color: DitherColor;
  series: number[];
};

const STATS: Stat[] = [
  {
    label: "Pending",
    value: "14",
    delta: 5,
    trend: "up",
    bad: true,
    color: "orange",
    series: [6, 5, 7, 6, 8, 7, 9, 8, 10, 9, 11, 14],
  },
  {
    label: "Resolved today",
    value: "38",
    delta: 12,
    trend: "up",
    bad: false,
    color: "green",
    series: [8, 12, 10, 16, 14, 20, 19, 24, 26, 30, 33, 38],
  },
  {
    label: "Automod · 24h",
    value: "126",
    delta: 8,
    trend: "up",
    bad: true,
    color: "purple",
    series: [70, 84, 78, 96, 90, 104, 98, 112, 108, 118, 120, 126],
  },
  {
    label: "Banned",
    value: "9",
    delta: 3,
    trend: "up",
    bad: false,
    color: "blue",
    series: [2, 3, 3, 4, 4, 5, 5, 6, 7, 7, 8, 9],
  },
];

type Severity = "Critical" | "High";
type Report = {
  Icon: (p: { className?: string }) => ReactNode;
  title: string;
  repo: string;
  ref: string;
  ago: string;
  reason: string;
  severity: Severity;
};

const REPORTS: Report[] = [
  {
    Icon: CommentIcon,
    title: "you people are clueless, this whole library is garbage",
    repo: "facebook/react",
    ref: "#31044",
    ago: "11m ago",
    reason: "Harassment",
    severity: "Critical",
  },
  {
    Icon: PrIcon,
    title: "Add 4000 lines of unrelated vendored code",
    repo: "shadcn-ui/ui",
    ref: "#6621",
    ago: "26m ago",
    reason: "Automod",
    severity: "Critical",
  },
  {
    Icon: IssueIcon,
    title: "where do you live? we should talk in person about this bug",
    repo: "withastro/astro",
    ref: "#12087",
    ago: "38m ago",
    reason: "Harassment",
    severity: "Critical",
  },
  {
    Icon: CommentIcon,
    title: "buy cheap followers + crypto airdrop, link in bio",
    repo: "vercel/next.js",
    ref: "#58213",
    ago: "4m ago",
    reason: "Spam",
    severity: "High",
  },
  {
    Icon: CommentIcon,
    title: "checkout my OF, nsfw content here",
    repo: "vercel/ai",
    ref: "#4412",
    ago: "52m ago",
    reason: "NSFW",
    severity: "High",
  },
  {
    Icon: PrIcon,
    title: "fix typo (also deletes the entire test suite)",
    repo: "denoland/deno",
    ref: "#5512",
    ago: "1h ago",
    reason: "Off-topic",
    severity: "High",
  },
];

const NAV = [
  { label: "Queue", Icon: QueueIcon, active: true },
  { label: "Events", Icon: EventsIcon, active: false },
  { label: "Rules", Icon: RulesIcon, active: false },
  { label: "Workflows", Icon: WorkflowsIcon, active: false },
  { label: "Moderation", Icon: ModerationIcon, active: false },
];

const CHIPS = ["All reasons", "Spam", "Harassment", "Off-topic", "Automod", "NSFW"];

/* --- delta pip: a small up/down triangle + count --- */
function DeltaPip({ delta, trend, bad }: { delta: number; trend: Delta; bad: boolean }) {
  const color = bad ? "#f0554b" : "#3fd07a";
  return (
    <span
      className="inline-flex items-center gap-1 text-[13px] font-medium"
      style={{ color }}
    >
      <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
        <path
          d={trend === "up" ? "M5 1 9 8H1Z" : "M5 9 1 2h8Z"}
          fill="currentColor"
        />
      </svg>
      {delta}
    </span>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="group flex flex-col overflow-hidden rounded-[14px] border border-[#1e1e1e] bg-[#111112] pt-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Label + number keep the inset padding… */}
      <div className="flex flex-col px-5">
        <span className="text-[15px] text-[#8a8a8a]">{stat.label}</span>
        <div className="mt-2 flex items-baseline gap-2.5">
          <span className="text-[34px] font-semibold leading-none tracking-tight text-white">
            {stat.value}
          </span>
          <DeltaPip delta={stat.delta} trend={stat.trend} bad={stat.bad} />
        </div>
      </div>
      {/* …the well (empty in the export, now a live dithered spark) runs edge to edge. */}
      <div className="mt-3 h-[72px] w-full">
        <Sparkline
          data={stat.series}
          color={stat.color}
          hovered={hovered}
          bloom="low"
          className="h-full w-full"
        />
      </div>
    </div>
  );
}

function ReportRow({ report }: { report: Report }) {
  const { Icon } = report;
  const dot = report.severity === "Critical" ? "#f0554b" : "#f5a623";
  return (
    <div className="flex items-center gap-4 border-t border-[#181818] py-4 transition-colors hover:bg-white/[0.02]">
      <Icon className="h-[19px] w-[19px] shrink-0 text-[#6f6f6f]" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[19px] leading-snug text-white">
          {report.title}
        </p>
        <p className="mt-1 text-[14px] text-[#7a7a7a]">
          {report.repo} {report.ref} · {report.ago}
        </p>
      </div>
      <span className="shrink-0 rounded-md bg-[#1c1c1e] px-2.5 py-1 text-[13px] text-[#b4b4b4]">
        {report.reason}
      </span>
      <span className="flex w-[74px] shrink-0 items-center gap-2 text-[15px] text-[#c8c8c8]">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: dot }}
        />
        {report.severity}
      </span>
    </div>
  );
}

/** The dashboard itself, drawn at DESIGN_W × DESIGN_H. */
function Dashboard() {
  return (
    <div
      style={{ width: DESIGN_W, height: DESIGN_H }}
      className="flex flex-col overflow-hidden bg-[#0b0b0c] text-white"
    >
      {/* top bar */}
      <header className="flex h-[68px] shrink-0 items-center gap-6 border-b border-[#161616] px-7">
        <div className="flex items-center gap-2.5">
          <Logo width={22} height={16} className="text-white" />
          <span className="text-[19px] font-medium tracking-tight">tripwire</span>
        </div>
        <nav className="flex items-center gap-1.5">
          {NAV.map(({ label, Icon, active }) => (
            <span
              key={label}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-[16px] ${
                active
                  ? "bg-[#1b1b1d] text-white ring-1 ring-inset ring-[#2a2a2a]"
                  : "text-[#9a9a9a]"
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {label}
            </span>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex h-[42px] w-[340px] items-center gap-2.5 rounded-lg border border-[#242424] bg-[#131314] px-3.5 text-[#7c7c7c]">
            <SearchIcon className="h-[18px] w-[18px] shrink-0" />
            <span className="text-[16px]">Search reports…</span>
          </div>
          <SunIcon className="h-[20px] w-[20px] shrink-0 text-[#8a8a8a]" />
          <span
            aria-hidden="true"
            className="h-8 w-8 shrink-0 rounded-full"
            style={{
              backgroundImage:
                "conic-gradient(from 210deg, #ff2d9b, #7b2dff, #2dd4ff, #ff2d9b)",
            }}
          />
        </div>
      </header>

      {/* body */}
      <div className="flex-1 px-8 pt-8">
        <h2 className="text-[32px] font-semibold tracking-tight">Moderation</h2>
        <p className="mt-2 text-[17px] text-[#8a8a8a]">
          Triage flagged issues, pull requests, and comments across your
          organization.
        </p>

        {/* stat cards */}
        <div className="mt-7 grid grid-cols-4 gap-5">
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        {/* tabs + sort */}
        <div className="mt-9 flex items-center">
          <div className="flex items-center gap-6 text-[18px]">
            <span className="flex items-center gap-2 font-medium text-white">
              Pending
              <span className="rounded-md bg-[#1c1c1e] px-2 py-0.5 text-[13px] text-[#b4b4b4]">
                14
              </span>
            </span>
            <span className="text-[#7a7a7a]">Log</span>
          </div>
          <div className="ml-auto flex items-center gap-6 text-[16px]">
            <span className="text-white">Severity</span>
            <span className="text-[#7a7a7a]">Newest</span>
          </div>
        </div>

        {/* reason chips */}
        <div className="mt-5 flex items-center gap-2.5">
          {CHIPS.map((chip, i) => (
            <span
              key={chip}
              className={`rounded-full px-4 py-2 text-[15px] ${
                i === 0
                  ? "bg-white font-medium text-black"
                  : "border border-[#262626] text-[#b0b0b0]"
              }`}
            >
              {chip}
            </span>
          ))}
        </div>

        {/* report list */}
        <div className="mt-3">
          {REPORTS.map((report) => (
            <ReportRow key={report.ref} report={report} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Scales the dashboard to the container width, then parks it inside a shorter
 * window pinned to the bottom edge. `progress` (0 = tucked down, 1 = fully up)
 * is driven by page scroll; the dashboard slides up by at most (DESIGN_H −
 * WINDOW_H), so its bottom edge can reach — but never pass — the window bottom.
 */
export default function HeroDemo({
  className,
  "aria-label": ariaLabel,
}: {
  className?: string;
  "aria-label"?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / DESIGN_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    // On mobile, DON'T tie the demo to page scroll: the reveal drags the
    // dashboard header up and out of the window as you scroll the page past the
    // hero, cutting it off. Leave progress at its initial 0 (header parked at
    // the top) and attach no scroll listener.
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      return;
    }
    // Respect reduced-motion: skip the reveal and show the demo fully settled.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setProgress(Math.min(1, Math.max(0, window.scrollY / REVEAL_PX)))
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const scaledH = DESIGN_H * scale;
  const windowH = WINDOW_H * scale;
  const maxY = scaledH - windowH; // slack the demo can travel
  const y = maxY * (1 - progress); // progress 0 → pushed down, 1 → pinned

  return (
    <div
      ref={ref}
      role="img"
      aria-label={ariaLabel}
      className={`relative w-full overflow-hidden bg-[#0b0b0c] ${className ?? ""}`}
      style={{
        height: scale ? windowH : undefined,
        aspectRatio: scale ? undefined : `${DESIGN_W} / ${WINDOW_H}`,
      }}
    >
      {scale > 0 && (
        <div
          className="absolute inset-x-0 bottom-0 will-change-transform"
          style={{ height: scaledH, transform: `translateY(${y}px)` }}
        >
          <div
            style={{
              width: DESIGN_W,
              height: DESIGN_H,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <Dashboard />
          </div>
        </div>
      )}
    </div>
  );
}
