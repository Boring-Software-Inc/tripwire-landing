"use client";

import { useEffect, useState } from "react";
import { NAV_ACCESS, NAV_CTA, NAV_LINKS, SITE } from "@/lib/content";
import { Logo, MenuIcon } from "@/components/icons";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-150 ${
        scrolled ? "bg-background/80 backdrop-blur-md" : "bg-background"
      }`}
    >
      <div className="mx-auto w-full max-w-[1536px] px-8 sm:px-12 lg:px-20">
        {/*
         * 1fr auto 1fr, not auto 1fr auto: with equal-weight side columns the
         * centre column lands on the true centre of the bar. Sizing the sides
         * to their content (auto) centred the nav within its column instead,
         * which reads as left-leaning because the logo is much narrower than
         * the buttons opposite it.
         */}
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-8">
          <a
            href="#hero"
            className="flex w-fit items-center gap-2.5 text-foreground"
          >
            <Logo width={20} height={14} />
            <span className="text-[16px]/[1.5] font-medium">{SITE.name}</span>
          </a>

          <nav
            aria-label="Main"
            className="hidden items-center justify-center gap-6 md:flex"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm/[1.43] text-foreground transition-opacity duration-150 hover:opacity-75"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/*
           * On mobile both pills collapse into the menu, leaving just the toggle.
           * col-start-3 is required: the centre nav is `display: none` below md,
           * which drops it out of the grid entirely, so without an explicit
           * column this block would auto-place into column 2 (the middle).
           */}
          <div className="col-start-3 flex items-center justify-end gap-3">
            <a
              href={NAV_ACCESS.href}
              className="hidden rounded-ui border border-line-strong bg-surface px-[10.5px] pt-[5.6px] pb-[5.88px] text-sm/[1.43] font-medium whitespace-nowrap text-foreground transition-opacity duration-150 hover:opacity-85 md:block"
            >
              {NAV_ACCESS.label}
            </a>
            <a
              href={NAV_CTA.href}
              className="hidden rounded-ui bg-foreground px-[10.5px] pt-[5.6px] pb-[5.88px] text-sm/[1.43] font-medium whitespace-nowrap text-background transition-opacity duration-150 hover:opacity-85 md:block"
            >
              {NAV_CTA.label}
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="-mr-1 cursor-pointer rounded-md p-1 text-foreground transition-colors duration-150 hover:bg-surface md:hidden"
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </div>

      {/*
       * Kept mounted so open/close can animate (grid-rows trick); `inert` keeps
       * the collapsed menu out of the tab order and off screen readers.
       */}
      <div
        id="mobile-menu"
        className="nav-panel md:hidden"
        data-open={menuOpen}
        inert={!menuOpen}
      >
        <div className="overflow-hidden">
          <nav
            aria-label="Main menu"
            className="flex flex-col gap-1 border-t border-line bg-background px-6 pt-4 pb-6"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-2 py-3 text-sm text-foreground transition-colors duration-150 hover:bg-surface hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href={NAV_ACCESS.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-2 py-3 text-sm text-muted transition-colors duration-150 hover:bg-surface hover:text-foreground"
            >
              {NAV_ACCESS.label}
            </a>
            <a
              href={NAV_CTA.href}
              onClick={() => setMenuOpen(false)}
              className="mt-3 rounded-tight bg-foreground px-4 py-2.5 text-center text-sm font-medium text-background transition-opacity duration-150 hover:opacity-85"
            >
              {NAV_CTA.label}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
