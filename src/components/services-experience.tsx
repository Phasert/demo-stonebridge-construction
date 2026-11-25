"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type ComponentType, type KeyboardEvent } from "react";
import { services } from "@/lib/data";
import { useLoop } from "./use-loop";
import { CommercialScene, DesignBuildScene, DevelopmentScene, RenovationScene, ResidentialScene, ScheduleScene } from "./scenes";

const SCENES: Record<string, { Scene: ComponentType<{ p: number }>; period: number; caption: string }> = {
  residential: { Scene: ResidentialScene, period: 9, caption: "Slab → timber frame → walls → roof → glazing" },
  commercial: { Scene: CommercialScene, period: 9, caption: "Nine storeys of floor plates, stacked and glazed" },
  renovations: { Scene: RenovationScene, period: 8, caption: "A tired shell transformed — watch the line pass" },
  "project-management": { Scene: ScheduleScene, period: 10, caption: "Live programme: every task, milestone and week" },
  "design-build": { Scene: DesignBuildScene, period: 8, caption: "One team: the drawing becomes the building" },
  "property-development": { Scene: DevelopmentScene, period: 10, caption: "Vacant land to a finished neighbourhood" },
};

/** Selectable service categories around a large central animated construction visual. */
export function ServicesExperience() {
  const [active, setActive] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const s = services[active];
  const { Scene, period, caption } = SCENES[s.slug];
  const p = useLoop(stage, period, { resetKey: active });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent) => {
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (active + dir + services.length) % services.length;
    setActive(n);
    tabs.current[n]?.focus();
  };

  return (
    <div className="grid gap-px overflow-hidden border border-charcoal/15 bg-charcoal/15 lg:grid-cols-12">
      <div role="tablist" aria-label="Services" aria-orientation="vertical" onKeyDown={onKey} className="flex gap-px overflow-x-auto bg-charcoal/15 lg:col-span-4 lg:flex-col lg:overflow-visible">
        {services.map((sv, i) => (
          <button
            key={sv.slug}
            ref={(el) => { tabs.current[i] = el; }}
            role="tab"
            id={`svc-tab-${sv.slug}`}
            aria-selected={i === active}
            aria-controls="svc-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`group relative flex min-w-[13rem] flex-1 items-center gap-4 px-6 py-5 text-left transition-colors duration-500 lg:min-w-0 lg:px-8 lg:py-6 ${i === active ? "bg-charcoal text-ivory" : "bg-ivory hover:bg-stone"}`}
          >
            <span className={`text-xs font-semibold ${i === active ? "text-bronze" : "text-charcoal/40"}`}>{sv.index}</span>
            <span className="font-serif text-xl leading-tight lg:text-2xl">{sv.name}</span>
            {i === active && <motion.span layoutId="svc-bar" className="absolute inset-y-0 left-0 w-1 bg-bronze max-lg:inset-x-0 max-lg:top-auto max-lg:h-1 max-lg:w-auto" />}
          </button>
        ))}
      </div>

      <div id="svc-panel" role="tabpanel" aria-labelledby={`svc-tab-${s.slug}`} className="relative bg-ivory lg:col-span-8">
        <div ref={stage} className="blueprint-grid relative aspect-[4/3] sm:aspect-[16/10]">
          <AnimatePresence mode="wait">
            <motion.svg
              key={s.slug}
              viewBox="-260 -220 520 400"
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-label={`Animated illustration: ${caption}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Scene p={p} />
            </motion.svg>
          </AnimatePresence>
          <p className="absolute top-5 left-5 font-mono text-[0.65rem] tracking-[0.2em] text-charcoal/50 uppercase">Fig. {s.index} — {caption}</p>
        </div>
        <div className="grid gap-6 border-t border-charcoal/10 p-6 sm:grid-cols-[1fr_auto] sm:items-end sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={s.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35 }}>
              <p className="max-w-xl font-serif text-2xl leading-snug">{s.summary}</p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-charcoal/65">{s.detail}</p>
            </motion.div>
          </AnimatePresence>
          <Link href={`/services#${s.slug}`} className="group inline-flex items-center gap-3 text-xs font-semibold tracking-[0.2em] whitespace-nowrap uppercase">
            Explore <span className="h-px w-8 bg-bronze transition-all duration-500 group-hover:w-14" />
          </Link>
        </div>
      </div>
    </div>
  );
}
