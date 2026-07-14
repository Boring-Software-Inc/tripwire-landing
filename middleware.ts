import { NextResponse, type NextRequest } from "next/server";

/*
 * Content negotiation for /dither-kit — the acceptmarkdown.com pattern.
 *
 * One URL, two representations: browsers (Accept: text/html) get the page;
 * agents that ask for text/markdown ahead of html get /dither-kit.md. The
 * `.md` URL stays directly fetchable too. `Vary: Accept` is set so shared
 * caches key on the request header.
 */

/** True when the client prefers text/markdown over text/html by q-value. */
function prefersMarkdown(accept: string): boolean {
  if (!accept) return false;
  let md = -1;
  let html = -1;
  for (const part of accept.split(",")) {
    const [typeRaw, ...params] = part.trim().split(";");
    const type = typeRaw.trim().toLowerCase();
    if (type !== "text/markdown" && type !== "text/html") continue;
    const qParam = params.find((p) => p.trim().startsWith("q="));
    const q = qParam ? Number.parseFloat(qParam.split("=")[1]) : 1;
    if (type === "text/markdown") md = Math.max(md, q);
    else html = Math.max(html, q);
  }
  return md > 0 && md >= html;
}

export function middleware(req: NextRequest) {
  if (prefersMarkdown(req.headers.get("accept") ?? "")) {
    const url = req.nextUrl.clone();
    url.pathname = "/dither-kit.md";
    const res = NextResponse.rewrite(url);
    res.headers.set("Vary", "Accept");
    return res;
  }
  const res = NextResponse.next();
  res.headers.set("Vary", "Accept");
  return res;
}

// Only the docs page negotiates — nothing else on the site is touched.
export const config = {
  matcher: "/dither-kit",
};
