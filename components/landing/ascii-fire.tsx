"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/glaze/utils";

const BASE_COLS = 40;
const CW = 3.9;
const LH = 7;
const FRAME_MS = 130;
const PHASE_STEP = 0.2;
export const HOT = "X#XX#%";
export const MID = "=+x+=X:";
export const LOW = ".:-.:.-=+";
const FLECK = ".:'";
const SPARK = "+*'";
export const EMBER = ".'*°";
const BODY_ALPHA = [0.2, 0.3, 0.4, 0.5];
const NONE = 0;
const HOT_K = 1;
const BODY = 2;
const FLECK_K = 3;
const SPARK_K = 4;

export type Peak = readonly [x: number, amp: number, width: number];

export function AsciiFire({
  side,
  height,
  seed,
  peaks,
  embers,
  compact = false,
  animated = true,
}: {
  compact?: boolean;
  animated?: boolean;
  side: "l" | "r";
  height: number;
  seed: number;
  peaks: readonly Peak[];
  embers: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const H = Math.floor(height / LH);
    let W = 0;
    let width = 0;
    let kind = new Uint8Array(0);
    let glyph = new Uint8Array(0);
    let hs = new Float32Array(0);
    let jitter = new Float32Array(0);
    let field: number[] = [];
    const ex = new Float32Array(embers);
    const ey = new Float32Array(embers);
    const age = new Float32Array(embers);
    const life = new Float32Array(embers);
    const y0 = new Float32Array(embers);
    const speed = new Float32Array(embers);
    const eg = new Uint8Array(embers);
    const alive = new Uint8Array(embers);
    let nextEmber = 0.5 + Math.random();
    let s = 1;
    const reseed = (n: number) => {
      s = Math.imul(n | 0, 2654435761) >>> 0 || 1;
    };
    const rand = () => {
      s ^= s << 13;
      s ^= s >>> 17;
      s ^= s << 5;
      return (s >>> 0) / 4294967296;
    };
    const pick = (set: string) => Math.floor(rand() * set.length);

    const layout = (px: number) => {
      width = px;
      W = Math.max(1, Math.ceil(px / CW));
      kind = new Uint8Array(W * H);
      glyph = new Uint8Array(W * H);
      hs = new Float32Array(W);
      jitter = new Float32Array(W);
      reseed(seed);
      for (let c = 0; c < W; c++) jitter[c] = 1 + 0.12 * (rand() - 0.5);
      const shift = W - BASE_COLS;
      field = [];
      let x = Infinity;
      for (const [px0, amp, wd] of peaks) {
        x = px0 + shift;
        field.push(x, amp, wd);
      }
      reseed(seed * 7 + 1);
      x -= 7 + rand() * 6;
      while (x > -4) {
        field.push(x, 0.3 + rand() * 0.42, 2.5 + rand() * 3);
        x -= 7 + rand() * 6;
      }
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.textBaseline = "top";
      if (theme.font) ctx.font = theme.font;
      for (let e = 0; e < embers; e++) alive[e] = 0;
    };

    const theme = { hot: "#E8461C", body: "#F97316", spark: "#FBBF24", k: 1, font: "", ember: "" };
    const readTheme = () => {
      const style = getComputedStyle(canvas);
      theme.hot = style.getPropertyValue("--fire-hot").trim() || theme.hot;
      theme.body = style.getPropertyValue("--fire-body").trim() || theme.body;
      theme.spark = style.getPropertyValue("--fire-spark").trim() || theme.spark;
      theme.k = Number.parseFloat(style.getPropertyValue("--fire-k")) || 1;
      theme.font = `500 6.5px ${style.fontFamily}`;
      theme.ember = `600 9px ${style.fontFamily}`;
      ctx.font = theme.font;
    };

    let phase = 0;
    let frame = 0;
    const build = () => {
      for (let c = 0; c < W; c++) {
        let h = 0.04 + 0.03 * Math.sin(c * 0.5 + phase);
        for (let p = 0; p < field.length; p += 3) {
          const px = field[p];
          const d = (c - px) / field[p + 2];
          const a = field[p + 1] * (0.9 + 0.1 * Math.sin(phase * 2.1 + px));
          h = Math.max(h, a * Math.exp(-d * d));
        }
        hs[c] = h * jitter[c] * H;
      }
      for (let c = 0; c < W; c++) {
        const h = hs[c];
        for (let y = 0; y < H; y++) {
          const i = (H - 1 - y) * W + c;
          kind[i] = NONE;
          if (y < h) {
            const t = y / Math.max(h, 1);
            if (t < 0.14 && h > H * 0.08) {
              reseed(seed * 977 + i * 31 + (frame >> 3));
              if (rand() < 0.88) {
                kind[i] = HOT_K;
                glyph[i] = pick(HOT);
              }
              reseed(seed * 31 + frame * 7919 + i);
            } else if (t < 0.32) {
              if (rand() < 0.7) {
                kind[i] = BODY;
                glyph[i] = 100 + pick(MID);
              }
            } else if (rand() < 0.7 * (1 - t) + 0.14) {
              kind[i] = BODY;
              glyph[i] = pick(LOW);
            }
          } else if (y < h + H * 0.12 && rand() < 0.035) {
            kind[i] = FLECK_K;
            glyph[i] = pick(FLECK);
          }
        }
      }
      for (let n = 0; n < 6; n++) {
        const r = Math.floor(H * 0.15 + rand() * H * 0.45);
        const c = Math.floor(rand() * W);
        const i = r * W + c;
        if (kind[i] === BODY && glyph[i] < 3) {
          kind[i] = SPARK_K;
          glyph[i] = pick(SPARK);
        }
      }
    };

    const xOf = (c: number) => (side === "l" ? width - (W - c) * CW : (W - 1 - c) * CW);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let pass = 0; pass < 7; pass++) {
        const want = pass < 4 ? BODY : pass === 4 ? HOT_K : pass === 5 ? FLECK_K : SPARK_K;
        const lo = pass < 4 ? Math.floor((pass * H) / 4) : 0;
        const hi = pass < 4 ? Math.floor(((pass + 1) * H) / 4) : H;
        ctx.fillStyle = want === HOT_K ? theme.hot : want === SPARK_K ? theme.spark : theme.body;
        ctx.globalAlpha = theme.k * (pass < 4 ? BODY_ALPHA[pass] : want === HOT_K ? 0.6 : want === FLECK_K ? 0.18 : 0.7);
        for (let r = lo; r < hi; r++) {
          for (let c = 0; c < W; c++) {
            const i = r * W + c;
            if (kind[i] !== want) continue;
            const g = glyph[i];
            const ch =
              want === HOT_K
                ? HOT[g]
                : want === FLECK_K
                  ? FLECK[g]
                  : want === SPARK_K
                    ? SPARK[g]
                    : g >= 100
                      ? MID[g - 100]
                      : LOW[g];
            ctx.fillText(ch, xOf(c), r * LH);
          }
        }
      }
      ctx.fillStyle = theme.spark;
      ctx.font = theme.ember;
      for (let e = 0; e < embers; e++) {
        if (!alive[e]) continue;
        const fall = Math.min(1, (ey[e] - y0[e]) / Math.max(1, height * 0.86 - y0[e]));
        ctx.globalAlpha = theme.k * (1 - fall * fall) * (0.85 + 0.15 * Math.random());
        ctx.fillText(EMBER[eg[e]], xOf(ex[e]), ey[e]);
      }
      ctx.globalAlpha = 1;
      ctx.font = theme.font;
    };

    const stepEmbers = (dt: number) => {
      nextEmber -= dt;
      for (let e = 0; e < embers; e++) {
        if (!alive[e]) {
          if (nextEmber > 0) continue;
          let top = 0;
          for (let c = 1; c < W; c++) if (hs[c] > hs[top]) top = c;
          alive[e] = 1;
          age[e] = 0;
          speed[e] = 24 + Math.random() * 16;
          ex[e] = Math.min(W - 1, Math.max(0, top + Math.round(Math.random() * 2 - 1)));
          ey[e] = y0[e] = height - hs[top] * LH;
          life[e] = (height * 0.86 - ey[e]) / speed[e];
          eg[e] = Math.floor(Math.random() * EMBER.length);
          nextEmber = 1 + Math.random() * 1.5;
          continue;
        }
        age[e] += dt;
        ey[e] += speed[e] * dt;
        if (Math.random() < 0.12) ex[e] = Math.min(W - 1, Math.max(0, ex[e] + (Math.random() < 0.5 ? -1 : 1)));
        if (age[e] >= life[e] || ey[e] > height * 0.88) alive[e] = 0;
      }
    };

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer = 0;
    let visible = false;
    let ready = false;
    const tick = () => {
      frame++;
      phase += PHASE_STEP;
      build();
      stepEmbers(FRAME_MS / 1000);
      draw();
    };
    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };
    const run = () => {
      if (timer || !ready || !animated || reduced || !visible || document.hidden) return;
      timer = window.setInterval(tick, FRAME_MS);
    };
    const start = () => {
      ready = true;
      readTheme();
      layout(canvas.clientWidth);
      build();
      draw();
      run();
    };
    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const px = canvas.clientWidth;
        if (!ready || !px || px === width) return;
        layout(px);
        build();
        draw();
      }, 150);
    });
    ro.observe(canvas);
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
      window.clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [side, height, seed, peaks, embers, animated]);

  return <canvas ref={ref} aria-hidden className={cn("fire", compact && "fire-compact", side === "l" ? "fire-l" : "fire-r")} style={{ height }} />;
}
