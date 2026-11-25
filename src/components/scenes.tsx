/* Original, procedurally drawn construction scenes (SVG). Each takes a looping phase 0..1. */
import type { ReactNode } from "react";
import { Box, Dim, GableX, Ground, Person, T, Tree, WindowsX, WindowsZ, ease, iso, mix, pts, seg } from "@/lib/iso";

const fadeLoop = (p: number) => 1 - seg(p, 0.94, 1);

/* ------------------------------ SERVICE SCENES ------------------------------ */

export function ResidentialScene({ p }: { p: number }) {
  const f = fadeLoop(p);
  const slab = ease(seg(p, 0, 0.12));
  const studs = seg(p, 0.12, 0.32);
  const clad = ease(seg(p, 0.3, 0.48));
  const roofDrop = ease(seg(p, 0.48, 0.62));
  const win = ease(seg(p, 0.62, 0.74));
  const land = ease(seg(p, 0.72, 0.86));
  const W = 150, D = 90, H = 52;
  const out: ReactNode[] = [];
  out.push(<Ground key="g" x0={-70} x1={W + 70} z0={-60} z1={D + 70} fill="#e3ddd1" />);
  out.push(<Ground key="lawn" x0={-60} x1={W + 60} z0={D + 15} z1={D + 65} fill="#a9b394" opacity={land} />);
  out.push(<Box key="slab" x0={-5} x1={W + 5} z0={-5} z1={D + 5} y0={0} y1={6 * slab} tone={T.concrete} opacity={slab} />);
  // timber studs rising sequentially
  const studList: [number, number][] = [];
  for (let x = 0; x <= W; x += 15) studList.push([x, D], [x, 0]);
  for (let z = 15; z < D; z += 15) studList.push([W, z], [0, z]);
  studList.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
  studList.forEach(([x, z], i) => {
    const t = ease(seg(studs, (i / studList.length) * 0.7, (i / studList.length) * 0.7 + 0.3));
    out.push(<Box key={`s${i}`} x0={x - 1.5} x1={x + 1.5} z0={z - 1.5} z1={z + 1.5} y0={6} y1={6 + H * t} tone={T.timber} opacity={(1 - clad) * t} />);
  });
  // cladding walls grow upward
  out.push(<Box key="walls" x0={0} x1={W} z0={0} z1={D} y0={6} y1={6 + H * clad} tone={T.stone} />);
  const roofY = 6 + H + (1 - roofDrop) * 60;
  out.push(<Box key="eave" x0={-8} x1={W + 8} z0={-8} z1={D + 8} y0={roofY} y1={roofY + 4} tone={T.dark} opacity={roofDrop} />);
  out.push(<GableX key="roof" x0={-8} x1={W + 8} z0={-8} z1={D + 8} y={roofY + 4} h={34} tone={T.roof} opacity={roofDrop} />);
  out.push(<WindowsZ key="wz" x0={8} x1={W - 8} z={D + 0.5} y0={10} y1={6 + H - 4} cols={5} rows={1} opacity={win} />);
  out.push(<WindowsX key="wx" z0={8} z1={D - 8} x={W + 0.5} y0={10} y1={6 + H - 4} cols={2} rows={1} opacity={win} />);
  out.push(<polygon key="door" points={pts([[W / 2 - 8, 6, D + 0.6], [W / 2 + 8, 6, D + 0.6], [W / 2 + 8, 40, D + 0.6], [W / 2 - 8, 40, D + 0.6]])} fill="#a68a64" opacity={win} />);
  [[-40, D + 40], [W + 40, D + 20], [W + 30, -20]].forEach(([x, z], i) => out.push(<Tree key={`t${i}`} x={x} z={z} opacity={land} />));
  out.push(<Person key="p" x={W / 2 + 25} z={D + 40} />);
  return <g opacity={f} transform="translate(-40 -40)">{out}</g>;
}

export function CommercialScene({ p }: { p: number }) {
  const f = fadeLoop(p);
  const FL = 9, FH = 22, S = 80;
  const built = seg(p, 0.05, 0.75) * FL;
  const out: ReactNode[] = [];
  out.push(<Ground key="g" x0={-80} x1={S + 120} z0={-70} z1={S + 90} fill="#d9d4ca" />);
  out.push(<Ground key="plaza" x0={-30} x1={S + 70} z0={S + 10} z1={S + 70} fill="#efebe3" />);
  out.push(<Box key="podium" x0={-10} x1={S + 40} z0={-10} z1={S + 10} y0={0} y1={8} tone={T.concrete} />);
  for (let i = 0; i < FL; i++) {
    const t = ease(seg(built - i, 0, 1));
    if (t <= 0) continue;
    const y0 = 8 + i * FH, drop = (1 - t) * 30;
    out.push(<g key={i} opacity={t} transform={`translate(0 ${-drop})`}>
      <Box x0={0} x1={S} z0={0} z1={S} y0={y0} y1={y0 + FH} tone={T.glass} />
      <Box x0={-1} x1={S + 1} z0={-1} z1={S + 1} y0={y0 + FH - 3} y1={y0 + FH} tone={T.steel} />
      <WindowsZ x0={0} x1={S} z={S + 0.3} y0={y0} y1={y0 + FH - 3} cols={6} rows={1} fill="#5c757b" frame="#a68a64" lit={seg(p, 0.75, 0.9)} />
      <WindowsX z0={0} z1={S} x={S + 0.3} y0={y0} y1={y0 + FH - 3} cols={6} rows={1} fill="#86a0a6" frame="#a68a64" lit={seg(p, 0.75, 0.9)} />
    </g>);
  }
  // fins
  if (built >= FL - 0.01) out.push(<Box key="crown" x0={10} x1={S - 10} z0={10} z1={S - 10} y0={8 + FL * FH} y1={8 + FL * FH + 14 * ease(seg(p, 0.75, 0.82))} tone={T.dark} />);
  for (let i = 0; i < 6; i++) out.push(<Person key={`p${i}`} x={-10 + i * 18} z={S + 30 + (i % 2) * 14} />);
  [[S + 60, S + 50], [-20, S + 60]].forEach(([x, z], i) => out.push(<Tree key={`t${i}`} x={x} z={z} />));
  return <g opacity={f} transform="translate(-10 60)">{out}</g>;
}

export function Facade({ variant }: { variant: "old" | "new" }) {
  const W = 160, D = 70, H = 110;
  const old = variant === "old";
  return (
    <g>
      <Box x0={0} x1={W} z0={0} z1={D} y0={0} y1={H} tone={old ? { top: "#6b5547", right: "#7a4a37", left: "#5e3a2b" } : T.stone} />
      {old ? (
        <>
          <WindowsZ x0={4} x1={W - 4} z={D + 0.4} y0={6} y1={H - 6} cols={6} rows={3} fill="#2a2a28" frame="#4b3b31" />
          <WindowsX z0={4} z1={D - 4} x={W + 0.4} y0={6} y1={H - 6} cols={3} rows={3} fill="#2f2f2c" frame="#4b3b31" />
          {/* cracks & stains */}
          <path d={`M${iso(30, 90, D)[0]} ${iso(30, 90, D)[1]} l6 8 l-4 6 l7 9`} stroke="#2b1d16" fill="none" strokeWidth={0.8} />
          <path d={`M${iso(W, 40, 20)[0]} ${iso(W, 40, 20)[1]} l5 9 l-3 7`} stroke="#2b1d16" fill="none" strokeWidth={0.8} />
          <polygon points={pts([[60, H, 0], [60, H + 6, 10], [80, H + 2, 0]])} fill="#5e3a2b" />
        </>
      ) : (
        <>
          <Box x0={-3} x1={W + 3} z0={-3} z1={D + 3} y0={H} y1={H + 5} tone={T.steel} />
          <WindowsZ x0={4} x1={W - 4} z={D + 0.4} y0={6} y1={H - 6} cols={6} rows={3} fill="#5c757b" frame="#a68a64" lit={0.4} />
          <WindowsX z0={4} z1={D - 4} x={W + 0.4} y0={6} y1={H - 6} cols={3} rows={3} fill="#86a0a6" frame="#a68a64" lit={0.3} />
          <Box x0={W * 0.3} x1={W * 0.85} z0={D * 0.2} z1={D * 0.7} y0={H + 5} y1={H + 22} tone={T.glass} />
        </>
      )}
    </g>
  );
}

export function RenovationScene({ p }: { p: number }) {
  // ping-pong wipe from old → new
  const t = ease(seg(p < 0.5 ? p : 1 - p, 0.08, 0.42));
  const minX = -80, maxX = 180;
  const x = minX + (maxX - minX) * t;
  return (
    <g transform="translate(-50 10)">
      <defs>
        <clipPath id="reno-new"><rect x={minX - 10} y={-300} width={x - minX + 10} height={600} /></clipPath>
        <clipPath id="reno-old"><rect x={x} y={-300} width={600} height={600} /></clipPath>
      </defs>
      <Ground x0={-60} x1={220} z0={-50} z1={130} fill="#ddd7cb" />
      <g clipPath="url(#reno-old)"><Facade variant="old" /></g>
      <g clipPath="url(#reno-new)"><Facade variant="new" /><Tree x={-20} z={95} /><Tree x={175} z={80} s={0.9} /></g>
      <line x1={x} y1={-170} x2={x} y2={130} stroke="#a68a64" strokeWidth={1.5} />
      <g transform={`translate(${x} -170)`}><rect x={-26} y={-14} width={52} height={16} fill="#202725" /><text y={-3} textAnchor="middle" fontSize={7} fill="#f7f5f0" letterSpacing={1.5}>{t > 0.5 ? "AFTER" : "BEFORE"}</text></g>
    </g>
  );
}

export function ScheduleScene({ p }: { p: number }) {
  const tasks = [
    ["Feasibility", 0, 0.14], ["Design & approvals", 0.1, 0.36], ["Procurement", 0.3, 0.48], ["Groundworks", 0.42, 0.58],
    ["Structure", 0.52, 0.78], ["Envelope", 0.7, 0.88], ["Fit-out", 0.8, 0.96], ["Handover", 0.94, 1],
  ] as const;
  const X0 = -190, X1 = 190, Y0 = -130, RH = 30;
  const today = seg(p, 0.05, 0.85);
  const tx = X0 + 110 + (X1 - X0 - 110) * today;
  return (
    <g fontFamily="var(--font-manrope)">
      <rect x={X0 - 20} y={Y0 - 50} width={X1 - X0 + 40} height={tasks.length * RH + 90} fill="#fffdf8" stroke="#d8d1c4" />
      <text x={X0} y={Y0 - 25} fontSize={9} letterSpacing={2} fill="#a68a64">PROGRAMME · WEEKS 1–78</text>
      {Array.from({ length: 13 }, (_, i) => { const x = X0 + 110 + i * ((X1 - X0 - 110) / 12); return <g key={i}><line x1={x} y1={Y0 - 8} x2={x} y2={Y0 + tasks.length * RH} stroke="#ece6da" /><text x={x} y={Y0 - 12} fontSize={6} textAnchor="middle" fill="#9a948a">{i * 6}</text></g>; })}
      {tasks.map(([name, a, b], i) => {
        const y = Y0 + i * RH;
        const x0 = X0 + 110 + (X1 - X0 - 110) * a, full = (X1 - X0 - 110) * (b - a);
        const grow = ease(seg(p, i * 0.05, i * 0.05 + 0.25));
        const done = Math.min(1, Math.max(0, (today - a) / (b - a)));
        return (
          <g key={name}>
            <text x={X0} y={y + 14} fontSize={9} fill="#202725">{name}</text>
            <rect x={x0} y={y + 4} width={full * grow} height={14} fill="#e9e4da" />
            <rect x={x0} y={y + 4} width={full * grow * done} height={14} fill={done >= 1 ? "#202725" : "#a68a64"} />
            {done >= 1 && grow > 0.9 && <path d={`M${x0 + full - 10} ${y + 11} l3 3 l5 -6`} stroke="#f7f5f0" fill="none" strokeWidth={1.2} />}
          </g>
        );
      })}
      {[0.36, 0.78, 1].map((m, i) => { const x = X0 + 110 + (X1 - X0 - 110) * m; return <rect key={i} x={x - 4} y={Y0 + tasks.length * RH + 6} width={8} height={8} transform={`rotate(45 ${x} ${Y0 + tasks.length * RH + 10})`} fill={today >= m ? "#a68a64" : "none"} stroke="#a68a64" />; })}
      <line x1={tx} y1={Y0 - 8} x2={tx} y2={Y0 + tasks.length * RH + 2} stroke="#202725" strokeWidth={1.2} strokeDasharray="3 2" />
      <rect x={tx - 20} y={Y0 + tasks.length * RH + 20} width={40} height={14} fill="#202725" />
      <text x={tx} y={Y0 + tasks.length * RH + 30} fontSize={7} textAnchor="middle" fill="#f7f5f0" letterSpacing={1}>WK {Math.round(today * 78)}</text>
    </g>
  );
}

export function DesignBuildScene({ p }: { p: number }) {
  const f = fadeLoop(p);
  const draw = ease(seg(p, 0.02, 0.4));
  const solid = ease(seg(p, 0.42, 0.75));
  const W = 150, D = 100, H = 120;
  const edges: [number, number, number][][] = [
    [[0, 0, 0], [W, 0, 0], [W, 0, D], [0, 0, D], [0, 0, 0]],
    [[0, H, 0], [W, H, 0], [W, H, D], [0, H, D], [0, H, 0]],
    [[W, 0, 0], [W, H, 0]], [[W, 0, D], [W, H, D]], [[0, 0, D], [0, H, D]], [[0, 0, 0], [0, H, 0]],
    [[0, 60, D], [W, 60, D], [W, 60, 0]], [[W * 0.6, H, 0], [W * 0.6, H + 30, 0], [W, H + 30, 0], [W, H + 30, D * 0.6], [W * 0.6, H + 30, D * 0.6], [W * 0.6, H + 30, 0]],
  ];
  return (
    <g opacity={f} transform="translate(-30 40)">
      <g opacity={1 - solid * 0.8}>
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={-260} y1={-200 + i * 36} x2={260} y2={-200 + i * 36} stroke="#a68a64" strokeOpacity={0.15} />)}
      </g>
      <Ground x0={-40} x1={W + 40} z0={-40} z1={D + 50} fill="#e3ddd1" opacity={solid} />
      <g opacity={solid}>
        <Box x0={0} x1={W} z0={0} z1={D} y0={0} y1={H * solid} tone={T.stone} />
        <Box x0={W * 0.6} x1={W} z0={0} z1={D * 0.6} y0={H} y1={H + 30 * seg(solid, 0.7, 1)} tone={T.glass} />
        <WindowsZ x0={6} x1={W - 6} z={D + 0.4} y0={6} y1={H * solid - 4} cols={5} rows={3} opacity={seg(solid, 0.6, 1)} />
        <WindowsX z0={6} z1={D - 6} x={W + 0.4} y0={6} y1={H * solid - 4} cols={3} rows={3} opacity={seg(solid, 0.6, 1)} />
        <Tree x={-25} z={D + 30} opacity={seg(solid, 0.8, 1)} />
      </g>
      <g fill="none" stroke="#a68a64" strokeWidth={1} opacity={1 - solid * 0.6}>
        {edges.map((e, i) => {
          const d = "M" + e.map((q) => iso(...q).join(" ")).join(" L");
          return <path key={i} d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - seg(draw, i * 0.08, i * 0.08 + 0.4)} />;
        })}
      </g>
      <Dim from={[0, 0, D + 25]} to={[W, 0, D + 25]} label="15 000" opacity={draw} />
      <Dim from={[W + 25, 0, 0]} to={[W + 25, 0, D]} label="10 000" opacity={draw} />
    </g>
  );
}

export function DevelopmentScene({ p }: { p: number }) {
  const f = fadeLoop(p);
  const plot = ease(seg(p, 0, 0.1));
  const roads = ease(seg(p, 0.08, 0.2));
  const blocks = [
    { x: 0, z: 0, w: 60, d: 60, h: 130, at: 0.2, tone: T.stone },
    { x: 90, z: -10, w: 70, d: 50, h: 80, at: 0.3, tone: T.concrete },
    { x: 0, z: 100, w: 50, d: 50, h: 60, at: 0.4, tone: T.stone },
    { x: 90, z: 80, w: 80, d: 60, h: 105, at: 0.5, tone: T.concrete },
  ];
  return (
    <g opacity={f} transform="translate(-60 -20)">
      <Ground x0={-60} x1={230} z0={-60} z1={210} fill={mix("#7c705e", "#ddd7cb", plot)} />
      <g stroke="#a68a64" strokeDasharray="4 3" fill="none" opacity={1 - roads}><polygon points={pts([[-40, 0, -40], [210, 0, -40], [210, 0, 190], [-40, 0, 190]])} /></g>
      <Ground x0={-60} x1={230} z0={70} z1={88} fill="#4a5350" opacity={roads} />
      <Ground x0={68} x1={84} z0={-60} z1={210} fill="#4a5350" opacity={roads} />
      {blocks.sort((a, b) => a.x + a.z - (b.x + b.z)).map((b, i) => {
        const t = ease(seg(p, b.at, b.at + 0.25));
        return (
          <g key={i}>
            <Box x0={b.x} x1={b.x + b.w} z0={b.z} z1={b.z + b.d} y0={0} y1={b.h * t} tone={b.tone} opacity={seg(t, 0, 0.1)} />
            <WindowsZ x0={b.x + 3} x1={b.x + b.w - 3} z={b.z + b.d + 0.3} y0={4} y1={b.h * t - 4} cols={4} rows={Math.max(1, Math.round((b.h * t) / 22))} opacity={seg(t, 0.6, 1)} lit={seg(p, 0.8, 0.9) * 0.5} />
            <WindowsX z0={b.z + 3} z1={b.z + b.d - 3} x={b.x + b.w + 0.3} y0={4} y1={b.h * t - 4} cols={3} rows={Math.max(1, Math.round((b.h * t) / 22))} opacity={seg(t, 0.6, 1)} lit={seg(p, 0.8, 0.9) * 0.5} />
          </g>
        );
      })}
      {[[-30, 150], [40, 190], [190, 190], [200, 30], [-40, 40]].map(([x, z], i) => <Tree key={i} x={x} z={z} opacity={ease(seg(p, 0.7 + i * 0.03, 0.8 + i * 0.03))} />)}
    </g>
  );
}

/* ------------------------------ PROCESS SCENES ------------------------------ */

export function ConsultationScene({ p }: { p: number }) {
  const sketch = seg(p, 0.1, 0.8);
  const bubble = Math.floor(p * 4) % 2;
  const sheetLines: [number, number, number][][] = [
    [[20, 31, 12], [100, 31, 12], [100, 31, 58], [20, 31, 58], [20, 31, 12]],
    [[50, 31, 12], [50, 31, 58]], [[20, 31, 35], [100, 31, 35]], [[75, 31, 35], [75, 31, 58]],
  ];
  return (
    <g transform="translate(-55 -10) scale(1.55)">
      <Ground x0={-80} x1={200} z0={-60} z1={150} fill="#e9e4da" />
      <Box x0={0} x1={120} z0={0} z1={70} y0={26} y1={30} tone={T.timber} />
      {[[4, 4], [116, 4], [4, 66], [116, 66]].map(([x, z]) => <Box key={`${x}${z}`} x0={x - 2} x1={x + 2} z0={z - 2} z1={z + 2} y0={0} y1={26} tone={T.dark} />)}
      <polygon points={pts([[14, 30.5, 8], [106, 30.5, 8], [106, 30.5, 62], [14, 30.5, 62]])} fill="#f7f5f0" stroke="#d8d1c4" />
      {sheetLines.map((l, i) => <path key={i} d={"M" + l.map((q) => iso(...q).join(" ")).join(" L")} fill="none" stroke="#a68a64" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - seg(sketch, i * 0.2, i * 0.2 + 0.4)} />)}
      <Person x={60} z={95} color="#202725" />
      <Person x={150} z={30} color="#a68a64" />
      {[[60, 95, 0], [150, 30, 1]].map(([x, z, who]) => { const [a, b] = iso(x, 0, z); return (
        <g key={who} opacity={bubble === who ? 1 : 0.15} style={{ transition: "opacity .4s" }}>
          <rect x={a - 22} y={b - 46} width={44} height={20} rx={10} fill={who ? "#a68a64" : "#202725"} />
          {[0, 1, 2].map((d) => <circle key={d} cx={a - 8 + d * 8} cy={b - 36} r={2} fill="#f7f5f0" opacity={0.4 + 0.6 * ((Math.floor(p * 12) + d) % 3 === 0 ? 1 : 0)} />)}
        </g>
      ); })}
    </g>
  );
}

export function PlanningScene({ p }: { p: number }) {
  const d = ease(seg(p, 0.02, 0.7));
  const L = (x1: number, y1: number, x2: number, y2: number, i: number, dash?: string) => <line key={i} x1={x1} y1={y1} x2={x1 + (x2 - x1) * seg(d, i * 0.04, i * 0.04 + 0.35)} y2={y1 + (y2 - y1) * seg(d, i * 0.04, i * 0.04 + 0.35)} strokeDasharray={dash} />;
  return (
    <g>
      <rect x={-210} y={-160} width={420} height={320} fill="#202725" />
      <g stroke="#a68a64" strokeOpacity={0.18}>{Array.from({ length: 21 }, (_, i) => <line key={i} x1={-210 + i * 21} y1={-160} x2={-210 + i * 21} y2={160} />)}{Array.from({ length: 16 }, (_, i) => <line key={`h${i}`} x1={-210} y1={-160 + i * 21} x2={210} y2={-160 + i * 21} />)}</g>
      <g stroke="#c9b08a" strokeWidth={1.4} fill="none">
        {L(-150, -100, 150, -100, 0)}{L(150, -100, 150, 100, 1)}{L(150, 100, -150, 100, 2)}{L(-150, 100, -150, -100, 3)}
        {L(-30, -100, -30, 100, 4)}{L(-150, 10, -30, 10, 5)}{L(60, -100, 60, 30, 6)}{L(60, 30, 150, 30, 7)}
      </g>
      <g stroke="#c9b08a" strokeWidth={0.6} fill="none" opacity={seg(d, 0.4, 0.9)}>
        <path d="M-30 60 A40 40 0 0 1 10 100" strokeDasharray="3 2" />
        <path d="M60 -20 A30 30 0 0 0 30 10" strokeDasharray="3 2" />
        {L(-150, 125, 150, 125, 10)}{L(175, -100, 175, 100, 11)}
      </g>
      <g fill="#c9b08a" fontSize={8} letterSpacing={1.5} fontFamily="ui-monospace, monospace" opacity={seg(d, 0.7, 1)}>
        <text x={0} y={140} textAnchor="middle">18 000</text>
        <text x={192} y={4} textAnchor="middle" transform="rotate(90 192 4)">12 000</text>
        <text x={-90} y={-40} textAnchor="middle">LIVING</text><text x={-90} y={60} textAnchor="middle">STUDY</text>
        <text x={15} y={-30} textAnchor="middle">KITCHEN</text><text x={105} y={-40} textAnchor="middle">BED 1</text><text x={105} y={70} textAnchor="middle">TERRACE</text>
      </g>
      <g transform={`translate(${-150 + 300 * d} ${-100 + 200 * Math.abs(Math.sin(d * 6))})`} opacity={d < 1 ? 1 : 0}>
        <path d="M0 0 l14 -24 l4 2 l-14 24 z" fill="#f7f5f0" /><circle r={1.5} fill="#a68a64" />
      </g>
    </g>
  );
}

/** Excavator drawn in side elevation with articulated boom, stick and bucket. */
export function SitePrepScene({ p }: { p: number }) {
  // dig cycle (two per loop)
  const c = (p * 2) % 1;
  const k = (keys: [number, number][]) => { for (let i = 1; i < keys.length; i++) if (c <= keys[i][0]) { const [t0, v0] = keys[i - 1], [t1, v1] = keys[i]; const u = (c - t0) / (t1 - t0); return v0 + (v1 - v0) * (u * u * (3 - 2 * u)); } return keys[keys.length - 1][1]; };
  const swing = k([[0, 1], [0.3, 1], [0.45, -1], [0.7, -1], [0.85, 1], [1, 1]]); // 1 = facing the dig, -1 = facing the spoil pile
  const boom = k([[0, -10], [0.15, 18], [0.3, -25], [0.45, -30], [0.6, -15], [0.7, -15], [0.85, -10], [1, -10]]);
  const stick = k([[0, 40], [0.15, 75], [0.3, 60], [0.45, 50], [0.6, 30], [0.7, 30], [0.85, 40], [1, 40]]);
  const bucket = k([[0, -40], [0.15, 10], [0.3, 80], [0.5, 80], [0.6, -60], [0.7, -60], [0.85, -40], [1, -40]]);
  const pile = 0.4 + 0.6 * seg(p, 0, 1);
  const tracks = Math.sin(p * Math.PI * 2) * 4;
  const loaded = c > 0.25 && c < 0.6;
  return (
    <g transform="translate(10 10) scale(1.3)">
      <rect x={-260} y={40} width={520} height={120} fill="#8a7a63" />
      <path d="M-260 40 H70 Q110 85 150 40 H260" fill="none" stroke="#6b5c47" strokeWidth={2} />
      <path d={`M70 40 Q110 ${40 + 45 * (0.5 + p * 0.5)} 150 40 Z`} fill="#5e503e" />
      <path d={`M-230 40 Q-170 ${40 - 50 * pile} -110 40 Z`} fill="#9c8a6e" />
      <g transform={`translate(${tracks} 0)`}>
        {/* tracks */}
        <rect x={-55} y={20} width={110} height={20} rx={10} fill="#2a3130" />
        {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={-42 + i * 17} cy={30} r={5} fill="#4a5350" />)}
        <g transform={`scale(${swing === 0 ? 0.001 : swing} 1)`}>
          {/* house */}
          <rect x={-50} y={-10} width={95} height={30} fill="#d9a441" />
          <rect x={-50} y={-10} width={22} height={30} fill="#b98a30" />
          <rect x={10} y={-48} width={34} height={38} fill="#d9a441" />
          <rect x={16} y={-42} width={24} height={22} fill="#4b5f64" />
          {/* boom → stick → bucket */}
          <g transform={`translate(5 -15) rotate(${boom - 30})`}>
            <rect x={0} y={-5} width={80} height={10} rx={4} fill="#d9a441" />
            <g transform={`translate(80 0) rotate(${stick})`}>
              <rect x={0} y={-4} width={60} height={8} rx={3} fill="#c8952f" />
              <g transform={`translate(60 0) rotate(${bucket})`}>
                <path d="M0 -8 L18 -6 L22 10 L2 8 Z" fill="#3a3f3d" />
                {loaded && <path d="M2 -7 L17 -6 L14 -12 L5 -12 Z" fill="#6b5c47" />}
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

export function ConstructionScene2D({ p }: { p: number }) {
  const NX = 3, NZ = 2, B = 50, FH = 36, FL = 4;
  const built = seg(p, 0.05, 0.85) * FL;
  const out: ReactNode[] = [];
  out.push(<Ground key="g" x0={-50} x1={NX * B + 50} z0={-50} z1={NZ * B + 60} fill="#6c675f" />);
  out.push(<Box key="b" x0={-4} x1={NX * B + 4} z0={-4} z1={NZ * B + 4} y0={0} y1={5} tone={T.concrete} />);
  for (let f = 0; f < FL; f++) {
    const l = Math.min(1, Math.max(0, built - f));
    if (l <= 0) continue;
    const yb = 5 + f * FH, yt = yb + FH - 5;
    const cT = ease(seg(l, 0, 0.45)), bT = ease(seg(l, 0.4, 0.75)), sT = ease(seg(l, 0.7, 1));
    for (let i = 0; i <= NX; i++) for (let k = 0; k <= NZ; k++) out.push(<Box key={`c${f}${i}${k}`} x0={i * B - 2.5} x1={i * B + 2.5} z0={k * B - 2.5} z1={k * B + 2.5} y0={yb} y1={yb + (yt - yb) * cT} tone={T.concrete} />);
    for (let k = 0; k <= NZ; k++) out.push(<Box key={`bx${f}${k}`} x0={0} x1={NX * B * bT} z0={k * B - 1.5} z1={k * B + 1.5} y0={yt - 4} y1={yt} tone={T.steel} />);
    for (let i = 0; i <= NX; i++) out.push(<Box key={`bz${f}${i}`} x0={i * B - 1.5} x1={i * B + 1.5} z0={0} z1={NZ * B * bT} y0={yt - 4} y1={yt} tone={T.steel} />);
    out.push(<Box key={`s${f}`} x0={-3} x1={NX * B + 3} z0={-3} z1={NZ * B + 3} y0={yt} y1={yt + 5} tone={T.concrete} opacity={sT} />);
  }
  // welding sparks on the current level
  const lvl = Math.min(FL - 1, Math.floor(built));
  const [sx, sy] = iso(NX * B, 5 + lvl * FH + FH - 4, NZ * B);
  const spark = Math.floor(p * 60) % 3;
  return <g transform="translate(-10 30)">{out}<g opacity={built < FL ? 1 : 0}>{[0, 1, 2, 3, 4].map((i) => <line key={i} x1={sx} y1={sy} x2={sx + Math.cos(i * 1.3 + spark) * 9} y2={sy + Math.sin(i * 1.3 + spark) * 9 - 3} stroke="#f2c46d" strokeWidth={1} />)}<circle cx={sx} cy={sy} r={2.5} fill="#fff3d6" /></g></g>;
}

export function FinishingScene({ p }: { p: number }) {
  const W = 140, D = 90, FH = 34, FL = 4;
  const panels = seg(p, 0.05, 0.6);
  const lights = seg(p, 0.6, 0.85);
  const out: ReactNode[] = [];
  out.push(<Ground key="g" x0={-60} x1={W + 60} z0={-60} z1={D + 70} fill="#ddd7cb" />);
  out.push(<Box key="core" x0={0} x1={W} z0={0} z1={D} y0={0} y1={FL * FH} tone={T.concrete} />);
  for (let f = 0; f < FL; f++) {
    const t = ease(seg(panels * FL - f, 0, 1));
    out.push(<g key={f} opacity={t} transform={`translate(0 ${-(1 - t) * 14})`}>
      <polygon points={pts([[0, f * FH, D + 0.3], [W, f * FH, D + 0.3], [W, (f + 1) * FH, D + 0.3], [0, (f + 1) * FH, D + 0.3]])} fill="#ece6da" stroke="#a68a64" strokeWidth={0.5} />
      <polygon points={pts([[W + 0.3, f * FH, 0], [W + 0.3, f * FH, D], [W + 0.3, (f + 1) * FH, D], [W + 0.3, (f + 1) * FH, 0]])} fill="#d3cbbc" stroke="#a68a64" strokeWidth={0.5} />
      <WindowsZ x0={0} x1={W} z={D + 0.6} y0={f * FH} y1={(f + 1) * FH} cols={5} rows={1} lit={lights} fill="#4b5f64" />
      <WindowsX z0={0} z1={D} x={W + 0.6} y0={f * FH} y1={(f + 1) * FH} cols={3} rows={1} lit={lights} fill="#6f8a90" />
    </g>);
  }
  out.push(<Box key="parapet" x0={-2} x1={W + 2} z0={-2} z1={D + 2} y0={FL * FH} y1={FL * FH + 5 * ease(seg(p, 0.55, 0.65))} tone={T.steel} />);
  // painter on a mast-climbing platform
  const py = FH * FL * (1 - seg(p, 0.05, 0.6));
  const [a, b] = iso(W + 8, py, D * 0.5);
  out.push(<g key="plat" opacity={panels < 1 ? 1 : 0}><rect x={a - 18} y={b - 2} width={36} height={4} fill="#d9a441" /><line x1={a} y1={b} x2={a} y2={iso(W + 8, 0, D * 0.5)[1]} stroke="#8a8f8c" /><Person x={W + 8} z={D * 0.5 - 2} color="#e8772e" /></g>);
  [[-30, D + 40], [W + 40, D + 30]].forEach(([x, z], i) => out.push(<Tree key={`t${i}`} x={x} z={z} opacity={ease(seg(p, 0.65 + i * 0.05, 0.8))} />));
  return <g transform="translate(-20 40)">{out}</g>;
}

export function HandoverScene({ p }: { p: number }) {
  const key = ease(seg(p, 0.1, 0.5));
  const turn = ease(seg(p, 0.5, 0.65));
  const glow = seg(p, 0.6, 0.8);
  return (
    <g>
      <g transform="translate(-80 60)">
        <Ground x0={-60} x1={180} z0={-60} z1={150} fill="#ddd7cb" />
        <Ground x0={40} x1={70} z0={90} z1={150} fill="#f7f5f0" />
        <Box x0={0} x1={120} z0={0} z1={90} y0={0} y1={70} tone={T.stone} />
        <GableX x0={-6} x1={126} z0={-6} z1={96} y={70} h={30} tone={T.roof} />
        <WindowsZ x0={4} x1={116} z={90.4} y0={8} y1={64} cols={4} rows={2} lit={glow} />
        <WindowsX z0={4} z1={86} x={120.4} y0={8} y1={64} cols={3} rows={2} lit={glow} />
        <polygon points={pts([[47, 0, 90.6], [63, 0, 90.6], [63, 32, 90.6], [47, 32, 90.6]])} fill={mix("#a68a64", "#e8c98f", glow)} />
        <Tree x={-30} z={110} /><Tree x={150} z={60} s={0.9} />
        <Person x={58} z={125} /><Person x={68} z={128} color="#a68a64" />
      </g>
      <g transform={`translate(${120 - 30 * key} ${-60 + 20 * key}) rotate(${-30 + 30 * key + 90 * turn})`} opacity={seg(p, 0.05, 0.2)}>
        <circle r={18} fill="none" stroke="#a68a64" strokeWidth={5} />
        <rect x={16} y={-4} width={56} height={8} fill="#a68a64" />
        <rect x={56} y={4} width={6} height={10} fill="#a68a64" /><rect x={66} y={4} width={6} height={14} fill="#a68a64" />
      </g>
      <text x={140} y={70} textAnchor="middle" fontSize={10} letterSpacing={3} fill="#a68a64" opacity={glow}>KEYS HANDED OVER</text>
    </g>
  );
}
