"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/glaze/utils";

const MAXH = 36;
const RAMP = " .:-=+*#%@";
const COLS = 40;
const CW = 3.9;
const CH = 7;
const WIDTH = 156;
const STEP_MS = 72;
const BANDS = [0.16, 0.32, 0.55, 0.8];

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
    const heat = new Float32Array(COLS * rows);
    const source = new Float32Array(COLS);
    const decay = new Float32Array(COLS);
    const colors: string[] = ["", "", "", "", ""];
    let s = seed >>> 0 || 1;
    const rand = () => {
      s ^= s << 13;
      s ^= s >>> 17;
      s ^= s << 5;
      return (s >>> 0) / 4294967296;
    };

    const BAND = 0.18;
    const bandRows = Math.round(rows * BAND);
    const count = 4 + Math.floor(rand() * 3);
    const centers = new Float32Array(count);
    const widths = new Uint8Array(count);
    const reaches = new Float32Array(count);
    const drifts = new Int8Array(count);
    const clocks = new Uint16Array(count);
    const phase = rand() * Math.PI * 2;
    for (let i = 0; i < count; i++) {
      centers[i] = 1 + i * Math.floor(COLS / count) + Math.floor(rand() * 3);
      widths[i] = 2 + Math.floor(rand() * 3);
      reaches[i] = 0.7 + rand() * 0.3;
      drifts[i] = rand() < 0.5 ? -1 : 1;
      clocks[i] = 20 + Math.floor(rand() * 40);
    }
    const lowDecay = (MAXH * 0.4) / bandRows;
    const highDecay = (MAXH * 0.55) / Math.max(3, rows * 0.1);

    let t = 0;
    const step = () => {
      t += STEP_MS / 1000;
      decay.fill(highDecay);
      for (let i = 0; i < count; i++) {
        if (--clocks[i] === 0) {
          clocks[i] = 25 + Math.floor(rand() * 40);
          if (rand() < 0.3) drifts[i] = -drifts[i];
          centers[i] = Math.min(COLS - 2, Math.max(1, centers[i] + drifts[i]));
        }
        const close = 1 - centers[i] / COLS;
        const top = Math.min(0.72, 0.72 * reaches[i] * (0.45 + 0.55 * close));
        const climb = Math.max(1, rows * (top - BAND));
        const d = Math.max(0.08, (MAXH * 0.55) / climb - 0.25);
        const half = widths[i] / 2;
        for (let u = Math.ceil(centers[i] - half); u <= Math.floor(centers[i] + half); u++) {
          if (u >= 0 && u < COLS) decay[u] = Math.min(decay[u], d);
        }
      }
      for (let u = 0; u < COLS; u++) {
        const close = 1 - u / COLS;
        const n = 0.5 + 0.25 * Math.sin(u * 0.45 + t * 0.8 + phase) + 0.25 * Math.sin(u * 0.17 - t * 0.5);
        source[u] = MAXH * (0.75 + 0.25 * (0.5 * close + 0.5 * n));
      }
      const base = (rows - 1) * COLS;
      for (let u = 0; u < COLS; u++) heat[base + u] = source[u];
      for (let r = 0; r < rows - 1; r++) {
        const inBand = r >= rows - 1 - bandRows;
        for (let u = 0; u < COLS; u++) {
          const below = heat[(r + 1) * COLS + u];
          const lift = inBand ? (rows - 1 - r) / bandRows : 1;
          let h = below - (inBand ? lowDecay * (0.3 + lift * 1.4) * (0.5 + rand()) + (lift > 0.6 ? decay[u] * 0.35 * rand() : 0) : decay[u] * (0.5 + rand()));
          if (!inBand && h < MAXH / 2 && rand() < 0.25) h -= 1;
          const roll = rand();
          const du = roll < 0.22 ? (rand() < 0.5 ? -1 : 1) : roll < 0.3 ? 1 : 0;
          const to = Math.min(COLS - 1, Math.max(0, u + du));
          heat[r * COLS + to] = h > 0 ? h : 0;
        }
      }
      if (rand() < 0.8) {
        const u = Math.floor(rand() * COLS);
        let top = rows - 1;
        while (top > 0 && heat[(top - 1) * COLS + u] > 0) top--;
        const r = top - 2 - Math.floor(rand() * 5);
        if (r >= 0) heat[r * COLS + u] = 2 + rand() * 3;
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
