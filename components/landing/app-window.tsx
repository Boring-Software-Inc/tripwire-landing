"use client";

import { Popover } from "@base-ui/react/popover";
import { useState, type ReactNode } from "react";
import { Add, Check, Icon, Search, Settings } from "@/components/glaze/icon";
import { buttonVariants } from "@/components/glaze/ui/button-variants";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/glaze/ui/dropdown-menu";
import { Logo } from "@/components/landing/logo";
import { CONDITIONS, FIELDS, Pick, SEVERITIES } from "@/components/landing/rule-builder";
import { RuleCard } from "@/components/landing/rule-card";
import { RULES, type RuleParam } from "@/components/landing/rules-data";
import { menuItemClass, menuPopupClass, menuSeparatorClass } from "@/lib/glaze/overlay";
import { useGlazePortal } from "@/lib/glaze/portal";
import { cn } from "@/lib/glaze/utils";

const TABS = ["Moderation", "Activity", "Rules", "Workflows", "Customize", "Analytics"];

type Key = keyof typeof RULES;
const ALL: Key[] = ["crypto", "age", "honeypot", "files", "merged", "rate", "english", "readme", "ai"];
const REPOS = [
  { name: "api", off: false },
  { name: "docs", off: true },
  { name: "widgets", off: false },
  { name: "website", off: false },
];
const ORGS = [
  { name: "acme", personal: false },
  { name: "ana-dev", personal: true },
];
const SORTS = [
  { key: "active", label: "Most active" },
  { key: "az", label: "A to Z" },
] as const;
type SortKey = (typeof SORTS)[number]["key"];
type Show = "all" | "active" | "custom";
type Draft = Record<Key, { on: boolean; param?: RuleParam }>;

const SAVED = Object.fromEntries(ALL.map((k) => [k, { on: true, param: RULES[k].param }])) as Draft;

function sameParam(a?: RuleParam, b?: RuleParam) {
  if (!a || !b) return a === b;
  return a.kind === "number" && b.kind === "number" ? a.n === b.n : a.kind === "path" && b.kind === "path" && a.text === b.text;
}

function useRules() {
  const [draft, setDraft] = useState<Draft>(SAVED);
  const changed = (k: Key) => ({
    on: draft[k].on !== SAVED[k].on,
    param: !sameParam(draft[k].param, SAVED[k].param),
  });
  const count = ALL.reduce((n, k) => {
    const c = changed(k);
    return n + (c.on ? 1 : 0) + (c.param ? 1 : 0);
  }, 0);
  const card = (k: Key) => ({
    rule: RULES[k],
    on: draft[k].on,
    param: draft[k].param,
    queued: changed(k).on || changed(k).param,
    onFlip: () => setDraft((d) => ({ ...d, [k]: { ...d[k], on: !d[k].on } })),
    onParam: (param: RuleParam) => setDraft((d) => ({ ...d, [k]: { ...d[k], param } })),
  });
  return { draft, count, card, discard: () => setDraft(SAVED) };
}

function useNope() {
  const [nope, setNope] = useState(false);
  return {
    trigger: () => {
      setNope(true);
      setTimeout(() => setNope(false), 400);
    },
    props: { "data-nope": nope ? "" : undefined },
  };
}

function Sort({ className }: { className?: string }) {
  return (
    <svg aria-hidden width="12" height="12" viewBox="0 0 14 14" className={cn("shrink-0", className)}>
      <path d="M4.5 5.5L7 3l2.5 2.5M4.5 8.5L7 11l2.5-2.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GitHubMark() {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 16 16" className="shrink-0 text-text-1">
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  );
}

function OrgAvatar() {
  return <span className="size-5 shrink-0 rounded-[6px] bg-[linear-gradient(135deg,#d9d9d6,#8f8f8a)]" />;
}

const crumb =
  "-mx-1.5 flex h-7 items-center gap-2.5 rounded-[8px] px-1.5 outline-none transition-colors duration-(--dur-state) ease-out hover:bg-hover focus-visible:bg-hover data-popup-open:bg-pressed";

function OrgSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Org: acme. Switch org" className={crumb}>
        <OrgAvatar />
        <span className="text-text-2">acme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-56">
        {ORGS.map((o) => (
          <DropdownMenuItem key={o.name}>
            {o.personal ? <span className="size-5 shrink-0 rounded-[6px] bg-[linear-gradient(135deg,#e4d8c8,#a08c74)]" /> : <OrgAvatar />}
            <span className="min-w-0 flex-1 truncate">{o.name}</span>
            {o.personal ? <span className="type-caption text-text-3">Personal</span> : null}
            {o.name === "acme" ? <Icon icon={Check} /> : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Icon icon={Add} />
          Create org
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon icon={Settings} />
          Org settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RepoSwitcher({ repo, onPick }: { repo: string; onPick: (name: string) => void }) {
  const container = useGlazePortal();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const found = REPOS.filter((r) => r.name.includes(q.trim().toLowerCase()));
  const pick = (name: string) => {
    onPick(name);
    setOpen(false);
  };
  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQ("");
      }}
    >
      <Popover.Trigger aria-label={`Repo: ${repo}. Switch repo`} className={crumb}>
        <span className="font-medium text-text-1">{repo}</span>
        <Sort className="-ml-1 text-text-3" />
      </Popover.Trigger>
      <Popover.Portal container={container}>
        <Popover.Positioner className="isolate z-(--z-overlay) outline-none" align="start" sideOffset={6} collisionPadding={8}>
          <Popover.Popup className={cn(menuPopupClass, "w-64 p-0")}>
            <div className="flex h-10 shrink-0 items-center gap-2 border-b border-line-faint px-3">
              <Icon icon={Search} className="text-text-3" />
              <input
                autoFocus
                aria-label="Find a repo"
                placeholder="Find a repo"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && found[0]) pick(found[0].name);
                }}
                className="min-w-0 grow bg-transparent type-label text-text-1 placeholder:text-text-3"
                style={{ outline: "none" }}
              />
            </div>
            <div className="flex flex-col p-1">
              {found.length === 0 ? <span className="px-2 py-2 type-label text-text-3">No repos match</span> : null}
              {found.map((r) => (
                <button key={r.name} type="button" onClick={() => pick(r.name)} className={cn(menuItemClass, "hover:bg-hover focus-visible:bg-hover")}>
                  <GitHubMark />
                  <span className="min-w-0 flex-1 truncate text-start">{r.name}</span>
                  {r.off ? <span className="type-caption text-text-3">Off</span> : null}
                  {r.name === repo ? <Icon icon={Check} /> : null}
                </button>
              ))}
              <span className={menuSeparatorClass} />
              <button type="button" onClick={() => setOpen(false)} className={cn(menuItemClass, "hover:bg-hover focus-visible:bg-hover")}>
                <Icon icon={Add} />
                Connect repos
              </button>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function Segment({ label, count, on, onPick }: { label: string; count: number; on: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onPick}
      className={cn(
        "group flex h-7 items-center gap-1.5 rounded-pill px-3 text-[13px] leading-[18px] outline-none transition-colors duration-(--dur-state) ease-out",
        on ? "glass glass-ink" : "hover:bg-hover focus-visible:bg-hover",
      )}
    >
      <span className={cn("font-medium", on ? "text-(--glass-ink-text)" : "text-text-2 group-hover:text-text-1")}>{label}</span>
      <span className={on ? "font-medium text-(--glass-ink-text) opacity-70" : "text-text-3"}>{count}</span>
    </button>
  );
}

function SortMenu({ sort, onSort }: { sort: SortKey; onSort: (s: SortKey) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-[30px] items-center gap-2 rounded-pill bg-paper pr-2.5 pl-3 text-[13px] leading-[18px] text-text-1 ring-1 ring-line-control outline-none transition-colors duration-(--dur-state) ease-out hover:bg-hover focus-visible:bg-hover data-popup-open:bg-hover">
        {SORTS.find((s) => s.key === sort)?.label}
        <Sort className="text-text-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" size="sm">
        {SORTS.map((s) => (
          <DropdownMenuItem key={s.key} onClick={() => onSort(s.key)}>
            <span className="flex-1">{s.label}</span>
            {s.key === sort ? <Icon icon={Check} /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SaveBar({ count, onDiscard, bottom }: { count: number; onDiscard: () => void; bottom: number }) {
  const nope = useNope();
  if (count === 0) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 z-10 flex justify-center px-3" style={{ bottom }}>
      <section aria-label="Unsaved changes" className="demo-nope rule-enter overlay pointer-events-auto flex items-center gap-2 rounded-pill py-1 ps-4 pe-1 font-geist" {...nope.props}>
        <span className="type-label-sm whitespace-nowrap text-text-1">
          {count} unsaved {count === 1 ? "change" : "changes"}
        </span>
        <button type="button" onClick={onDiscard} className={buttonVariants({ variant: "ghost", size: "sm" })}>
          Discard
        </button>
        <button type="button" onClick={nope.trigger} className={buttonVariants({ size: "sm" })}>
          Save changes
        </button>
      </section>
    </div>
  );
}

type RuleDraft = { field: string | null; condition: string | null; value: string; severity: string | null };
const EMPTY: RuleDraft = { field: null, condition: null, value: "", severity: null };

function CreateRuleDialog({ onClose, phone = false }: { onClose: () => void; phone?: boolean }) {
  const [d, setD] = useState<RuleDraft>(EMPTY);
  const nope = useNope();
  const set = (patch: Partial<RuleDraft>) => setD((x) => ({ ...x, ...patch }));
  const ready = d.field && d.condition && d.value.trim() && d.severity;
  return (
    <div
      className="absolute inset-0 z-20 flex items-start justify-center bg-scrim font-geist"
      style={{ paddingTop: phone ? 72 : 120 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        role="dialog"
        aria-label="Create rule"
        className={cn("demo-nope rule-enter flex flex-col rounded-shell bg-shell p-[3px] ring-1 ring-line", phone ? "w-[calc(100%-24px)]" : "w-[480px]")}
        {...nope.props}
      >
        <div className="flex flex-col gap-4 rounded-panel bg-paper p-5">
          <span className="type-label-lg text-text-1">Create rule</span>
          <p className={cn("flex flex-wrap items-center gap-1.5 text-text-2", phone ? "text-[15px] leading-6" : "text-[18px] leading-7")}>
            <span>Require</span>
            <span>that</span>
            <Pick label="Field" value={d.field} placeholder="field" options={FIELDS} onPick={(field) => set({ field })} />
            <Pick label="Condition" value={d.condition} placeholder="condition" options={CONDITIONS} onPick={(condition) => set({ condition })} />
            <input
              aria-label="Value"
              className="value-slot bg-transparent"
              placeholder="value"
              value={d.value}
              maxLength={40}
              onChange={(e) => set({ value: e.target.value })}
            />
            <span>as</span>
            <span>a</span>
            <Pick label="Severity" value={d.severity} placeholder="severity" options={SEVERITIES} onPick={(severity) => set({ severity })} />
            <span>signal.</span>
          </p>
        </div>
        <div className="flex justify-end gap-2 px-2 pt-2 pb-1">
          <button type="button" onClick={onClose} className={buttonVariants({ variant: "secondary", size: "sm" })}>
            Cancel
          </button>
          <button type="button" disabled={!ready} onClick={nope.trigger} className={buttonVariants({ size: "sm" })}>
            Create rule
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateButton({ onClick, icon = false }: { onClick: () => void; icon?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("glass glass-ink flex h-8 shrink-0 items-center rounded-pill px-3.5 font-medium", icon && "gap-1.5 text-[13px] leading-[19.5px]")}
    >
      {icon ? (
        <svg aria-hidden width="12" height="12" viewBox="0 0 14 14" className="shrink-0">
          <path d="M7 2.5v9M2.5 7h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ) : null}
      Create rule
    </button>
  );
}

function CustomEmpty({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="col-span-2 flex w-full flex-col items-center gap-3 rounded-shell py-6 text-center font-geist ring-1 ring-line-faint">
      <div className="flex flex-col gap-1">
        <span className="type-label-lg text-text-1">No custom rules yet</span>
        <span className="max-w-[360px] type-body-sm text-text-2">A custom rule checks contributors and their changes against conditions you pick.</span>
      </div>
      <button type="button" onClick={onCreate} className={buttonVariants({ variant: "secondary", size: "sm" })}>
        Create rule
      </button>
    </div>
  );
}

function Chrome({ url, phone = false }: { url: string; phone?: boolean }) {
  return (
    <div className={cn("relative flex shrink-0 items-center justify-center", phone ? "h-8" : "h-9 px-3")}>
      <span className={cn("absolute flex", phone ? "top-3 left-2.5 gap-[5px]" : "top-[13px] left-3.5 gap-[7px]")}>
        {[0, 1, 2].map((i) => (
          <span key={i} className={cn("rounded-full bg-(--chrome-dot)", phone ? "size-2" : "size-2.5")} />
        ))}
      </span>
      <span
        className={cn(
          "flex items-center rounded-[6px] bg-(--chrome-field) font-mono text-(--chrome-text)",
          phone ? "h-5 max-w-[calc(100%-100px)] px-2.5 text-[10px] leading-3" : "h-[22px] px-3.5 text-[11px] leading-[14px]",
        )}
      >
        <span className="truncate">{url}</span>
      </span>
    </div>
  );
}

function Stage({ children }: { children: ReactNode }) {
  return <div className="relative flex min-h-0 grow flex-col overflow-clip rounded-t-[12px] bg-page">{children}</div>;
}

export function AppWindow() {
  const rules = useRules();
  const [repo, setRepo] = useState("widgets");
  const [show, setShow] = useState<Show>("all");
  const [sort, setSort] = useState<SortKey>("active");
  const [creating, setCreating] = useState(false);
  const active = ALL.filter((k) => rules.draft[k].on).length;
  const custom = ALL.filter((k) => RULES[k].custom);
  const visible = ALL.filter((k) => (show === "active" ? rules.draft[k].on : show === "custom" ? RULES[k].custom : true)).sort((a, b) =>
    sort === "az" ? RULES[a].title.localeCompare(RULES[b].title) : RULES[b].matches - RULES[a].matches || ALL.indexOf(a) - ALL.indexOf(b),
  );
  return (
    <div className="app-window relative flex h-[640px] w-full flex-col rounded-t-[16px] bg-shell px-1 select-none">
      <Chrome url={`tripwire.sh/acme/${repo}/rules`} />
      <Stage>
        <div className="font-system flex grow flex-col text-[14px] leading-[18px]">
          <div className="flex h-[52px] shrink-0 items-center gap-5 border-b border-line-faint px-4">
            <div className="flex shrink-0 items-center gap-2.5">
              <Logo size={24} />
              <span className="text-text-disabled">/</span>
              <OrgSwitcher />
              <span className="text-text-disabled">/</span>
              <RepoSwitcher repo={repo} onPick={setRepo} />
            </div>
            <div className="tab-scroll flex h-[52px] min-w-0 gap-5 overflow-x-auto pl-3">
              {TABS.map((tab) =>
                tab === "Rules" ? (
                  <span key={tab} className="flex shrink-0 items-center border-b-2 border-text-1 pt-0.5 font-medium text-text-1">
                    {tab}
                  </span>
                ) : (
                  <button
                    key={tab}
                    type="button"
                    className="flex shrink-0 items-center border-b-2 border-transparent pt-0.5 text-text-2 outline-none transition-colors duration-(--dur-state) ease-out hover:border-line-control hover:text-text-1 focus-visible:text-text-1"
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-6 px-6 pt-10">
            <div className="flex w-full max-w-[768px] items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[28px] leading-[34px] font-medium tracking-[-0.02em] text-text-1">Rules</span>
                <span className="text-text-2">Requirements that every contributor outside your org must meet on every change request.</span>
              </div>
              <CreateButton onClick={() => setCreating(true)} />
            </div>
            <div className="flex w-full max-w-[768px] flex-col rounded-shell bg-shell p-[3px] ring-1 ring-line-faint">
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
            <div className="flex w-full max-w-[768px] items-center justify-between gap-3">
              <span className="flex rounded-pill bg-paper p-0.5 ring-1 ring-line-faint">
                <Segment label="All" count={ALL.length} on={show === "all"} onPick={() => setShow("all")} />
                <Segment label="Active" count={active} on={show === "active"} onPick={() => setShow("active")} />
                <Segment label="Custom" count={custom.length} on={show === "custom"} onPick={() => setShow("custom")} />
              </span>
              <SortMenu sort={sort} onSort={setSort} />
            </div>
            <div className="grid w-full max-w-[768px] grid-cols-2 gap-3 font-geist">
              {show === "custom" && custom.length === 0 ? <CustomEmpty onCreate={() => setCreating(true)} /> : null}
              {visible.map((k) => (
                <RuleCard key={k} className="min-w-0" {...rules.card(k)} />
              ))}
            </div>
          </div>
        </div>
        <SaveBar count={rules.count} onDiscard={rules.discard} bottom={96} />
        {creating ? <CreateRuleDialog onClose={() => setCreating(false)} /> : null}
      </Stage>
    </div>
  );
}

const PHONE: Key[] = ["crypto", "age", "merged"];

export function PhoneWindow() {
  const rules = useRules();
  const [creating, setCreating] = useState(false);
  return (
    <div className="app-window relative flex h-[520px] w-[min(330px,calc(100%-16px))] shrink-0 flex-col rounded-t-[16px] bg-shell px-1 select-none">
      <Chrome url="tripwire.sh/acme/widgets/rules" phone />
      <Stage>
        <div className="flex w-full flex-col gap-5 px-3.5 pt-5 pb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[28px] leading-[34px] font-medium text-text-1">Rules</span>
              <CreateButton icon onClick={() => setCreating(true)} />
            </div>
            <span className="text-[14px] leading-[21px] text-text-2">
              Requirements that every contributor outside your org must meet on every change request.
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {PHONE.map((k) => (
              <RuleCard key={k} phone {...rules.card(k)} />
            ))}
          </div>
        </div>
        <SaveBar count={rules.count} onDiscard={rules.discard} bottom={108} />
        {creating ? <CreateRuleDialog phone onClose={() => setCreating(false)} /> : null}
      </Stage>
    </div>
  );
}

