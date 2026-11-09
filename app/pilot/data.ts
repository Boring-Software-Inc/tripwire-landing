export const PILOT_REPOSITORY = "https://github.com/Boring-Software-Inc/Pilot";
export const PILOT_API = "https://app.tripwire.sh/api/blocklist";

interface PilotEntry {
  accountId: string;
  login: string;
  reason: string;
  expiresAt: string | null;
}

interface PilotDirectory {
  entries: PilotEntry[];
  total: number;
  matches: number;
  page: number;
  pageCount: number;
  publishedAt: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTimestamp(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function isInteger(value: unknown, min: number): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= min;
}

function isEntry(value: unknown): value is PilotEntry {
  return isRecord(value) &&
    typeof value.accountId === "string" && /^[1-9][0-9]*$/.test(value.accountId) &&
    typeof value.login === "string" &&
    typeof value.reason === "string" &&
    (value.expiresAt === null || isTimestamp(value.expiresAt));
}

function isDirectory(value: unknown): value is PilotDirectory {
  return isRecord(value) && value.version === 1 &&
    Array.isArray(value.entries) && value.entries.every(isEntry) &&
    isInteger(value.total, 0) && isInteger(value.matches, 0) &&
    isInteger(value.page, 1) && isInteger(value.pageCount, 1) &&
    value.page <= value.pageCount && value.matches <= value.total &&
    isTimestamp(value.publishedAt);
}

export async function loadPilotDirectory(q: string, page: number): Promise<PilotDirectory | null> {
  const url = new URL(PILOT_API);
  if (q) url.searchParams.set("q", q);
  url.searchParams.set("page", String(page));
  try {
    const response = await fetch(url, {
      ...(q ? { cache: "no-store" } : { next: { revalidate: 30 } }),
      signal: AbortSignal.timeout(3500),
    });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    return isDirectory(data) ? data : null;
  } catch {
    return null;
  }
}

export async function loadPilotStars(): Promise<number | null> {
  try {
    const response = await fetch("https://api.github.com/repos/Boring-Software-Inc/Pilot", {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    return isRecord(data) && isInteger(data.stargazers_count, 0) ? data.stargazers_count : null;
  } catch {
    return null;
  }
}
