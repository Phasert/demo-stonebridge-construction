import Link from "next/link";
import { Hero } from "@/components/hero";
import { Blueprint, MaskImage, Reveal, SplitHeading } from "@/components/motion";
import { BuildingSequence } from "@/components/building-sequence";
import { ServicesExperience } from "@/components/services-experience";
import { ProjectShowcase } from "@/components/project-showcase";
import { ProcessExperience } from "@/components/process-experience";
import { RenovationCompare } from "@/components/renovation-compare";
import { QuoteCta } from "@/components/cta";
import { images } from "@/lib/data";

const pillars = [
  { k: "Integrity", v: "Transparent costs, honest programmes and no surprises at handover." },
  { k: "Craft", v: "Details resolved on paper before they are built on site." },
  { k: "Longevity", v: "Materials and methods chosen to age gracefully for generations." },
];

export default function Home() {
  return (
    <>
      <Hero />
      <BuildingSequence />

      {/* About */}
      <section aria-labelledby="about-heading" className="relative overflow-hidden py-28 sm:py-40">
        <div className="mx-auto grid max-w-[90rem] gap-16 px-5 sm:px-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal><p className="eyebrow text-bronze">About Stonebridge</p></Reveal>
            <SplitHeading lines={["Quiet confidence,", "built into every", <em key="e" className="text-bronze">foundation.</em>]} className="mt-6 font-serif text-[clamp(2.6rem,5.5vw,5rem)] leading-[1] font-medium" />
            <h2 id="about-heading" className="sr-only">About the company</h2>
            <Reveal delay={0.2}>
              <p className="mt-10 max-w-xl text-lg leading-relaxed text-charcoal/75">
                Stonebridge is an imagined construction, contracting and property development firm. Its philosophy is simple: build with the
                discipline of an engineer, the eye of an architect and the accountability of a partner who will still answer the phone in twenty years.
              </p>
            </Reveal>
            <dl className="mt-14 grid gap-8 border-t border-charcoal/15 pt-10 sm:grid-cols-3">
              {pillars.map((p, i) => (
                <Reveal key={p.k} delay={0.1 * i}>
                  <dt className="font-serif text-2xl">{p.k}</dt>
                  <dd className="mt-3 text-sm leading-relaxed text-charcoal/65">{p.v}</dd>
                </Reveal>
              ))}
            </dl>
            <Reveal delay={0.3}>
              <Link href="/about" className="group mt-12 inline-flex items-center gap-4 text-xs font-semibold tracking-[0.2em] uppercase">
                Our story <span className="h-px w-10 bg-bronze transition-all duration-500 group-hover:w-20" />
              </Link>
            </Reveal>
          </div>
          <div className="relative lg:col-span-5 lg:col-start-8">
            <MaskImage src={images.site} alt="Workers in hard hats tying steel reinforcement on a construction site (Unsplash photograph)" className="aspect-[4/5]" />
            <div className="absolute -bottom-12 -left-6 hidden w-3/5 border-8 border-ivory bg-charcoal p-5 text-bronze sm:block lg:-left-20">
              <Blueprint className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section aria-labelledby="services-heading" className="pb-28 sm:pb-40">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-10">
          <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Reveal><p className="eyebrow text-bronze">What we do</p></Reveal>
              <SplitHeading lines={["Six disciplines.", "Watch each one work."]} className="mt-6 font-serif text-[clamp(2.6rem,5.5vw,5rem)] leading-[1] font-medium" />
              <h2 id="services-heading" className="sr-only">Services</h2>
            </div>
            <Reveal className="lg:col-span-4 lg:col-start-9"><p className="leading-relaxed text-charcoal/65">Select a discipline to see it demonstrated. Each figure is a stylised, animated illustration — use the arrow keys to move between them.</p></Reveal>
          </div>
          <ServicesExperience />
        </div>
      </section>

      {/* Featured projects */}
      <section aria-labelledby="projects-heading" className="bg-charcoal py-28 text-ivory sm:py-40">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-10">
          <div className="mb-14 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Reveal><p className="eyebrow text-bronze">Featured concepts</p></Reveal>
              <SplitHeading lines={["Concepts in", <em key="e" className="text-bronze-light">stone, steel & timber.</em>]} className="mt-6 font-serif text-[clamp(2.6rem,5.5vw,5rem)] leading-[1] font-medium" />
              <h2 id="projects-heading" className="sr-only">Featured construction projects</h2>
            </div>
            <Reveal delay={0.2} className="lg:col-span-4 lg:col-start-9">
              <p className="leading-relaxed text-ivory/65">Choose a concept and watch it assemble. These are conceptual case studies created for this demonstration — not completed builds.</p>
            </Reveal>
          </div>
          <ProjectShowcase />
        </div>
      </section>

      {/* Process */}
      <section aria-labelledby="process-heading" className="py-28 sm:py-40">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-10">
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Reveal><p className="eyebrow text-bronze">How we work</p></Reveal>
              <SplitHeading lines={["Six stages,", "one thread."]} className="mt-6 font-serif text-[clamp(2.6rem,5.5vw,5rem)] leading-[1] font-medium" />
              <h2 id="process-heading" className="sr-only">Construction process</h2>
            </div>
            <Reveal><Link href="/process" className="link-underline text-sm font-semibold">Our full process →</Link></Reveal>
          </div>
          <ProcessExperience />
        </div>
      </section>

      {/* Renovation slider */}
      <section aria-labelledby="ba-heading" className="bg-stone py-28 sm:py-36">
        <div className="mx-auto grid max-w-[90rem] gap-12 px-5 sm:px-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <p className="eyebrow text-bronze">Renovations</p>
            <h2 id="ba-heading" className="mt-6 font-serif text-5xl leading-[1] sm:text-6xl">Before. <em className="text-bronze">After.</em></h2>
            <p className="mt-6 leading-relaxed text-charcoal/70">Drag the divider — or focus it and use your arrow keys — to compare a tired industrial shell with its conceptual renewal.</p>
          </div>
          <div className="lg:col-span-8"><RenovationCompare /></div>
        </div>
      </section>

      <QuoteCta />
    </>
  );
}
