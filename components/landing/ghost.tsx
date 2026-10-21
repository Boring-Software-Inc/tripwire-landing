"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/glaze/utils";

const BODY =
  "M42 14L78 14L78 20L90 20L90 26L96 26L96 32L102 32L102 38L108 38L108 116L90 116L90 104L84 104L84 116L66 116L66 104L54 104L54 116L36 116L36 104L30 104L30 116L12 116L12 38L18 38L18 32L24 32L24 26L30 26L30 20L42 20Z";
const LENS_OPEN =
  "M54 38L66 38L66 44L84 44L84 50L90 50L90 62L84 62L84 68L66 68L66 74L54 74L54 68L36 68L36 62L30 62L30 50L36 50L36 44L54 44Z";
const LENS_CLOSED = "M48 50L72 50L72 56L84 56L84 62L36 62L36 56L48 56Z";
const HAPPY = "M36 50L48 50L48 56L54 56L54 62L30 62L30 56L36 56ZM84 50L84 56L90 56L90 62L66 62L66 56L72 56L72 50Z";

const PUPILS: string[] = [];
for (let dy = -1; dy <= 1; dy++) {
  for (let dx = -2; dx <= 2; dx++) {
    const x = 54 + dx * 6;
    const y = 50 + dy * 6;
    PUPILS.push(`M${x} ${y}L${x + 12} ${y}L${x + 12} ${y + 12}L${x} ${y + 12}Z`);
  }
}

function lensPath(dx: number, dy: number, closed: boolean) {
  return closed ? BODY + LENS_CLOSED : BODY + LENS_OPEN + PUPILS[(dy + 1) * 5 + dx + 2];
}

export function Ghost({ size, face = "eye", className }: { size: number; face?: "eye" | "happy"; className?: string }) {
  const body = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = body.current;
    if (!el || face !== "eye") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const svg = el.ownerSVGElement;
    if (!svg) return;
    let dx = 0;
    let dy = 0;
    let closed = false;
    let frame = 0;
    let timer = 0;
    let px = 0;
    let py = 0;
    const draw = () => el.setAttribute("d", lensPath(dx, dy, closed));
    const look = () => {
      frame = 0;
      const box = svg.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, (px - (box.left + box.width / 2)) / 360));
      const ny = Math.max(-1, Math.min(1, (py - (box.top + box.height * 0.45)) / 240));
      const ndx = Math.round(nx * 2);
      const ndy = Math.round(ny);
      if (ndx === dx && ndy === dy) return;
      dx = ndx;
      dy = ndy;
      draw();
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(look);
    };
    const blink = () => {
      timer = window.setTimeout(
        () => {
          if (!document.hidden) {
            closed = true;
            draw();
            window.setTimeout(() => {
              closed = false;
              draw();
            }, 160);
          }
          blink();
        },
        2500 + Math.random() * 3500,
      );
    };
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    blink();
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [face]);

  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="-1 0 122 122"
      className={cn("block shrink-0 text-ink", className)}
    >
      <path ref={body} d={face === "eye" ? lensPath(0, 0, false) : BODY + HAPPY} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
