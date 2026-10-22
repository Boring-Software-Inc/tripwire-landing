import { getTrackingParams, track } from "@databuddy/sdk";

export const DATABUDDY_CLIENT_ID = "09661145-7249-45d9-a9e3-f1a93e9c7266";

export type Placement = "nav" | "hero" | "bottom";

type Events = {
  beta_signup_click: { placement: Placement };
  beta_signup_popup_blocked: { placement: Placement };
  beta_signup_result: { placement: Placement; status: "pending" | "approved" | "rejected" | "error"; seconds: number };
  beta_signup_abandoned: { placement: Placement; seconds: number; reason: "popup_closed" | "left_page" };
  demo_interaction: { surface: string; element: string };
};

export function trackEvent<E extends keyof Events>(name: E, props: Events[E]) {
  try {
    void track(name, props);
  } catch {}
}

const seen = new Set<string>();

export function trackDemo(surface: string, element: string) {
  const key = `${surface}:${element}`;
  if (seen.has(key)) return;
  seen.add(key);
  trackEvent("demo_interaction", { surface, element });
}

export function withTrackingParams(url: string) {
  try {
    const params = getTrackingParams();
    if (!params) return url;
    const next = new URL(url);
    for (const [key, value] of new URLSearchParams(params)) next.searchParams.set(key, value);
    return next.toString();
  } catch {
    return url;
  }
}
