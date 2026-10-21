import Link from "next/link";
import RequestAccessCta from "@/components/RequestAccessCta";
import { buttonVariants } from "@/components/glaze/ui/button-variants";
import { AppWindow } from "@/components/landing/app-window";
import { Arrow } from "@/components/landing/arrow";
import { AsciiFire } from "@/components/landing/ascii-fire";
import { Ghost } from "@/components/landing/ghost";
import { Row } from "@/components/landing/grid";
import { Lockup } from "@/components/landing/logo";
import { RULES, RuleCard } from "@/components/landing/rule-card";
import { APP } from "@/lib/content";
import { cn } from "@/lib/glaze/utils";

export function Nav() {
  return (
    <Row as="header" plain>
      <nav aria-label="Main" className="flex h-14 items-center justify-between pr-1 pl-4 lg:h-[72px] lg:px-7">
        <Link href="/" aria-label="Tripwire home" className="rounded-tag">
          <Lockup size={22} logoClass="size-[18px] lg:size-[22px]" wordClass="t-word text-text-1" />
        </Link>
        <div className="flex items-center gap-2">
          <a href={APP.login} className="t-nav flex h-11 items-center px-3 text-text-1 lg:h-9">
            <span className="link-draw">Sign in</span>
          </a>
          <span className="only-lg flex">
            <RequestAccessCta size="nav" />
          </span>
        </div>
      </nav>
    </Row>
  );
}

function SignInButton() {
  return (
    <a href={APP.login} className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "btn-xl btn-xl-flat only-lg")}>
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
          <AsciiFire side="l" height={448} seed={11} />
          <AsciiFire side="r" height={448} seed={29} />
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 px-5 pt-14 pb-8 text-center lg:gap-5 lg:px-16 lg:py-28">
        <h1 id="hero-title" className="t-display text-balance text-text-1">
          The firewall for your OSS projects
        </h1>
        <p className="t-lede text-balance text-text-2">Trigger workflows from contributor activity. Filter out the noise.</p>
        <div className="flex gap-2 pt-2 lg:pt-5">
          <RequestAccessCta size="xl" />
          <SignInButton />
        </div>
      </div>
      <div className="only-sm relative flex flex-col items-center px-5 pt-7 pb-12">
        <Ghost size={44} className="absolute top-[-1px] left-[calc(50%+42px)]" />
        <RuleCard rule={RULES.crypto} width={318} compact className="relative" />
      </div>
    </Row>
  );
}

export function Product() {
  return (
    <Row className="only-lg">
      <div className="relative h-[640px] overflow-clip pt-[72px]">
        <Ghost size={80} className="absolute top-5 left-[calc(50%+341px)]" />
        <AppWindow />
      </div>
    </Row>
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
    tone: "text-warn",
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

function Slot({ children }: { children: string }) {
  return <span className="slot h-[26px] text-text-3">{children}</span>;
}

export function Rules() {
  return (
    <Row aria-labelledby="rules-title">
      <div className="flex flex-col lg:flex-row">
        <div className="sticky-copy flex flex-col gap-2 px-5 pt-12 pb-6 lg:w-[420px] lg:shrink-0 lg:gap-3 lg:self-start lg:px-9 lg:py-[72px]">
          <h2 id="rules-title" className="t-section text-text-1">
            Rules you can read
          </h2>
          <p className="t-section-sub text-text-2">Write a rule the way you would say it.</p>
        </div>
        <div className="flex flex-col gap-3 px-5 pb-12 lg:flex-1 lg:border-l lg:border-(--grid) lg:px-9 lg:py-[72px]">
          <div className="card-hover rounded-shell bg-shell p-[3px]">
            <div className="flex flex-col gap-3.5 rounded-panel bg-paper p-5">
              <span className="text-[14px] leading-[21px] font-medium text-text-1">Create rule</span>
              <p className="flex flex-wrap items-center gap-1.5 text-[18px] leading-7 text-text-2">
                <span>Require</span>
                <span>that</span>
                <Slot>field</Slot>
                <Slot>condition</Slot>
                <Slot>value</Slot>
                <span>as</span>
                <span>a</span>
                <span className="flex h-[30px] items-center rounded-[8px] bg-paper px-2 text-text-3 ring-1 ring-line-control">severity</span>
                <span>signal.</span>
              </p>
            </div>
          </div>
          <div className="only-lg flex gap-3">
            <RuleCard rule={RULES.crypto} width={307} hover />
            <RuleCard rule={RULES.age} width={307} hover />
          </div>
        </div>
      </div>
    </Row>
  );
}

const FORGES = [
  {
    name: "GitHub",
    icon: (
      <svg aria-hidden viewBox="0 0 16 16" className="size-[22px] shrink-0 text-text-1 lg:size-6">
        <path
          fill="currentColor"
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
        />
      </svg>
    ),
  },
  {
    name: "GitLab",
    icon: (
      <svg aria-hidden viewBox="466.677 361.395 12.374 12.115" className="size-[22px] shrink-0 text-text-1 lg:size-6">
        <path
          fill="currentColor"
          d="M479.051 366.176l-0.018-0.046-1.742-4.454c-0.035-0.087-0.098-0.161-0.179-0.21-0.082-0.051-0.177-0.075-0.273-0.071-0.096 0.006-0.188 0.04-0.265 0.098-0.074 0.059-0.129 0.139-0.153 0.231l-1.177 3.527h-4.761l-1.176-3.527c-0.025-0.091-0.08-0.171-0.154-0.231-0.075-0.059-0.167-0.093-0.264-0.098-0.097-0.006-0.193 0.019-0.274 0.071-0.082 0.051-0.144 0.124-0.179 0.21l-1.742 4.454-0.017 0.046c-0.516 1.319-0.077 2.812 1.073 3.663l0.015 0.012 2.655 1.946 1.313 0.974 0.8 0.592c0.193 0.143 0.459 0.143 0.651 0l0.798-0.592 1.313-0.974 2.67-1.958c1.149-0.852 1.589-2.344 1.073-3.662Z"
        />
      </svg>
    ),
  },
  {
    name: "OpenGit",
    icon: (
      <svg aria-hidden viewBox="0.49 0 17.019 17" className="size-[22px] shrink-0 text-text-1 lg:size-6">
        <polygon fill="currentColor" points="3.596 2.261 7.272 0.051 14.565 4.481 10.889 6.853 5.049 3.22" />
        <polygon fill="currentColor" fillOpacity="0.725" points="10.879 6.853 14.565 4.481 14.565 13.665 10.879 15.918" />
        <polygon fill="currentColor" fillOpacity="0.9" points="3.518 11.455 6.127 9.796 8.962 11.628 8.973 14.84" />
        <polygon fill="currentColor" fillOpacity="0.55" points="3.527 4.558 6.127 6.239 6.127 9.796 3.507 11.445 3.507 11.003" />
      </svg>
    ),
  },
];

export function Forges() {
  return (
    <Row aria-labelledby="forges-title">
      <div className="flex flex-col gap-2 px-5 pt-12 pb-6 lg:gap-3 lg:px-9 lg:pt-[72px] lg:pb-10">
        <h2 id="forges-title" className="t-section text-text-1">
          Works where your code lives
        </h2>
        <p className="only-lg t-section-sub text-text-2">Connect once on GitHub, GitLab or OpenGit.</p>
      </div>
      <ul className="flex border-t border-(--grid)">
        {FORGES.map((f, i) => (
          <li key={f.name} className={cn("flex flex-1", i > 0 && "border-l border-(--grid)")}>
            <a
              href={APP.login}
              className="cell flex flex-1 flex-col items-center gap-2.5 py-6 focus-visible:outline-offset-[-2px] lg:flex-row lg:gap-3 lg:px-9 lg:py-10"
            >
              {f.icon}
              <span className="t-forge text-text-1">{f.name}</span>
              <Arrow className="forge-arrow only-lg ml-auto text-text-1" />
            </a>
          </li>
        ))}
      </ul>
    </Row>
  );
}

export function ClosingCta() {
  return (
    <Row
      aria-labelledby="cta-title"
      edges={
        <>
          <AsciiFire side="l" height={252} seed={47} />
          <AsciiFire side="r" height={252} seed={83} />
        </>
      }
    >
      <div className="flex flex-col items-center gap-5 px-5 py-14 text-center lg:gap-6 lg:px-9 lg:py-[120px]">
        <Ghost size={104} face="happy" className="only-lg" />
        <h2 id="cta-title" className="t-cta text-text-1">
          Tripwire is in closed beta
        </h2>
        <div className="flex gap-2 lg:pt-2">
          <RequestAccessCta size="xl" />
          <SignInButton />
        </div>
      </div>
    </Row>
  );
}

export function Footer() {
  return (
    <Row as="footer">
      <div className="flex px-5 pt-6 pb-10 lg:px-9 lg:pt-7 lg:pb-14">
        <Lockup size={18} wordClass="text-[14px] leading-4 font-medium tracking-[-0.01em] text-text-1" />
      </div>
    </Row>
  );
}
