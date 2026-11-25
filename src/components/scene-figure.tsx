"use client";

import { useRef } from "react";
import { useLoop } from "./use-loop";
import * as S from "./scenes";

const MAP = {
  residential: [S.ResidentialScene, 9], commercial: [S.CommercialScene, 9], renovations: [S.RenovationScene, 8],
  "project-management": [S.ScheduleScene, 10], "design-build": [S.DesignBuildScene, 8], "property-development": [S.DevelopmentScene, 10],
  consultation: [S.ConsultationScene, 6], construction: [S.ConstructionScene2D, 8], finishing: [S.FinishingScene, 8],
} as const;

/** A looping animated scene that pauses offscreen; set `still` for a static frame. */
export function SceneFigure({ name, label, still, bg = "#e9e4da", className = "" }: { name: keyof typeof MAP; label: string; still?: number; bg?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [Scene, period] = MAP[name];
  const live = useLoop(ref, period, { paused: still !== undefined, still: 0.85 });
  return (
    <div ref={ref} className={`h-full w-full ${className}`} style={{ background: bg }}>
      <svg viewBox="-260 -220 520 400" className="h-full w-full" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
        <Scene p={still ?? live} />
      </svg>
    </div>
  );
}
