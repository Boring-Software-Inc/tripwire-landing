"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Popover } from "@base-ui/react/popover";
import RequestAccessCta from "@/components/RequestAccessCta";
import { Lockup } from "@/components/landing/logo";
import { Row } from "@/components/landing/grid";
import { APP } from "@/lib/content";
import { useGlazePortal } from "@/lib/glaze/portal";

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
const products = [
  { title: "Gatekeeper", description: "Evaluate every contribution against composable rules", href: "#rules-title", icon: "M4 12h16M12 4v16" },
  { title: "Workflows", description: "Connect rules, gates, human review, and actions", href: "#workflows", icon: "M5 6h5v5H5z M14 13h5v5h-5z M10 8h4v7" },
  { title: "Human review", description: "Route uncertain contributions to maintainers", href: "#outcomes-title", icon: "M4 6h16v12H4z M8 10h8 M8 14h5" },
  { title: "Runs", description: "Trace each decision, signal, and forge action", href: APP.login, icon: "M6 4h12v16H6z M9 8h6M9 12h6M9 16h4" },
];
const developers = [
  { title: "MCP server", description: "Connect agents to Tripwire context and actions", href: "https://www.npmjs.com/package/@tripwire-sh/cli", icon: "M5 8h4l3 4 3-3h4 M5 16h4l3-4 3 3h4" },
  { title: "CLI", description: "Set up agents and manage Tripwire from the terminal", href: "https://www.npmjs.com/package/@tripwire-sh/cli", icon: "M5 7l5 5-5 5 M12 17h7" },
  { title: "TypeScript SDK", description: "Author typed workflows in your repository", href: "https://www.npmjs.com/package/@tripwire-sh/sdk", icon: "M8 5H5v14h3 M16 5h3v14h-3 M10 9l-2 3 2 3 M14 9l2 3-2 3" },
];
const resources = [
  { title: "GitHub", href: github },
  { title: "Dither Kit", href: "/dither-kit" },
];

function Mark({ path, size = 24 }: { path: string; size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
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

function MenuGroup({ title, items, onNavigate }: {
  title: string;
  items: typeof products;
  onNavigate: () => void;
}) {
  return (
    <>
      <p className="lander-menu-label">{title}</p>
      <ul>
        {items.map((item) => (
          <li key={item.title}>
            <a className="lander-menu-item" href={item.href} onClick={onNavigate}>
              <Mark path={item.icon} />
              <span><strong>{item.title}</strong><small>{item.description}</small></span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

function PilotLink({ href, onNavigate }: { href: string; onNavigate: () => void }) {
  return (
    <a className="lander-menu-item lander-pilot-link" href={href} onClick={onNavigate}>
      <span><strong>Tripwire Pilot</strong><small>Public GitHub spam reports, reviewed by maintainers.</small></span>
      <Mark path="M5 12h14m-5-5 5 5-5 5" size={15} />
    </a>
  );
}

function ResourceLinks({ onNavigate }: { onNavigate: () => void }) {
  return resources.map(({ title, href }) => <a key={title} href={href} onClick={onNavigate}>{title}</a>);
}

export function Nav() {
  const portal = useGlazePortal();
  const pilot = useSyncExternalStore(subscribeToHost, getPilotHref, () => configuredPilot);
  const [menu, setMenu] = useState<"products" | "resources" | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const drawer = useRef<HTMLDialogElement>(null);
  const drawerTrigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const resourcesTrigger = useRef<HTMLButtonElement>(null);
  const closeMenu = () => setMenu(null);
  const closeDrawer = () => drawer.current?.close();

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const syncViewport = () => {
      if (desktop.matches) drawer.current?.close();
      else setMenu(null);
    };
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) {
        setMenu((current) => current === "resources" ? null : current);
      }
    };
    desktop.addEventListener("change", syncViewport);
    document.addEventListener("pointerdown", dismiss);
    return () => {
      desktop.removeEventListener("change", syncViewport);
      document.removeEventListener("pointerdown", dismiss);
    };
  }, []);

  return (
    <Row as="header" plain className="lander-nav-row">
      <nav
        ref={header}
        aria-label="Main"
        className="lander-nav-bar"
        onKeyDown={(event) => {
          if (event.key !== "Escape" || menu !== "resources") return;
          event.stopPropagation();
          resourcesTrigger.current?.focus();
          closeMenu();
        }}
      >
        <Brand />
        <div className="lander-nav-desktop">
          <Popover.Root open={menu === "products"} onOpenChange={(open) => setMenu((current) => open ? "products" : current === "products" ? null : current)}>
            <Popover.Trigger type="button">
              Products <Mark path="m6 9 6 6 6-6" size={12} />
            </Popover.Trigger>
            <Popover.Portal container={portal}>
              <Popover.Backdrop className="lander-menu-backdrop" onClick={closeMenu} />
              <Popover.Positioner
                anchor={header}
                side="bottom"
                align="start"
                collisionAvoidance={{ side: "none", align: "none" }}
                className="lander-mega-positioner"
              >
                <Popover.Popup aria-label="Products" initialFocus={false} className="lander-mega-menu">
                    <section><MenuGroup title="Products" items={products} onNavigate={closeMenu} /></section>
                    <section>
                      <MenuGroup title="Build with Tripwire" items={developers} onNavigate={closeMenu} />
                      <a className="lander-menu-item lander-menu-docs" href={docs} onClick={closeMenu}>
                        Documentation <Mark path="M5 12h14m-5-5 5 5-5 5" size={15} />
                      </a>
                    </section>
                    <section>
                      <p className="lander-menu-label">Featured</p>
                      <a className="lander-pilot-art" href={pilot} onClick={closeMenu} tabIndex={-1} aria-hidden="true">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/pilot-menu-preview.png" alt="" width={812} height={558} />
                      </a>
                      <PilotLink href={pilot} onNavigate={closeMenu} />
                    </section>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
          <div className="lander-resources">
            <button type="button" ref={resourcesTrigger} aria-expanded={menu === "resources"} aria-controls="lander-resources" onClick={() => setMenu(menu === "resources" ? null : "resources")}>
              Resources <Mark path="m6 9 6 6 6-6" size={12} />
            </button>
            <div id="lander-resources" className="lander-resources-popover" hidden={menu !== "resources"}>
              <ResourceLinks onNavigate={closeMenu} />
            </div>
          </div>
          <span aria-disabled="true">Pricing</span>
          <a href={docs}>Docs</a>
          <span aria-disabled="true">Blog</span>
        </div>
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
          <MenuGroup title="Products" items={products} onNavigate={closeDrawer} />
          <MenuGroup title="Build with Tripwire" items={developers} onNavigate={closeDrawer} />
          <PilotLink href={pilot} onNavigate={closeDrawer} />
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
