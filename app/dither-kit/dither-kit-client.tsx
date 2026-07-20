"use client";

import dynamic from "next/dynamic";

/*
 * The docs are ported verbatim from tripwire's `/dither-kit` route, which was
 * `ssr: false`. They read `window.localStorage` during render (theme) and mount
 * DialKit (a window-only control surface), so they must render on the client
 * only — hence the dynamic import with `ssr: false`.
 *
 * Isolating the `ssr: false` import in this client island lets the parent
 * `page.tsx` stay a server component: it can export route metadata and render a
 * crawlable summary that ships in the initial HTML, instead of the whole route
 * bailing to client-side rendering (and inheriting the site-wide metadata).
 */
const DitherKitDocs = dynamic(() => import("./dither-kit-docs"), {
  ssr: false,
});

export function DitherKitDocsClient() {
  return <DitherKitDocs />;
}
