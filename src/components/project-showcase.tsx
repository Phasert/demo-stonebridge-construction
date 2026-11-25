"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState, type KeyboardEvent } from "react";
import { projects } from "@/lib/data";
import { ProjectPlate } from "./project-plate";
import { useTween } from "./use-tween";

/**
 * Featured interaction — an editorial showcase. Choosing a concept "builds" its illustration
 * from the ground up, with architectural overlays and project data transitioning alongside.
 */
export function ProjectShowcase() {
  const [index, setIndex] = useState(0);
  const p = projects[index];
  const build = useTween(p.slug, 2.2);
  const go = (n: number) => setIndex((n + projects.length) % projects.length);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
  };

  return (
    <div onKeyDown={onKey} role="region" aria-roledescription="carousel" aria-label="Conceptual project showcase">
      {/* index rail */}
      <div role="tablist" aria-label="Choose a concept" className="grid grid-cols-2 border-t border-ivory/15 sm:grid-cols-4">
        {projects.map((proj, i) => (
          <button key={proj.slug} role="tab" aria-selected={i === index} onClick={() => go(i)} tabIndex={i === index ? 0 : -1}
            className="group relative py-5 pr-4 text-left">
            <span className="absolute top-0 left-0 h-px bg-bronze transition-all duration-700" style={{ width: i === index ? "100%" : "0%" }} />
            <span className="block text-[0.65rem] tracking-[0.25em] text-bronze">0{i + 1} · {proj.type.toUpperCase()}</span>
            <span className={`mt-2 block font-serif text-xl transition-opacity ${i === index ? "opacity-100" : "opacity-45 group-hover:opacity-80"}`}>{proj.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-12" aria-live="polite">
        <div className="relative overflow-hidden lg:col-span-8">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={p.slug} initial={{ clipPath: "inset(0 0 0 100%)" }} animate={{ clipPath: "inset(0 0 0 0%)" }} exit={{ opacity: 0.3 }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}>
              <motion.div initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}>
                <ProjectPlate slug={p.slug} p={build} className="aspect-[4/3] w-full sm:aspect-[16/11]" label={`Conceptual isometric illustration of ${p.name}`} />
              </motion.div>
            </motion.div>
          </AnimatePresence>
          {/* architectural overlay */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <span className="absolute top-4 left-4 bg-charcoal/85 px-3 py-1.5 text-[0.62rem] tracking-[0.25em] text-ivory uppercase">Conceptual study — not a completed project</span>
            <span className="absolute right-4 bottom-4 font-mono text-[0.62rem] tracking-[0.2em] text-bronze">BUILD {String(Math.round(build * 100)).padStart(3, "0")}%</span>
            <span className="absolute top-4 right-4 size-6 border-t border-r border-bronze" /><span className="absolute bottom-4 left-4 size-6 border-b border-l border-bronze" />
          </div>
        </div>

        <div className="flex flex-col justify-between lg:col-span-4">
          <AnimatePresence mode="wait">
            <motion.div key={p.slug} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <p className="eyebrow text-bronze">{p.location}</p>
              <h3 className="mt-4 font-serif text-5xl leading-[0.95] sm:text-6xl">{p.name}</h3>
              <p className="mt-6 leading-relaxed text-ivory/70">{p.excerpt}</p>
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ivory/10 pt-6 text-sm">
                <div><dt className="text-ivory/45">Gross area</dt><dd className="mt-1 font-serif text-2xl">{p.area}</dd></div>
                <div><dt className="text-ivory/45">Programme</dt><dd className="mt-1 font-serif text-2xl">{p.duration}</dd></div>
                {p.stats.slice(0, 2).map((s) => <div key={s.label}><dt className="text-ivory/45">{s.label}</dt><dd className="mt-1 font-serif text-2xl">{s.value}</dd></div>)}
              </dl>
            </motion.div>
          </AnimatePresence>
          <div className="mt-10 flex items-center justify-between gap-6">
            <Link href={`/projects/${p.slug}`} className="group inline-flex items-center gap-4 text-xs font-semibold tracking-[0.2em] uppercase">
              Read the concept <span className="h-px w-8 bg-bronze transition-all duration-500 group-hover:w-16" />
            </Link>
            <div className="flex gap-2">
              <button type="button" onClick={() => go(index - 1)} aria-label="Previous concept" className="flex size-12 items-center justify-center border border-ivory/25 transition-colors hover:border-bronze hover:bg-bronze">←</button>
              <button type="button" onClick={() => go(index + 1)} aria-label="Next concept" className="flex size-12 items-center justify-center border border-ivory/25 transition-colors hover:border-bronze hover:bg-bronze">→</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
