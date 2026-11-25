"use client";

import { useRef, useState, type ReactNode } from "react";

/** Accessible comparison slider (pointer drag, touch, or keyboard via a range input). */
export function BeforeAfter({ before, after, beforeLabel = "Before", afterLabel = "After", label = "Comparison" }: { before: ReactNode; after: ReactNode; beforeLabel?: string; afterLabel?: string; label?: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const update = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (r) setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div ref={ref} className="relative aspect-[4/3] touch-pan-y overflow-hidden bg-stone select-none sm:aspect-[16/10]"
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); update(e.clientX); }}
      onPointerMove={(e) => e.buttons === 1 && update(e.clientX)}>
      <div className="absolute inset-0 [&>svg]:h-full [&>svg]:w-full">{after}</div>
      <div className="absolute inset-0 [&>svg]:h-full [&>svg]:w-full" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>{before}</div>
      <span className="absolute top-4 left-4 bg-charcoal/85 px-3 py-1.5 text-[0.62rem] tracking-[0.25em] text-ivory uppercase">{beforeLabel}</span>
      <span className="absolute top-4 right-4 bg-ivory/90 px-3 py-1.5 text-[0.62rem] tracking-[0.25em] text-charcoal uppercase">{afterLabel}</span>
      <div className="pointer-events-none absolute inset-y-0 w-px bg-bronze" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bronze bg-charcoal/80 text-ivory">⟷</span>
      </div>
      <label className="sr-only" htmlFor="ba-range">{label}</label>
      <input id="ba-range" type="range" min={0} max={100} value={Math.round(pos)} onChange={(e) => setPos(Number(e.target.value))} className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
    </div>
  );
}
