import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Blueprint, MaskImage, Reveal, SplitHeading } from "@/components/motion";
import { QuoteCta } from "@/components/cta";
import { SceneFigure } from "@/components/scene-figure";

export const metadata: Metadata = { title: "About", description: "The philosophy and values of Stonebridge Construction, a fictional construction company created as a portfolio demonstration." };

const values = [
  { t: "Accountability", d: "One team owns the outcome — programme, budget and quality — from first sketch to final defect." },
  { t: "Precision", d: "Every junction, tolerance and finish is resolved in drawings before it is built." },
  { t: "Safety", d: "Safe sites are well-run sites. Planning and housekeeping come first, every day." },
  { t: "Stewardship", d: "Responsible sourcing, reduced waste and buildings designed to outlive their builders." },
];

const figures = [
  { n: "6", l: "Integrated disciplines" },
  { n: "1", l: "Accountable project lead" },
  { n: "5", l: "Stage delivery process" },
  { n: "∞", l: "Commitment to craft" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" lines={["Builders by trade.", <em key="e" className="text-bronze-light">Architects at heart.</em>]} intro="An imagined firm founded on the belief that a well-made building is a public promise — to its owners, its neighbours and the street." visual={<SceneFigure name="property-development" label="Animated illustration of a site becoming a neighbourhood" bg="#e3ddd1" />} />

      <section className="py-28 sm:py-40">
        <div className="mx-auto grid max-w-[90rem] gap-16 px-5 sm:px-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-bronze">Our story</p>
            <SplitHeading lines={["Built on a", "simple idea."]} className="mt-6 font-serif text-5xl leading-[1] sm:text-6xl" />
            <Blueprint className="mt-12 w-full max-w-md text-bronze" />
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-charcoal/75 lg:col-span-6 lg:col-start-7">
            <Reveal><p className="font-serif text-3xl leading-snug text-charcoal">Stonebridge imagines a contractor that thinks like a design studio — and delivers like the most disciplined builder in the city.</p></Reveal>
            <Reveal delay={0.1}><p>The name comes from the most enduring kind of structure: the stone bridge, which carries load quietly for centuries. That is the standard the brand is built around — work that is calm, robust and generous to the people who use it.</p></Reveal>
            <Reveal delay={0.2}><p>Stonebridge is a fictional company. This website was created by RS Technology Group to demonstrate the craft, motion and attention to detail possible in a premium construction website. No people, projects or credentials shown here are real.</p></Reveal>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-24 text-ivory">
        <dl className="mx-auto grid max-w-[90rem] grid-cols-2 gap-px bg-ivory/10 px-5 sm:px-10 lg:grid-cols-4">
          {figures.map((f, i) => (
            <Reveal key={f.l} delay={i * 0.1} className="bg-charcoal p-8">
              <dd className="font-serif text-7xl text-bronze-light sm:text-8xl">{f.n}</dd>
              <dt className="mt-4 text-sm text-ivory/60">{f.l}</dt>
            </Reveal>
          ))}
        </dl>
      </section>

      <section className="py-28 sm:py-40">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-10">
          <p className="eyebrow text-bronze">Values</p>
          <SplitHeading lines={["What holds", "everything up."]} className="mt-6 mb-16 font-serif text-5xl leading-[1] sm:text-6xl" />
          <div className="grid gap-16 lg:grid-cols-12">
            <MaskImage parallax={0} className="aspect-[4/5] lg:col-span-5"><SceneFigure name="consultation" label="Animated illustration of client and builder sketching a brief together" /></MaskImage>
            <ul className="divide-y divide-charcoal/15 border-y border-charcoal/15 lg:col-span-6 lg:col-start-7">
              {values.map((v, i) => (
                <li key={v.t}>
                  <Reveal delay={i * 0.08} className="grid gap-4 py-10 sm:grid-cols-[4rem_1fr]">
                    <span className="font-serif text-2xl text-bronze">0{i + 1}</span>
                    <div><h3 className="font-serif text-3xl">{v.t}</h3><p className="mt-3 leading-relaxed text-charcoal/65">{v.d}</p></div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <QuoteCta />
    </>
  );
}
