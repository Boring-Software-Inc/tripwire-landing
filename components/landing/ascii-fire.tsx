"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/glaze/utils";

const MAXH = 36;
const RAMP = " .:-=+*#%@";
const COLS = 40;
const CW = 3.9;
const CH = 7;
const WIDTH = 156;
const STEP_MS = 75;
const BANDS = [0.16, 0.32, 0.55, 0.8];
const REACH = 1.35;

function bandOf(h: number) {
  const f = h / MAXH;
  let b = 0;
  while (b < BANDS.length && f >= BANDS[b]) b++;
  return b;
}

export function AsciiFire({ side, height, seed }: { side: "l" | "r"; height: number; seed: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rows = Math.floor(height / CH);
    const heat = new Uint8Array(COLS * rows);
    const source = new Uint8Array(COLS);
    const decay = new Float32Array(COLS);
    const colors: string[] = ["", "", "", "", ""];
    let s = seed >>> 0 || 1;
    const rand = () => {
      s ^= s << 13;
      s ^= s >>> 17;
      s ^= s << 5;
      return (s >>> 0) / 4294967296;
    };

    const count = 4 + Math.floor(rand() * 2);
    const homes = new Float32Array(count);
    const centers = new Float32Array(count);
    const sigmas = new Float32Array(count);
    const chimneyDecay = new Float32Array(count);
    const between = MAXH / (0.17 * rows);
    const spacing = COLS / count;
    for (let i = 0; i < count; i++) {
      const w = 2.5 + rand() * 1.5;
      homes[i] = centers[i] = w / 2 + i * spacing;
      sigmas[i] = w / 2;
      const reach = (1.05 - (0.6 * i) / Math.max(1, count - 1)) * (0.85 + rand() * 0.25) * REACH;
      chimneyDecay[i] = MAXH / (reach * rows);
    }
    const phase0 = rand() * Math.PI * 2;
    const phase1 = rand() * Math.PI * 2;
    const tip = (u: number) => {
      let r = rows - 1;
      while (r > 0 && heat[(r - 1) * COLS + u] > 0) r--;
      return r;
    };

    let t = 0;
    const step = () => {
      t++;
      for (let i = 0; i < count; i++) {
        centers[i] += (rand() * 2 - 1) * 0.12;
        centers[i] += (homes[i] - centers[i]) * 0.08;
      }
      for (let u = 0; u < COLS; u++) {
        let d = between;
        for (let i = 0; i < count; i++) {
          const z = (u - centers[i]) / sigmas[i];
          const g = Math.exp(-z * z);
          const c = between + (chimneyDecay[i] - between) * g;
          if (c < d) d = c;
        }
        decay[u] = d;
        const n = (Math.sin(0.35 * u + phase0 + 0.05 * t) + 0.6 * Math.sin(0.13 * u + phase1 - 0.035 * t)) / 1.6;
        source[u] = Math.round(MAXH * Math.min(1, (0.75 + 0.25 * (0.5 + 0.5 * n)) * (0.88 + 0.12 * (1 - u / COLS))));
      }
      const base = (rows - 1) * COLS;
      for (let u = 0; u < COLS; u++) heat[base + u] = source[u];
      for (let r = 0; r < rows - 1; r++) {
        for (let u = 0; u < COLS; u++) {
          const d = decay[u];
          const whole = Math.floor(d);
          const h = heat[(r + 1) * COLS + u] - whole - (rand() < d - whole ? 1 : 0);
          const roll = rand();
          const du = roll < 0.07 ? (rand() < 0.5 ? -1 : 1) : roll < 0.11 ? 1 : 0;
          const to = Math.min(COLS - 1, Math.max(0, u + du));
          heat[r * COLS + to] = h > 0 ? h : 0;
        }
      }
      if (rand() < 0.45) {
        const u = Math.min(COLS - 1, Math.max(0, Math.round(centers[Math.floor(rand() * count)])));
        const r = tip(u) - 2 - Math.floor(rand() * 6);
        if (r >= 0) heat[r * COLS + u] = 2 + Math.floor(rand() * 4);
      }
    };

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(WIDTH * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textBaseline = "top";

    const readTheme = () => {
      const style = getComputedStyle(canvas);
      for (let i = 0; i < colors.length; i++) colors[i] = style.getPropertyValue(`--fire-${i + 1}`).trim() || "transparent";
      ctx.font = `500 6.5px ${style.fontFamily}`;
    };

    const draw = () => {
      ctx.clearRect(0, 0, WIDTH, height);
      for (let b = 0; b < colors.length; b++) {
        ctx.fillStyle = colors[b];
        for (let r = 0; r < rows; r++) {
          for (let u = 0; u < COLS; u++) {
            const h = heat[r * COLS + u];
            if (h < 1 || bandOf(h) !== b) continue;
            const x = side === "l" ? WIDTH - (u + 1) * CW : u * CW;
            ctx.fillText(RAMP[Math.min(9, Math.max(1, Math.ceil((h / MAXH) * 9)))], x, r * CH);
          }
        }
      }
    };

    let timer = 0;
    let visible = false;
    let ready = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };
    const run = () => {
      if (timer || !ready || reduced || !visible || document.hidden) return;
      timer = window.setInterval(() => {
        step();
        draw();
      }, STEP_MS);
    };

    for (let i = 0, n = rows > 40 ? 90 : 70; i < n; i++) step();
    const start = () => {
      ready = true;
      readTheme();
      draw();
      run();
    };
    document.fonts.load(`500 6.5px ${getComputedStyle(canvas).fontFamily}`).then(start, start);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) run();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : run());
    document.addEventListener("visibilitychange", onVisibility);
    const root = canvas.closest(".lander");
    const mo = new MutationObserver(() => {
      readTheme();
      draw();
    });
    if (root) mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      stop();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [side, height, seed]);

  return <canvas ref={ref} aria-hidden className={cn("fire", side === "l" ? "fire-l" : "fire-r")} style={{ width: WIDTH, height }} />;
}
