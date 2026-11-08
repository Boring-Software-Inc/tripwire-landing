"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { AsciiFire, type Peak } from "@/components/landing/ascii-fire";
import { useGlazePortal } from "@/lib/glaze/portal";

type MenuValue = "products" | "resources";

const MENU_FIRE_PEAKS: readonly Peak[] = [[36, 0.66, 5], [27, 0.33, 5]];

function DesktopMenuItem({ value, label, active, children }: {
  value: MenuValue;
  label: string;
  active: boolean;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <NavigationMenu.Item value={value}>
      <NavigationMenu.Trigger className="lander-nav-trigger">
        {label}
        <NavigationMenu.Icon className="lander-nav-chevron">
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </NavigationMenu.Icon>
        {active && (
          <motion.span
            aria-hidden="true"
            className="lander-nav-indicator"
            layoutId={reduceMotion ? undefined : "active-trigger"}
            transition={{ type: "spring", stiffness: 350, damping: 32 }}
          />
        )}
      </NavigationMenu.Trigger>
      <NavigationMenu.Content className="lander-menu-panel">
        {children}
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  );
}

export function DesktopNavigation({ products, resources, docsHref }: {
  products: ReactNode;
  resources: ReactNode;
  docsHref: string;
}) {
  const portal = useGlazePortal();
  const anchor = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<MenuValue | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeBelowDesktop = () => {
      if (!desktop.matches) setActive(null);
    };
    desktop.addEventListener("change", closeBelowDesktop);
    return () => desktop.removeEventListener("change", closeBelowDesktop);
  }, []);

  return (
    <NavigationMenu.Root<MenuValue>
      render={<div />}
      className="lander-nav-desktop"
      value={active}
      onValueChange={setActive}
      delay={0}
      closeDelay={180}
    >
      <span ref={anchor} className="lander-mega-anchor" aria-hidden="true" />
      <LayoutGroup>
        <NavigationMenu.List className="lander-nav-list">
          <DesktopMenuItem value="products" label="Products" active={active === "products"}>
            {products}
          </DesktopMenuItem>
          <DesktopMenuItem value="resources" label="Resources" active={active === "resources"}>
            {resources}
          </DesktopMenuItem>
          <NavigationMenu.Item><span aria-disabled="true">Pricing</span></NavigationMenu.Item>
          <NavigationMenu.Item><NavigationMenu.Link href={docsHref} closeOnClick>Docs</NavigationMenu.Link></NavigationMenu.Item>
          <NavigationMenu.Item><span aria-disabled="true">Blog</span></NavigationMenu.Item>
        </NavigationMenu.List>
      </LayoutGroup>
      <NavigationMenu.Portal container={portal}>
        <NavigationMenu.Backdrop className="lander-menu-backdrop" />
        <NavigationMenu.Positioner
          anchor={anchor}
          align="start"
          sideOffset={0}
          collisionPadding={0}
          collisionAvoidance={{ side: "none", align: "none" }}
          className="lander-mega-positioner"
        >
          <NavigationMenu.Popup aria-label="Main menu links" className="lander-mega-surface">
            <div className="lander-menu-fire" aria-hidden="true">
              <AsciiFire side="l" height={112} seed={4} peaks={MENU_FIRE_PEAKS} embers={0} animated={false} />
              <AsciiFire side="r" height={112} seed={9} peaks={MENU_FIRE_PEAKS} embers={0} animated={false} />
            </div>
            <NavigationMenu.Viewport className="lander-mega-viewport" />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
}
