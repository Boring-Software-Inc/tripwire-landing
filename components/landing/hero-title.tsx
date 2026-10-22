"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { EMBER, HOT } from "@/components/landing/ascii-fire";

const WORDS = ["spam", "slop", "airdrop hunters", "drive-by PRs", "unwanted noise"];
const CYCLE = 2400;
const CATCH = 500;
const BURN = 1100;
const NEXT = 1800;
const RISE = 1900;
const STEP_MS = 50;
const HIGH = "*+=*+";
const MID = "=+-:=";
const LOW = ":-.:";
const MAX_EMBERS = 24;

type Phase = "enter" | "catch" | "burn" | "next";

function phaseOf(c: number): Phase {
  if (c < CATCH) return "enter";
  if (c < BURN) return "catch";
  if (c < NEXT) return "burn";
  return "next";
}

function smooth(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function hash(n: number) {
  let s = Math.imul(n | 0, 2654435761) >>> 0;
  s ^= s >>> 15;
  s = Math.imul(s, 2246822519) >>> 0;
  s ^= s >>> 13;
  return (s >>> 0) / 4294967296;
}

export function HeroTitle() {
  const [index, setIndex] = useState(0);
  const [widths, setWidths] = useState<number[] | null>(null);
  const measure = useRef<HTMLSpanElement>(null);
  const slot = useRef<HTMLSpanElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const widthsRef = useRef<number[]>([]);
  const indexRef = useRef(0);

  useLayoutEffect(() => {
    const read = () => {
      const el = measure.current;
      if (!el) return;
      const next = Array.from(el.children).map((c) => (c as HTMLElement).getBoundingClientRect().width);
      widthsRef.current = next;
      setWidths(next);
    };
    read();
    document.fonts.ready.then(read);
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    const slotEl = slot.current;
    const wordEl = word.current;
    if (!el || !ctx || !slotEl || !wordEl) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let W = 0;
    let H = 0;
    let CW = 5.4;
    let LH = 9;
    let PAD = 24;
    let HEIGHT = 160;
    let reach = 1;
    let heat = new Float32Array(0);
    let pxWidth = 0;
    const ex = new Float32Array(MAX_EMBERS);
    const ey = new Float32Array(MAX_EMBERS);
    const vx = new Float32Array(MAX_EMBERS);
    const vy = new Float32Array(MAX_EMBERS);
    const age = new Float32Array(MAX_EMBERS);
    const life = new Float32Array(MAX_EMBERS);
    const eg = new Uint8Array(MAX_EMBERS);
    const alive = new Uint8Array(MAX_EMBERS);
    const colors = { body: "#F97316", hot: "#E8461C", font: "" };

    const layout = () => {
      const line = Number.parseFloat(getComputedStyle(slotEl).height) || 84;
      const wide = line >= 60;
      LH = wide ? 9 : 7.5;
      CW = LH * 0.6;
      PAD = wide ? 24 : 8;
      HEIGHT = wide ? 160 : 64;
      H = Math.floor(HEIGHT / LH);
      reach = 17 / H;
      el.style.height = `${HEIGHT}px`;
      el.style.top = `${line - 6 - HEIGHT}px`;
      el.style.left = `${-PAD}px`;
      const max = Math.max(...widthsRef.current, slotEl.getBoundingClientRect().width);
      const nextWidth = Math.ceil(max + PAD * 2);
      if (nextWidth === pxWidth && heat.length === Math.ceil(nextWidth / CW) * H) return;
      pxWidth = nextWidth;
      W = Math.ceil(pxWidth / CW);
      heat = new Float32Array(W * H);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      el.style.width = `${pxWidth}px`;
      el.width = Math.round(pxWidth * dpr);
      el.height = Math.round(HEIGHT * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const style = getComputedStyle(el);
      colors.body = style.getPropertyValue("--brand-fire-body").trim() || colors.body;
      colors.hot = style.getPropertyValue("--brand-fire-hot").trim() || colors.hot;
      colors.font = `600 ${LH}px ${style.fontFamily}`;
      ctx.font = colors.font;
      ctx.textBaseline = "bottom";
    };

    let tick = 0;
    const step = (c: number, span: number) => {
      tick++;
      const catching = c >= CATCH && c < BURN;
      const burning = c >= BURN && c < NEXT;
      const k = catching ? 0.6 + 0.3 * smooth((c - CATCH) / 300) : burning ? 1 : 0;
      const decay = catching ? 0.3 - 0.08 * smooth((c - CATCH) / 600) : 0.075 + 0.1 * (1 - smooth((c - BURN) / 200));
      const lo = Math.floor(PAD / CW) - 2;
      const hi = Math.ceil((PAD + span) / CW) + 1;
      const bottom = (H - 1) * W;
      for (let x = 0; x < W; x++) {
        if (k === 0 || x < lo || x > hi) {
          heat[bottom + x] = 0;
          continue;
        }
        const wave =
          0.6 +
          0.3 * Math.sin(x * 0.55 + tick * 0.35) +
          0.12 * Math.sin(x * 0.23 - tick * 0.21 + 1.7);
        const peak = Math.max(0, wave) ** 2.2;
        heat[bottom + x] = Math.max(0, Math.min(1, k * (0.3 + 0.9 * peak + 0.25 * (hash(x * 131 + tick) - 0.5))));
      }
      const passes = burning ? 3 : 2;
      for (let pass = 0; pass < passes; pass++) {
        for (let y = 0; y < H - 1; y++) {
          for (let x = 0; x < W; x++) {
            const r = hash(tick * 7919 + pass * 104729 + y * 977 + x);
            const sx = Math.min(W - 1, Math.max(0, x + Math.round(r * 2 - 1)));
            const below = heat[(y + 1) * W + sx];
            heat[y * W + x] = Math.max(0, below - decay * reach * (0.4 + r) * (k === 0 ? 2.2 : 1));
          }
        }
      }
      if (burning && c > BURN + 150) {
        for (let e = 0; e < MAX_EMBERS; e++) {
          if (alive[e] || hash(tick * 13 + e) > 0.22) continue;
          alive[e] = 1;
          age[e] = 0;
          life[e] = 0.6 + hash(tick + e * 3) * 0.7;
          ex[e] = PAD + hash(tick * 3 + e) * span;
          ey[e] = HEIGHT - 8 - hash(tick * 5 + e) * Math.min(56, HEIGHT * 0.6);
          vx[e] = (hash(tick * 11 + e) - 0.5) * 24;
          vy[e] = -(22 + hash(tick * 17 + e) * 26);
          eg[e] = Math.floor(hash(tick * 19 + e) * EMBER.length);
          break;
        }
      }
      const dt = STEP_MS / 1000;
      for (let e = 0; e < MAX_EMBERS; e++) {
        if (!alive[e]) continue;
        age[e] += dt;
        ex[e] += vx[e] * dt + (hash(tick * 23 + e) - 0.5) * 2;
        ey[e] += vy[e] * dt;
        if (age[e] >= life[e] || ey[e] < 0) alive[e] = 0;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, pxWidth, HEIGHT);
      const top = HEIGHT - H * LH;
      for (let pass = 0; pass < 2; pass++) {
        ctx.fillStyle = pass === 0 ? colors.body : colors.hot;
        ctx.globalAlpha = pass === 0 ? 0.95 : 1;
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const h = heat[y * W + x];
            if (h < 0.1) continue;
            const r = hash(tick * 31 + y * 211 + x * 7);
            const hot = h > 0.72 && y >= H - Math.ceil(H * 0.25);
            if ((pass === 1) !== hot) continue;
            let ch: string;
            if (hot) ch = HOT[Math.floor(r * HOT.length)];
            else if (h > 0.5) ch = HIGH[Math.floor(r * HIGH.length)];
            else if (h > 0.25) ch = MID[Math.floor(r * MID.length)];
            else if (r < 0.55) ch = LOW[Math.floor(r * 1.8 * LOW.length) % LOW.length];
            else continue;
            ctx.fillText(ch, x * CW, top + (y + 1) * LH);
          }
        }
      }
      ctx.fillStyle = colors.body;
      for (let e = 0; e < MAX_EMBERS; e++) {
        if (!alive[e]) continue;
        const f = age[e] / life[e];
        ctx.globalAlpha = 0.9 * (1 - f * f);
        ctx.fillText(EMBER[eg[e]], ex[e], ey[e]);
      }
      ctx.globalAlpha = 1;
    };

    const style = (c: number) => {
      let o = 1;
      let y = 0;
      if (c >= RISE) {
        const p = (c - RISE) / (CYCLE - RISE);
        const e = 1 - (1 - p) ** 3;
        o = Math.min(1, p * 1.4);
        y = (1 - e) * 0.32;
      } else if (c >= BURN) {
        o = 1 - smooth((c - BURN) / (NEXT - BURN));
      }
      wordEl.style.opacity = String(o);
      wordEl.style.transform = y ? `translateY(${y}em)` : "";
    };

    layout();
    let start = performance.now();
    let last = -1;
    let raf = 0;
    let running = false;
    let pausedAt = 0;
    let cycleSeen = 0;
    let lastPhase: Phase = "enter";
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const t = now - start;
      const cycle = Math.floor(t / CYCLE);
      const c = t - cycle * CYCLE;
      const shown = (c >= RISE ? cycle + 1 : cycle) % WORDS.length;
      if (shown !== indexRef.current) {
        indexRef.current = shown;
        setIndex(shown);
      }
      const phase = phaseOf(c);
      if (phase !== lastPhase || cycle !== cycleSeen) {
        lastPhase = phase;
        cycleSeen = cycle;
        slotEl.dataset.phase = phase;
      }
      style(c);
      const s = Math.floor(t / STEP_MS);
      if (s !== last) {
        last = s;
        const span = widthsRef.current[cycle % WORDS.length] ?? slotEl.getBoundingClientRect().width;
        step(c, span);
        draw();
      }
    };
    const run = () => {
      if (running) return;
      running = true;
      if (pausedAt) start += performance.now() - pausedAt;
      pausedAt = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      pausedAt = performance.now();
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? run() : stop()));
    io.observe(slotEl);
    const onVisibility = () => (document.hidden ? stop() : run());
    document.addEventListener("visibilitychange", onVisibility);
    const ro = new ResizeObserver(() => layout());
    ro.observe(slotEl);
    document.fonts.ready.then(layout);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const width = widths ? widths[index] : undefined;

  return (
    <h1 id="hero-title" className="t-hero text-text-1">
      <span className="sr-only">Keep {WORDS.slice(0, -1).join(", ")} and {WORDS.at(-1)} out of your repo.</span>
      <span aria-hidden className="flex flex-col items-center">
        <span className="hero-line flex items-end">
          <span>Keep</span>
          <span ref={slot} data-phase="enter" className="hero-slot relative flex" style={width ? { width } : undefined}>
            <span ref={word} className="hero-word whitespace-nowrap">
              {WORDS[index]}
            </span>
            <canvas ref={canvas} className="hero-fire" />
          </span>
        </span>
        <span>out of your repo.</span>
      </span>
      <span ref={measure} aria-hidden className="hero-measure">
        {WORDS.map((w) => (
          <span key={w} className="hero-slot">
            {w}
          </span>
        ))}
      </span>
    </h1>
  );
}
