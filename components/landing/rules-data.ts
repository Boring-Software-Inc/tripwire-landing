import type { ReactNode } from "react";

export type Rule = {
  title: string;
  words: string[];
  value?: ReactNode;
  mono?: boolean;
  matches: number;
  spikes: number[];
  label?: string;
  after?: string[];
};

export const RULES: Record<"crypto" | "age" | "honeypot" | "files" | "merged", Rule> = {
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
  merged: {
    title: "Merged change requests",
    words: ["Requires"],
    value: "1 merged change request",
    after: ["in", "other", "people\u2019s", "repos,", "as", "proof", "that", "someone", "else\u2026"],
    matches: 0,
    spikes: [],
  },
};
