export const SITE = {
  name: "Tripwire",
  title: "The firewall for your OSS projects",
  description: "Trigger workflows from contributor activity. Filter out the noise.",
};

export const DOCS_URL = "https://docs.tripwire.sh";

/*
 * The waitlist flow runs entirely on the app domain — GitHub sign-in happens
 * there and this site makes no API calls, it only opens the app in a popup and
 * listens for a postMessage back (see RequestAccessCta).
 *
 * `NEXT_PUBLIC_APP_URL` drives the app origin so the popup target and the
 * message listener's origin check agree. It's build-time inlined (public), and
 * falls back to the dev/prod origins so nothing breaks without an env file.
 * The app must run on this origin; in dev that means the landing runs on a
 * different port (e.g. `next dev -p 3001`).
 */
const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://app.tripwire.sh");

export const REQUEST_ACCESS = {
  /** App origin — used for the popup target and the strict message-origin check. */
  appOrigin: APP_ORIGIN,
  /**
   * Popup entry point. Also the `<a href>` / no-JS + popup-blocked fallback:
   * navigating here full-page runs the same flow and lands on /queue in place.
   */
  href: `${APP_ORIGIN}/oauth/waitlist`,
};

export const APP = {
  home: APP_ORIGIN,
  login: `${APP_ORIGIN}/login`,
};
