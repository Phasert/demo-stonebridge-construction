"use client";

import { useReducedMotionSafe } from "./use-reduced";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ProjectPlate } from "./project-plate";
import type { Project } from "@/lib/data";

/** Project card with a subtle 3D tilt and light sheen on hover. */
export function TiltCard({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotionSafe();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });
  const sheen = useTransform(mx, [0, 1], ["-20%", "120%"]);

  return (
    <motion.div style={{ perspective: 1200 }} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 1, delay: (index % 2) * 0.15 }}>
      <motion.div
        style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => { mx.set(0.5); my.set(0.5); }}
      >
        <Link href={`/projects/${project.slug}`} className="group block">
          <div className="relative aspect-[4/5] overflow-hidden bg-stone">
            <ProjectPlate slug={project.slug} label={`Conceptual illustration of ${project.name}`} className="absolute inset-0 h-full w-full transition-transform duration-[1.4s] ease-arch group-hover:scale-105" />
            <motion.span aria-hidden="true" className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-opacity group-hover:opacity-100" style={{ left: sheen }} />
            <span className="absolute top-5 left-5 bg-ivory/90 px-3 py-1.5 text-[0.62rem] tracking-[0.25em] text-charcoal uppercase">Concept · {project.type}</span>
            <span className="absolute right-5 bottom-5 flex size-14 translate-y-4 items-center justify-center rounded-full bg-bronze text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" style={{ transform: "translateZ(40px)" }} aria-hidden="true">→</span>
          </div>
          <div className="mt-6 flex items-start justify-between gap-6">
            <div>
              <h3 className="font-serif text-3xl sm:text-4xl">{project.name}</h3>
              <p className="mt-2 text-sm text-charcoal/60">{project.location} · {project.area}</p>
            </div>
            <span className="font-serif text-2xl text-bronze">0{index + 1}</span>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
