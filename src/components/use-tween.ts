"use client";

import { useReducedMotionSafe } from "./use-reduced";
import { useEffect, useState } from "react";

/** Animates 0 → 1 over `duration` seconds whenever `key` changes. */
export function useTween(key: unknown, duration = 1.8) {
  const reduce = useReducedMotionSafe();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      setV(t);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [key, duration, reduce]);
  return reduce ? 1 : v;
}
