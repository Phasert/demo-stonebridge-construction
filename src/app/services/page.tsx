import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { MaskImage, Reveal } from "@/components/motion";
import { QuoteCta } from "@/components/cta";
import { services } from "@/lib/data";
import { SceneFigure } from "@/components/scene-figure";

export const metadata: Metadata = { title: "Services", description: "Residential and commercial construction, renovations, project management, design & build and property development." };

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services" lines={["Every discipline,", <em key="e" className="text-bronze-light">under one roof.</em>]} intro="Six integrated services, delivered by one accountable team — so nothing falls between the drawings and the site." visual={<SceneFigure name="design-build" label="Animated illustration of a blueprint becoming a building" />} />
      <div className="py-20 sm:py-32">
        {services.map((s, i) => (
          <section key={s.slug} id={s.slug} aria-labelledby={`${s.slug}-h`} className="scroll-mt-24 py-16 sm:py-24">
            <div className="mx-auto grid max-w-[90rem] gap-12 px-5 sm:px-10 lg:grid-cols-12 lg:items-center">
              <MaskImage direction={i % 2 ? "right" : "left"} parallax={0} className={`aspect-[5/4] lg:col-span-6 ${i % 2 ? "lg:order-2 lg:col-start-7" : ""}`}><SceneFigure name={s.slug as "residential"} label={`Animated illustration: ${s.name}`} bg={i % 2 ? "#efebe3" : "#e9e4da"} /></MaskImage>
              <div className={`lg:col-span-5 ${i % 2 ? "lg:order-1" : "lg:col-start-8"}`}>
                <Reveal><p className="font-serif text-7xl text-bronze/40">{s.index}</p></Reveal>
                <Reveal delay={0.1}><h2 id={`${s.slug}-h`} className="mt-4 font-serif text-5xl leading-[1] sm:text-6xl">{s.name}</h2></Reveal>
                <Reveal delay={0.2}><p className="mt-6 font-serif text-2xl text-charcoal/80 italic">{s.summary}</p></Reveal>
                <Reveal delay={0.3}><p className="mt-5 leading-relaxed text-charcoal/70">{s.detail}</p></Reveal>
                <Reveal delay={0.4}>
                  <ul className="mt-8 grid grid-cols-2 gap-x-6 border-t border-charcoal/15">
                    {s.scope.map((x) => <li key={x} className="flex items-center gap-3 border-b border-charcoal/15 py-4 text-sm"><span className="size-1.5 rotate-45 bg-bronze" aria-hidden="true" />{x}</li>)}
                  </ul>
                </Reveal>
              </div>
            </div>
          </section>
        ))}
      </div>
      <QuoteCta />
    </>
  );
}
