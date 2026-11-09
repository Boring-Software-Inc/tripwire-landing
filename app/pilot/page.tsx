import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import "@/components/glaze/styles.css";
import { GithubMark, Icon } from "@/components/glaze/icon";
import { buttonVariants } from "@/components/glaze/ui/button-variants";
import { Ghost } from "@/components/landing/ghost";
import { Lockup } from "@/components/landing/logo";
import { ThemeScript } from "@/components/landing/theme-script";
import { APP } from "@/lib/content";
import { geist, geistMono } from "@/lib/fonts";
import { GlazePortalProvider } from "@/lib/glaze/portal";
import { loadPilotDirectory, loadPilotStars, PILOT_API, PILOT_REPOSITORY } from "./data";
import styles from "./pilot.module.css";

const TITLE = "Pilot | Tripwire";
const DESCRIPTION = "A public list of GitHub accounts reported for spam and reviewed by maintainers.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/pilot" },
  openGraph: {
    type: "website",
    siteName: "Tripwire",
    title: TITLE,
    description: DESCRIPTION,
    url: "/pilot",
    images: ["/og.png"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og.png"] },
  other: { "twitter:player:stream": [], "twitter:player:stream:content_type": [] },
};

const FONTS = {
  "--font-sans": geist.style.fontFamily,
  "--font-mono": geistMono.style.fontFamily,
} as CSSProperties;

const ACCOUNT_PROMPT = "GitHub username or profile URL:\n\n";
const SUGGEST = new URLSearchParams({
  title: "Suggest an account",
  body: ACCOUNT_PROMPT + "What happened? Include public links if available. Keep private evidence out of this issue.",
});
const APPEAL = new URLSearchParams({
  title: "Appeal a block",
  body: ACCOUNT_PROMPT + "Why should this listing be changed or removed? Keep private details out of this issue.",
});

function pageHref(q: string, page: number) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  return params.size ? `/pilot?${params}` : "/pilot";
}

function updatedAgo(date: string) {
  const seconds = Math.max(0, (Date.now() - Date.parse(date)) / 1000);
  const format = new Intl.RelativeTimeFormat("en", { numeric: "always" });
  if (seconds < 60) return "just now";
  if (seconds < 3600) return format.format(-Math.floor(seconds / 60), "minute");
  if (seconds < 86400) return format.format(-Math.floor(seconds / 3600), "hour");
  return format.format(-Math.floor(seconds / 86400), "day");
}

export default async function PilotPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawQuery = typeof params.q === "string" ? params.q.trim() : "";
  const q = rawQuery.length <= 100 ? rawQuery : "";
  const requestedPage = typeof params.page === "string" ? Number(params.page) : 1;
  const page = Number.isInteger(requestedPage) && requestedPage >= 1 && requestedPage <= 400 ? requestedPage : 1;
  const [directory, stars] = await Promise.all([loadPilotDirectory(q, page), loadPilotStars()]);
  const showSearch = Boolean(directory?.total);
  const secondary = buttonVariants({ variant: "secondary" });

  return (
    <div className={`glaze ${styles.surface}`} style={FONTS} suppressHydrationWarning>
      <ThemeScript />
      <GlazePortalProvider>
        <main id="main" tabIndex={-1} className={styles.page}>
          <nav aria-label="Tripwire" className={styles.nav}>
            <Link href="/" aria-label="Tripwire home">
              <Lockup size={22} wordClass="type-label-lg" />
            </Link>
            <div className={styles.actions}>
              <a className={secondary} href={`${PILOT_REPOSITORY}/issues/new?${APPEAL}`}>Appeal a block</a>
              <a className={secondary} href={PILOT_REPOSITORY}>
                <Icon icon={GithubMark} />
                View on GitHub
                {stars !== null ? <span className={styles.muted}>{`${stars.toLocaleString("en-US")} ${stars === 1 ? "star" : "stars"}`}</span> : null}
              </a>
            </div>
          </nav>

          <header className={styles.stack}>
            <h1>Pilot</h1>
            <p className={styles.muted}>{DESCRIPTION}</p>
          </header>

          <section className="shell" aria-labelledby="pilot-accounts">
            <div className="panel">
              {showSearch && directory ? (
                <header className={styles.toolbar}>
                  <div className={styles.stack}>
                    <h2 id="pilot-accounts">Listed accounts</h2>
                    <p className={styles.muted}>
                      {q ? `${directory.matches} of ${directory.total} accounts` :
                        `${directory.total} ${directory.total === 1 ? "account" : "accounts"}`}
                    </p>
                  </div>
                  <form action="/pilot" method="get" className={styles.search}>
                    <input className="field" aria-label="GitHub username" placeholder="GitHub username"
                      name="q" type="search" maxLength={100} defaultValue={q} />
                    <button className={secondary} type="submit">Search</button>
                  </form>
                </header>
              ) : null}
              {directory?.entries.length ? (
                <table className={styles.table}>
                  <thead><tr><th scope="col">GitHub account</th><th scope="col">Reason</th><th scope="col">Expires (UTC)</th></tr></thead>
                  <tbody>
                    {directory.entries.map((entry) => (
                      <tr key={entry.accountId}>
                        <td><a className={styles.account} href={`https://github.com/${encodeURIComponent(entry.login)}`}>
                          <Image alt="" width={20} height={20} unoptimized
                            src={`https://avatars.githubusercontent.com/u/${entry.accountId}?s=40&v=4`} />
                          <span>@{entry.login}</span>
                        </a></td>
                        <td>{entry.reason}</td>
                        <td>{entry.expiresAt ? <time dateTime={entry.expiresAt}>{entry.expiresAt.slice(0, 10)}</time> : "No expiry"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className={styles.empty}>
                  <Ghost size={56} />
                  <h2 id={showSearch ? undefined : "pilot-accounts"}>
                    {!directory ? "Blocklist unavailable" : showSearch ? "No matching accounts" : "No accounts listed"}
                  </h2>
                  <p className={styles.muted}>
                    {!directory ? "Try again in a few minutes." : showSearch ?
                      "Try a different GitHub username." : "Know an account sending spam? Suggest it for review."}
                  </p>
                  {showSearch ? <Link className={secondary} href="/pilot">Clear search</Link> : directory ? (
                    <a className={buttonVariants()} href={`${PILOT_REPOSITORY}/issues/new?${SUGGEST}`}>Suggest an account</a>
                  ) : null}
                </div>
              )}
            </div>
            {directory ? (
              <div className={`shell-foot ${styles.meta}`}>
                <span className={styles.muted}>
                  Updated <time dateTime={directory.publishedAt} title={directory.publishedAt}>{updatedAgo(directory.publishedAt)}</time>
                </span>
                {directory.pageCount > 1 ? (
                  <nav aria-label="Result pages" className={styles.actions}>
                    {directory.page > 1 ? <Link href={pageHref(q, directory.page - 1)} rel="prev">Previous</Link> : null}
                    <span className={styles.muted}>Page {directory.page} of {directory.pageCount}</span>
                    {directory.page < directory.pageCount ? <Link href={pageHref(q, directory.page + 1)} rel="next">Next</Link> : null}
                  </nav>
                ) : null}
              </div>
            ) : null}
          </section>

          <footer className={styles.actions}>
            {showSearch || !directory ? <a href={`${PILOT_REPOSITORY}/issues/new?${SUGGEST}`}>Suggest an account</a> : null}
            <a href={PILOT_API}>JSON API</a>
            <a href={`${PILOT_API}?format=txt`}>Raw usernames</a>
          </footer>

          <aside className={styles.callout} aria-labelledby="pilot-tripwire">
            <h2 id="pilot-tripwire">Use Pilot in Tripwire</h2>
            <p className={styles.muted}>Send pull requests from listed accounts to Human review.</p>
            <a className={secondary} href={APP.login}>Open Tripwire</a>
          </aside>
        </main>
      </GlazePortalProvider>
    </div>
  );
}
