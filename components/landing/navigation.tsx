"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ComponentProps } from "react";
import Link from "next/link";
import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { DesktopNavigation } from "@/components/landing/desktop-navigation";
import RequestAccessCta from "@/components/RequestAccessCta";
import { Lockup } from "@/components/landing/logo";
import { Row } from "@/components/landing/grid";
import { APP } from "@/lib/content";

const github = "https://github.com/Boring-Software-Inc/tripwire";
const docs = `${github}#readme`;
const stagingPilot = "https://staging.tripwire.sh/pilot";
const configuredPilot = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
  ? stagingPilot
  : `${APP.home}/pilot`;

function getPilotHref() {
  return window.location.hostname === "tripwire-landing-preview-tripwire.unkey.app"
    ? stagingPilot
    : configuredPilot;
}

function subscribeToHost() {
  return () => {};
}
type MenuItem = { title: string; description: string; href: string; icon: string; iconViewSize?: number };

const products: MenuItem[] = [
  { title: "Gatekeeper", description: "Evaluate every contribution against composable rules", href: "#rules-title", icon: "M3.334 10h13.332M10 3.334v13.332", iconViewSize: 20 },
  { title: "Workflows", description: "Connect rules, gates, human review, and actions", href: "#workflows", icon: "M4.166 5h4.168v4.167H4.166zM11.666 10.834h4.168v4.166h-4.168zM8.334 6.667h3.332v5.833", iconViewSize: 20 },
  { title: "Human review", description: "Route uncertain contributions to maintainers", href: "#outcomes-title", icon: "M3.334 5h13.332v10H3.334zM6.666 8.334h6.668M6.666 11.666h4.168", iconViewSize: 20 },
  { title: "Runs", description: "Trace each decision, signal, and forge action", href: APP.login, icon: "M5 3.334h10v13.332H5zM7.5 7.5h5M7.5 10.834h5M7.5 14.166h3.334", iconViewSize: 20 },
];
const developers: MenuItem[] = [
  { title: "MCP server", description: "Connect agents to Tripwire context and actions", href: "https://www.npmjs.com/package/@tripwire-sh/cli", icon: "M5 8h4l3 4 3-3h4 M5 16h4l3-4 3 3h4" },
  { title: "CLI", description: "Set up agents and manage Tripwire from the terminal", href: "https://www.npmjs.com/package/@tripwire-sh/cli", icon: "M5 7l5 5-5 5 M12 17h7" },
  { title: "TypeScript SDK", description: "Author typed workflows in your repository", href: "https://www.npmjs.com/package/@tripwire-sh/sdk", icon: "M8 5H5v14h3 M16 5h3v14h-3 M10 9l-2 3 2 3 M14 9l2 3-2 3" },
];
const resources = [
  { title: "GitHub", href: github },
  { title: "Dither Kit", href: "/dither-kit" },
];

function Mark({ path, size = 24, viewSize = 24, strokeWidth = 1.6 }: { path: string; size?: number; viewSize?: number; strokeWidth?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox={`0 0 ${viewSize} ${viewSize}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
      <path d={path} />
    </svg>
  );
}

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" aria-label="Tripwire home" className="rounded-tag" onClick={onClick}>
      <Lockup size={22} logoClass="size-[22px]" wordClass="t-word text-text-1" />
    </Link>
  );
}

function AccountActions() {
  return (
    <div className="lander-nav-actions">
      <a href={APP.login} data-track="sign_in_click" data-placement="nav" className="t-nav flex h-11 items-center px-3 text-text-1 lg:h-9">
        <span className="link-draw">Sign in</span>
      </a>
      <RequestAccessCta placement="nav" />
    </div>
  );
}

function MenuLink({ onClick, ...props }: ComponentProps<"a">) {
  return onClick ? <a onClick={onClick} {...props} /> : <NavigationMenu.Link closeOnClick {...props} />;
}

function MenuGroup({ title, items, onNavigate }: {
  title: string;
  items: MenuItem[];
  onNavigate?: () => void;
}) {
  return (
    <>
      <p className="lander-menu-label">{title}</p>
      <ul>
        {items.map((item) => (
          <li key={item.title}>
            <MenuLink className="lander-menu-item" href={item.href} onClick={onNavigate}>
              <span className="lander-menu-icon">
                <Mark
                  path={item.icon}
                  size={item.iconViewSize ?? 22}
                  viewSize={item.iconViewSize}
                  strokeWidth={item.iconViewSize ? 1.6 : 1.5}
                />
              </span>
              <span className="lander-menu-copy"><strong>{item.title}</strong><small>{item.description}</small></span>
            </MenuLink>
          </li>
        ))}
      </ul>
    </>
  );
}

function MenuDocs() {
  return (
    <MenuLink className="lander-menu-item lander-menu-docs" href={docs}>
      Documentation <Mark path="M3 7h8M8 4l3 3-3 3" size={14} viewSize={14} strokeWidth={1.4} />
    </MenuLink>
  );
}

function ProductsPanel({ pilot }: { pilot: string }) {
  return (
    <div className="lander-mega-menu">
      <section>
        <MenuGroup title="Products" items={products} />
        <MenuDocs />
      </section>
      <section>
        <MenuGroup title="Build with Tripwire" items={developers} />
        <MenuDocs />
      </section>
      <section>
        <p className="lander-menu-label">Featured</p>
        <MenuLink className="lander-pilot-art" href={pilot} tabIndex={-1} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lander-pilot-light" src="/pilot-menu-preview.png" alt="" width={812} height={558} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lander-pilot-dark" src="/pilot-menu-preview-dark.jpg" alt="" width={812} height={558} />
        </MenuLink>
        <MenuLink className="lander-menu-item lander-pilot-link" href={pilot}>
          <span><strong>Tripwire Pilot</strong><small>Public GitHub spam reports, reviewed by maintainers.</small></span>
          <Mark path="M5 12h14m-5-5 5 5-5 5" size={15} />
        </MenuLink>
      </section>
    </div>
  );
}

function ResourceLinks({ onNavigate }: { onNavigate?: () => void }) {
  return resources.map(({ title, href }) => <MenuLink key={title} href={href} onClick={onNavigate}>{title}</MenuLink>);
}

function ResourcesPanel() {
  return (
    <div className="lander-mega-menu lander-mega-resources">
      <section aria-label="Resources">
        <ResourceLinks />
      </section>
    </div>
  );
}

export function Nav() {
  const pilot = useSyncExternalStore(subscribeToHost, getPilotHref, () => configuredPilot);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawer = useRef<HTMLDialogElement>(null);
  const drawerTrigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const closeDrawer = () => drawer.current?.close();

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) drawer.current?.close();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <Row as="header" plain className="lander-nav-row">
      <nav aria-label="Main" className="lander-nav-bar">
        <Brand />
        <DesktopNavigation
          products={<ProductsPanel pilot={pilot} />}
          resources={<ResourcesPanel />}
          docsHref={docs}
        />
        <div className="lander-desktop-actions"><AccountActions /></div>
        <button
          ref={drawerTrigger}
          type="button"
          className="lander-mobile-trigger"
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          aria-controls="lander-mobile-drawer"
          onClick={() => {
            drawer.current?.showModal();
            setDrawerOpen(true);
            closeButton.current?.focus();
          }}
        >
          <Mark path="M4 7h16M4 12h16M4 17h16" size={22} />
        </button>
      </nav>
      <dialog
        ref={drawer}
        id="lander-mobile-drawer"
        className="lander-mobile-drawer"
        aria-label="Main menu"
        onClose={() => {
          setDrawerOpen(false);
          if (!window.matchMedia("(min-width: 1024px)").matches) drawerTrigger.current?.focus({ preventScroll: true });
        }}
      >
        <div className="lander-drawer-header">
          <Brand onClick={closeDrawer} />
          <button ref={closeButton} type="button" className="lander-mobile-trigger" aria-label="Close menu" onClick={closeDrawer}>
            <Mark path="M6 6l12 12M18 6 6 18" size={22} />
          </button>
        </div>
        <nav aria-label="Mobile" className="lander-drawer-links">
          <MenuGroup
            title="Products"
            items={[
              ...products,
              {
                title: "Pilot",
                description: "Public GitHub spam reports, reviewed by maintainers.",
                href: pilot,
                icon: "M12 3l7 3v5c0 4-2.8 7.4-7 10-4.2-2.6-7-6-7-10V6l7-3z M9 12l2 2 4-4",
              },
            ]}
            onNavigate={closeDrawer}
          />
          <MenuGroup title="Build with Tripwire" items={developers} onNavigate={closeDrawer} />
          <div className="lander-drawer-secondary">
            <details><summary>Resources</summary><ResourceLinks onNavigate={closeDrawer} /></details>
            <span aria-disabled="true">Pricing</span>
            <a href={docs} onClick={closeDrawer}>Docs</a>
            <span aria-disabled="true">Blog</span>
          </div>
        </nav>
        <div className="lander-drawer-footer"><AccountActions /></div>
      </dialog>
    </Row>
  );
}
