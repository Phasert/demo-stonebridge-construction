import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion";
import { TiltCard } from "@/components/tilt-card";
import { ProjectShowcase } from "@/components/project-showcase";
import { QuoteCta } from "@/components/cta";
import { projects } from "@/lib/data";
import { ProjectsHorizontal } from "@/components/projects-horizontal";
import { ProjectPlate } from "@/components/project-plate";

export const metadata: Metadata = { title: "Projects", description: "Conceptual construction case studies illustrating Stonebridge's residential, commercial, renovation and development work." };

export default function ProjectsPage() {
  return (
    <>
      <PageHero eyebrow="Projects" lines={["Places we", <em key="e" className="text-bronze-light">imagine building.</em>]} intro="Conceptual case studies created for this portfolio demo. They illustrate scope and approach — none are completed projects." visual={<ProjectPlate slug="the-old-mill-renewal" className="h-full w-full" label="Conceptual illustration of an industrial building renewal" />} />
      <ProjectsHorizontal />
      <section className="py-28 sm:py-36">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-10">
          <Reveal className="mb-16 flex flex-wrap items-center justify-between gap-6 border-b border-charcoal/15 pb-8">
            <p className="eyebrow text-bronze">{projects.length} conceptual studies</p>
            <p className="max-w-md text-sm text-charcoal/60">Every illustration is original, drawn in code for this demonstration. Concepts only — none are completed builds.</p>
          </Reveal>
          <div className="grid gap-x-10 gap-y-20 md:grid-cols-2">
            {projects.map((p, i) => <div key={p.slug} className={i % 2 ? "md:mt-32" : ""}><TiltCard project={p} index={i} /></div>)}
          </div>
        </div>
      </section>
      <section className="bg-charcoal py-28 text-ivory">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-10">
          <h2 className="mb-12 font-serif text-5xl">Explore the showcase</h2>
          <ProjectShowcase />
        </div>
      </section>
      <QuoteCta />
    </>
  );
}
