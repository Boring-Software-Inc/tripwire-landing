"use client";

import dynamic from "next/dynamic";

/*
 * The docs page is ported verbatim from tripwire's `/dither-kit` route, which
 * was `ssr: false`. It reads `window.localStorage` during render (theme) and
 * mounts DialKit (a window-only control surface), so it must render on the
 * client only — hence the dynamic import with `ssr: false`.
 */
const DitherKitDocs = dynamic(() => import("./dither-kit-docs"), {
  ssr: false,
});

export default function Page() {
  return <DitherKitDocs />;
}
