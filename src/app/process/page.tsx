import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ProcessSteps } from "@/components/process-steps";
import { ProcessExperience } from "@/components/process-experience";
import { SceneFigure } from "@/components/scene-figure";
import { Blueprint, Reveal } from "@/components/motion";
import { QuoteCta } from "@/components/cta";

export const metadata: Metadata = { title: "Our Process", description: "From consultation to handover — the five-stage Stonebridge construction process." };

const faqs = [
  ["How early should we involve a builder?", "As early as possible. Involving a contractor at concept stage lets cost and buildability shape the design, not the other way round."],
  ["How are costs reported?", "Through an open-book cost plan, updated monthly and reviewed together, with every variation agreed before it is built."],
  ["What happens after handover?", "A defects period with scheduled check-ins, complete operation manuals and a single point of contact for aftercare."],
];

export default function ProcessPage() {
  return (
    <>
      <PageHero eyebrow="Our process" lines={["Measured twice.", <em key="e" className="text-bronze-light">Built once.</em>]} intro="A clear, five-stage path from first conversation to final handover — designed to remove surprises." visual={<SceneFigure name="construction" label="Animated illustration of a structural frame rising floor by floor" />} />
      <section className="py-28 sm:py-36">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-10">
          <div className="mb-16 grid gap-10 lg:grid-cols-12 lg:items-center">
            <h2 className="font-serif text-5xl leading-[1] sm:text-6xl lg:col-span-6">Five stages, <em className="text-bronze">one thread</em> of accountability.</h2>
            <Blueprint className="w-full max-w-sm text-bronze lg:col-span-4 lg:col-start-9" />
          </div>
          <ProcessSteps detailed />
        </div>
      </section>
      <section aria-labelledby="explore-h" className="bg-charcoal py-28 sm:py-36"><div className="mx-auto max-w-[90rem] px-5 sm:px-10"><p className="eyebrow text-bronze">Interactive</p><h2 id="explore-h" className="mt-4 mb-14 font-serif text-5xl text-ivory sm:text-6xl">See each stage <em className="text-bronze-light">in motion.</em></h2><ProcessExperience dark /></div></section>
      <section className="py-28">
        <div className="mx-auto grid max-w-[90rem] gap-12 px-5 sm:px-10 lg:grid-cols-12">
          <h2 className="font-serif text-5xl lg:col-span-4">Common questions</h2>
          <div className="divide-y divide-charcoal/15 border-y border-charcoal/15 lg:col-span-7 lg:col-start-6">
            {faqs.map(([q, a]) => (
              <Reveal key={q}>
                <details className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-2xl">
                    {q}<span className="text-bronze transition-transform duration-300 group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-4 max-w-2xl leading-relaxed text-charcoal/70">{a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <QuoteCta />
    </>
  );
}
