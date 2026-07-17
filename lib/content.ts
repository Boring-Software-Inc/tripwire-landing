/*
 * All page copy, extracted from the Paper frame "Tripwire Landing".
 * Do not edit wording here without checking the frame first.
 *
 * Deliberate exception: three typos in the frame ("sentance", "explainations"
 * / "explaination", "theres") are corrected here. The frame still has them —
 * fix it there too so the two don't drift apart.
 */

export const SITE = {
  name: "tripwire",
  title: "Tripwire — The firewall for your OSS projects",
  description:
    "Trigger workflows from contributor activity. Keep the good, reject the bad.",
};

/* "Docs" points at #faq until a docs site exists — repoint it here. */
export const NAV_LINKS = [
  { label: "Events", href: "#events" },
  { label: "Rules", href: "#rules" },
  { label: "Workflows", href: "#workflows" },
  { label: "Docs", href: "#faq" },
] as const;

export const NAV_ACCESS = {
  label: "Already have access?",
  // The new app. Overridden by NEXT_PUBLIC_APP_URL at build time (see APP_ORIGIN).
  href: "https://v2.tripwire.sh",
};
export const NAV_CTA = { label: "Request access", href: "#cta" };

export const HERO = {
  badge: "Closed beta",
  headline: "The firewall for your OSS projects",
  subhead:
    "Trigger workflows from contributor activity. Keep the good, reject the bad.",
  cta: "Request access",
  screenshotAlt:
    "Tripwire moderation dashboard triaging flagged issues, pull requests, and comments across an organization",
  /*
   * Image is 1024×716.5 in design units. The export's top row was fully
   * transparent — the bright backdrop showed through it as a hairline — so that
   * row is trimmed from the asset. Everything therefore sits 0.5px higher than
   * the raw frame coordinates, and these percentages account for it:
   *   top = (node.y − 0.5) / 716.5
   */
  hotspots: [
    /* Topbar nav: Queue / Events / Rules / Workflows / Moderation (32px tall). */
    { left: 10.547, top: 1.047, width: 8.398, height: 4.466 },
    { left: 19.141, top: 1.047, width: 8.594, height: 4.466 },
    { left: 27.93, top: 1.047, width: 7.91, height: 4.466 },
    { left: 36.035, top: 1.047, width: 10.84, height: 4.466 },
    { left: 47.07, top: 1.047, width: 11.23, height: 4.466 },

    /* Reason filter chips: All reasons / Spam / Harassment / Off-topic / Automod / NSFW. */
    { left: 7.422, top: 50.663, width: 8.105, height: 3.489, radius: 999 },
    { left: 16.113, top: 50.523, width: 5.371, height: 3.768, radius: 999 },
    { left: 22.07, top: 50.523, width: 8.789, height: 3.768, radius: 999 },
    { left: 31.445, top: 50.523, width: 7.129, height: 3.768, radius: 999 },
    { left: 39.16, top: 50.523, width: 7.227, height: 3.768, radius: 999 },
    { left: 46.973, top: 50.523, width: 5.664, height: 3.768, radius: 999 },

    /* The six report rows in the moderation queue (896×56 each). */
    { left: 6.25, top: 55.897, width: 87.5, height: 7.816, radius: 10 },
    { left: 6.25, top: 63.712, width: 87.5, height: 7.816, radius: 10 },
    { left: 6.25, top: 71.528, width: 87.5, height: 7.816, radius: 10 },
    { left: 6.25, top: 79.344, width: 87.5, height: 7.816, radius: 10 },
    { left: 6.25, top: 87.16, width: 87.5, height: 7.816, radius: 10 },
    { left: 6.25, top: 94.976, width: 87.5, height: 7.816, radius: 10 },
  ] satisfies Hotspot[],
};

/**
 * A hover target laid over a screenshot, marking an element that would be
 * interactive in the real app. All values are percentages of the image box, so
 * they hold at any render width.
 *
 * These are not eyeballed: each one is derived from the node's real geometry in
 * the Paper frame — (node.world - imageRoot.world) / imageRoot.size — so they
 * stay locked to the artwork. If a screenshot is re-exported after the design
 * moves, recompute rather than nudging by hand.
 */
export type Hotspot = {
  left: number;
  top: number;
  width: number;
  height: number;
  /** corner radius in px, matched to the element in the design */
  radius?: number;
};

/** A generative dither-kit avatar laid over a blank circle in a shot. */
export type AvatarOverlay = {
  /** Seed — the PR author's handle. Same handle → same avatar, forever. */
  name: string;
  /** Circle position, in % of the shot (same basis as Hotspot). */
  left: number;
  top: number;
  /** Diameter as a % of the shot's WIDTH; kept circular via aspect-square. */
  size: number;
};

/*
 * Social-proof strip under the hero. Logo artwork lives in
 * components/sponsor-logos.tsx, keyed by `logo`.
 */
export const SPONSORS = {
  heading: "Sponsored by",
  items: [
    {
      name: "CodeRabbit",
      logo: "coderabbit",
      href: "https://coderabbit.ai?ref=tripwire.sh",
    },
  ],
} as const;

export type Feature = {
  id: string;
  title: string;
  /** Paragraph lines — rendered with a <br /> between them, per the frame */
  body: string[];
  linkLabel: string;
  linkHref: string;
  visual: "left" | "right";
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
    hotspots?: Hotspot[];
    /** Generative avatars overlaid on blank avatar circles in the shot. */
    avatars?: AvatarOverlay[];
  };
};

export const FEATURES: Feature[] = [
  {
    id: "events",
    title: "Screen every PR before it hits main.",
    body: [
      "See a detailed log of events such as PR creation, or comments. Events can be displayed by severity, type, or time, whatever makes sense to you.",
    ],
    linkLabel: "Join the beta to see it live",
    linkHref: "#cta",
    visual: "right",
    image: {
      src: "/visuals/events-panel.webp",
      width: 1152,
      height: 634,
      alt: "Events panel showing a live log of change requests and comments",
      /* Image is 576×317. */
      hotspots: [
        /* Topbar nav: Queue / Events / Rules / Workflows (27px tall). */
        { left: 18.924, top: 4.022, width: 9.549, height: 8.517, radius: 6 },
        { left: 28.819, top: 4.022, width: 9.896, height: 8.517, radius: 6 },
        { left: 39.063, top: 4.022, width: 8.681, height: 8.517, radius: 6 },
        { left: 48.09, top: 4.022, width: 13.542, height: 8.517, radius: 6 },

        /* The four event rows (538×49 each). */
        { left: 3.299, top: 30.284, width: 93.403, height: 15.457 },
        { left: 3.299, top: 46.372, width: 93.403, height: 15.457 },
        { left: 3.299, top: 62.461, width: 93.403, height: 15.457 },
        { left: 3.299, top: 78.549, width: 93.403, height: 15.457 },
      ],
      /* Dither-kit avatars over the four blank circles, seeded by PR author. */
      avatars: [
        { name: "oyster-dev", left: 9.4, top: 34.83, size: 3.5 },
        { name: "maria-k", left: 9.4, top: 50.92, size: 3.5 },
        { name: "leo-nguyen", left: 9.4, top: 67.01, size: 3.5 },
        { name: "dependabot", left: 9.4, top: 83.1, size: 3.5 },
      ],
    },
  },
  {
    id: "rules",
    title: "Ingest. Evaluate. Act.",
    body: [
      "Account age, rate limits, hidden links, max files changed; get multiple composable rules in one workflow.",
      "Org members are exempt and there's evidence on every run.",
    ],
    linkLabel: "Get early access to rules",
    linkHref: "#cta",
    visual: "left",
    image: {
      src: "/visuals/rules-panel.webp",
      width: 1152,
      height: 602,
      alt: "Rules panel with account age and crypto address rules toggled on",
      /*
       * Topbar nav only (image is 576×301). The rule cards deliberately have no
       * hover: a rule row is a config surface, not something you click through,
       * so a hover affordance there promised an interaction that doesn't exist.
       *
       * Note these x-positions differ slightly from the Events panel's nav —
       * this panel's brand lockup was replaced (the Silkscreen wordmark swapped
       * for the real logo), which shifted the tabs. Recomputed, not copied.
       */
      hotspots: [
        { left: 18.403, top: 4.568, width: 9.549, height: 8.97, radius: 6 },
        { left: 28.299, top: 4.568, width: 9.896, height: 8.97, radius: 6 },
        { left: 38.542, top: 4.568, width: 8.681, height: 8.97, radius: 6 },
        { left: 47.569, top: 4.568, width: 13.542, height: 8.97, radius: 6 },
      ],
    },
  },
  {
    id: "workflows",
    title: "Create custom workflows.",
    body: [
      "Triggers, rules, gates, actions. all-of / any-of. needs_review pauses for moderation.",
      "Every run snapshots the definition so history stays honest.",
    ],
    linkLabel: "Request an invite",
    linkHref: "#cta",
    visual: "right",
    image: {
      src: "/visuals/workflow-canvas.webp",
      width: 1070,
      height: 504,
      alt: "Workflow canvas connecting a pull request trigger to a rule and a block action",
      /* The trigger / rule / action nodes (image is 535×252). */
      hotspots: [
        { left: 5.981, top: 38.69, width: 31.028, height: 22.619 },
        { left: 41.121, top: 38.69, width: 29.907, height: 22.619 },
        { left: 75.14, top: 38.69, width: 18.879, height: 22.619 },
      ],
    },
  },
  {
    id: "pr-surface",
    title: "One comment. One check. Zero noise.",
    body: [
      "One sentence explanations. Maintainers can view a detailed explanation on Tripwire. Contributors never get an essay.",
    ],
    linkLabel: "Claim your spot on the waitlist",
    linkHref: "#cta",
    visual: "left",
    image: {
      src: "/visuals/pr-comment.webp",
      width: 1152,
      height: 580,
      alt: "GitHub pull request comment where Tripwire blocked a change with a one-sentence explanation",
      /* The "View on Tripwire" button (185×30, image is 576×290). */
      hotspots: [
        { left: 3.646, top: 83.793, width: 32.118, height: 10.345 },
      ],
    },
  },
];

export const CTA_BAND = {
  headline: "Block noise. Pass signal.",
  subhead:
    "Install the GitHub App. Workflows evaluate every change request. Runs are public; deciding stays gated.",
  cta: "Request access",
};

/*
 * The three questions are verbatim from the frame. The frame ships them closed,
 * so it defines no answer text — the answers are written here, grounded in the
 * product behaviour shown on the frame's app screens ("Public Run — Desktop",
 * "Maintainer Run — Desktop", "/run/:runId").
 *
 * The frame also drew a General / Events / Rules / Workflows tab rail above
 * these, but it has been dropped: with only three questions there is nothing to
 * filter, so the tabs added a control without a job.
 */
export const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "How does Tripwire work?",
    answer:
      "Install the GitHub App and Tripwire starts ingesting contributor activity — change requests, comments, and the rest. Every event runs through your workflows: triggers fire, rules evaluate, actions decide. Runs are public; deciding stays gated.",
  },
  {
    question: "Who is exempt from rules?",
    answer:
      "Org members. Their change requests skip rule evaluation entirely — everyone else gets screened. Either way the run keeps its evidence, so you can always see why a decision was made.",
  },
  {
    question: "What does a blocked run look like?",
    answer:
      "The change request gets one check and one comment: this change request can't be merged. The public run page lists every rule that was evaluated — say 3 blocked, 3 passed — with the evidence behind each finding. Maintainers get the detail; contributors get one sentence.",
  },
];

export const FAQ = {
  heading: "Questions & Answers",
  subhead: "Everything you need to know about tripwire",
};

/* Placeholder hrefs, grouped here so they're trivial to wire up later. */
export const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Rules", href: "#" },
      { label: "Workflows", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Runs", href: "#" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "Docs", href: "#" },
      { label: "GitHub App", href: "#" },
      { label: "API", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Blog", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
    ],
  },
] as const;

export const FOOTER_BOTTOM = {
  copyright: "© 2026 Boring Software, Inc. All rights reserved.",
  socials: [
    { label: "GitHub", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "Discord", href: "#" },
  ],
} as const;

/*
 * The waitlist flow runs entirely on the app domain — GitHub sign-in happens
 * there and this site makes no API calls, it only opens the app in a popup and
 * listens for a postMessage back (see RequestAccessCta).
 *
 * `NEXT_PUBLIC_APP_URL` drives the app origin so the popup target and the
 * message listener's origin check agree. It's build-time inlined (public), and
 * falls back to the dev/prod origins so nothing breaks without an env file.
 * The app must run on this origin; in dev that means the landing runs on a
 * different port (e.g. `next dev -p 3001`).
 */
const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://v2.tripwire.sh");

export const REQUEST_ACCESS = {
  /** App origin — used for the popup target and the strict message-origin check. */
  appOrigin: APP_ORIGIN,
  /**
   * Popup entry point. Also the `<a href>` / no-JS + popup-blocked fallback:
   * navigating here full-page runs the same flow and lands on /queue in place.
   */
  href: `${APP_ORIGIN}/oauth/waitlist`,
};
