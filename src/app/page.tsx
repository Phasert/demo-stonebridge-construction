import { Layers3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ServicesGrid } from "@/components/services-grid";

export default function Home() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-20 focus:bg-paper focus:p-4">
        Skip to content
      </a>
      <header className="border-b border-ink/15">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-6 py-5 sm:px-10">
          <Link href="/" className="inline-flex items-center gap-3 font-bold leading-tight">
            <span className="bg-ink p-2.5 text-signal"><Layers3 size={22} aria-hidden="true" /></span>
            <span>STONEBRIDGE<span className="block text-xs font-medium tracking-widest">CONSTRUCTION</span></span>
          </Link>
          <nav aria-label="Main navigation" className="flex gap-6 text-sm font-semibold">
            <a className="hover:underline" href="#services">Services</a>
            <a className="hover:underline" href="#about">About the demo</a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section aria-labelledby="hero-heading" className="relative isolate grid min-h-[35rem] items-center overflow-hidden bg-ink text-white">
          <Image src="/construction.webp" alt="" fill preload sizes="100vw" className="-z-20 object-cover object-center" />
          <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/95 via-black/80 to-black/40" />
          <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10">
            <p className="mb-6 border-l-2 border-signal pl-3 text-sm font-semibold tracking-wider text-signal uppercase">Fictional portfolio demo</p>
            <h1 id="hero-heading" className="max-w-3xl text-[clamp(2.4rem,7vw,6.5rem)] leading-[0.98] font-black tracking-tight">
              Stonebridge<br />Construction
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/90">
              A commercial construction concept spanning early planning, new builds, and renovations.
            </p>
            <a href="#services" className="mt-8 inline-flex bg-signal px-6 py-3.5 text-sm font-bold text-ink hover:bg-amber-200">Explore sample services</a>
          </div>
        </section>

        <section id="services" aria-labelledby="services-heading" className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20">
          <h2 id="services-heading" className="text-3xl font-bold tracking-tight sm:text-5xl">Sample services</h2>
          <ServicesGrid />
        </section>
      </main>

      <footer id="about" className="bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
          <h2 className="mb-2 text-lg font-semibold">About the demo</h2>
          <p className="max-w-xl leading-relaxed text-paper/85">
            Stonebridge Construction is a fictional company created to demonstrate a construction website for a web development portfolio.
          </p>
        </div>
      </footer>
    </>
  );
}
