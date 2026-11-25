import type { ReactNode } from "react";

export const COS = Math.cos(Math.PI / 6);
export const iso = (x: number, y: number, z: number) => [(x - z) * COS, (x + z) * 0.5 - y] as const;
export const pts = (list: [number, number, number][]) => list.map(([x, y, z]) => iso(x, y, z).join(",")).join(" ");
export const clamp = (v: number) => Math.min(1, Math.max(0, v));
export const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const c = [16, 8, 0].map((s) => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export type Tone = { top: string; right: string; left: string; stroke?: string };
export const T = {
  concrete: { top: "#d9d3c7", right: "#bdb6a8", left: "#a59e91" },
  stone: { top: "#ece6da", right: "#d3cbbc", left: "#b9b0a0" },
  footing: { top: "#9a948a", right: "#7f796f", left: "#6c675f" },
  steel: { top: "#c9b08a", right: "#a68a64", left: "#8a714f", stroke: "rgba(32,39,37,.25)" },
  timber: { top: "#b98d5e", right: "#9c7449", left: "#80603c" },
  brick: { top: "#b7735a", right: "#9c5a3c", left: "#7f4630" },
  dark: { top: "#4a5350", right: "#353d3b", left: "#2a3130" },
  glass: { top: "#9bb3b8", right: "#6f8a90", left: "#4b5f64" },
  roof: { top: "#5d6461", right: "#4a504e", left: "#3b413f" },
  green: { top: "#8f9a7e", right: "#76816a", left: "#626c57" },
} satisfies Record<string, Tone>;

export function Box({ x0, y0, z0, x1, y1, z1, tone, opacity = 1, stroke }: { x0: number; y0: number; z0: number; x1: number; y1: number; z1: number; tone: Tone; opacity?: number; stroke?: string }) {
  if (y1 - y0 < 0.01 || x1 - x0 < 0.01 || z1 - z0 < 0.01 || opacity <= 0) return null;
  const s = stroke ?? tone.stroke ?? "rgba(32,39,37,.35)";
  return (
    <g opacity={opacity} strokeWidth={0.6} stroke={s} strokeLinejoin="round">
      <polygon points={pts([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]])} fill={tone.right} />
      <polygon points={pts([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]])} fill={tone.left} />
      <polygon points={pts([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]])} fill={tone.top} />
    </g>
  );
}

/** Pitched roof prism running along x (ridge parallel to x). */
export function GableX({ x0, x1, z0, z1, y, h, tone, opacity = 1 }: { x0: number; x1: number; z0: number; z1: number; y: number; h: number; tone: Tone; opacity?: number }) {
  if (h <= 0.01 || opacity <= 0) return null;
  const zm = (z0 + z1) / 2;
  return (
    <g opacity={opacity} stroke="rgba(32,39,37,.4)" strokeWidth={0.6} strokeLinejoin="round">
      <polygon points={pts([[x1, y, z0], [x1, y + h, zm], [x1, y, z1]])} fill={tone.right} />
      <polygon points={pts([[x0, y + h, zm], [x1, y + h, zm], [x1, y, z1], [x0, y, z1]])} fill={tone.left} />
      <polygon points={pts([[x0, y, z0], [x1, y, z0], [x1, y + h, zm], [x0, y + h, zm]])} fill={tone.top} />
    </g>
  );
}

/** Window grid on the +z face (left visible face). */
export function WindowsZ({ x0, x1, z, y0, y1, cols, rows, fill = "#4b5f64", frame = "#a68a64", opacity = 1, lit = 0 }: { x0: number; x1: number; z: number; y0: number; y1: number; cols: number; rows: number; fill?: string; frame?: string; opacity?: number; lit?: number }) {
  const out: ReactNode[] = [];
  const w = (x1 - x0) / cols, h = (y1 - y0) / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const a = x0 + c * w + w * 0.18, b = a + w * 0.64, yy = y0 + r * h + h * 0.2, yt = yy + h * 0.6;
    out.push(<polygon key={`${r}-${c}`} points={pts([[a, yy, z], [b, yy, z], [b, yt, z], [a, yt, z]])} fill={(r * 7 + c * 3) % 5 < lit * 5 ? "#e8c98f" : fill} stroke={frame} strokeWidth={0.5} />);
  }
  return <g opacity={opacity}>{out}</g>;
}

/** Window grid on the +x face (right visible face). */
export function WindowsX({ z0, z1, x, y0, y1, cols, rows, fill = "#6f8a90", frame = "#a68a64", opacity = 1, lit = 0 }: { z0: number; z1: number; x: number; y0: number; y1: number; cols: number; rows: number; fill?: string; frame?: string; opacity?: number; lit?: number }) {
  const out: ReactNode[] = [];
  const w = (z1 - z0) / cols, h = (y1 - y0) / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const a = z0 + c * w + w * 0.18, b = a + w * 0.64, yy = y0 + r * h + h * 0.2, yt = yy + h * 0.6;
    out.push(<polygon key={`${r}-${c}`} points={pts([[x, yy, a], [x, yy, b], [x, yt, b], [x, yt, a]])} fill={(r * 5 + c * 2) % 5 < lit * 5 ? "#e8c98f" : fill} stroke={frame} strokeWidth={0.5} />);
  }
  return <g opacity={opacity}>{out}</g>;
}

export function Ground({ x0, x1, z0, z1, fill, y = 0, opacity = 1 }: { x0: number; x1: number; z0: number; z1: number; fill: string; y?: number; opacity?: number }) {
  return <polygon points={pts([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]])} fill={fill} opacity={opacity} />;
}

export function Tree({ x, z, s = 1, opacity = 1 }: { x: number; z: number; s?: number; opacity?: number }) {
  const [a, b] = iso(x, 0, z);
  return (
    <g opacity={opacity}>
      <line x1={a} y1={b} x2={a} y2={b - 20 * s} stroke="#5b4a36" strokeWidth={1.4} />
      <circle cx={a} cy={b - 28 * s} r={11 * s} fill="#6f7d62" />
      <circle cx={a + 4 * s} cy={b - 32 * s} r={7 * s} fill="#85927a" />
    </g>
  );
}

/** Small isometric human figure (for scale). */
export function Person({ x, z, color = "#202725" }: { x: number; z: number; color?: string }) {
  const [a, b] = iso(x, 0, z);
  return (
    <g fill={color}>
      <rect x={a - 1.6} y={b - 11} width={3.2} height={8} rx={1.4} />
      <circle cx={a} cy={b - 13} r={1.8} />
      <rect x={a - 1.4} y={b - 4} width={1.2} height={4} /><rect x={a + 0.2} y={b - 4} width={1.2} height={4} />
    </g>
  );
}

export function Dim({ from, to, label, offset = 0, color = "#a68a64", opacity = 1 }: { from: [number, number, number]; to: [number, number, number]; label: string; offset?: number; color?: string; opacity?: number }) {
  const [ax, ay] = iso(...from), [bx, by] = iso(...to);
  const mx = (ax + bx) / 2, my = (ay + by) / 2 + offset;
  return (
    <g stroke={color} strokeWidth={0.7} opacity={opacity}>
      <line x1={ax} y1={ay} x2={bx} y2={by} />
      <line x1={ax} y1={ay - 4} x2={ax} y2={ay + 4} /><line x1={bx} y1={by - 4} x2={bx} y2={by + 4} />
      <text x={mx} y={my - 5} fill={color} stroke="none" fontSize={7} textAnchor="middle" letterSpacing={1.5} fontFamily="ui-monospace, monospace">{label}</text>
    </g>
  );
}
