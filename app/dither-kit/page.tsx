import type { Metadata } from "next";
import { DitherKitDocsClient } from "./dither-kit-client";

const TITLE = "dither-kit — dithered charts & components for shadcn/ui";
const DESCRIPTION =
  "Composable, dithered charts — area, bar, line, pie, radar — plus generative avatars, buttons, and gradient washes, on one tiny canvas engine. A recharts-style, children-as-config API for shadcn/ui projects.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/dither-kit",
    // Agents that prefer plain docs can fetch the markdown representation
    // directly, or send `Accept: text/markdown` to /dither-kit (see middleware.ts).
    types: { "text/markdown": "/dither-kit.md" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    url: "/dither-kit",
    images: [{ url: "/og.png", width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

export default function Page() {
  return (
    <>
      {/*
       * Server-rendered, crawlable summary. The interactive docs below are a
       * window-only client island (canvas + localStorage theme + DialKit), so
       * this static block is what non-JS crawlers and AI agents actually read
       * in the initial HTML. Kept out of the visual flow with `sr-only` since
       * the hydrated docs render their own hero; agents that send
       * `Accept: text/markdown` get the full /dither-kit.md instead.
       */}
      <section className="sr-only" aria-hidden="true">
        <h1>dither-kit</h1>
        <p>{DESCRIPTION}</p>
        <p>
          Requires Tailwind and a shadcn project. Install with the Dither Kit
          CLI: <code>npx @dither-kit/cli add area-chart</code>, or add
          everything with <code>npx @dither-kit/cli add dither-kit</code>. See{" "}
          <code>npx @dither-kit/cli list</code> for the live registry. Without
          the CLI:{" "}
          <code>
            npx shadcn@latest add https://tripwire.sh/r/area-chart.json
          </code>
          .
        </p>
        <p>
          Available items: area-chart, bar-chart, pie-chart, radar-chart,
          avatar, button, gradient, core, and dither-kit (all of them). LineChart
          ships inside area-chart.
        </p>
        <p>
          <a href="/dither-kit.md">Plain-markdown docs for agents</a>
        </p>
      </section>
      <DitherKitDocsClient />
    </>
  );
}
