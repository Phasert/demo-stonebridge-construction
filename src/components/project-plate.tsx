/* Original isometric architectural plates for each conceptual project. `p` builds the project up (0 → 1). */
import type { ReactNode } from "react";
import { Box, Dim, GableX, Ground, Person, T, Tree, WindowsX, WindowsZ, ease, iso, pts, seg } from "@/lib/iso";

export const PLATE_BG: Record<string, string> = {
  "harbour-line-residence": "#e6e1d6",
  "meridian-house": "#202725",
  "the-old-mill-renewal": "#d8cfc0",
  "ashgrove-terraces": "#ebe7de",
};

function Harbour({ p }: { p: number }) {
  const plinth = ease(seg(p, 0, 0.35)), pav = ease(seg(p, 0.3, 0.7)), fin = ease(seg(p, 0.65, 1));
  return (
    <g transform="translate(-10 20)">
      <Ground x0={-140} x1={260} z0={110} z1={260} fill="#9fb2b5" />
      <Ground x0={-140} x1={260} z0={-120} z1={110} fill="#cfc7b6" />
      <Box x0={-20} x1={200} z0={0} z1={80} y0={0} y1={40 * plinth} tone={{ top: "#e2dbcc", right: "#c9c0ae", left: "#b3a994" }} />
      <WindowsZ x0={0} x1={180} z={80.4} y0={4} y1={36} cols={6} rows={1} opacity={fin} fill="#3d4c50" />
      {/* cantilevered timber pavilion */}
      <g opacity={seg(pav, 0, 0.2)} transform={`translate(0 ${-(1 - pav) * 30})`}>
        <Box x0={20} x1={250} z0={10} z1={70} y0={40} y1={78} tone={T.timber} />
        <WindowsZ x0={30} x1={245} z={70.4} y0={44} y1={74} cols={8} rows={1} fill="#4b5f64" opacity={fin} lit={fin * 0.3} />
        <WindowsX z0={14} z1={66} x={250.4} y0={44} y1={74} cols={2} rows={1} fill="#6f8a90" opacity={fin} />
        <Box x0={16} x1={254} z0={6} z1={74} y0={78} y1={82} tone={T.dark} />
      </g>
      <Ground x0={200} x1={250} z0={80} z1={120} fill="#efebe3" y={0.5} opacity={fin} />
      <Tree x={-60} z={40} opacity={fin} /><Tree x={-40} z={90} s={0.8} opacity={fin} />
      <Person x={215} z={100} />
      <Dim from={[20, 82, -20]} to={[250, 82, -20]} label="CANTILEVER 7 200" opacity={fin} />
    </g>
  );
}

function Meridian({ p }: { p: number }) {
  const FL = 9, FH = 24, S = 90;
  const built = seg(p, 0.05, 0.85) * FL;
  const out: ReactNode[] = [];
  out.push(<Ground key="g" x0={-90} x1={S + 110} z0={-80} z1={S + 110} fill="#2c3331" />);
  out.push(<Ground key="pl" x0={-40} x1={S + 60} z0={S + 10} z1={S + 80} fill="#3b4240" />);
  out.push(<Box key="lobby" x0={0} x1={S} z0={0} z1={S} y0={0} y1={FH * 1.4 * ease(seg(p, 0, 0.1))} tone={T.glass} />);
  for (let i = 0; i < FL; i++) {
    const t = ease(Math.min(1, Math.max(0, built - i)));
    if (t <= 0) continue;
    const y0 = FH * 1.4 + i * FH;
    out.push(<g key={i} opacity={t}>
      <Box x0={0} x1={S} z0={0} z1={S} y0={y0} y1={y0 + FH * t} tone={{ top: "#3a4543", right: "#4b5f64", left: "#3d4c50" }} />
      {Array.from({ length: 9 }, (_, k) => <Box key={`fz${k}`} x0={k * (S / 8) - 1} x1={k * (S / 8) + 1} z0={S} z1={S + 5} y0={y0} y1={y0 + FH * t} tone={T.steel} />)}
      {Array.from({ length: 9 }, (_, k) => <Box key={`fx${k}`} x0={S} x1={S + 5} z0={k * (S / 8) - 1} z1={k * (S / 8) + 1} y0={y0} y1={y0 + FH * t} tone={T.steel} />)}
    </g>);
  }
  const top = FH * 1.4 + FL * FH;
  out.push(<Box key="crown" x0={-3} x1={S + 3} z0={-3} z1={S + 3} y0={top} y1={top + 6 * ease(seg(p, 0.85, 0.95))} tone={T.steel} />);
  for (let i = 0; i < 7; i++) out.push(<Person key={`p${i}`} x={-20 + i * 16} z={S + 30 + (i % 3) * 12} color="#c9b08a" />);
  out.push(<Dim key="d" from={[S + 30, 0, -10]} to={[S + 30, top, -10]} label="" color="#c9b08a" opacity={seg(p, 0.8, 1)} />);
  const [lx, ly] = iso(S + 40, top / 2, -10);
  out.push(<text key="dt" x={lx + 10} y={ly} fontSize={7} fill="#c9b08a" letterSpacing={1.5} fontFamily="ui-monospace, monospace" opacity={seg(p, 0.8, 1)}>H 38 400</text>);
  return <g transform="translate(-20 115) scale(0.72)">{out}</g>;
}

function Mill({ p }: { p: number }) {
  const W = 220, D = 90, H = 70;
  const insert = ease(seg(p, 0.35, 0.75)), fin = ease(seg(p, 0.7, 1));
  const teeth = 6;
  return (
    <g transform="translate(-60 30)">
      <Ground x0={-60} x1={W + 60} z0={-60} z1={D + 100} fill="#c7bba7" />
      <Ground x0={-60} x1={W + 60} z0={D + 60} z1={D + 140} fill="#8fa3a6" />
      <Box x0={0} x1={W} z0={0} z1={D} y0={0} y1={H * ease(seg(p, 0, 0.3))} tone={T.brick} />
      {/* sawtooth roof */}
      {Array.from({ length: teeth }, (_, i) => {
        const x0 = (i * W) / teeth, x1 = ((i + 1) * W) / teeth, t = ease(seg(p, 0.2 + i * 0.03, 0.4 + i * 0.03));
        return <g key={i} opacity={t}>
          <polygon points={pts([[x0, H, 0], [x0, H + 24, 0], [x0, H + 24, D], [x0, H, D]])} fill="#6f8a90" stroke="#202725" strokeWidth={0.4} />
          <polygon points={pts([[x0, H + 24, 0], [x1, H, 0], [x1, H, D], [x0, H + 24, D]])} fill="#5d6461" stroke="#202725" strokeWidth={0.4} />
          <polygon points={pts([[x0, H, D], [x0, H + 24, D], [x1, H, D]])} fill="#7f4630" />
        </g>;
      })}
      <WindowsZ x0={6} x1={W - 6} z={D + 0.4} y0={6} y1={H - 6} cols={9} rows={2} fill="#2c3331" frame="#e2dbcc" lit={fin * 0.6} />
      <WindowsX z0={6} z1={D - 6} x={W + 0.4} y0={6} y1={H - 6} cols={4} rows={2} fill="#3d4c50" frame="#e2dbcc" lit={fin * 0.5} />
      {/* new glass insertion */}
      <g opacity={insert} transform={`translate(0 ${-(1 - insert) * 25})`}>
        <Box x0={W * 0.62} x1={W * 0.92} z0={D * 0.15} z1={D * 0.85} y0={H} y1={H + 44} tone={T.glass} />
        <Box x0={W * 0.62 - 2} x1={W * 0.92 + 2} z0={D * 0.15 - 2} z1={D * 0.85 + 2} y0={H + 44} y1={H + 48} tone={T.steel} />
      </g>
      <Tree x={-30} z={D + 30} opacity={fin} /><Tree x={W + 25} z={D + 20} opacity={fin} s={0.9} />
      <Person x={W * 0.4} z={D + 35} /><Person x={W * 0.45} z={D + 40} color="#a68a64" />
      <Dim from={[0, 0, D + 22]} to={[W, 0, D + 22]} label="EXISTING 1904 SHELL — RETAINED" opacity={fin} color="#7f4630" />
    </g>
  );
}

function Terraces({ p }: { p: number }) {
  const N = 6, UW = 42, D = 70, H = 56;
  return (
    <g transform="translate(-80 40)">
      <Ground x0={-50} x1={N * UW + 50} z0={-70} z1={D + 110} fill="#dcd6ca" />
      <Ground x0={-50} x1={N * UW + 50} z0={D + 50} z1={D + 70} fill="#6c675f" opacity={ease(seg(p, 0, 0.15))} />
      {Array.from({ length: N }, (_, i) => {
        const t = ease(seg(p, 0.08 + i * 0.1, 0.35 + i * 0.1));
        const x0 = i * UW, x1 = x0 + UW;
        const tone = i % 2 ? T.stone : { top: "#e6dfd2", right: "#cbc2b2", left: "#b7ad9b" };
        return <g key={i} opacity={seg(t, 0, 0.15)}>
          <Box x0={x0} x1={x1} z0={0} z1={D} y0={0} y1={H * t} tone={tone} />
          <GableX x0={x0} x1={x1} z0={-4} z1={D + 4} y={H * t} h={26 * seg(t, 0.8, 1)} tone={T.roof} />
          <WindowsZ x0={x0 + 4} x1={x1 - 4} z={D + 0.4} y0={6} y1={H * t - 4} cols={2} rows={2} opacity={seg(t, 0.7, 1)} />
          <polygon points={pts([[x0 + 15, 0, D + 0.6], [x0 + 27, 0, D + 0.6], [x0 + 27, 24, D + 0.6], [x0 + 15, 24, D + 0.6]])} fill="#a68a64" opacity={seg(t, 0.8, 1)} />
          <Ground x0={x0 + 2} x1={x1 - 2} z0={D + 4} z1={D + 46} fill="#a9b394" y={0.3} opacity={seg(t, 0.85, 1)} />
        </g>;
      }).reverse().reverse()}
      {Array.from({ length: 5 }, (_, i) => <Tree key={i} x={20 + i * 55} z={D + 85} s={0.8} opacity={ease(seg(p, 0.8 + i * 0.03, 0.95))} />)}
      <Dim from={[0, 0, -30]} to={[N * UW, 0, -30]} label="PHASE 1 · 6 OF 32 HOMES" opacity={seg(p, 0.85, 1)} />
    </g>
  );
}

const PLATES: Record<string, (props: { p: number }) => ReactNode> = {
  "harbour-line-residence": Harbour,
  "meridian-house": Meridian,
  "the-old-mill-renewal": Mill,
  "ashgrove-terraces": Terraces,
};

export function ProjectPlate({ slug, p = 1, label, className = "" }: { slug: string; p?: number; label?: string; className?: string }) {
  const Plate = PLATES[slug];
  const dark = slug === "meridian-house";
  return (
    <svg viewBox="-260 -230 520 400" className={className} style={{ background: PLATE_BG[slug] }} role="img" aria-label={label ?? "Conceptual isometric illustration"} preserveAspectRatio="xMidYMid slice">
      <g stroke={dark ? "#c9b08a" : "#a68a64"} strokeOpacity={0.12}>
        {Array.from({ length: 27 }, (_, i) => <line key={i} x1={-260 + i * 20} y1={-230} x2={-260 + i * 20} y2={170} />)}
        {Array.from({ length: 21 }, (_, i) => <line key={`h${i}`} x1={-260} y1={-230 + i * 20} x2={260} y2={-230 + i * 20} />)}
      </g>
      <Plate p={p} />
    </svg>
  );
}
