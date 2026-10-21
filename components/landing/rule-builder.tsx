"use client";

import { useState } from "react";
import { buttonVariants } from "@/components/glaze/ui/button-variants";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/glaze/ui/dropdown-menu";
import { RuleCard } from "@/components/landing/rule-card";
import { RULES, type Rule } from "@/components/landing/rules-data";
import { cn } from "@/lib/glaze/utils";

const FIELDS = ["location", "account age", "bio", "company"];
const CONDITIONS = ["contains", "is", "is not"];
const SEVERITIES = ["Low", "Medium", "High"];

type Draft = { field: string | null; condition: string | null; value: string; severity: string | null };
type Saved = { id: number; rule: Rule };

const EMPTY: Draft = { field: null, condition: null, value: "", severity: null };

function slotClass(empty: boolean) {
  return cn(
    "slot h-[26px] rounded-tag transition-colors duration-(--dur-state) ease-out hover:bg-hover data-popup-open:bg-hover",
    empty ? "text-text-3" : "text-text-1",
  );
}

function Pick({
  value,
  placeholder,
  options,
  onPick,
  label,
}: {
  value: string | null;
  placeholder: string;
  options: string[];
  onPick: (v: string) => void;
  label: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={value ? `${label}: ${value}` : label} className={slotClass(!value)}>
        {value ? value.toLowerCase() : placeholder}
      </DropdownMenuTrigger>
      <DropdownMenuContent size="sm">
        {options.map((o) => (
          <DropdownMenuItem key={o} onClick={() => onPick(o)}>
            {o.charAt(0).toUpperCase() + o.slice(1)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function toRule(d: Draft): Rule {
  return {
    title: `${d.field!.charAt(0).toUpperCase()}${d.field!.slice(1)} ${d.condition}`,
    words: ["Flags", "change", "requests", "when", "the", ...d.field!.split(" "), ...d.condition!.split(" ")],
    value: d.value.trim(),
    matches: 0,
    spikes: [],
    label: d.severity!,
  };
}

export function RuleBuilder() {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saved, setSaved] = useState<Saved[]>([]);
  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));
  const touched = draft.field || draft.condition || draft.value || draft.severity;
  const ready = draft.field && draft.condition && draft.value.trim() && draft.severity;

  const save = () => {
    if (!ready) return;
    setSaved((list) => [{ id: Date.now(), rule: toRule(draft) }, ...list]);
    setDraft(EMPTY);
  };

  return (
    <>
      <form
        className="card-hover rounded-shell bg-shell p-[3px]"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <div className="flex flex-col gap-3.5 rounded-panel bg-paper p-5">
          <span className="text-[14px] leading-[21px] font-medium text-text-1">Create rule</span>
          <p className="flex flex-wrap items-center gap-1.5 text-[18px] leading-7 text-text-2">
            <span>Require</span>
            <span>that</span>
            <Pick label="Field" value={draft.field} placeholder="field" options={FIELDS} onPick={(field) => set({ field })} />
            <Pick
              label="Condition"
              value={draft.condition}
              placeholder="condition"
              options={CONDITIONS}
              onPick={(condition) => set({ condition })}
            />
            <input
              aria-label="Value"
              className="value-slot bg-transparent"
              placeholder="value"
              value={draft.value}
              maxLength={40}
              onChange={(e) => set({ value: e.target.value })}
            />
            <span>as</span>
            <span>a</span>
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={draft.severity ? `Severity: ${draft.severity}` : "Severity"}
                className={cn(
                  "flex h-[30px] items-center rounded-[8px] bg-paper px-2 ring-1 ring-line-control transition-colors duration-(--dur-state) ease-out hover:bg-hover data-popup-open:bg-hover",
                  draft.severity ? "text-text-1" : "text-text-3",
                )}
              >
                {draft.severity ? draft.severity.toLowerCase() : "severity"}
              </DropdownMenuTrigger>
              <DropdownMenuContent size="sm">
                {SEVERITIES.map((s) => (
                  <DropdownMenuItem key={s} onClick={() => set({ severity: s })}>
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <span>signal.</span>
          </p>
          {touched ? (
            <div className="flex justify-end gap-2">
              <button type="button" className={buttonVariants({ variant: "secondary", size: "sm" })} onClick={() => setDraft(EMPTY)}>
                Cancel
              </button>
              <button type="submit" disabled={!ready} className={buttonVariants({ size: "sm" })}>
                Save rule
              </button>
            </div>
          ) : null}
        </div>
      </form>
      <div className="grid gap-3 lg:grid-cols-2">
        {saved.map((s) => (
          <RuleCard key={s.id} rule={s.rule} hover className="rule-enter min-w-0" />
        ))}
        <RuleCard rule={RULES.crypto} hover className="only-lg min-w-0" />
        <RuleCard rule={RULES.age} hover className="only-lg min-w-0" />
      </div>
    </>
  );
}
