import Link from "next/link";
import { Blueprint, SplitHeading, Reveal } from "./motion";

export function QuoteCta() {
  return (
    <section aria-labelledby="cta-heading" className="relative isolate overflow-hidden bg-charcoal text-ivory">
      <div className="blueprint-grid absolute inset-0 -z-20 opacity-40" aria-hidden="true" />
      <Blueprint className="absolute -right-24 -bottom-10 -z-10 w-[46rem] max-w-none text-bronze/25" />
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-28 sm:px-10 sm:py-40 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="eyebrow text-bronze">Start a conversation</p>
          <SplitHeading
            lines={["Have a project", <em key="e" className="text-bronze-light">worth building well?</em>]}
            className="mt-6 font-serif text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.95] font-medium"
          />
          <h2 id="cta-heading" className="sr-only">Request a quotation</h2>
        </div>
        <Reveal delay={0.3} className="lg:col-span-4">
          <p className="max-w-sm leading-relaxed text-ivory/75">Share your brief and our team will outline scope, programme and an indicative budget. (Demo — no enquiry is sent.)</p>
          <Link href="/contact" className="group mt-8 inline-flex items-center gap-5 bg-bronze px-8 py-5 text-xs font-semibold tracking-[0.2em] text-white uppercase transition-colors hover:bg-ivory hover:text-charcoal">
            Request a Quotation
            <span className="block h-px w-8 bg-current transition-all duration-500 group-hover:w-14" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
