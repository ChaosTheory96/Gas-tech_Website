"use client";
/* ---------------------------------------------------------------------------
   Loads the cursor smoke (lib/cursorSmoke.ts) on the first mouse movement, so
   it adds nothing to the first load. Mouse and trackpad only; off for visitors
   who ask for reduced motion.
   --------------------------------------------------------------------------- */
import { useEffect } from "react";

const ALLOWED = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export function CursorSmoke() {
  useEffect(() => {
    const query = window.matchMedia(ALLOWED);
    let stop: (() => void) | undefined;
    let generation = 0;

    const load = () => {
      const mine = generation;
      import("@/lib/cursorSmoke")
        .then((m) => { if (mine === generation) stop = m.startCursorSmoke(); })
        .catch(() => {});
    };
    const reset = () => {
      generation++;
      window.removeEventListener("pointermove", load);
      stop?.();
      stop = undefined;
    };
    const arm = () => {
      reset();
      if (query.matches) window.addEventListener("pointermove", load, { once: true, passive: true });
    };

    arm();
    query.addEventListener("change", arm);
    return () => {
      query.removeEventListener("change", arm);
      reset();
    };
  }, []);
  return null;
}
