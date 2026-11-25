"use client";

/**
 * Procedural, fully original 3D construction site (no external assets).
 * - A rigged-by-hierarchy bricklayer performs a pick → lift → place → adjust → return cycle.
 * - A tower crane slews, trolleys, hoists a steel beam on slings, places and releases it.
 * - Dust particles, a rotating mixer drum and real-time shadows add life.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const C = {
  charcoal: "#202725",
  concrete: "#b9b3a7",
  concreteDark: "#8e897f",
  bronze: "#a68a64",
  steel: "#5b5f5c",
  crane: "#d9a441",
  brick: "#9c5a3c",
  vest: "#e8772e",
  skin: "#c08a64",
  trousers: "#2f3a45",
  hat: "#f2f0ea",
  ground: "#3a3934",
};

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const lerp = THREE.MathUtils.lerp;

/** Sample a keyframe track: [[time, value], ...] with smoothstep easing. */
function track(keys: [number, number][], t: number) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i];
    const [t0, v0] = keys[i - 1];
    if (t <= t1) return lerp(v0, v1, smooth((t - t0) / (t1 - t0)));
  }
  return keys[keys.length - 1][1];
}

/* ---------------------------------- Worker --------------------------------- */

type Pose = { yaw: number; crouch: number; spine: number; thigh: number; knee: number; shoulder: number; elbow: number; spread: number; head: number };
// Bricklaying cycle (seconds). Poses are interpolated with eased keyframes.
const W_CYCLE = 7.2;
const W_KEYS: [number, Pose][] = [
  [0.0, { yaw: 0.95, crouch: 0, spine: 0.08, thigh: -0.05, knee: 0.1, shoulder: 0.05, elbow: -0.25, spread: 0.12, head: 0.1 }],
  [1.2, { yaw: 0.95, crouch: 0.36, spine: 0.95, thigh: -1.05, knee: 1.6, shoulder: -0.85, elbow: -0.15, spread: 0.18, head: -0.2 }],
  [1.6, { yaw: 0.95, crouch: 0.36, spine: 0.95, thigh: -1.05, knee: 1.6, shoulder: -0.85, elbow: -0.15, spread: 0.18, head: -0.2 }],
  [2.6, { yaw: 0.95, crouch: 0.02, spine: 0.12, thigh: -0.08, knee: 0.15, shoulder: -0.7, elbow: -1.35, spread: 0.2, head: 0.1 }],
  [3.5, { yaw: -0.85, crouch: 0.02, spine: 0.12, thigh: -0.08, knee: 0.15, shoulder: -0.7, elbow: -1.35, spread: 0.2, head: 0.15 }],
  [4.3, { yaw: -0.85, crouch: 0.12, spine: 0.42, thigh: -0.35, knee: 0.55, shoulder: -1.05, elbow: -0.55, spread: 0.2, head: 0.05 }],
  [4.6, { yaw: -0.85, crouch: 0.12, spine: 0.42, thigh: -0.35, knee: 0.55, shoulder: -1.05, elbow: -0.55, spread: 0.2, head: 0.05 }],
  [5.6, { yaw: -0.85, crouch: 0.08, spine: 0.35, thigh: -0.25, knee: 0.4, shoulder: -0.25, elbow: -0.6, spread: 0.12, head: 0.2 }],
  [6.4, { yaw: -0.85, crouch: 0, spine: 0.08, thigh: -0.05, knee: 0.1, shoulder: 0.05, elbow: -0.25, spread: 0.12, head: 0.1 }],
  [W_CYCLE, { yaw: 0.95, crouch: 0, spine: 0.08, thigh: -0.05, knee: 0.1, shoulder: 0.05, elbow: -0.25, spread: 0.12, head: 0.1 }],
];
const W_GRAB = 1.55;
const W_RELEASE = 4.5;
const SLOTS = [-0.12, 0.08, 0.26, 0.42];

function samplePose(t: number, slot: number): Pose {
  const out = { ...W_KEYS[0][1] };
  for (const k of Object.keys(out) as (keyof Pose)[]) out[k] = track(W_KEYS.map(([tt, p]) => [tt, p[k]]), t);
  // Tap-adjust: small wrist taps after placing the brick.
  if (t > W_RELEASE && t < 5.3) out.elbow += Math.sin((t - W_RELEASE) * 22) * 0.06;
  // Turn slightly further along the wall for each subsequent brick.
  if (t > 2.6 && t < 6.4) out.yaw += SLOTS[slot] * clamp01((t - 2.6) / 0.9) * (1 - clamp01((t - 5.6) / 0.8));
  return out;
}

type Rig = {
  root: THREE.Group; pelvis: THREE.Group; spine: THREE.Group; head: THREE.Group;
  thighL: THREE.Group; thighR: THREE.Group; kneeL: THREE.Group; kneeR: THREE.Group;
  shL: THREE.Group; shR: THREE.Group; elL: THREE.Group; elR: THREE.Group; handL: THREE.Group; handR: THREE.Group;
};

function applyPose(r: Rig, p: Pose) {
  r.root.rotation.y = p.yaw;
  r.pelvis.position.y = 0.98 - p.crouch;
  r.spine.rotation.x = p.spine;
  r.head.rotation.x = p.head;
  r.thighL.rotation.x = p.thigh; r.thighR.rotation.x = p.thigh;
  r.kneeL.rotation.x = p.knee; r.kneeR.rotation.x = p.knee;
  r.shL.rotation.x = p.shoulder; r.shR.rotation.x = p.shoulder;
  r.shL.rotation.z = -p.spread; r.shR.rotation.z = p.spread;
  r.elL.rotation.x = p.elbow; r.elR.rotation.x = p.elbow;
}

/** Hands midpoint in world space (where the brick is held). */
function handsWorld(r: Rig, out: THREE.Vector3) {
  const a = new THREE.Vector3(), b = new THREE.Vector3();
  r.handL.getWorldPosition(a); r.handR.getWorldPosition(b);
  return out.copy(a).add(b).multiplyScalar(0.5);
}

function Limb({ len, radius, color }: { len: number; radius: number; color: string }) {
  return (
    <mesh position={[0, -len / 2, 0]} castShadow>
      <capsuleGeometry args={[radius, len - radius * 2, 4, 10]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

function Worker({ position, animate, rotation = 0 }: { position: [number, number, number]; animate: boolean; rotation?: number }) {
  // Bones are collected via callback refs into one mutable rig object (only read inside useFrame).
  const bones = useRef<Partial<Rig>>({});
  // eslint-disable-next-line react-hooks/refs -- callback refs only write bones; they are read exclusively inside useFrame
  const bone = (k: keyof Rig) => (o: THREE.Group | null) => { if (o) bones.current[k] = o; };
  const brick = useRef<THREE.Mesh>(null!);
  const placed = useRef<(THREE.Mesh | null)[]>([]);
  const wall = useRef<THREE.Group>(null!);
  const pile = useRef<THREE.Group>(null!);
  const state = useRef({ slot: 0, lastCycle: -1, calibrated: false, placeTargets: [] as THREE.Vector3[] });
  const tmp = useMemo(() => new THREE.Vector3(), []);


  useFrame(({ clock }) => {
    const r = bones.current as Rig;
    const s = state.current;
    const root = r.root.parent!;
    // Calibrate once: find where hands are when grabbing / placing so pile and wall line up exactly.
    if (!s.calibrated) {
      applyPose(r, samplePose(W_GRAB, 0)); root.updateMatrixWorld(true);
      const grab = handsWorld(r, new THREE.Vector3());
      root.worldToLocal(grab);
      pile.current.position.set(grab.x, 0, grab.z);
      pile.current.scale.y = Math.max(0.2, grab.y - 0.06) / 0.5;
      s.placeTargets = SLOTS.map((_, i) => {
        applyPose(r, samplePose(W_RELEASE, i)); root.updateMatrixWorld(true);
        return root.worldToLocal(handsWorld(r, new THREE.Vector3()));
      });
      const avg = s.placeTargets.reduce((acc, v) => acc.add(v), new THREE.Vector3()).multiplyScalar(1 / SLOTS.length);
      wall.current.position.set(avg.x, 0, avg.z);
      const a0 = s.placeTargets[0], a1 = s.placeTargets[SLOTS.length - 1];
      wall.current.rotation.y = Math.atan2(-(a1.z - a0.z), a1.x - a0.x);
      wall.current.scale.y = (avg.y - 0.06) / 1;
      s.calibrated = true;
    }

    const time = animate ? clock.elapsedTime : W_CYCLE * 0.36;
    const cycle = Math.floor(time / W_CYCLE);
    const t = time % W_CYCLE;
    if (cycle !== s.lastCycle) {
      s.lastCycle = cycle;
      s.slot = cycle % SLOTS.length;
      if (s.slot === 0) placed.current.forEach((m) => m && (m.visible = false));
    }
    applyPose(r, samplePose(t, s.slot));
    root.updateMatrixWorld(true);

    const carrying = t >= W_GRAB && t < W_RELEASE;
    brick.current.visible = carrying;
    if (carrying) {
      root.worldToLocal(handsWorld(r, tmp));
      brick.current.position.copy(tmp);
      brick.current.rotation.y = r.root.rotation.y;
    }
    const target = placed.current[s.slot];
    if (target && t >= W_RELEASE) {
      target.visible = true;
      target.position.copy(s.placeTargets[s.slot]);
      target.rotation.y = s.placeTargets.length ? samplePose(W_RELEASE, s.slot).yaw : 0;
    }
  });

  const vest = (
    <meshStandardMaterial color={C.vest} roughness={0.7} />
  );

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* brick pile */}
      <group ref={pile}>
        {[0, 1, 2].map((row) => [-0.13, 0.13].map((x) => (
          <mesh key={`${row}${x}`} position={[x, 0.5 * (row + 0.5) / 3, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.24, 0.5 / 3 - 0.01, 0.12]} />
            <meshStandardMaterial color={C.brick} roughness={0.9} />
          </mesh>
        )))}
      </group>
      {/* partially built wall */}
      <group ref={wall}>
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 1, 0.14]} />
          <meshStandardMaterial color={C.brick} roughness={0.95} />
        </mesh>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[0, (i + 1) / 6.5, 0]}>
            <boxGeometry args={[1.6, 0.012, 0.144]} />
            <meshStandardMaterial color="#d8cfc0" />
          </mesh>
        ))}
      </group>
      {SLOTS.map((_, i) => (
        <mesh key={i} ref={(m) => { placed.current[i] = m; }} visible={false} castShadow>
          <boxGeometry args={[0.24, 0.075, 0.12]} />
          <meshStandardMaterial color={C.brick} roughness={0.9} />
        </mesh>
      ))}
      <mesh ref={brick} castShadow>
        <boxGeometry args={[0.24, 0.075, 0.12]} />
        <meshStandardMaterial color={C.brick} roughness={0.9} />
      </mesh>

      {/* the worker */}
      <group ref={bone("root")}>
        <group ref={bone("pelvis")} position={[0, 0.98, 0]}>
          <mesh castShadow><boxGeometry args={[0.34, 0.16, 0.2]} /><meshStandardMaterial color={C.trousers} /></mesh>
          {(["L", "R"] as const).map((side) => (
            <group key={side} ref={bone(side === "L" ? "thighL" : "thighR")} position={[side === "L" ? 0.1 : -0.1, -0.05, 0]}>
              <Limb len={0.46} radius={0.075} color={C.trousers} />
              <group ref={bone(side === "L" ? "kneeL" : "kneeR")} position={[0, -0.46, 0]}>
                <Limb len={0.44} radius={0.06} color={C.trousers} />
                <mesh position={[0, -0.46, 0.05]} castShadow><boxGeometry args={[0.11, 0.08, 0.26]} /><meshStandardMaterial color="#3b2b1f" /></mesh>
              </group>
            </group>
          ))}
          <group ref={bone("spine")} position={[0, 0.06, 0]}>
            <mesh position={[0, 0.28, 0]} castShadow>
              <capsuleGeometry args={[0.17, 0.26, 4, 12]} />
              {vest}
            </mesh>
            {/* reflective strips */}
            {[0.22, 0.36].map((y) => (
              <mesh key={y} position={[0, y, 0]}><cylinderGeometry args={[0.175, 0.175, 0.03, 16, 1, true]} /><meshStandardMaterial color="#e9eae4" metalness={0.4} roughness={0.3} side={THREE.DoubleSide} /></mesh>
            ))}
            <group ref={bone("head")} position={[0, 0.58, 0]}>
              <mesh position={[0, 0.02, 0]} castShadow><cylinderGeometry args={[0.05, 0.06, 0.08]} /><meshStandardMaterial color={C.skin} /></mesh>
              <mesh position={[0, 0.14, 0.01]} castShadow><sphereGeometry args={[0.105, 20, 16]} /><meshStandardMaterial color={C.skin} roughness={0.7} /></mesh>
              {/* hard hat */}
              <mesh position={[0, 0.19, 0]} castShadow><sphereGeometry args={[0.122, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={C.hat} roughness={0.35} /></mesh>
              <mesh position={[0, 0.19, 0.03]}><cylinderGeometry args={[0.15, 0.15, 0.012, 24]} /><meshStandardMaterial color={C.hat} roughness={0.35} /></mesh>
            </group>
            {(["L", "R"] as const).map((side) => (
              <group key={side} ref={bone(side === "L" ? "shL" : "shR")} position={[side === "L" ? 0.22 : -0.22, 0.46, 0]}>
                <Limb len={0.3} radius={0.055} color={C.vest} />
                <group ref={bone(side === "L" ? "elL" : "elR")} position={[0, -0.3, 0]}>
                  <Limb len={0.28} radius={0.045} color={C.skin} />
                  <group ref={bone(side === "L" ? "handL" : "handR")} position={[side === "L" ? -0.03 : 0.03, -0.32, 0]}>
                    <mesh castShadow><sphereGeometry args={[0.05, 12, 10]} /><meshStandardMaterial color="#d6b46a" roughness={0.8} /></mesh>
                  </group>
                </group>
              </group>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}

/* ---------------------------------- Crane ---------------------------------- */

const CR = { x: -7, z: -6, height: 15, cycle: 18 };
// Pick from the laydown area, place on the building's top floor.
const PICK = { theta: -0.35, r: 7.5, y: 0.25 };
const PLACE = { theta: 0.62, r: 11.2, y: 9.46 };
const CRANE_KEYS = {
  theta: [[0, PICK.theta], [3.8, PICK.theta], [8.5, PLACE.theta], [13.5, PLACE.theta], [17.4, PICK.theta], [18, PICK.theta]] as [number, number][],
  r: [[0, PICK.r], [3.8, PICK.r], [8.5, PLACE.r], [13.5, PLACE.r], [17.4, PICK.r], [18, PICK.r]] as [number, number][],
  hook: [[0, PICK.y + 0.9], [1.2, PICK.y + 0.9], [3.8, 11.5], [8.5, 11.5], [10.6, PLACE.y + 0.9], [11.8, PLACE.y + 0.9], [13.5, 12.5], [15.5, 12.5], [17.6, PICK.y + 0.9], [18, PICK.y + 0.9]] as [number, number][],
};
const ATTACH = 1.0;
const RELEASE = 11.6;

function I_Beam({ opacity = 1 }: { opacity?: number }) {
  const m = <meshStandardMaterial color={C.bronze} metalness={0.6} roughness={0.4} transparent opacity={opacity} />;
  return (
    <group>
      <mesh castShadow position={[0, 0.14, 0]}><boxGeometry args={[4.2, 0.04, 0.24]} />{m}</mesh>
      <mesh castShadow><boxGeometry args={[4.2, 0.26, 0.04]} />{m}</mesh>
      <mesh castShadow position={[0, -0.14, 0]}><boxGeometry args={[4.2, 0.04, 0.24]} />{m}</mesh>
    </group>
  );
}

function Lattice({ h, w = 0.9 }: { h: number; w?: number }) {
  const segs = Math.round(h / w);
  const mat = <meshStandardMaterial color={C.crane} metalness={0.3} roughness={0.55} />;
  return (
    <group>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => (
        <mesh key={`${a}${b}`} position={[(a * w) / 2, h / 2, (b * w) / 2]} castShadow><boxGeometry args={[0.07, h, 0.07]} />{mat}</mesh>
      ))}
      {Array.from({ length: segs }, (_, i) => (
        <group key={i} position={[0, i * w + w / 2, 0]}>
          {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((ry) => (
            <mesh key={ry} rotation={[0, ry, Math.PI / 4]} position={[Math.sin(ry) * w / 2, 0, Math.cos(ry) * w / 2]}>
              <boxGeometry args={[0.03, w * 1.414, 0.03]} />{mat}
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Crane({ animate }: { animate: boolean }) {
  const slew = useRef<THREE.Group>(null!);
  const trolley = useRef<THREE.Group>(null!);
  const cable = useRef<THREE.Mesh>(null!);
  const hook = useRef<THREE.Group>(null!);
  const beam = useRef<THREE.Group>(null!);
  const placedBeam = useRef<THREE.Group>(null!);
  const pileBeam = useRef<THREE.Group>(null!);
  const slings = useRef<THREE.Group>(null!);
  const jibY = CR.height + 0.6;

  useFrame(({ clock }) => {
    const t = animate ? clock.elapsedTime % CR.cycle : 9.5;
    const theta = track(CRANE_KEYS.theta, t);
    const r = track(CRANE_KEYS.r, t);
    const hy = track(CRANE_KEYS.hook, t);
    slew.current.rotation.y = theta;
    trolley.current.position.x = r;
    const drop = jibY - hy;
    cable.current.scale.y = drop;
    cable.current.position.y = -drop / 2;
    hook.current.position.y = -drop;

    const hookWorld = new THREE.Vector3(CR.x + r * Math.cos(theta), hy, CR.z - r * Math.sin(theta));
    const attached = t >= ATTACH && t < RELEASE;
    beam.current.visible = attached;
    slings.current.visible = attached;
    beam.current.position.copy(hookWorld).add(new THREE.Vector3(0, -0.9, 0));
    beam.current.rotation.y = theta;
    // Beam waiting on the laydown area, then placed on the slab; both fade gently between cycles.
    pileBeam.current.visible = t < ATTACH;
    const placedVisible = t >= RELEASE;
    placedBeam.current.visible = placedVisible;
    if (placedVisible) {
      const fade = 1 - clamp01((t - 16.4) / 1.4);
      placedBeam.current.traverse((o) => { if ((o as THREE.Mesh).material) ((o as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = fade; });
    }
  });

  const placePos: [number, number, number] = [CR.x + PLACE.r * Math.cos(PLACE.theta), PLACE.y, CR.z - PLACE.r * Math.sin(PLACE.theta)];
  const pickPos: [number, number, number] = [CR.x + PICK.r * Math.cos(PICK.theta), PICK.y, CR.z - PICK.r * Math.sin(PICK.theta)];

  return (
    <>
      <group position={[CR.x, 0, CR.z]}>
        <mesh position={[0, 0.2, 0]} receiveShadow castShadow><boxGeometry args={[2.4, 0.4, 2.4]} /><meshStandardMaterial color={C.concreteDark} /></mesh>
        <Lattice h={CR.height} />
        <group ref={slew} position={[0, CR.height, 0]}>
          {/* cab + slewing unit */}
          <mesh position={[0.2, 0.35, 0.7]} castShadow><boxGeometry args={[1, 0.8, 0.8]} /><meshStandardMaterial color={C.crane} /></mesh>
          <mesh position={[0.25, 0.4, 1.0]}><boxGeometry args={[0.7, 0.45, 0.05]} /><meshStandardMaterial color="#1b2326" metalness={0.8} roughness={0.15} /></mesh>
          {/* jib */}
          <group position={[0, 0.6, 0]}>
            <mesh position={[7, 0, 0]} castShadow><boxGeometry args={[14, 0.12, 0.12]} /><meshStandardMaterial color={C.crane} /></mesh>
            <mesh position={[7, 0.55, 0]} rotation={[0, 0, -0.035]} castShadow><boxGeometry args={[14, 0.08, 0.08]} /><meshStandardMaterial color={C.crane} /></mesh>
            {Array.from({ length: 20 }, (_, i) => (
              <mesh key={i} position={[i * 0.7 + 0.35, 0.27, 0]} rotation={[0, 0, i % 2 ? 0.7 : -0.7]}><boxGeometry args={[0.035, 0.75, 0.035]} /><meshStandardMaterial color={C.crane} /></mesh>
            ))}
            {/* counter-jib + counterweights */}
            <mesh position={[-2.6, 0, 0]} castShadow><boxGeometry args={[5.2, 0.14, 0.5]} /><meshStandardMaterial color={C.crane} /></mesh>
            <mesh position={[-4.6, -0.5, 0]} castShadow><boxGeometry args={[1.2, 1, 0.9]} /><meshStandardMaterial color={C.concrete} /></mesh>
            {/* apex */}
            <mesh position={[0, 1.6, 0]} castShadow><boxGeometry args={[0.18, 3.2, 0.18]} /><meshStandardMaterial color={C.crane} /></mesh>
            <mesh position={[5.5, 1.75, 0]} rotation={[0, 0, -0.25]}><boxGeometry args={[11.3, 0.025, 0.025]} /><meshStandardMaterial color="#222" /></mesh>
            <mesh position={[-2.4, 1.6, 0]} rotation={[0, 0, 0.55]}><boxGeometry args={[5.6, 0.025, 0.025]} /><meshStandardMaterial color="#222" /></mesh>
            <group ref={trolley} position={[PICK.r, 0, 0]}>
              <mesh position={[0, -0.12, 0]} castShadow><boxGeometry args={[0.5, 0.18, 0.4]} /><meshStandardMaterial color="#333" /></mesh>
              <mesh ref={cable} position={[0, -1, 0]}><boxGeometry args={[0.02, 1, 0.02]} /><meshStandardMaterial color="#111" /></mesh>
              <group ref={hook}>
                <mesh castShadow><boxGeometry args={[0.32, 0.38, 0.22]} /><meshStandardMaterial color={C.crane} /></mesh>
                <mesh position={[0, -0.28, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.1, 0.03, 8, 16, Math.PI * 1.5]} /><meshStandardMaterial color="#333" metalness={0.8} /></mesh>
              </group>
            </group>
          </group>
        </group>
      </group>

      <group ref={beam}>
        <I_Beam />
        <group ref={slings}>
          {[-1.6, 1.6].map((x) => (
            <mesh key={x} position={[x / 2, 0.45, 0]} rotation={[0, 0, Math.atan2(x, 0.9)]}>
              <boxGeometry args={[0.015, Math.hypot(x, 0.9), 0.015]} />
              <meshStandardMaterial color="#111" />
            </mesh>
          ))}
        </group>
      </group>
      <group ref={pileBeam} position={pickPos} rotation={[0, PICK.theta, 0]}><I_Beam /></group>
      <group ref={placedBeam} position={placePos} rotation={[0, PLACE.theta, 0]} visible={false}><I_Beam /></group>
      {/* timber dunnage in the laydown area */}
      {[-1.2, 1.2].map((o) => (
        <mesh key={o} position={[pickPos[0] + o * Math.cos(PICK.theta), 0.05, pickPos[2] - o * Math.sin(PICK.theta)]} rotation={[0, PICK.theta + Math.PI / 2, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.8, 0.1, 0.12]} /><meshStandardMaterial color="#7a6146" />
        </mesh>
      ))}
    </>
  );
}

/* --------------------------------- Building -------------------------------- */

function Building() {
  // Concrete frame: 3 finished slabs, a 4th floor under construction where beams are placed.
  const base: [number, number, number] = [CR.x + PLACE.r * Math.cos(PLACE.theta), 0, CR.z - PLACE.r * Math.sin(PLACE.theta)];
  const floors = 3;
  const fh = 3;
  const W = 9, D = 6;
  return (
    <group position={base} rotation={[0, PLACE.theta, 0]}>
      {Array.from({ length: floors + 1 }, (_, f) => (
        <mesh key={f} position={[0, f * fh + 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[W, 0.3, D]} /><meshStandardMaterial color={C.concrete} roughness={0.9} />
        </mesh>
      ))}
      {Array.from({ length: floors }, (_, f) =>
        [-W / 2 + 0.3, -W / 6, W / 6, W / 2 - 0.3].flatMap((x) => [-D / 2 + 0.3, D / 2 - 0.3].map((z) => (
          <mesh key={`${f}${x}${z}`} position={[x, f * fh + fh / 2 + 0.15, z]} castShadow>
            <boxGeometry args={[0.35, fh, 0.35]} /><meshStandardMaterial color={C.concreteDark} roughness={0.9} />
          </mesh>
        ))),
      )}
      {/* glazing installed on the lower floor */}
      <mesh position={[0, 1.65, D / 2 - 0.2]}><boxGeometry args={[W - 0.8, 2.6, 0.05]} /><meshStandardMaterial color="#3d4a4c" metalness={0.7} roughness={0.15} /></mesh>
      {/* top-level starter columns + rebar */}
      {[-W / 2 + 0.3, W / 2 - 0.3].map((x) => [-D / 2 + 0.3, D / 2 - 0.3].map((z) => (
        <mesh key={`${x}${z}`} position={[x, floors * fh + 0.9, z]} castShadow><boxGeometry args={[0.35, 1.5, 0.35]} /><meshStandardMaterial color={C.concreteDark} /></mesh>
      )))}
      {/* scaffolding on one face */}
      <group position={[0, 0, -D / 2 - 0.6]}>
        {Array.from({ length: 7 }, (_, i) => (
          <mesh key={i} position={[-W / 2 + i * (W / 6), (floors * fh + 1) / 2, 0]}><boxGeometry args={[0.05, floors * fh + 1, 0.05]} /><meshStandardMaterial color="#8a8f8c" metalness={0.6} /></mesh>
        ))}
        {Array.from({ length: floors * 2 + 1 }, (_, i) => (
          <mesh key={i} position={[0, i * 1.5 + 0.2, 0]}><boxGeometry args={[W, 0.05, 0.05]} /><meshStandardMaterial color="#8a8f8c" metalness={0.6} /></mesh>
        ))}
      </group>
    </group>
  );
}

function Mixer({ animate }: { animate: boolean }) {
  const drum = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { if (animate) drum.current.rotation.x += dt * 1.2; });
  return (
    <group position={[9.5, 0, -3]} rotation={[0, -0.7, 0]}>
      <mesh position={[0, 0.85, 1.6]} castShadow><boxGeometry args={[1.9, 1.3, 1.3]} /><meshStandardMaterial color={C.hat} /></mesh>
      <mesh position={[0, 1.05, 2.27]}><boxGeometry args={[1.6, 0.6, 0.02]} /><meshStandardMaterial color="#1d2427" metalness={0.8} roughness={0.2} /></mesh>
      <mesh position={[0, 0.45, 0]} castShadow><boxGeometry args={[1.8, 0.3, 4.6]} /><meshStandardMaterial color="#2b2b2b" /></mesh>
      <mesh ref={drum} position={[0, 1.55, -0.6]} rotation={[0.25, 0, 0]} castShadow>
        <cylinderGeometry args={[0.6, 1.0, 2.8, 20]} /><meshStandardMaterial color={C.bronze} metalness={0.3} roughness={0.5} />
      </mesh>
      {[[-0.95, 1.4], [0.95, 1.4], [-0.95, -1.2], [0.95, -1.2]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.38, z]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.38, 0.38, 0.28, 18]} /><meshStandardMaterial color="#151515" /></mesh>
      ))}
    </group>
  );
}

function Dust({ animate, count = 260 }: { animate: boolean; count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3);
    // deterministic pseudo-random scatter
    let s = 7;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < count; i++) { p[i * 3] = (rnd() - 0.5) * 30; p[i * 3 + 1] = rnd() * 8; p[i * 3 + 2] = (rnd() - 0.5) * 20; }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, [count]);
  useFrame((_, dt) => {
    if (!animate) return;
    const a = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let x = a.getX(i) + dt * 0.35; let y = a.getY(i) + Math.sin(x * 0.7 + i) * dt * 0.08;
      if (x > 15) x = -15; if (y > 8) y = 0;
      a.setXY(i, x, y);
    }
    a.needsUpdate = true;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.06} color="#d9c7a6" transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

function Rig({ mobile, animate }: { mobile: boolean; animate: boolean }) {

  const base = useMemo(() => (mobile ? new THREE.Vector3(-4, 4, 30) : new THREE.Vector3(-13, 3.2, 22)), [mobile]);
  const look = useMemo(() => (mobile ? new THREE.Vector3(-2, 8, -4) : new THREE.Vector3(-11, 5, -4)), [mobile]);
  useFrame(({ clock, camera, pointer }) => {
    const drift = animate ? Math.sin(clock.elapsedTime * 0.08) * 0.8 : 0;
    camera.position.x = lerp(camera.position.x, base.x + drift + (animate ? pointer.x * 0.8 : 0), 0.04);
    camera.position.y = lerp(camera.position.y, base.y + (animate ? pointer.y * 0.4 : 0), 0.04);
    camera.position.z = base.z;
    camera.lookAt(look);
  });
  return null;
}

export default function ConstructionScene({ active, reduced, mobile }: { active: boolean; reduced: boolean; mobile: boolean }) {
  const animate = !reduced;
  return (
    <Canvas
      shadows={!mobile}
      dpr={mobile ? [1, 1.25] : [1, 1.75]}
      frameloop={active ? (reduced ? "demand" : "always") : "never"}
      camera={{ position: [-13, 3.2, 22], fov: mobile ? 52 : 45, near: 0.1, far: 120 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; }}
      aria-hidden="true"
    >
      <color attach="background" args={[C.charcoal]} />
      <fog attach="fog" args={[C.charcoal, 22, 60]} />
      <hemisphereLight args={["#f3e6cf", "#2a2f2c", 0.8]} />
      <directionalLight position={[-12, 6, 14]} intensity={0.5} color="#c9d4d8" />
      <directionalLight
        position={[14, 18, 10]}
        intensity={2.4}
        color="#ffd9a8"
        castShadow
        shadow-mapSize={[1536, 1536]}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-bias={-0.0004}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial color={C.ground} roughness={1} />
      </mesh>
      {/* site hoarding with bronze line */}
      <mesh position={[0, 1, -16]}><boxGeometry args={[60, 2, 0.1]} /><meshStandardMaterial color="#2c3331" /></mesh>
      <Building />
      <Crane animate={animate} />
      <Mixer animate={animate} />
      <Worker position={mobile ? [-1, 0, 6] : [-7, 0, 10]} animate={animate} rotation={2.5} />
      {!mobile && <Dust animate={animate} />}
      <Rig mobile={mobile} animate={animate} />
      <InvalidateOnce />
    </Canvas>
  );
}

function InvalidateOnce() {
  const { invalidate } = useThree();
  useEffect(() => { const id = setTimeout(() => invalidate(), 50); return () => clearTimeout(id); }, [invalidate]);
  return null;
}
