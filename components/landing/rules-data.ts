import type { ReactNode } from "react";

export type RuleParam =
  | { kind: "number"; n: number; unit: [string, string]; min: number; max: number }
  | { kind: "path"; text: string };

export type Rule = {
  title: string;
  words: string[];
  value?: ReactNode;
  param?: RuleParam;
  mono?: boolean;
  matches: number;
  spikes: number[];
  label?: string;
  after?: string[];
  custom?: boolean;
};

export function paramText(param: RuleParam) {
  if (param.kind === "path") return param.text;
  return `${param.n} ${param.n === 1 ? param.unit[0] : param.unit[1]}`;
}

export const RULES: Record<
  "crypto" | "age" | "honeypot" | "files" | "merged" | "rate" | "english" | "readme" | "ai",
  Rule
> = {
  crypto: {
    title: "Crypto address",
    words: ["Catches", "cryptocurrency", "addresses", "in", "titles,", "comments", "and", "diffs."],
    matches: 2,
    spikes: [9.3, 17.3],
  },
  age: {
    title: "Account age",
    words: ["Flags", "change", "requests", "from", "accounts", "younger", "than"],
    param: { kind: "number", n: 7, unit: ["day", "days"], min: 1, max: 365 },
    matches: 0,
    spikes: [],
  },
  honeypot: {
    title: "Honeypot paths",
    words: ["Catches", "change", "requests", "that", "touch"],
    param: { kind: "path", text: ".github/workflows/**" },
    mono: true,
    matches: 0,
    spikes: [],
  },
  files: {
    title: "Max files changed",
    words: ["Flags", "change", "requests", "that", "touch", "more", "than"],
    param: { kind: "number", n: 200, unit: ["file", "files"], min: 1, max: 5000 },
    matches: 0,
    spikes: [],
  },
  merged: {
    title: "Merged change requests",
    words: ["Requires"],
    param: { kind: "number", n: 1, unit: ["merged change request", "merged change requests"], min: 1, max: 50 },
    after: ["in", "other", "people’s", "repos,", "as", "proof", "that", "someone", "else…"],
    matches: 0,
    spikes: [],
  },
  rate: {
    title: "Rate limit",
    words: ["Caps", "each", "contributor", "at"],
    param: { kind: "number", n: 5, unit: ["change request", "change requests"], min: 1, max: 100 },
    after: ["per", "24", "hours."],
    matches: 0,
    spikes: [],
  },
  english: {
    title: "English only",
    words: ["Flags", "text", "that", "is", "mostly", "in", "non-latin", "script."],
    matches: 0,
    spikes: [],
  },
  readme: {
    title: "Profile README",
    words: ["Requires", "a", "profile", "bio", "of", "at", "least"],
    param: { kind: "number", n: 32, unit: ["character", "characters"], min: 1, max: 500 },
    matches: 0,
    spikes: [],
  },
  ai: {
    title: "AI review",
    words: ["Reviews", "the", "change", "in", "up", "to"],
    param: { kind: "number", n: 12, unit: ["step", "steps"], min: 1, max: 50 },
    matches: 0,
    spikes: [],
  },
};
