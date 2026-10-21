"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_SETTINGS, MascotEngine, type MascotSettings, restFrame } from "@/components/mascot/engine";
import type { Expression } from "@/components/mascot/geometry";
import { MascotFigure } from "@/components/mascot/mascot-figure";
import { useReducedMotion } from "@/components/mascot/use-reduced-motion";
import { cn } from "@/lib/glaze/utils";

function settingsFor(face: Expression, reduced: boolean): MascotSettings {
  return { ...DEFAULT_SETTINGS, bob: 2, reduced, resting: face };
}

export function Ghost({ size, face = "neutral", className }: { size: number; face?: Expression; className?: string }) {
  const reduced = useReducedMotion();
  const button = useRef<HTMLButtonElement>(null);
  const [engine] = useState(() => new MascotEngine(settingsFor(face, reduced), "idle"));

  useEffect(() => {
    engine.configure(settingsFor(face, reduced));
  }, [engine, face, reduced]);

  useEffect(() => {
    if (!button.current) return;
    engine.start(button.current);
    return () => engine.stop();
  }, [engine]);

  return (
    <button
      ref={button}
      type="button"
      aria-label="Poke the ghost"
      onClick={() => engine.poke()}
      className={cn("block cursor-pointer rounded-panel", className)}
    >
      <MascotFigure engine={engine} path={restFrame(face)} size={size} />
    </button>
  );
}
