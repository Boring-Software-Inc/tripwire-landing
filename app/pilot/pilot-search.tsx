"use client";

import Form from "next/form";
import { type SubmitEvent, useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import styles from "./pilot.module.css";

function trackSearch(event: SubmitEvent<HTMLFormElement>) {
  const query = new FormData(event.currentTarget).get("q");
  const length = typeof query === "string" ? query.trim().length : 0;
  if (length === 0) return;
  trackEvent("pilot_search_submit", { query_length: length });
}

export function PilotSearchForm({ query, buttonClassName }: { query: string; buttonClassName: string }) {
  return (
    <Form action="/pilot" className={styles.search} onSubmit={trackSearch}>
      <input className="field" aria-label="GitHub username" placeholder="GitHub username"
        name="q" type="search" maxLength={100} defaultValue={query} />
      <button className={buttonClassName} type="submit">Search</button>
    </Form>
  );
}

export function PilotSearchResultsEvent({ matches, page }: { matches: number | null; page: number }) {
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackEvent("pilot_search_results", matches === null
      ? { status: "unavailable", page }
      : { status: "available", matches, page });
  }, [matches, page]);

  return null;
}
