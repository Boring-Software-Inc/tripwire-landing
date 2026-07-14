# Tripwire — Marketing Landing Page

Single-page marketing site for **Tripwire** ("The firewall for your OSS projects"), implemented pixel-faithfully from the Paper design frame **"Tripwire Landing"** (1778 × 4253). Next.js App Router + TypeScript + Tailwind CSS v4.

## Run

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build
```

## Where things live

| What | Where |
| --- | --- |
| All copy (verbatim from the frame) + link config | `lib/content.ts` |
| Design tokens (colors, font, radii) | `app/globals.css` (`@theme`) |
| Sections, one component each | `components/sections/` |
| Waitlist API stub | `app/api/waitlist/route.ts` |
| Exported frame assets (2x WebP) | `public/visuals/` |
| Screenshot hover hotspots | `components/InteractiveShot.tsx` + `hotspots` in `lib/content.ts` |

## Screenshot hotspots

The product screenshots stay as exported images (the brief rules out rebuilding them in HTML), but the elements that would be interactive in the real app get hover affordances laid over them: the 6 moderation rows, 4 event rows, 2 rule cards, 3 workflow nodes, and the "View on Tripwire" button — 16 in total.

Each hotspot is positioned in **percentages derived from the node's real geometry in the Paper frame** — `(node.world − imageRoot.world) / imageRoot.size` — not eyeballed, so they stay aligned at every render width. **If a screenshot is re-exported after the design moves, recompute the percentages rather than nudging them by hand.**

They are hover-only: `aria-hidden`, never in the tab order (the `alt` text already describes the content), and no click handler — clicking is a no-op. `cursor: pointer` is used to sell the affordance. If a click should do something (e.g. route to the section's link), that needs wiring.

## Fonts

The frame uses **Inter**, loaded via `next/font/google` — an exact match, no substitution needed.

## Waitlist

Both "Join the waitlist" buttons reveal an inline email form that POSTs to `/api/waitlist`. The route only validates and returns success (`// TODO: connect provider`). Swapping in ConvertKit/Loops/etc. is a one-file change in `app/api/waitlist/route.ts`.

## Approved deviations from the frame

These three gaps in the frame were resolved deliberately, with sign-off — the frame remains the source of truth for everything else.

- **FAQ answers were written for this build.** The frame ships all three accordions closed, so it contains no answer text. The answers in `lib/content.ts` are grounded in the product behaviour shown on the frame's own app screens ("Public Run — Desktop", "Maintainer Run — Desktop", `/run/:runId`) — e.g. the blocked-run answer reflects the real run page: one check, one comment, a per-rule tally, and evidence per finding.
- **The FAQ category tabs were dropped.** The frame draws a General / Events / Rules / Workflows rail above the questions, but with only three questions there is nothing to filter — the tabs were a control without a job. The three questions now render as a plain accordion.
- **Contrast fix**: the frame's `#5A5A5A` (footer links, CTA-band + FAQ sub-copy) is ≈ 2.8:1 on `#0E0E0E` and fails WCAG AA. `--color-faint` is lightened to `#8A8A8A` (≈ 5.6:1), the nearest neutral that clears AA for normal text. `#969696` and `#929292` already passed and are unchanged.
- **Three typos corrected**: "sentance" → "sentence", "explainations"/"explaination" → "explanations"/"explanation", "theres" → "there's". **The Paper frame still contains them** — fix it there so the two don't drift apart.
- **Hero screenshot enlarged.** The frame nests the dashboard inside a padded backdrop frame, so exporting that frame baked ~30% dead padding into the image and made the UI read small. The backdrop (bg + radial gradient + radius) is now rebuilt in CSS and only the dashboard itself (`Beta Banner`) is exported, so it fills the container — ~1.44× larger on desktop.

## Still open

- **Hover states are not defined in the frame** — minimal opacity/color transitions (~150 ms) were derived from the existing palette. The same applies to the mobile menu, which the frame does not design at all (it has no mobile artboard): the hamburger, its ease-in-out open/close, and its hover states are all inventions.
- `metadataBase` in `app/layout.tsx` is a placeholder domain — set the real one before launch.
- "Docs" nav link points at `#faq` until a docs site exists (repoint in `lib/content.ts` → `NAV_LINKS`).
- All footer / feature links that have no destination yet are `#` placeholders grouped in `lib/content.ts`.

## Out of scope (per PRD)

Docs site, app/login, pricing, blog, real waitlist provider, analytics (mount point is commented in `app/layout.tsx`), CMS.
