/*
 * Markdown representation of /dither-kit, for agents that prefer plain docs
 * over scraping the marketing page. Mirrors the acceptmarkdown.com pattern:
 * served as `text/markdown; charset=utf-8` with `Vary: Accept`, and reachable
 * both here (`/dither-kit.md`) and via `Accept: text/markdown` on `/dither-kit`
 * (see middleware.ts).
 *
 * Keep this in sync with components/dither-kit-docs/content.ts — the install
 * commands, prop table, and code snippets are lifted from there.
 */

const MARKDOWN = `# dither-kit

Composable, dithered charts — area, bar, line, pie, radar — plus generative
avatars, buttons, and gradient washes, on one tiny canvas engine. A
recharts-style, children-as-config API with no recharts. Ordered-dither fills
that hold up in light and dark, entrance animations, a gliding scrub tooltip,
selection, winking sparkles, and colour bloom.

Requires Tailwind + a shadcn project (\`components.json\`). Files land in
\`components/dither-kit/\` and import from \`@/components/dither-kit\`.

## Install

Use the Dither Kit CLI — it writes a lockfile (so you can \`update\` / \`diff\`
later) and pulls the shared \`core\` engine plus deps (motion, d3) automatically.

\`\`\`bash
# npm
npx @dither-kit/cli add area-chart
npx @dither-kit/cli add button
npx @dither-kit/cli add dither-kit   # everything
npx @dither-kit/cli list             # what's available (live registry)
\`\`\`

Other package managers use their own runner: \`pnpm dlx @dither-kit/cli …\`,
\`yarn dlx @dither-kit/cli …\`, \`bunx --bun @dither-kit/cli …\`.

Available items: \`area-chart\`, \`bar-chart\`, \`pie-chart\`, \`radar-chart\`,
\`avatar\`, \`button\`, \`gradient\`, \`core\`, and \`dither-kit\` (all of them).
\`LineChart\` ships inside \`area-chart\` (a line is an area + glow).

### Without the CLI (raw shadcn, no lockfile)

\`\`\`bash
# tracked registry URL (counts as an install)
npx shadcn@latest add https://tripwire.sh/r/area-chart.json
# or the GitHub shorthand
npx shadcn@latest add Boring-Software-Inc/dither-kit/area-chart
\`\`\`

### Or register the @dither-kit namespace once

\`\`\`jsonc
// components.json
{
  "registries": {
    "@dither-kit": "https://tripwire.sh/r/{name}.json"
  }
}
\`\`\`

\`\`\`bash
npx shadcn@latest add @dither-kit/area-chart
\`\`\`

## API

Charts are recharts-style: a \`data\` array plus a \`config\` object mapping each
series key to a \`label\` and \`color\`. Series/axes/legend/tooltip are composed
as children.

\`\`\`tsx
import { AreaChart, Area, XAxis, YAxis, Legend, Tooltip } from "@/components/dither-kit/area-chart"

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 240, mobile: 100 },
]
const config = {
  desktop: { label: "Desktop", color: "blue" },
  mobile: { label: "Mobile", color: "purple" },
}

<AreaChart data={data} config={config} bloom="aura">
  <XAxis dataKey="month" />
  <YAxis />
  <Legend isClickable />
  <Tooltip labelKey="month" />
  <Area dataKey="desktop" variant="gradient" />
  <Area dataKey="mobile" variant="hatched" />
</AreaChart>
\`\`\`

### Bar

\`\`\`tsx
<BarChart data={data} config={config} stackType="stacked" bloom="aura">
  <XAxis dataKey="month" />
  <YAxis />
  <Legend isClickable />
  <Tooltip labelKey="month" />
  <Bar dataKey="desktop" variant="gradient" />
  <Bar dataKey="mobile" variant="hatched" />
</BarChart>
\`\`\`

### Line

\`\`\`tsx
// LineChart ships in the area-chart item (line = area + glow)
<LineChart data={data} config={config} bloom="aura">
  <XAxis dataKey="month" />
  <YAxis />
  <Legend isClickable />
  <Tooltip labelKey="month" />
  <Line dataKey="desktop" />
  <Line dataKey="mobile" strokeVariant="dashed" />
</LineChart>
\`\`\`

### Pie / donut

\`\`\`tsx
const data = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
]
const config = {
  chrome: { label: "Chrome", color: "blue" },
  safari: { label: "Safari", color: "green" },
}

<PieChart data={data} config={config} dataKey="visitors" nameKey="browser" innerRadius={0.5} bloom="aura">
  <Legend isClickable align="center" />
  <Tooltip />
  <Pie variant="gradient" />
</PieChart>
\`\`\`

### Radar

\`\`\`tsx
const data = [
  { skill: "Speed", desktop: 186, mobile: 120 },
  { skill: "Power", desktop: 205, mobile: 98 },
]

<RadarChart data={data} config={config} nameKey="skill" bloom="aura">
  <Legend isClickable align="center" />
  <Tooltip />
  <Radar dataKey="desktop" variant="gradient" />
  <Radar dataKey="mobile" variant="hatched" />
</RadarChart>
\`\`\`

### Sparkline

\`\`\`tsx
// tiny decorative spark — no axes, no tooltip
<Sparkline data={[3, 7, 5, 9, 8, 12]} color="green" bloom="aura" />
\`\`\`

## Props

| Prop | Values |
| --- | --- |
| \`variant\` | \`"gradient" \\| "dotted" \\| "hatched" \\| "solid"\` (per series) |
| \`bloom\` | \`"off" \\| "low" \\| "high" \\| "aura"\` or \`{ blur, brightness, opacity, saturate }\` |
| \`stackType\` | \`"default" \\| "stacked" \\| "percent"\` |
| \`color\` | \`green\` \`blue\` \`purple\` \`pink\` \`orange\` \`red\` \`grey\` |
| \`animate\` | with \`animationDuration\` + \`replayToken\` for entrance and replay |
| \`interactive\` | \`false\` = decorative spark, no crosshair or tooltip |

## Standalone extras

No chart engine — tiny installs, same CLI.

\`\`\`tsx
// avatar — generative mirrored pixel avatars (deterministic per name, ~1.5T combos)
<DitherAvatar name="dan" size={96} />        // optional hue={0-360}

// button — dithered native <button> (all button props pass through)
<DitherButton color="blue" variant="gradient" onClick={save}>save changes</DitherButton>

// gradient — dithered background wash; fills its nearest relative ancestor
<footer className="relative">
  <DitherGradient from="purple" direction="up" />
  <p className="relative">…footer content…</p>
</footer>
\`\`\`

---

Full interactive docs: https://tripwire.sh/dither-kit — inspired by Evil Charts.
`

export function GET(): Response {
  return new Response(MARKDOWN, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // Caches key on Accept so the HTML and Markdown reps don't clobber.
      Vary: "Accept",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  })
}
