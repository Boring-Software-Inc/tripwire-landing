#!/usr/bin/env node
/**
 * Pull a testimonial's author, avatar, and media straight from an X post URL,
 * re-encode everything for the 250px card, and print the `Testimonial` entry to
 * paste into `components/dither-kit-docs/testemonials.ts`.
 *
 *   node scripts/fetch-testimonial.mjs https://x.com/marclou/status/2080998264476938266 [slug]
 *
 * X's own API needs a paid key for this, so metadata comes from fxtwitter — a
 * public read-only mirror of the embed data. Media is then downloaded straight
 * from twimg and re-encoded locally, so the site never hot-links X.
 *
 * Requires `cwebp` (brew install webp) and `ffmpeg` (brew install ffmpeg).
 */

import { execFileSync } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"

const OUT_DIR = path.join(process.cwd(), "public", "testimonials")

// Card media box is 242×170 CSS px; 640px wide covers it at 2x with headroom.
const MEDIA_WIDTH = 640
const AVATAR_PX = 96

const [, , url, slugArg] = process.argv
if (!url) {
  console.error("usage: node scripts/fetch-testimonial.mjs <x-post-url> [slug]")
  process.exit(1)
}

const id = url.match(/status\/(\d+)/)?.[1]
if (!id) {
  console.error(`Not an X post URL (expected .../status/<id>): ${url}`)
  process.exit(1)
}

const res = await fetch(`https://api.fxtwitter.com/i/status/${id}`)
if (!res.ok) {
  console.error(`fxtwitter returned ${res.status} for ${id}`)
  process.exit(1)
}
const { tweet } = await res.json()
if (!tweet) {
  console.error(`No tweet payload for ${id} — is the post public?`)
  process.exit(1)
}

const author = tweet.author.screen_name
const slug = (slugArg ?? author).toLowerCase().replace(/[^a-z0-9]+/g, "-")
const media = tweet.media?.all?.[0]
if (!media) {
  console.error(`Post ${id} has no photo or video attached.`)
  process.exit(1)
}

const tmp = path.join(tmpdir(), `testimonial-${slug}`)
mkdirSync(tmp, { recursive: true })
mkdirSync(OUT_DIR, { recursive: true })

const run = (cmd, args) => execFileSync(cmd, args, { stdio: "inherit" })

async function download(src, dest) {
  const r = await fetch(src)
  if (!r.ok) throw new Error(`${r.status} fetching ${src}`)
  writeFileSync(dest, Buffer.from(await r.arrayBuffer()))
  return dest
}

// --- avatar. `_400x400` is the largest square X serves for profile images.
const avatarSrc = tweet.author.avatar_url.replace(
  /_(normal|bigger|200x200)\./,
  "_400x400."
)
const avatarRaw = await download(avatarSrc, path.join(tmp, "avatar.jpg"))
run("cwebp", [
  "-quiet",
  "-q",
  "85",
  "-resize",
  String(AVATAR_PX),
  String(AVATAR_PX),
  avatarRaw,
  "-o",
  path.join(OUT_DIR, `${slug}-avatar.webp`),
])

// --- poster still. Videos carry a thumbnail; photos are their own poster.
const posterSrc =
  media.type === "video"
    ? media.thumbnail_url
    : media.url.replace(/\?name=\w+$/, "?name=orig")
const posterRaw = await download(posterSrc, path.join(tmp, "poster.jpg"))
run("cwebp", [
  "-quiet",
  "-q",
  "80",
  "-resize",
  String(MEDIA_WIDTH),
  "0",
  posterRaw,
  "-o",
  path.join(OUT_DIR, `${slug}-post.webp`),
])

// --- video, when there is one. Re-encoding beats X's own low tiers at our
// size, but pulling their 4K rendition to make a 640px file is a waste — take
// the smallest one that still has pixels to spare (>= 2x our output width).
let hasVideo = false
if (media.type === "video") {
  const widthOf = (f) => Number(f.url.match(/\/(\d+)x\d+\//)?.[1] ?? 0)
  const mp4s = (media.formats ?? [])
    .filter((f) => f.container === "mp4")
    .sort((a, b) => widthOf(a) - widthOf(b))
  const best =
    mp4s.find((f) => widthOf(f) >= MEDIA_WIDTH * 2) ?? mp4s.at(-1)
  const videoRaw = await download(
    best?.url ?? media.url,
    path.join(tmp, "clip.mp4")
  )
  run("ffmpeg", [
    "-y",
    "-loglevel",
    "error",
    "-i",
    videoRaw,
    "-an", // cards play muted — the audio track is dead weight
    "-vf",
    `scale=${MEDIA_WIDTH}:-2`,
    "-c:v",
    "libx264",
    "-crf",
    "30",
    "-preset",
    "slow",
    "-profile:v",
    "high",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart", // start playing before the whole file lands
    path.join(OUT_DIR, `${slug}-post.mp4`),
  ])
  hasVideo = true
}

const caption = tweet.text.replace(/\s*\n\s*/g, " ").trim()
console.log(`
Add to components/dither-kit-docs/testemonials.ts:

  {
    tweet: ${JSON.stringify(tweet.url)},
    author: ${JSON.stringify(author)},
    caption: ${JSON.stringify(caption)},
    image: "/testimonials/${slug}-post.webp",
    avatar: "/testimonials/${slug}-avatar.webp",${
      hasVideo ? `\n    video: "/testimonials/${slug}-post.mp4",` : ""
    }
  },
`)
