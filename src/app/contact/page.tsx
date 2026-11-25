import type { Metadata } from "next";
import { QuoteForm } from "@/components/quote-form";
import { Blueprint, Reveal, SplitHeading } from "@/components/motion";

export const metadata: Metadata = { title: "Contact & Quotation", description: "Request a quotation from Stonebridge Construction (demo form — no data is sent)." };

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden pt-36 pb-28 sm:pt-44">
      <div className="absolute inset-x-0 top-0 h-[22rem] bg-charcoal" aria-hidden="true">
        <div className="blueprint-grid absolute inset-0 opacity-30" />
      </div>
      <div className="relative mx-auto max-w-[90rem] px-5 sm:px-10">
        <Reveal><p className="eyebrow text-bronze">Request a quotation</p></Reveal>
        <SplitHeading as="h1" immediate lines={["Let’s build", <em key="e" className="text-bronze-light">something lasting.</em>]} className="mt-6 font-serif text-[clamp(3rem,8vw,7rem)] leading-[0.95] font-medium text-ivory" />
        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="bg-ivory p-6 shadow-[0_40px_80px_-40px_rgba(32,39,37,0.4)] sm:p-12 lg:col-span-8">
            <QuoteForm />
          </div>
          <aside className="space-y-10 lg:col-span-3 lg:col-start-10 lg:pt-8">
            <div>
              <h2 className="eyebrow text-bronze">What happens next</h2>
              <ol className="mt-6 space-y-5 text-sm leading-relaxed text-charcoal/70">
                <li><span className="font-serif text-lg text-charcoal">01 — </span>We review your brief.</li>
                <li><span className="font-serif text-lg text-charcoal">02 — </span>A short discovery call.</li>
                <li><span className="font-serif text-lg text-charcoal">03 — </span>Indicative scope, programme and budget.</li>
              </ol>
              <p className="mt-6 text-xs text-charcoal/50">Illustrative only — this demo does not process enquiries.</p>
            </div>
            <div className="border-t border-charcoal/15 pt-8 text-sm text-charcoal/70">
              <h2 className="eyebrow mb-4 text-bronze">Studio</h2>
              <p>hello@stonebridge.example</p>
              <p className="mt-2">Mon – Fri, 8:00 – 17:00</p>
            </div>
            <Blueprint className="w-full text-bronze" />
          </aside>
        </div>
      </div>
    </section>
  );
}
