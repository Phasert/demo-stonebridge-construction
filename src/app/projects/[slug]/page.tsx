import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion";
import { ProjectPlate } from "@/components/project-plate";
import { BeforeAfter } from "@/components/before-after";
import { QuoteCta } from "@/components/cta";
import { projects } from "@/lib/data";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: `${p.name} (Concept)`, description: p.excerpt } : {};
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];

  return (
    <>
      <PageHero eyebrow={`Conceptual study · ${p.type}`} lines={p.name.split(" ").length > 2 ? [p.name.split(" ").slice(0, -1).join(" "), <em key="e" className="text-bronze-light">{p.name.split(" ").at(-1)}</em>] : [p.name]} intro={p.excerpt} visual={<ProjectPlate slug={p.slug} className="h-full w-full" label={`Conceptual isometric illustration of ${p.name}`} />} />

      <section className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-[90rem] gap-16 px-5 sm:px-10 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <dl className="divide-y divide-charcoal/15 border-y border-charcoal/15 lg:sticky lg:top-32">
              {[["Type", p.type], ["Setting", p.location], ["Status", "Conceptual — not built"], ["Gross area", p.area], ["Programme", p.duration], ...p.stats.map((s) => [s.label, s.value])].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-4 text-sm"><dt className="text-charcoal/55">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
              ))}
            </dl>
          </aside>
          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal><p className="eyebrow text-bronze">The brief</p></Reveal>
            <Reveal delay={0.1}><p className="mt-6 font-serif text-3xl leading-snug sm:text-4xl">{p.brief}</p></Reveal>
            <Reveal delay={0.2}><h2 className="eyebrow mt-16 text-bronze">Our approach</h2></Reveal>
            <ol className="mt-6 border-t border-charcoal/15">
              {p.approach.map((a, j) => (
                <Reveal key={a} delay={0.1 * j}><li className="flex gap-6 border-b border-charcoal/15 py-6 text-lg"><span className="font-serif text-bronze">0{j + 1}</span>{a}</li></Reveal>
              ))}
            </ol>
            <p className="mt-10 bg-stone p-6 text-sm leading-relaxed text-charcoal/70">
              <strong className="text-charcoal">Please note:</strong> this is a fictional, conceptual project created for a portfolio demonstration. Illustrations are original drawings made for this demo and do not depict a real building.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="stage-h" className="pb-28">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 id="stage-h" className="font-serif text-4xl sm:text-5xl">Mid-build <em className="text-bronze">vs.</em> complete</h2>
            <p className="max-w-sm text-sm text-charcoal/60">Drag to compare the concept part-way through construction with its finished state. Illustrative only.</p>
          </div>
          <BeforeAfter
            before={<ProjectPlate slug={p.slug} p={0.4} label={`${p.name} part-way through construction (concept)`} />}
            after={<ProjectPlate slug={p.slug} p={1} label={`${p.name} complete (concept)`} />}
            beforeLabel="Mid-build · concept" afterLabel="Complete · concept" label={`Compare ${p.name} mid-build and complete`}
          />
        </div>
      </section>

      <Link href={`/projects/${next.slug}`} className="group relative block overflow-hidden border-t border-charcoal/15 py-20 sm:py-28">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-10">
          <p className="eyebrow text-bronze">Next concept</p>
          <p className="mt-4 font-serif text-[clamp(2.8rem,8vw,7rem)] leading-none transition-transform duration-700 ease-arch group-hover:translate-x-6">{next.name} →</p>
        </div>
      </Link>
      <QuoteCta />
    </>
  );
}
