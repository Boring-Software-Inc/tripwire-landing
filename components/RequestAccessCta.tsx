"use client";

import { useEffect, useRef, useState } from "react";
import { REQUEST_ACCESS } from "@/lib/content";

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

type Phase = "idle" | "waiting" | "success" | "incomplete";

export default function RequestAccessCta({
  label,
  size = "md",
  align = "start",
}: {
  label: string;
  /** md = hero (16px), sm = CTA band (14px) — paddings per the frame */
  size?: "md" | "sm";
  align?: "start" | "center";
}) {
  const buttonClasses =
    size === "md"
      ? "rounded-tight md:rounded-ui bg-foreground px-[10.5px] pt-[5.6px] pb-[5.88px] text-[16px]/[1.5] font-medium text-background"
      : "rounded-tight md:rounded-ui bg-foreground px-[17.5px] pt-[7px] pb-[7.28px] text-sm/[1.43] font-medium text-background";

  const justify = align === "center" ? "justify-center" : "justify-start";

  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const popupRef = useRef<Window | null>(null);
  const pollRef = useRef<number | null>(null);

  const setPhaseBoth = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  const stopPolling = () => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      // Strict origin check — only the app domain may drive this UI.
      if (event.origin !== REQUEST_ACCESS.appOrigin) return;
      const data = event.data as WaitlistMessage | null;
      if (!data || data.type !== MESSAGE_TYPE) return;
      if (phaseRef.current !== "waiting") return;

      stopPolling();
      // Leave the popup open — the app's callback page shows a confirmation and
      // lets the user close it themselves. We just reflect the result here.
      popupRef.current = null;
      setPhaseBoth(data.status === "error" ? "incomplete" : "success");
    }

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      stopPolling();
    };
  }, []);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Let modified clicks (new tab, etc.) and no-JS fall back to the plain href.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();

    const url = `${REQUEST_ACCESS.href}?opener=${encodeURIComponent(
      window.location.origin,
    )}`;

    // Must open synchronously inside the click handler or the popup is blocked.
    const popup = window.open(
      url,
      "tripwire-waitlist",
      "popup,width=520,height=680",
    );

    // Blocked → degrade to a full-page redirect through the same entry point.
    if (!popup) {
      window.location.href = url;
      return;
    }

    popupRef.current = popup;
    setPhaseBoth("waiting");

    // Detect the user closing the popup (or cancelling on GitHub) without a
    // result — reset to idle-with-note rather than stranding them "waiting".
    stopPolling();
    pollRef.current = window.setInterval(() => {
      if (popupRef.current && !popupRef.current.closed) return;
      stopPolling();
      if (phaseRef.current === "waiting") setPhaseBoth("incomplete");
      popupRef.current = null;
    }, 500);
  }

  if (phase === "success") {
    return (
      <div className={`flex items-center gap-3 ${justify}`}>
        <span className={`${buttonClasses} inline-block cursor-default`}>
          You&apos;re on the waitlist
        </span>
        <span className="text-sm text-muted">Check your email — we review requests manually.</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 ${align === "center" ? "items-center" : "items-start"}`}>
      <div className={`flex items-center gap-4 ${justify}`}>
        <a
          href={REQUEST_ACCESS.href}
          onClick={handleClick}
          aria-busy={phase === "waiting"}
          className={`${buttonClasses} inline-block transition-opacity duration-150 hover:opacity-85 ${
            phase === "waiting" ? "pointer-events-none opacity-70" : ""
          }`}
        >
          {phase === "waiting" ? "Opening GitHub…" : label}
        </a>
      </div>
      {phase === "incomplete" ? (
        <span className="text-sm text-muted">
          Didn&apos;t finish — you can try again.
        </span>
      ) : null}
    </div>
  );
}
