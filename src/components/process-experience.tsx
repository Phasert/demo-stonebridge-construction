"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type ComponentType, type KeyboardEvent } from "react";
import { useLoop } from "./use-loop";
import { ConsultationScene, ConstructionScene2D, FinishingScene, HandoverScene, PlanningScene, SitePrepScene } from "./scenes";

const STAGES: { name: string; text: string; duration: string; Scene: ComponentType<{ p: number }>; period: number; caption: string }[] = [
  { name: "Consultation", text: "We listen first: site, ambitions, budget and constraints — sketched together on the same sheet of paper.", duration: "Weeks 1–2", Scene: ConsultationScene, period: 6, caption: "Client and builder sketch the brief together" },
  { name: "Planning", text: "Concept design, engineering coordination and approvals — with cost checked at every line.", duration: "Months 1–4", Scene: PlanningScene, period: 7, caption: "A floor plan drafts itself with dimensions" },
  { name: "Site Preparation", text: "Surveying, clearing and excavation. The excavator digs, slews and stockpiles spoil ready for foundations.", duration: "Months 4–5", Scene: SitePrepScene, period: 7, caption: "Excavator digging, slewing and dumping spoil" },
  { name: "Construction", text: "Columns, beams and slabs rise floor by floor under daily quality inspections.", duration: "Months 5–16", Scene: ConstructionScene2D, period: 8, caption: "Structural frame rising floor by floor" },
  { name: "Finishing", text: "Facade, glazing, joinery and detailing — the part of the job where craft becomes visible.", duration: "Months 16–18", Scene: FinishingScene, period: 8, caption: "Facade panels installed and lights come on" },
  { name: "Handover", text: "Commissioning, documentation, a walkthrough — and the keys. Aftercare continues long after.", duration: "Ongoing", Scene: HandoverScene, period: 6, caption: "Keys handed over at the finished home" },
];

export function ProcessExperience({ dark = false }: { dark?: boolean }) {
  const [active, setActive] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const s = STAGES[active];
  const p = useLoop(stage, s.period, { resetKey: active });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (active + dir + STAGES.length) % STAGES.length;
    setActive(n); tabs.current[n]?.focus();
  };

  return (
    <div className={dark ? "text-ivory" : ""}>
      <div role="tablist" aria-label="Construction stages" onKeyDown={onKey} className="relative grid grid-cols-3 gap-y-6 sm:grid-cols-6">
        <span className={`absolute top-[11px] right-0 left-0 h-px max-sm:hidden ${dark ? "bg-ivory/15" : "bg-charcoal/15"}`} aria-hidden="true" />
        <motion.span className="absolute top-[11px] left-0 h-px bg-bronze max-sm:hidden" animate={{ width: `${(active / (STAGES.length - 1)) * 100}%` }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} aria-hidden="true" />
        {STAGES.map((st, i) => (
          <button key={st.name} ref={(el) => { tabs.current[i] = el; }} role="tab" aria-selected={i === active} aria-controls="proc-panel" id={`proc-tab-${i}`} tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)} className="group relative flex flex-col items-start gap-3 text-left">
            <span className={`relative z-10 size-[23px] rotate-45 border transition-colors duration-500 ${i <= active ? "border-bronze bg-bronze" : dark ? "border-ivory/30 bg-charcoal" : "border-charcoal/30 bg-ivory"}`} />
            <span className="text-[0.65rem] font-semibold tracking-[0.2em] text-bronze">0{i + 1}</span>
            <span className={`font-serif text-lg leading-tight transition-opacity sm:text-xl ${i === active ? "opacity-100" : "opacity-50 group-hover:opacity-80"}`}>{st.name}</span>
          </button>
        ))}
      </div>

      <div id="proc-panel" role="tabpanel" aria-labelledby={`proc-tab-${active}`} className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-center">
        <div ref={stage} className={`relative aspect-[4/3] overflow-hidden lg:col-span-8 ${dark ? "bg-[#283030]" : "bg-stone"}`}>
          <AnimatePresence mode="wait">
            <motion.svg key={s.name} viewBox="-240 -200 480 360" className="absolute inset-0 h-full w-full" role="img" aria-label={`Animated illustration: ${s.caption}`}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <s.Scene p={p} />
            </motion.svg>
          </AnimatePresence>
          <p className={`absolute bottom-4 left-5 font-mono text-[0.62rem] tracking-[0.2em] uppercase ${dark ? "text-ivory/40" : "text-charcoal/45"}`}>Stage 0{active + 1} · {s.caption}</p>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={s.name} className="lg:col-span-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
            <p className="font-serif text-8xl leading-none text-bronze/40">0{active + 1}</p>
            <h3 className="mt-4 font-serif text-4xl">{s.name}</h3>
            <p className={`mt-4 leading-relaxed ${dark ? "text-ivory/70" : "text-charcoal/70"}`}>{s.text}</p>
            <p className="eyebrow mt-6 text-bronze">{s.duration}</p>
            <div className="mt-8 flex gap-2">
              <button type="button" onClick={() => setActive((active - 1 + STAGES.length) % STAGES.length)} aria-label="Previous stage" className={`flex size-12 items-center justify-center border transition-colors hover:border-bronze hover:bg-bronze hover:text-white ${dark ? "border-ivory/25" : "border-charcoal/20"}`}>←</button>
              <button type="button" onClick={() => setActive((active + 1) % STAGES.length)} aria-label="Next stage" className={`flex size-12 items-center justify-center border transition-colors hover:border-bronze hover:bg-bronze hover:text-white ${dark ? "border-ivory/25" : "border-charcoal/20"}`}>→</button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
