import { process } from "@/lib/data";
import { Reveal } from "./motion";

export function ProcessSteps({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol className={`grid gap-px bg-charcoal/15 ${detailed ? "" : "md:grid-cols-5"}`}>
      {process.map((p, i) => (
        <li key={p.step} className="bg-ivory">
          <Reveal delay={i * 0.08} className={`group relative h-full overflow-hidden p-8 ${detailed ? "grid gap-6 py-14 md:grid-cols-12 md:items-baseline" : ""}`}>
            <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-bronze transition-transform duration-700 ease-arch group-hover:scale-x-100" aria-hidden="true" />
            <span className={`font-serif text-6xl text-bronze/50 transition-colors duration-500 group-hover:text-bronze ${detailed ? "md:col-span-2 md:text-8xl" : ""}`}>{p.step}</span>
            <div className={detailed ? "md:col-span-6" : "mt-10"}>
              <h3 className={`font-serif ${detailed ? "text-4xl sm:text-5xl" : "text-2xl"}`}>{p.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/65 sm:text-base">{p.text}</p>
            </div>
            <p className={`eyebrow text-charcoal/45 ${detailed ? "md:col-span-3 md:col-start-10 md:text-right" : "mt-8"}`}>{p.duration}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
