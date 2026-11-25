"use client";

import { useReducedMotionSafe } from "./use-reduced";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState, useSyncExternalStore } from "react";
import { projects } from "@/lib/data";
import { ProjectPlate } from "./project-plate";

const subscribe = (cb: () => void) => { const m = window.matchMedia("(min-width: 768px)"); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); };

/** Pinned horizontal storytelling: each concept slides in and assembles as you scroll. */
export function ProjectsHorizontal() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const wide = useSyncExternalStore(subscribe, () => window.matchMedia("(min-width: 768px)").matches, () => true);
  const pinned = wide && !reduce;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${((projects.length - 1) / projects.length) * 100}%`]);
  const [prog, setProg] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setProg);
  const N = projects.length;

  return (
    <section ref={ref} aria-label="Concept stories" className="relative bg-charcoal text-ivory" style={pinned ? { height: `${N * 100}vh` } : undefined}>
      <div className={pinned ? "sticky top-0 h-[100svh] overflow-hidden" : ""}>
        <motion.div className={pinned ? "flex h-full" : "flex flex-col"} style={pinned ? { x, width: `${N * 100}%` } : undefined}>
          {projects.map((p, i) => {
            // local build progress for this panel
            const local = pinned ? Math.min(1, Math.max(0, prog * (N - 1) - i + 1.1)) : 1;
            return (
              <article key={p.slug} className="relative grid h-full w-full grid-rows-[auto_1fr] gap-6 px-5 pt-24 pb-10 sm:px-10 md:grid-cols-12 md:grid-rows-1 md:items-center md:gap-10 md:pt-20" aria-labelledby={`h-${p.slug}`}>
                <div className="md:col-span-5">
                  <p className="font-mono text-xs tracking-[0.25em] text-bronze">0{i + 1} / 0{N} · CONCEPT</p>
                  <h2 id={`h-${p.slug}`} className="mt-4 font-serif text-[clamp(2.8rem,6vw,6rem)] leading-[0.92]">{p.name}</h2>
                  <p className="mt-6 max-w-md leading-relaxed text-ivory/70">{p.brief}</p>
                  <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-ivory/15 pt-6 text-sm">
                    <div><dt className="text-ivory/45">Type</dt><dd className="mt-1 font-serif text-xl">{p.type}</dd></div>
                    <div><dt className="text-ivory/45">Area</dt><dd className="mt-1 font-serif text-xl">{p.area}</dd></div>
                    <div><dt className="text-ivory/45">Status</dt><dd className="mt-1 font-serif text-xl">Concept</dd></div>
                  </dl>
                  <Link href={`/projects/${p.slug}`} className="group mt-8 inline-flex items-center gap-4 text-xs font-semibold tracking-[0.2em] uppercase">
                    Explore concept <span className="h-px w-8 bg-bronze transition-all duration-500 group-hover:w-16" />
                  </Link>
                </div>
                <div className="relative min-h-[16rem] md:col-span-7 md:h-[70vh]">
                  <ProjectPlate slug={p.slug} p={local} className="h-full w-full" label={`Conceptual illustration of ${p.name}`} />
                  <span className="absolute top-3 left-3 bg-charcoal/85 px-3 py-1.5 text-[0.6rem] tracking-[0.25em] uppercase">Not a completed project</span>
                  <span className="absolute right-3 bottom-3 font-mono text-[0.6rem] tracking-[0.2em] text-bronze">ASSEMBLY {String(Math.round(local * 100)).padStart(3, "0")}%</span>
                </div>
              </article>
            );
          })}
        </motion.div>
        {pinned && (
          <div className="absolute inset-x-5 bottom-5 h-px bg-ivory/15 sm:inset-x-10" aria-hidden="true">
            <div className="h-full bg-bronze" style={{ width: `${prog * 100}%` }} />
          </div>
        )}
      </div>
    </section>
  );
}
