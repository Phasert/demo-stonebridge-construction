import { MaskImage, SplitHeading, Reveal } from "./motion";

export function PageHero({ eyebrow, lines, intro, image, alt, visual, visualBg = "#e9e4da" }: { eyebrow: string; lines: React.ReactNode[]; intro: string; image?: string; alt?: string; visual?: React.ReactNode; visualBg?: string }) {
  return (
    <section className="relative bg-charcoal pt-36 text-ivory sm:pt-44">
      <div className="blueprint-grid absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-[90rem] px-5 sm:px-10">
        <Reveal><p className="eyebrow text-bronze">{eyebrow}</p></Reveal>
        <div className="mt-6 grid items-end gap-10 lg:grid-cols-12">
          <SplitHeading as="h1" immediate lines={lines} className="font-serif text-[clamp(3rem,8vw,7.5rem)] leading-[0.95] font-medium lg:col-span-8" />
          <Reveal delay={0.4} className="lg:col-span-4">
            <p className="max-w-md text-lg leading-relaxed text-ivory/75">{intro}</p>
          </Reveal>
        </div>
      </div>
      <div className="relative mx-auto mt-16 max-w-[90rem] px-5 sm:px-10">
        <MaskImage src={image} alt={alt} preload sizes="100vw" className="aspect-[16/10] translate-y-16 sm:aspect-[21/8] [&_svg]:h-full [&_svg]:w-full">{visual && <div className="h-full w-full" style={{ background: visualBg }}>{visual}</div>}</MaskImage>
      </div>
      <div className="h-16 bg-ivory" />
    </section>
  );
}
