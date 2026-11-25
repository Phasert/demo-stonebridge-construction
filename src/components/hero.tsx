"use client";

import { useReducedMotionSafe } from "./use-reduced";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HeroPoster } from "./hero-poster";

const ConstructionScene = dynamic(() => import("./three/construction-scene"), { ssr: false, loading: () => null });

const ease = [0.22, 1, 0.36, 1] as const;

function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => { const m = window.matchMedia(query); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function hasWebGL() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}
const webglStore = { subscribe: () => () => {}, get: () => hasWebGL(), server: () => false };

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe() ?? false;
  const mobile = useMedia("(max-width: 767px)");
  const webgl = useSyncExternalStore(webglStore.subscribe, webglStore.get, webglStore.server);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Pause rendering whenever the hero is offscreen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.02 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const headline = ["Built With", "Purpose."];
  return (
    <section ref={ref} aria-labelledby="hero-heading" className="relative isolate h-[100svh] min-h-[40rem] overflow-hidden bg-charcoal text-white">
      <div className="absolute inset-0 -z-10">
        <HeroPoster />
        {webgl && (
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6, delay: 0.2 }}>
            <ConstructionScene active={visible && !paused} reduced={reduce || paused} mobile={mobile} />
          </motion.div>
        )}
        {/* legibility vignette — directional, not decorative */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(32,39,37,0.92)_0%,rgba(32,39,37,0.55)_38%,rgba(32,39,37,0)_65%)] max-md:bg-[linear-gradient(180deg,rgba(32,39,37,0)_30%,rgba(32,39,37,0.95)_75%)]" />
      </div>

      {/* site HUD */}
      <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        className="absolute top-28 right-5 hidden w-60 border border-white/15 bg-charcoal/60 p-5 font-mono text-[0.68rem] tracking-wider text-white/70 backdrop-blur-sm sm:right-10 md:block">
        <div className="flex justify-between border-b border-white/10 pb-3"><dt className="text-bronze-light">SITE 04 · LIVE (DEMO)</dt><dd className="flex items-center gap-2"><span className="size-1.5 animate-pulse rounded-full bg-bronze" />{paused || reduce ? "PAUSED" : "ACTIVE"}</dd></div>
        <div className="flex justify-between pt-3"><dt>Level</dt><dd>04 / 06</dd></div>
        <div className="flex justify-between pt-2"><dt>Crane</dt><dd>Steel erection</dd></div>
        <div className="flex justify-between pt-2"><dt>Masonry</dt><dd>Course 07</dd></div>
        <div className="flex justify-between pt-2"><dt>Grid</dt><dd>B-4 → C-4</dd></div>
      </motion.dl>

      <motion.div style={reduce ? undefined : { y: textY, opacity: fade }} className="relative mx-auto flex h-full max-w-[90rem] flex-col justify-end px-5 pb-12 sm:px-10 sm:pb-20">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }} className="eyebrow flex items-center gap-4 text-bronze-light">
          <span className="h-px w-10 bg-bronze" /> From blueprint to reality
        </motion.p>
        <h1 id="hero-heading" className="mt-6 font-serif text-[clamp(3.2rem,9vw,8.75rem)] leading-[0.9] font-medium tracking-[-0.015em]">
          <span className="sr-only">Built With Purpose. Designed To Last.</span>
          <span aria-hidden="true" className="block">
            {headline.map((w, i) => (
              <span key={w} className="mr-[0.22em] inline-block overflow-hidden pb-[0.06em] align-bottom">
                <motion.span className="inline-block" initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ delay: 0.5 + i * 0.12, duration: 1.1, ease }}>{w}</motion.span>
              </span>
            ))}
          </span>
          <span aria-hidden="true" className="relative block">
            <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
              <motion.em className="inline-block font-normal text-bronze-light" initial={reduce ? false : { y: "105%" }} animate={{ y: 0 }} transition={{ delay: 0.8, duration: 1.1, ease }}>Designed To Last.</motion.em>
            </span>
            {/* dimension line — the headline measured like a drawing */}
            <motion.span className="absolute -bottom-3 left-0 flex w-[min(100%,34rem)] items-center gap-2 text-[0.6rem] font-sans tracking-[0.3em] text-bronze/80 not-italic"
              initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ delay: 1.5, duration: 1.4, ease }}>
              <span className="h-2 w-px bg-bronze" /><span className="h-px flex-1 bg-bronze/70" /><span>DESIGN LIFE 100 YRS</span><span className="h-px flex-1 bg-bronze/70" /><span className="h-2 w-px bg-bronze" />
            </motion.span>
          </span>
        </h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 1 }} className="mt-12 flex max-w-xl flex-col gap-8">
          <p className="max-w-md text-base leading-relaxed text-white/80">
            A fictional builder of homes, workplaces and places. Watch the site at work — then scroll to see a building rise from its first line.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/contact" className="bg-bronze px-7 py-4 text-xs font-semibold tracking-[0.2em] text-white uppercase transition-colors hover:bg-ivory hover:text-charcoal">Request a Quote</Link>
            <Link href="/projects" className="border border-white/40 px-7 py-4 text-xs font-semibold tracking-[0.2em] uppercase transition-colors hover:border-bronze hover:text-bronze-light">View Concepts</Link>
            {webgl && !reduce && (
              <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} className="flex size-12 items-center justify-center border border-white/25 text-xs transition-colors hover:border-bronze" aria-label={paused ? "Play site animation" : "Pause site animation"}>
                {paused ? "▶" : "❚❚"}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
