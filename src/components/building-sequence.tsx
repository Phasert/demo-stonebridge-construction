"use client";

import { useReducedMotionSafe } from "./use-reduced";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { Box, T, ease, iso, mix, pts, seg, clamp, type Tone } from "@/lib/iso";

const CONCRETE: Tone = T.concrete;
const FOOTING: Tone = T.footing;
const STEEL: Tone = T.steel;

/* ------------------------------- building model ------------------------------ */
const BAY = 60, FH = 44, NX = 4, NZ = 3, FLOORS = 5;
const W = BAY * NX, D = BAY * NZ, H = FH * FLOORS;
const cols: [number, number][] = [];
for (let i = 0; i <= NX; i++) for (let k = 0; k <= NZ; k++) cols.push([i * BAY, k * BAY]);
cols.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));

const STAGES = [
  { key: "Planning", title: "Planning", text: "Every structure begins as a line on paper. The column grid, setbacks and dimensions are fixed before a shovel touches the ground." },
  { key: "Foundations", title: "Foundations", text: "The drawing becomes a site. Ground is levelled, excavated and concrete footings are poured on every grid point." },
  { key: "Structure", title: "Structural framework", text: "Columns rise, steel beams connect them and slabs are cast floor by floor while the crane lifts materials into place." },
  { key: "Envelope", title: "Exterior & windows", text: "Facade panels close the frame and glazing is installed. The building becomes recognisable — and weathertight." },
  { key: "Completion", title: "Completion", text: "Scaffolding comes down, landscape goes in and the site becomes a place. From vision to reality." },
];

function Scene({ p }: { p: number }) {
  // stage-local progress
  const s1 = seg(p, 0.0, 0.18), s2 = seg(p, 0.2, 0.38), s3 = seg(p, 0.4, 0.62), s4 = seg(p, 0.64, 0.82), s5 = seg(p, 0.84, 0.98);
  const blueprint = 1 - seg(p, 0.2, 0.32) * 0.75 - s5 * 0.25;
  const floorsBuilt = s3 * FLOORS; // continuous
  const under: ReactNode[] = [];
  const back: ReactNode[] = [];
  const out: ReactNode[] = [];

  // --- site ground
  const groundOpacity = ease(s2);
  under.push(
    <polygon key="ground" points={pts([[-90, 0, -90], [W + 90, 0, -90], [W + 90, 0, D + 90], [-90, 0, D + 90]])} fill={s5 > 0 ? mix("#4a4f47", "#e9e4da", s5) : "#4a4f47"} opacity={groundOpacity} />,
  );
  // excavation pit
  if (s2 > 0 && s5 < 1) {
    under.push(<polygon key="pit" points={pts([[-15, 0, -15], [W + 15, 0, -15], [W + 15, 0, D + 15], [-15, 0, D + 15]])} fill="#3b3a33" opacity={ease(seg(s2, 0.1, 0.4)) * (1 - s5)} />);
  }
  // landscape (completion)
  if (s5 > 0) {
    under.push(<polygon key="lawn" points={pts([[-80, 0.2, D + 25], [W + 80, 0.2, D + 25], [W + 80, 0.2, D + 80], [-80, 0.2, D + 80]])} fill="#8f9a7e" opacity={ease(s5) * 0.8} />);
    under.push(<polygon key="path" points={pts([[W / 2 - 15, 0.3, D], [W / 2 + 15, 0.3, D], [W / 2 + 15, 0.3, D + 90], [W / 2 - 15, 0.3, D + 90]])} fill="#f7f5f0" opacity={ease(s5)} />);
  }

  // --- blueprint linework (drawn progressively; fades into site)
  const lines: ReactNode[] = [];
  const gridLines: [number, number, number, number][] = [];
  for (let i = 0; i <= NX; i++) gridLines.push([i * BAY, -30, i * BAY, D + 30]);
  for (let k = 0; k <= NZ; k++) gridLines.push([-30, k * BAY, W + 30, k * BAY]);
  gridLines.forEach(([x0, z0, x1, z1], i) => {
    const t = ease(seg(s1, i * 0.06, i * 0.06 + 0.4));
    const [ax, ay] = iso(x0, 0, z0), [bx, by] = iso(x0 + (x1 - x0) * t, 0, z0 + (z1 - z0) * t);
    lines.push(<line key={`g${i}`} x1={ax} y1={ay} x2={bx} y2={by} stroke="#a68a64" strokeWidth={0.8} strokeDasharray="5 3" />);
  });
  // grid bubbles
  "ABCDE".split("").forEach((l, i) => {
    const [x, y] = iso(i * BAY, 0, -42);
    lines.push(<g key={l} opacity={seg(s1, 0.4 + i * 0.05, 0.55 + i * 0.05)}><circle cx={x} cy={y} r={8} fill="none" stroke="#a68a64" /><text x={x} y={y + 3} textAnchor="middle" fontSize={8} fill="#c9b08a">{l}</text></g>);
  });
  ["1", "2", "3", "4"].forEach((l, k) => {
    const [x, y] = iso(-42, 0, k * BAY);
    lines.push(<g key={l} opacity={seg(s1, 0.5 + k * 0.05, 0.65 + k * 0.05)}><circle cx={x} cy={y} r={8} fill="none" stroke="#a68a64" /><text x={x} y={y + 3} textAnchor="middle" fontSize={8} fill="#c9b08a">{l}</text></g>);
  });
  // dimension line + outline
  const dim = ease(seg(s1, 0.55, 0.95));
  {
    const [ax, ay] = iso(0, 0, D + 55), [bx, by] = iso(W * dim, 0, D + 55);
    lines.push(<g key="dim" stroke="#c9b08a" strokeWidth={0.8}><line x1={ax} y1={ay} x2={bx} y2={by} /><line x1={ax} y1={ay - 5} x2={ax} y2={ay + 5} />{dim > 0.98 && <line x1={bx} y1={by - 5} x2={bx} y2={by + 5} />}</g>);
    const [tx, ty] = iso(W / 2, 0, D + 70);
    lines.push(<text key="dimt" x={tx} y={ty} fontSize={9} fill="#c9b08a" textAnchor="middle" opacity={dim} letterSpacing={2}>24 000</text>);
    const [ex, ey] = iso(W + 55, 0, 0), [fx, fy] = iso(W + 55, 0, D * dim);
    lines.push(<line key="dim2" x1={ex} y1={ey} x2={fx} y2={fy} stroke="#c9b08a" strokeWidth={0.8} />);
    const [ux, uy] = iso(W + 70, 0, D / 2);
    lines.push(<text key="dim2t" x={ux} y={uy} fontSize={9} fill="#c9b08a" textAnchor="middle" opacity={dim} letterSpacing={2}>18 000</text>);
  }
  // elevation ghost (structural outline above the plan)
  const ghost = ease(seg(s1, 0.6, 1)) * (1 - s3);
  if (ghost > 0) {
    lines.push(
      <g key="ghost" fill="none" stroke="#a68a64" strokeWidth={0.6} strokeDasharray="2 3" opacity={ghost * 0.8}>
        <polygon points={pts([[0, H, 0], [W, H, 0], [W, H, D], [0, H, D]])} />
        {[[0, 0], [W, 0], [W, D], [0, D]].map(([x, z]) => { const [a, b] = iso(x, 0, z), [c, d] = iso(x, H, z); return <line key={`${x}${z}`} x1={a} y1={b} x2={c} y2={d} />; })}
      </g>,
    );
  }
  under.push(<g key="bp" opacity={blueprint}>{lines}</g>);

  // --- footings
  cols.forEach(([x, z], i) => {
    const t = ease(seg(s2, 0.35 + i * 0.025, 0.55 + i * 0.025));
    out.push(<Box key={`f${i}`} x0={x - 9} x1={x + 9} z0={z - 9} z1={z + 9} y0={0} y1={6 * t} tone={FOOTING} opacity={t} />);
  });
  // ground slab
  const gs = ease(seg(s2, 0.85, 1));
  out.push(<Box key="gslab" x0={-6} x1={W + 6} z0={-6} z1={D + 6} y0={0} y1={6 * gs} tone={CONCRETE} opacity={gs} />);

  // --- structure: floor by floor (columns → beams → slab), then envelope per floor
  for (let f = 0; f < FLOORS; f++) {
    const local = clamp(floorsBuilt - f);
    const yb = 6 + f * FH, yt = yb + FH - 6;
    if (local > 0) {
      const colT = ease(seg(local, 0, 0.45));
      cols.forEach(([x, z], i) => out.push(<Box key={`c${f}-${i}`} x0={x - 3} x1={x + 3} z0={z - 3} z1={z + 3} y0={yb} y1={yb + (yt - yb) * colT} tone={CONCRETE} />));
      // steel beams
      const beamT = ease(seg(local, 0.4, 0.75));
      if (beamT > 0) {
        for (let k = 0; k <= NZ; k++) out.push(<Box key={`bx${f}${k}`} x0={0} x1={W * beamT} z0={k * BAY - 2} z1={k * BAY + 2} y0={yt - 5} y1={yt} tone={STEEL} />);
        for (let i = 0; i <= NX; i++) out.push(<Box key={`bz${f}${i}`} x0={i * BAY - 2} x1={i * BAY + 2} z0={0} z1={D * beamT} y0={yt - 5} y1={yt} tone={STEEL} />);
      }
      const slabT = ease(seg(local, 0.7, 1));
      out.push(<Box key={`s${f}`} x0={-4} x1={W + 4} z0={-4} z1={D + 4} y0={yt} y1={yt + 6} tone={CONCRETE} opacity={slabT} />);
    }
    // envelope: facade panels and windows on the two visible faces
    const env = clamp(s4 * FLOORS - f);
    if (env > 0) {
      for (let i = 0; i < NX; i++) {
        const t = ease(seg(env, i * 0.15, i * 0.15 + 0.5));
        const x0 = i * BAY + 3, x1 = (i + 1) * BAY - 3, zz = D + 4.5;
        const lift = (1 - t) * 20;
        out.push(
          <g key={`wl${f}${i}`} opacity={t} transform={`translate(0 ${-lift})`}>
            <polygon points={pts([[x0, yb, zz], [x1, yb, zz], [x1, yt, zz], [x0, yt, zz]])} fill="#2f3a3d" stroke="#a68a64" strokeWidth={0.8} />
            <polygon points={pts([[x0 + 4, yb + 6, zz], [x1 - 4, yb + 6, zz], [x1 - 4, yt - 4, zz], [x0 + 4, yt - 4, zz]])} fill={mix("#3d4c50", "#7f9aa0", s5)} />
            <line x1={iso((x0 + x1) / 2, yb + 6, zz)[0]} y1={iso((x0 + x1) / 2, yb + 6, zz)[1]} x2={iso((x0 + x1) / 2, yt - 4, zz)[0]} y2={iso((x0 + x1) / 2, yt - 4, zz)[1]} stroke="#a68a64" strokeWidth={0.6} />
          </g>,
        );
      }
      for (let k = 0; k < NZ; k++) {
        const t = ease(seg(env, 0.3 + k * 0.15, 0.3 + k * 0.15 + 0.5));
        const z0 = k * BAY + 3, z1 = (k + 1) * BAY - 3, xx = W + 4.5;
        const lift = (1 - t) * 20;
        out.push(
          <g key={`wr${f}${k}`} opacity={t} transform={`translate(0 ${-lift})`}>
            <polygon points={pts([[xx, yb, z0], [xx, yb, z1], [xx, yt, z1], [xx, yt, z0]])} fill="#d8d1c4" stroke="#a68a64" strokeWidth={0.8} />
            <polygon points={pts([[xx, yb + 8, z0 + 10], [xx, yb + 8, z1 - 10], [xx, yt - 6, z1 - 10], [xx, yt - 6, z0 + 10]])} fill={mix("#4b5a5e", "#9bb3b8", s5)} />
          </g>,
        );
      }
    }
  }
  // roof parapet + rooftop plant at completion of envelope
  const roof = ease(seg(s4, 0.85, 1));
  out.push(<Box key="plant" x0={W * 0.55} x1={W * 0.8} z0={D * 0.2} z1={D * 0.55} y0={H + 6} y1={H + 6 + 16 * roof} tone={{ top: "#e9e4da", right: "#c4bcae", left: "#aaa294" }} opacity={roof} />);

  // --- scaffolding (stage 3-4), removed at completion
  const scaff = ease(seg(s3, 0.1, 0.4)) * (1 - ease(seg(s5, 0, 0.5)));
  if (scaff > 0) {
    const sh = Math.min(H + 10, 10 + floorsBuilt * FH);
    const sc: ReactNode[] = [];
    for (let i = 0; i <= 8; i++) { const [a, b] = iso(W + 16, 0, i * (D / 8)), [, d] = iso(W + 16, sh, i * (D / 8)); sc.push(<line key={`sv${i}`} x1={a} y1={b} x2={a} y2={d} />); }
    for (let y = 0; y <= sh; y += 22) { const [a, b] = iso(W + 16, y, 0), [c, d] = iso(W + 16, y, D); sc.push(<line key={`sh${y}`} x1={a} y1={b} x2={c} y2={d} />); }
    out.push(<g key="scaff" stroke="#8a8f8c" strokeWidth={0.7} opacity={scaff * 0.85}>{sc}</g>);
  }

  // --- tower crane, moving a beam during framing
  const craneOn = ease(seg(s2, 0.7, 1)) * (1 - ease(seg(s5, 0.1, 0.6)));
  if (craneOn > 0) {
    const mx = -55, mz = D * 0.5, mh = H + 90;
    const [bx, by] = iso(mx, 0, mz), [tx, ty] = iso(mx, mh, mz);
    // slewing: angle oscillates with structural progress
    const ang = 0.35 + Math.sin(s3 * Math.PI * 4) * 0.55 + s4 * 0.4;
    const reach = 210;
    const jx = mx + Math.cos(ang) * reach, jz = mz - Math.sin(ang) * reach * 0.6;
    const cx = mx - Math.cos(ang) * 70, cz = mz + Math.sin(ang) * 70 * 0.6;
    const [jex, jey] = iso(jx, mh, jz), [cex, cey] = iso(cx, mh, cz);
    const tr = 0.45 + 0.4 * Math.abs(Math.sin(s3 * Math.PI * 4));
    const trx = mx + (jx - mx) * tr, trz = mz + (jz - mz) * tr;
    const [hx, hy] = iso(trx, mh, trz);
    const hookY = mh - 30 - (1 - Math.abs(Math.cos(s3 * Math.PI * 4))) * Math.min(120, 40 + floorsBuilt * 20);
    const [, hly] = iso(trx, hookY, trz);
    const lattice: ReactNode[] = [];
    for (let y = 0; y < mh; y += 14) { const [a, b] = iso(mx, y, mz), [c, d] = iso(mx, y + 14, mz); lattice.push(<line key={y} x1={a - 4} y1={b} x2={c + 4} y2={d} />, <line key={`r${y}`} x1={a + 4} y1={b} x2={c - 4} y2={d} />); }
    back.push(
      <g key="crane" opacity={craneOn} stroke="#d9a441" strokeWidth={1.2} fill="none">
        <line x1={bx - 4} y1={by} x2={tx - 4} y2={ty} /><line x1={bx + 4} y1={by} x2={tx + 4} y2={ty} />
        <g strokeWidth={0.5}>{lattice}</g>
        <line x1={cex} y1={cey} x2={jex} y2={jey} strokeWidth={2} />
        <line x1={tx} y1={ty - 26} x2={jex} y2={jey} strokeWidth={0.6} stroke="#888" />
        <line x1={tx} y1={ty - 26} x2={cex} y2={cey} strokeWidth={0.6} stroke="#888" />
        <line x1={tx} y1={ty} x2={tx} y2={ty - 26} strokeWidth={2} />
        <rect x={cex - 9} y={cey} width={18} height={10} fill="#a59e91" stroke="none" />
        <line x1={hx} y1={hy} x2={hx} y2={hly} stroke="#202725" strokeWidth={0.7} />
        <rect x={hx - 3} y={hly} width={6} height={6} fill="#d9a441" stroke="none" />
        {s3 > 0 && s3 < 1 && <rect x={hx - 22} y={hly + 10} width={44} height={5} fill="#a68a64" stroke="#202725" strokeWidth={0.5} />}
        {s3 > 0 && s3 < 1 && <path d={`M${hx} ${hly + 6} L${hx - 18} ${hly + 10} M${hx} ${hly + 6} L${hx + 18} ${hly + 10}`} stroke="#202725" strokeWidth={0.5} />}
      </g>,
    );
  }

  // --- trees & people at completion
  if (s5 > 0) {
    [[-50, D + 50], [-20, D + 70], [W + 40, D + 40], [W + 60, D + 10], [W * 0.3, D + 60], [W * 0.75, D + 62]].forEach(([x, z], i) => {
      const t = ease(seg(s5, 0.2 + i * 0.08, 0.5 + i * 0.08));
      const [a, b] = iso(x, 0, z);
      out.push(<g key={`t${i}`} opacity={t}><line x1={a} y1={b} x2={a} y2={b - 22 * t} stroke="#5b4a36" strokeWidth={1.5} /><circle cx={a} cy={b - 22 * t - 10} r={12 * t} fill="#6f7d62" /><circle cx={a + 5} cy={b - 22 * t - 14} r={8 * t} fill="#85927a" /></g>);
    });
  }
  return <>{under}{back}{out}</>;
}

const DURATION = 16000; // ms for the full autoplay, blueprint to completion

export function BuildingSequence() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const [p, setP] = useState(0);
  const pRef = useRef(0);
  const visible = useRef(false);
  const raf = useRef(0);
  const last = useRef(0);

  // Autoplay: advances on its own while the section is on screen; page scroll is never locked.
  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const tick = (t: number) => {
      const dt = last.current ? t - last.current : 0;
      last.current = t;
      if (pRef.current < 1) {
        pRef.current = Math.min(1, pRef.current + dt / DURATION);
        setP(pRef.current);
        raf.current = requestAnimationFrame(tick);
      } else {
        raf.current = 0;
      }
    };
    const start = () => {
      if (!raf.current && visible.current && pRef.current < 1) {
        last.current = 0;
        raf.current = requestAnimationFrame(tick);
      }
    };
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      if (e.isIntersecting) start();
      else { cancelAnimationFrame(raf.current); raf.current = 0; }
    }, { threshold: 0.3 });
    io.observe(el);
    (el as HTMLElement & { __play?: () => void }).__play = start;
    return () => { io.disconnect(); cancelAnimationFrame(raf.current); raf.current = 0; };
  }, [reduce]);

  const progress = reduce ? 1 : p;
  const stage = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length * 0.999));
  const complete = seg(progress, 0.84, 0.98);

  // Stage buttons jump the animation to that stage and keep playing from there.
  const jump = (i: number) => {
    pRef.current = i / STAGES.length;
    setP(pRef.current);
    (ref.current as (HTMLElement & { __play?: () => void }) | null)?.__play?.();
  };

  // camera: start close on the plan, pull back and lift for the reveal
  const pull = ease(seg(progress, 0.1, 0.55));
  const scale = 1.45 - pull * 0.55 - complete * 0.05;
  const fx = 52, fy = 105 - pull * 120 + complete * 10;

  return (
    <section ref={ref} aria-labelledby="seq-heading" className="relative">
      <div className={`${reduce ? "" : "h-[100svh]"} overflow-hidden transition-colors duration-700`} style={{ background: mix("#202725", "#f7f5f0", complete) }}>
        <div className="blueprint-grid absolute inset-0" style={{ opacity: 1 - seg(progress, 0.2, 0.4) * 0.7 - complete * 0.3 }} aria-hidden="true" />
        <div className="relative mx-auto grid h-full max-w-[90rem] grid-rows-[auto_1fr] gap-4 px-5 pt-24 pb-8 sm:px-10 lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:pt-20">
          <div className={`lg:col-span-4 ${complete > 0.5 ? "text-charcoal" : "text-ivory"} transition-colors duration-700`}>
            <p className="eyebrow text-bronze">Signature sequence</p>
            <h2 id="seq-heading" className="mt-4 font-serif text-[clamp(2rem,4.2vw,3.75rem)] leading-[1]">
              {complete > 0.6 ? <>From Vision <em className="text-bronze">to Reality.</em></> : <>Every Great Structure <em className="text-bronze-light">Starts Somewhere.</em></>}
            </h2>
            <div className="mt-6 hidden min-h-[7.5rem] sm:block" aria-live="polite">
              <p className="font-serif text-2xl"><span className="mr-3 text-bronze">0{stage + 1}</span>{STAGES[stage].title}</p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed opacity-75">{STAGES[stage].text}</p>
            </div>
            <p className="mt-3 text-sm sm:hidden"><span className="text-bronze">0{stage + 1}</span> · {STAGES[stage].title}</p>
            <nav aria-label="Construction stages" className="mt-6 lg:mt-10">
              <ol className="flex gap-2 lg:flex-col lg:gap-0">
                {STAGES.map((s, i) => (
                  <li key={s.key} className="flex-1">
                    <button type="button" onClick={() => jump(i)} aria-current={i === stage ? "step" : undefined}
                      className="group flex w-full items-center gap-4 py-2 text-left text-xs tracking-[0.18em] uppercase">
                      <span className="relative h-px w-full bg-current/25 lg:w-10"><span className="absolute inset-y-0 left-0 bg-bronze transition-all duration-500" style={{ width: i < stage ? "100%" : i === stage ? `${seg(progress * STAGES.length - i, 0, 1) * 100}%` : "0%" }} /></span>
                      <span className={`hidden lg:inline ${i === stage ? "opacity-100" : "opacity-45 group-hover:opacity-80"}`}>{s.key}</span>
                      <span className="sr-only lg:hidden">{s.key}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
          <div className="relative h-full min-h-0 lg:col-span-8">
            <svg viewBox="-300 -290 600 580" className="h-full w-full" role="img" aria-labelledby="seq-desc" preserveAspectRatio="xMidYMid meet">
              <desc id="seq-desc">Isometric illustration of a five-storey building progressing from blueprint, to foundations, to structural frame, to facade and windows, to a completed landscaped building.</desc>
              <g transform={`translate(${-fx * scale} ${-fy * scale}) scale(${scale})`} style={{ transition: "transform 120ms linear" }}>
                <Scene p={progress} />
              </g>
            </svg>
            <p className={`absolute right-0 bottom-0 font-mono text-[0.65rem] tracking-widest ${complete > 0.5 ? "text-charcoal/50" : "text-ivory/40"}`} aria-hidden="true">
              {String(Math.round(progress * 100)).padStart(3, "0")}% · ELEV. +{Math.round(seg(progress, 0.4, 0.62) * 22)} M
            </p>
          </div>
        </div>
      </div>
      {/* Accessible, non-animated summary of the sequence */}
      <ol className="sr-only">
        {STAGES.map((s) => <li key={s.key}>{s.title}: {s.text}</li>)}
      </ol>
    </section>
  );
}
