"use client";

import { useReducedMotionSafe } from "./use-reduced";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import type { ImageProps } from "next/image";
import { Photo } from "./photo";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, delay = 0, className = "", y = 32 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduce = useReducedMotionSafe();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Line-by-line masked headline reveal. Pass lines as an array. */
export function SplitHeading({
  lines,
  as: Tag = "h2",
  className = "",
  delay = 0,
  immediate = false,
}: {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const reduce = useReducedMotionSafe();
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      className={className}
      initial={reduce ? false : "hidden"}
      {...(immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-10% 0px" } })}
      transition={{ staggerChildren: 0.12, delayChildren: delay }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            variants={{ hidden: { y: "110%", rotate: 2 }, show: { y: 0, rotate: 0, transition: { duration: 1.1, ease } } }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/** Image revealed through an animated architectural mask, with gentle parallax. */
export function MaskImage({
  src,
  alt,
  className = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  direction = "up",
  parallax = 8,
  preload,
  children,
}: {
  src?: string;
  alt?: string;
  children?: ReactNode;
  className?: string;
  sizes?: string;
  direction?: "up" | "left" | "right";
  parallax?: number;
  preload?: ImageProps["preload"];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`]);
  const from = { up: "inset(100% 0 0 0)", left: "inset(0 100% 0 0)", right: "inset(0 0 0 100%)" }[direction];
  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden bg-stone ${className}`}
      initial={reduce ? false : { clipPath: from }}
      whileInView={{ clipPath: "inset(0 0 0 0)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div className="absolute -inset-y-[12%] inset-x-0" style={reduce ? undefined : { y }}>
        <motion.div
          className="relative h-full w-full"
          initial={reduce ? false : { scale: 1.25 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease }}
        >
          {children ?? (src && <Photo src={src} alt={alt ?? ""} fill sizes={sizes} className="object-cover" preload={preload} />)}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/** Blueprint linework that draws itself as it enters the viewport. */
export function Blueprint({ className = "" }: { className?: string }) {
  const reduce = useReducedMotionSafe();
  const draw = (d: number) => ({
    initial: reduce ? false : { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true },
    transition: { duration: 2.2, delay: d, ease: "easeInOut" as const },
  });
  return (
    <svg viewBox="0 0 400 300" fill="none" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1">
        <motion.path d="M40 260 H360" {...draw(0)} />
        <motion.path d="M70 260 V120 L200 50 L330 120 V260" {...draw(0.2)} />
        <motion.path d="M70 120 H330" {...draw(0.6)} />
        <motion.path d="M110 260 V170 H160 V260" {...draw(0.9)} />
        <motion.path d="M200 150 H290 V210 H200 Z" {...draw(1.1)} />
        <motion.path d="M245 150 V210 M200 180 H290" {...draw(1.4)} />
        <motion.path d="M200 50 V20 M180 20 H220" {...draw(1.6)} strokeDasharray="4 4" />
        <motion.path d="M40 280 H360 M40 274 V286 M360 274 V286" {...draw(1.8)} />
        <motion.circle cx="200" cy="95" r="14" {...draw(1.2)} />
      </g>
      <motion.text x="200" y="296" textAnchor="middle" fill="currentColor" fontSize="9" letterSpacing="3"
        initial={reduce ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2.4 }}>
        ELEVATION A — 1:100
      </motion.text>
    </svg>
  );
}
