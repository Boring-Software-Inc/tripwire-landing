"use client";

import { useEffect } from "react";
import { withTrackingParams } from "@/lib/analytics";
import { APP } from "@/lib/content";

export function AppLinkStitching() {
  useEffect(() => {
    const app = new URL(APP.home).origin;
    const stitch = (event: Event) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.origin !== app) return;
      link.href = withTrackingParams(link.href);
    };
    document.addEventListener("pointerdown", stitch, true);
    document.addEventListener("keydown", stitch, true);
    return () => {
      document.removeEventListener("pointerdown", stitch, true);
      document.removeEventListener("keydown", stitch, true);
    };
  }, []);
  return null;
}
