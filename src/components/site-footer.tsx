import Link from "next/link";
import { Logo } from "./logo";
import { services } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-charcoal text-ivory">
      <div className="blueprint-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-[90rem] px-5 pt-24 pb-10 sm:px-10">
        <div className="grid gap-16 border-b border-ivory/10 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-8 max-w-sm font-serif text-3xl leading-tight text-ivory/90">
              Building with integrity, <em className="text-bronze-light">one considered detail</em> at a time.
            </p>
          </div>
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h2 className="eyebrow text-bronze">Studio</h2>
              <ul className="mt-6 space-y-3 text-sm text-ivory/75">
                <li><Link className="link-underline" href="/about">About</Link></li>
                <li><Link className="link-underline" href="/projects">Projects</Link></li>
                <li><Link className="link-underline" href="/process">Our Process</Link></li>
                <li><Link className="link-underline" href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="eyebrow text-bronze">Services</h2>
              <ul className="mt-6 space-y-3 text-sm text-ivory/75">
                {services.map((s) => (
                  <li key={s.slug}><Link className="link-underline" href={`/services#${s.slug}`}>{s.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow text-bronze">Contact</h2>
              <address className="mt-6 space-y-3 text-sm not-italic text-ivory/75">
                <p>Demo address only<br />No real office</p>
                <p>hello@stonebridge.example</p>
                <p>Mon – Fri, 8:00 – 17:00</p>
              </address>
            </div>
          </div>
        </div>
        <p aria-hidden="true" className="pointer-events-none select-none py-10 text-center font-serif text-[clamp(3.5rem,13vw,13rem)] leading-none text-ivory/[0.06]">
          Stonebridge
        </p>
        <div className="flex flex-col gap-4 text-xs text-ivory/50 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Stonebridge Construction — a fictional company. Portfolio demonstration by RS Technology Group.</p>
          <p>Illustrations are original; one photograph via Unsplash. Projects shown are conceptual.</p>
        </div>
      </div>
    </footer>
  );
}
