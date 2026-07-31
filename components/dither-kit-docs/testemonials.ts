/** First-party testimonials — each one links back to the original X post so
 * the claim is verifiable. Order here is the order in the rail.
 *
 * Media lives in `public/testimonials/`, pulled from the post itself and
 * re-encoded for a 250px card: posters as 640px webp, video as 640px h264 with
 * the audio track stripped (the cards play muted on hover). To add one:
 *
 *   node scripts/fetch-testimonial.mjs <x-post-url> [slug]
 *
 * which fetches the author, avatar, caption and media, and prints the entry to
 * paste in below. Pass an explicit slug when one author appears twice.
 */

export type Testimonial = {
  /** Permalink to the original X post. */
  tweet: string
  /** X handle, without the leading `@`. */
  author: string
  /** The post text, trimmed to the line that carries it. */
  caption: string
  /** Still from the post. Doubles as the poster frame when `video` is set. */
  image: string
  /** Author avatar. Omit to fall back to a DitherAvatar seeded from `author`. */
  avatar?: string
  /** Muted clip, played on hover. Omit for photo posts. */
  video?: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    tweet: "https://x.com/lewiscarhart/status/2083325959889928212",
    author: "lewiscarhart",
    // Post opens on the $80k HubSpot quote that prompted the build — trimmed
    // past it to the line that's the testimonial.
    caption: "charts beautified with dither-kit (@grimcodes)",
    image: "/testimonials/lewiscarhart-post.webp",
    avatar: "/testimonials/lewiscarhart-avatar.webp",
    video: "/testimonials/lewiscarhart-post.mp4",
  },
  {
    tweet: "https://x.com/marclou/status/2080998264476938266",
    author: "marclou",
    caption:
      "The masculine urge to redesign TrustMRR's chart with this gorgeous library",
    image: "/testimonials/marclou-post.webp",
    avatar: "/testimonials/marclou-avatar.webp",
    video: "/testimonials/marclou-post.mp4",
  },
  {
    tweet: "https://x.com/pontusab/status/2077767397206053343",
    author: "pontusab",
    // Thread opener — trimmed past the "🧵" to the line that's the testimonial.
    caption:
      "You can't go wrong with Geist Pixel and Dieter graphs when talking about tokens.",
    image: "/testimonials/pontusab-post.webp",
    avatar: "/testimonials/pontusab-avatar.webp",
    video: "/testimonials/pontusab-post.mp4",
  },
  {
    tweet: "https://x.com/ParssaKyanzadeh/status/2076133911575290357",
    author: "ParssaKyanzadeh",
    caption: "sooo nice, internal tools have never looked better ty",
    image: "/testimonials/parssa-post.webp",
    avatar: "/testimonials/parssa-avatar.webp",
    video: "/testimonials/parssa-post.mp4",
  },
  {
    tweet: "https://x.com/ramonpiano_/status/2076765754590941693",
    author: "ramonpiano_",
    caption: "dither-kit x lumakeys — insane library @grimcodes",
    image: "/testimonials/ramon-post.webp",
    avatar: "/testimonials/ramon-avatar.webp",
    video: "/testimonials/ramon-post.mp4",
  },
  {
    tweet: "https://x.com/theCTO/status/2075781610767786485",
    author: "theCTO",
    caption: "played around with this and loving this style! great work!",
    image: "/testimonials/thecto-post.webp",
    avatar: "/testimonials/thecto-avatar.webp",
  },
  {
    tweet: "https://x.com/areus/status/2078575612193865914",
    author: "areus",
    caption:
      "It's been fun using this as a springboard. Started logging my rowing data. The heartrate pulses match whatever the selected value is.",
    image: "/testimonials/areus-post.webp",
    avatar: "/testimonials/areus-avatar.webp",
    video: "/testimonials/areus-post.mp4",
  },
  {
    tweet: "https://x.com/eugenezelenkov/status/2076929348310098329",
    author: "eugenezelenkov",
    caption: "just added a stats page using dither-kit to my app and it looks so cool 🙏",
    image: "/testimonials/eugenezelenkov-post.webp",
    avatar: "/testimonials/eugenezelenkov-avatar.webp",
  },
  {
    tweet: "https://x.com/snapsnocaps/status/2076153707939438983",
    author: "snapsnocaps",
    caption:
      "An upgrade to the @earlydotgold market page visuals — powered by dither-kit! Aligned perfectly with the branding here.",
    image: "/testimonials/snapsnocaps-post.webp",
    avatar: "/testimonials/snapsnocaps-avatar.webp",
  },
  {
    tweet: "https://x.com/uAghazadae/status/2076463713599537634",
    author: "uAghazadae",
    caption: "its just perfect 👌🏼 @grimcodes",
    image: "/testimonials/uaghazadae-post.webp",
    avatar: "/testimonials/uaghazadae-avatar.webp",
    video: "/testimonials/uaghazadae-post.mp4",
  },
  {
    tweet: "https://x.com/sarangpratham_/status/2078886868184351191",
    author: "sarangpratham_",
    caption:
      "I've been using dither-kit for one my side-projects and its absolutely stunning. @grimcodes 🥂",
    image: "/testimonials/sarangpratham-post.webp",
    avatar: "/testimonials/sarangpratham-avatar.webp",
  },
  {
    tweet: "https://x.com/xzcendence/status/2076890156917735468",
    author: "xzcendence",
    caption:
      "pretty neat ngl, used it for a little web ui to turn off my AWS remote dev box when i'm not using it",
    image: "/testimonials/xzcendence-post.webp",
    avatar: "/testimonials/xzcendence-avatar.webp",
  },
  {
    tweet: "https://x.com/eugenezelenkov/status/2079055811364671664",
    author: "eugenezelenkov",
    caption:
      "Updated one of my projects internal dashboards with dither-kit feels so hot 💦",
    image: "/testimonials/eugenezelenkov-2-post.webp",
    avatar: "/testimonials/eugenezelenkov-2-avatar.webp",
  },
  {
    tweet: "https://x.com/ryadi_os/status/2076648076593508662",
    author: "ryadi_os",
    caption: "I had to try out these, so just made this analytics page",
    image: "/testimonials/ryadi-os-post.webp",
    avatar: "/testimonials/ryadi-os-avatar.webp",
  },
  {
    tweet: "https://x.com/AntipartyGG/status/2076870838264246500",
    author: "AntipartyGG",
    caption: "yeah this is sexy icl",
    image: "/testimonials/antipartygg-post.webp",
    avatar: "/testimonials/antipartygg-avatar.webp",
  },
  {
    tweet: "https://x.com/realchriswilder/status/2079329709595263322",
    author: "realchriswilder",
    caption: "Loving it actually @grimcodes",
    image: "/testimonials/realchriswilder-post.webp",
    avatar: "/testimonials/realchriswilder-avatar.webp",
  },
]
