"use client";

import { useSyncExternalStore } from "react";
import { Arrow } from "@/components/landing/arrow";
import { buttonVariants } from "@/components/glaze/ui/button-variants";
import { trackEvent, type Placement } from "@/lib/analytics";
import { APP, REQUEST_ACCESS } from "@/lib/content";
import { cn } from "@/lib/glaze/utils";

/**
 * Access CTA used by the hero and the CTA band. Opens the app's GitHub waitlist
 * flow in a popup and listens for the app to postMessage back when it's done —
 * OAuth happens entirely on the app domain, so this site makes no API calls.
 *
 * Cross-deployment contract (see the app's /oauth/popup-callback):
 *  - popup opened synchronously in the click handler (or the browser blocks it)
 *  - we pass our origin as ?opener= so the app knows exactly who to reply to
 *  - we only trust messages whose origin === the app origin
 *  - popup blocked → full-page redirect to the same entry URL
 *  - popup closed with no result (GitHub cancel / user closed it) → reset to
 *    idle with a subtle "didn't finish" note; we never auto-redirect them back
 *    into a flow they just backed out of
 */

/** Message channel name shared with the app's closer page. */
const MESSAGE_TYPE = "tripwire:waitlist";

type WaitlistMessage = {
  type: typeof MESSAGE_TYPE;
  status: "pending" | "approved" | "rejected" | "error";
  name?: string | null;
};

/**
 * Structural check that a message came from the app domain — compares protocol
 * + host ignoring a `www.` prefix, so an apex/www canonicalization on the app
 * side can't silently break the listener (the symmetric bug to the app's opener
 * allowlist that caused the dash-in-popup issue).
 */
function isAppOrigin(origin: string): boolean {
  try {
    const got = new URL(origin);
    const app = new URL(REQUEST_ACCESS.appOrigin);
    const stripWww = (host: string) => host.replace(/^www\./, "");
    return (
      got.protocol === app.protocol && stripWww(got.host) === stripWww(app.host)
    );
  } catch {
    return false;
  }
}

type Phase = "idle" | "waiting" | "pending" | "approved" | "rejected" | "incomplete";

const RESULT: Record<WaitlistMessage["status"], Phase> = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
  error: "incomplete",
};

let phase: Phase = "idle";
let popup: Window | null = null;
let poll: number | null = null;
let attempt: { placement: Placement; at: number } | null = null;

function secondsOpen() {
  return attempt ? Math.round((Date.now() - attempt.at) / 1000) : 0;
}
const listeners = new Set<() => void>();

function setPhase(next: Phase) {
  phase = next;
  listeners.forEach((fn) => fn());
}

function stopPolling() {
  if (poll !== null) {
    window.clearInterval(poll);
    poll = null;
  }
}

function onMessage(event: MessageEvent) {
  // Strict-but-structural origin check — only the app domain may drive this
  // UI, matched by protocol+host (www-insensitive) so apex/www can't break it.
  if (!isAppOrigin(event.origin)) return;
  const data = event.data as WaitlistMessage | null;
  if (!data || data.type !== MESSAGE_TYPE) return;
  if (phase !== "waiting") return;
  const next = RESULT[data.status];
  if (!next) return;

  stopPolling();
  if (attempt) trackEvent("beta_signup_result", { placement: attempt.placement, status: data.status, seconds: secondsOpen() });
  // Leave the popup open — the app's callback page shows a confirmation and
  // lets the user close it themselves. We just reflect the result here.
  popup = null;
  setPhase(next);
}

function subscribe(fn: () => void) {
  if (listeners.size === 0) window.addEventListener("message", onMessage);
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
    if (listeners.size === 0) {
      window.removeEventListener("message", onMessage);
      stopPolling();
    }
  };
}

function handleClick(e: React.MouseEvent<HTMLAnchorElement>, placement: Placement) {
  attempt = { placement, at: Date.now() };
  trackEvent("beta_signup_click", { placement });
  // Let modified clicks (new tab, etc.) and no-JS fall back to the plain href.
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();

  const entryUrl = `${REQUEST_ACCESS.href}?opener=${encodeURIComponent(
    window.location.origin,
  )}`;

  // Must open synchronously inside the click handler or the popup is blocked.
  // `mode=popup` tells the closer it's in a popup regardless of window.opener
  // (which a future COOP header could sever) — opener is the delivery check
  // only, never the popup detector.
  const opened = window.open(
    `${entryUrl}&mode=popup`,
    "tripwire-waitlist",
    "popup,width=520,height=680",
  );

  // Blocked → full-page redirect WITHOUT mode=popup, so the closer treats it
  // as a full-page flow and navigates in place (not a stranded popup).
  if (!opened) {
    trackEvent("beta_signup_popup_blocked", { placement });
    window.location.href = entryUrl;
    return;
  }

  popup = opened;
  setPhase("waiting");
  window.addEventListener(
    "pagehide",
    () => {
      if (phase === "waiting" && attempt) trackEvent("beta_signup_abandoned", { placement: attempt.placement, seconds: secondsOpen(), reason: "left_page" });
    },
    { once: true },
  );

  // Detect the user closing the popup (or cancelling on GitHub) without a
  // result — reset to idle-with-note rather than stranding them "waiting".
  stopPolling();
  poll = window.setInterval(() => {
    if (popup && !popup.closed) return;
    stopPolling();
    if (phase === "waiting") {
      if (attempt) trackEvent("beta_signup_abandoned", { placement: attempt.placement, seconds: secondsOpen(), reason: "popup_closed" });
      setPhase("incomplete");
    }
    popup = null;
  }, 500);
}

const NOTES: Partial<Record<Phase, string>> = {
  rejected: "We can't add you to the beta right now.",
  incomplete: "Didn't finish. You can try again.",
};

export default function RequestAccessCta({ placement }: { placement: Placement }) {
  const size = placement === "nav" ? "nav" : "xl";
  const current = useSyncExternalStore(subscribe, () => phase, () => "idle" as Phase);
  const sizeClass = size === "nav" ? "btn-nav" : "btn-xl";
  const arrow = size === "xl" ? <Arrow /> : null;

  if (current === "approved") {
    return (
      <a href={APP.home} className={cn(buttonVariants({ size: "lg" }), sizeClass)}>
        Open Tripwire
        {arrow}
      </a>
    );
  }

  if (current === "pending") {
    return (
      <span role="status" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), sizeClass, "cursor-default")}>
        You&apos;re on the waitlist
      </span>
    );
  }

  const note = size === "xl" ? NOTES[current] : undefined;

  return (
    <span className="relative flex flex-col items-center">
      <a
        href={REQUEST_ACCESS.href}
        onClick={(e) => handleClick(e, placement)}
        aria-busy={current === "waiting" || undefined}
        className={cn(buttonVariants({ size: "lg" }), sizeClass, current === "waiting" && "pointer-events-none")}
      >
        {current === "waiting" ? "Opening GitHub" : "Join the beta"}
        {arrow}
      </a>
      {size === "xl" ? (
        <span aria-live="polite" className="absolute top-full left-1/2 mt-2 -translate-x-1/2 text-[13px] leading-[18px] whitespace-nowrap text-text-2">
          {note}
        </span>
      ) : null}
    </span>
  );
}
