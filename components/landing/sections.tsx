import type { ReactNode } from "react";
import Link from "next/link";
import RequestAccessCta from "@/components/RequestAccessCta";
import { buttonVariants } from "@/components/glaze/ui/button-variants";
import { AppWindow, PhoneWindow } from "@/components/landing/app-window";
import { Arrow } from "@/components/landing/arrow";
import { AsciiArt } from "@/components/landing/ascii-art";
import { STAGE_FADE, STAGE_FADE_PHONE } from "@/components/landing/ascii-art-data";
import { AsciiFire, type Peak } from "@/components/landing/ascii-fire";
import { QueuePicture, WorkflowPicture } from "@/components/landing/feature-pictures";
import { Ghost } from "@/components/landing/ghost";
import { Row } from "@/components/landing/grid";
import { HeroTitle } from "@/components/landing/hero-title";
import { Lockup } from "@/components/landing/logo";
import { RuleBuilder } from "@/components/landing/rule-builder";
import { APP } from "@/lib/content";
import { cn } from "@/lib/glaze/utils";

const PEAKS: Record<"heroL" | "heroR" | "ctaL" | "ctaR", Peak[]> = {
  heroL: [[37.29, 0.865, 6.19], [29.36, 0.328, 3.7], [16.85, 0.636, 4.8], [8.52, 0.525, 3.33], [0.49, 0.345, 3.14]],
  heroR: [[36.61, 0.906, 5.42], [24.41, 0.303, 4.01], [12.02, 0.334, 4.16], [1.32, 0.317, 3.64]],
  ctaL: [[37.51, 0.953, 6.9], [27.63, 0.391, 4.88], [15.78, 0.515, 4.02], [7.37, 0.301, 3.61], [-3.15, 0.329, 4.88]],
  ctaR: [[36.87, 0.989, 7.53], [28.58, 0.666, 4.41], [21.33, 0.7, 3.27], [12.5, 0.478, 4.27], [4.75, 0.588, 5.0]],
};

export function Nav() {
  return (
    <Row as="header" plain>
      <nav aria-label="Main" className="flex h-14 items-center justify-between pr-2 pl-4 lg:h-[72px] lg:px-7">
        <Link href="/" aria-label="Tripwire home" className="rounded-tag">
          <Lockup size={22} logoClass="size-[18px] lg:size-[22px]" wordClass="t-word text-text-1" />
        </Link>
        <div className="flex items-center gap-0.5 lg:gap-2">
          <a href={APP.login} data-track="sign_in_click" data-placement="nav" className="t-nav flex h-11 items-center px-2.5 text-text-1 lg:h-9 lg:px-3">
            <span className="link-draw">Sign in</span>
          </a>
          <RequestAccessCta placement="nav" />
        </div>
      </nav>
    </Row>
  );
}

function SignInButton({ placement }: { placement: "hero" | "bottom" }) {
  return (
    <a href={APP.login} data-track="sign_in_click" data-placement={placement} className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "btn-xl btn-xl-flat only-lg")}>
      Sign in
    </a>
  );
}

export function Hero() {
  return (
    <Row
      aria-labelledby="hero-title"
      edges={
        <>
          <AsciiFire side="l" height={448} seed={4} peaks={PEAKS.heroL} embers={3} />
          <AsciiFire side="r" height={448} seed={9} peaks={PEAKS.heroR} embers={3} />
          <AsciiFire side="l" height={308} seed={4} peaks={PEAKS.heroL} embers={1} compact />
          <AsciiFire side="r" height={308} seed={9} peaks={PEAKS.heroR} embers={1} compact />
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 px-5 py-10 text-center lg:gap-5 lg:px-16 lg:py-28">
        <HeroTitle />
        <p className="t-lede text-text-2">
          Tripwire checks every change request against your rules and blocks the junk before you see it.
        </p>
        <div className="flex gap-2 pt-2 lg:pt-5">
          <RequestAccessCta placement="hero" />
          <SignInButton placement="hero" />
        </div>
      </div>
    </Row>
  );
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="t-link flex items-center gap-1.5 text-text-1">
      <span className="link-draw">{children}</span>
      <Arrow className="text-text-1" />
    </a>
  );
}

export function Product() {
  return (
    <Row aria-labelledby="product-title">
      <div className="only-wide relative flex h-[640px] justify-center overflow-clip px-4 pt-[72px] lg:px-0">
        <div className="relative w-full max-w-[960px]">
          <Ghost size={71} className="absolute -top-[65px] right-[113.4px]" />
          <AppWindow />
        </div>
        <div className="stage-fade pointer-events-none absolute inset-x-0 bottom-0 flex h-[160px] justify-center overflow-hidden">
          <AsciiArt art={STAGE_FADE} className="shrink-0" />
        </div>
      </div>
      <div className="only-narrow relative flex h-[480px] justify-center overflow-clip pt-14">
        <Ghost size={50} className="absolute top-[13px] left-[calc(50%+75.2px)]" />
        <PhoneWindow />
        <div className="stage-fade pointer-events-none absolute inset-x-0 bottom-0 flex h-[112px] justify-center overflow-hidden">
          <AsciiArt art={STAGE_FADE_PHONE} className="shrink-0" />
          <AsciiArt art={STAGE_FADE_PHONE} className="absolute right-[calc(50%+178px)] bottom-0" />
          <AsciiArt art={STAGE_FADE_PHONE} className="absolute bottom-0 left-[calc(50%+178px)]" />
        </div>
      </div>
      <div className="flex flex-col items-start gap-2.5 border-t border-(--grid) px-5 pt-6 pb-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-6 lg:pt-8">
        <h2 id="product-title" className="t-caption text-text-1">
          One place for every rule
        </h2>
        <div className="flex flex-col items-start gap-2.5 lg:w-[400px] lg:shrink-0 lg:gap-3.5">
          <p className="t-body text-text-2">See what each rule caught today, then turn it off with one switch.</p>
          <div className="pt-1 lg:pt-0">
            <TextLink href={APP.login}>Open the demo</TextLink>
          </div>
        </div>
      </div>
    </Row>
  );
}

const FEATURES = [
  {
    title: "When this happens, do that",
    body: "Label, comment, close or ask a maintainer, based on what a contributor does.",
    link: "See workflows",
    Picture: WorkflowPicture,
  },
  {
    title: "You only see the maybes",
    body: "Obvious junk is blocked on its own. The unsure ones wait for your call.",
    link: "See the queue",
    Picture: QueuePicture,
  },
];

function FeatureCaption({ feature, phone }: { feature: (typeof FEATURES)[number]; phone: boolean }) {
  return (
    <div className={cn("flex flex-col items-start", phone ? "gap-2.5 px-5 pt-6 pb-10" : "gap-3 px-5 pt-7 pb-11")}>
      <h2 className="t-feature text-text-1">{feature.title}</h2>
      <p className="t-body max-w-[400px] text-text-2">{feature.body}</p>
      <div className={phone ? "pt-1" : "pt-1.5"}>
        <TextLink href={APP.login}>{feature.link}</TextLink>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <>
      <Row className="only-lg">
        <div className="flex">
          {FEATURES.map((f, i) => (
            <article key={f.title} className={cn("flex min-w-0 flex-1 flex-col", i === 0 && "border-r border-(--grid)")}>
              <f.Picture />
              <FeatureCaption feature={f} phone={false} />
            </article>
          ))}
        </div>
      </Row>
      {FEATURES.map((f) => (
        <Row key={f.title} className="only-sm">
          <article className="flex min-w-0 flex-col">
            <f.Picture phone />
            <FeatureCaption feature={f} phone />
          </article>
        </Row>
      ))}
    </>
  );
}

const OUTCOMES = [
  {
    title: "Blocked",
    wide: "Tripwire stops the merge and tells the contributor how to fix it.",
    narrow: "The merge stops. The contributor sees how to fix it.",
    tone: "text-fail",
    mark: <path d="M5.8 5.8l4.4 4.4M10.2 5.8l-4.4 4.4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />,
  },
  {
    title: "Sent to review",
    wide: "It waits in your queue until a maintainer approves or blocks it.",
    narrow: "It waits until a maintainer decides.",
    tone: "text-[color-mix(in_srgb,var(--ink)_70%,transparent)]",
    mark: <path d="M8 4.8v3.4l2.2 1.4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />,
  },
  {
    title: "Passed",
    wide: "Nothing changes. It reaches you like any other change request.",
    narrow: "It reaches you like any other change request.",
    tone: "text-ok",
    mark: <path d="M5.3 8.2l1.9 1.9 3.5-3.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

export function Outcomes() {
  return (
    <Row aria-labelledby="outcomes-title">
      <div className="px-5 pt-12 pb-6 lg:px-9 lg:pt-[72px] lg:pb-10">
        <h2 id="outcomes-title" className="t-section text-text-1">
          Every change request gets an answer
        </h2>
      </div>
      <ul className="flex flex-col border-t border-(--grid) pb-2 lg:flex-row lg:pb-0">
        {OUTCOMES.map((o, i) => (
          <li
            key={o.title}
            className={cn(
              "cell flex gap-3 px-5 py-4 lg:flex-1 lg:flex-col lg:px-9 lg:py-12",
              i > 0 && "border-t border-(--grid) lg:border-t-0 lg:border-l",
            )}
          >
            <svg aria-hidden viewBox="0 0 16 16" className={cn("mt-0.5 size-[18px] shrink-0 lg:mt-0 lg:size-5", o.tone)}>
              <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              {o.mark}
            </svg>
            <div className="flex flex-col gap-0.5 lg:gap-3">
              <h3 className="t-cell-title text-text-1 lg:pt-1">{o.title}</h3>
              <p className="t-cell-body text-text-2">
                <span className="lg:hidden">{o.narrow}</span>
                <span className="max-lg:hidden">{o.wide}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Row>
  );
}

export function Rules() {
  return (
    <Row aria-labelledby="rules-title">
      <div className="flex flex-col lg:flex-row">
        <div className="sticky-copy flex flex-col gap-2 px-5 pt-12 pb-6 lg:w-[33%] lg:shrink-0 xl:w-[37.6%] lg:gap-3 lg:self-start lg:px-9 lg:py-[72px]">
          <h2 id="rules-title" className="t-section text-text-1">
            Rules you can read
          </h2>
          <p className="t-section-sub text-text-2">Write a rule the way you would say it.</p>
        </div>
        <div className="flex flex-col gap-3 px-5 pb-12 lg:min-w-0 lg:flex-1 lg:py-[72px] lg:pr-9 lg:pl-0">
          <RuleBuilder />
        </div>
      </div>
    </Row>
  );
}

export function Forges() {
  return (
    <Row aria-labelledby="forges-title">
      <div className="flex flex-col gap-2 px-5 py-12 lg:gap-3 lg:px-9 lg:py-[72px]">
        <h2 id="forges-title" className="t-section text-text-1">
          Works on GitHub
        </h2>
        <p className="t-section-sub text-text-2">Install the app once, then pick the repos it should watch.</p>
      </div>
    </Row>
  );
}

export function ClosingCta() {
  return (
    <Row
      aria-labelledby="cta-title"
      edges={
        <>
          <AsciiFire side="l" height={252} seed={21} peaks={PEAKS.ctaL} embers={3} />
          <AsciiFire side="r" height={252} seed={25} peaks={PEAKS.ctaR} embers={3} />
          <AsciiFire side="l" height={210} seed={21} peaks={PEAKS.ctaL} embers={1} compact />
          <AsciiFire side="r" height={210} seed={25} peaks={PEAKS.ctaR} embers={1} compact />
        </>
      }
    >
      <div className="flex flex-col items-center gap-5 px-5 py-14 text-center lg:gap-6 lg:px-9 lg:py-[120px]">
        <Ghost size={92} face="happy" className="only-lg my-1.5" />
        <h2 id="cta-title" className="t-cta text-text-1">
          Tripwire is in closed beta
        </h2>
        <div className="flex gap-2 lg:pt-2">
          <RequestAccessCta placement="bottom" />
          <SignInButton placement="bottom" />
        </div>
      </div>
    </Row>
  );
}

export function Footer() {
  return (
    <Row as="footer">
      <div className="flex flex-col gap-3 px-5 pt-6 pb-10 lg:flex-row lg:items-center lg:justify-between lg:px-9 lg:pt-7 lg:pb-14">
        <Lockup size={18} wordClass="text-[14px] leading-4 font-medium tracking-[-0.01em] text-text-1" />
        <p className="type-caption text-text-2">
          © 2026{" "}
          <a href="https://boringsoftware.net" className="text-text-2 hover:text-text-1">
            <span className="link-draw">Boring Software, Inc.</span>
          </a>
        </p>
      </div>
    </Row>
  );
}
