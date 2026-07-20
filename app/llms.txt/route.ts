/*
 * /llms.txt — the llms.txt convention (llmstxt.org): a short, link-first index
 * that points AI agents at the plain-markdown docs and the machine-readable
 * component registry, rather than the JS-heavy marketing page. Keep the links
 * in sync with app/dither-kit.md/route.ts and public/r/.
 */

const LLMS = `# Tripwire

> The firewall for your OSS projects — trigger workflows from contributor activity. Keep the good, reject the bad.

## Docs

- [dither-kit](https://tripwire.sh/dither-kit.md): Composable, dithered charts (area, bar, line, pie, radar) plus generative avatars, buttons, and gradient washes for shadcn/ui. Full API, install commands, and prop tables in markdown.

## Registry

- [Component registry index](https://tripwire.sh/r/registry.json): machine-readable list of installable dither-kit components for the shadcn CLI.
- [Install a component](https://tripwire.sh/r/area-chart.json): each item at https://tripwire.sh/r/{name}.json is inlined and ready for \`shadcn add\`.
`;

export function GET(): Response {
  return new Response(LLMS, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
