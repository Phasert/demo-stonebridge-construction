"use client";

import { useReducedMotionSafe } from "./use-reduced";
import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Returns a looping phase 0..1 for a given period. Pauses when the element is offscreen,
 * when the tab is hidden, and holds a representative frame when reduced motion is requested.
 */
export function useLoop(ref: RefObject<Element | null>, period: number, opts: { still?: number; paused?: boolean; resetKey?: unknown } = {}) {
  const reduce = useReducedMotionSafe();
  const [phase, setPhase] = useState(0);
  const visible = useRef(false);
  const start = useRef(0);
  const { paused = false, resetKey } = opts;

  useEffect(() => { start.current = performance.now(); }, [resetKey]);

  useEffect(() => {
    if (reduce || paused) return;
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; }, { threshold: 0.05 });
    if (el) io.observe(el);
    let raf = 0, last = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible.current || document.hidden || now - last < 33) return; // ~30fps is plenty for SVG scenes
      last = now;
      setPhase((((now - start.current) / 1000) % period) / period);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [reduce, paused, period, ref]);

  return reduce ? opts.still ?? 0.8 : phase;
}
