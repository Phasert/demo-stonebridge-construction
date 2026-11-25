"use client";

import { Building2, ClipboardList, HardHat } from "lucide-react";
import { MotionConfig, motion } from "motion/react";

const services = [
  {
    icon: ClipboardList,
    name: "Preconstruction",
    description: "Define project scope, assess site constraints, and plan the budget and schedule before work starts.",
  },
  {
    icon: Building2,
    name: "Commercial construction",
    description: "Coordinate trades and site operations for new commercial buildings and industrial spaces.",
  },
  {
    icon: HardHat,
    name: "Renovation & fit-out",
    description: "Plan phased upgrades and interior build-outs around the day-to-day needs of occupants.",
  },
];

export function ServicesGrid() {
  return (
    <MotionConfig reducedMotion="user">
      <ul className="mt-8 grid gap-px border border-ink/15 bg-ink/15 md:grid-cols-3">
        {services.map(({ icon: Icon, name, description }) => (
          <motion.li
            key={name}
            className="bg-paper p-6 sm:p-8"
            whileHover={{ backgroundColor: "#fffaf0" }}
            transition={{ duration: 0.18 }}
          >
            <Icon className="mb-6 size-7" aria-hidden="true" />
            <h3 className="mb-2 text-xl font-semibold">{name}</h3>
            <p className="max-w-sm leading-relaxed text-ink/80">{description}</p>
          </motion.li>
        ))}
      </ul>
    </MotionConfig>
  );
}
