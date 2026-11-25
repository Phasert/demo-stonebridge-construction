"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "./logo";

export const nav = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/process", label: "Our Process" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  // Menu is tied to the path it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) => setOpenOn((typeof v === "function" ? v(open) : v) ? pathname : null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 400 && y > prev && !open);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          solid ? "bg-charcoal/95 text-ivory shadow-[0_1px_0_rgba(166,138,100,0.25)] backdrop-blur-md" : "bg-transparent text-white"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[90rem] items-center justify-between px-5 sm:px-10">
          <Link href="/" aria-label="Stonebridge Construction home"><Logo /></Link>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-9 text-[0.82rem] font-medium tracking-wide">
              {[{ href: "/", label: "Home" }, ...nav.slice(0, 4)].map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li key={item.href} className="relative">
                    <Link href={item.href} aria-current={active ? "page" : undefined} className="py-2 opacity-90 transition-opacity hover:opacity-100">
                      {item.label}
                    </Link>
                    {active && <motion.span layoutId="nav-active" className="absolute -bottom-1 left-0 h-px w-full bg-bronze" />}
                  </li>
                );
              })}
              <li>
                <Link href="/contact" className="group relative inline-flex items-center gap-3 overflow-hidden border border-bronze px-5 py-3 text-xs font-semibold tracking-[0.18em] uppercase">
                  <span className="absolute inset-0 -translate-x-full bg-bronze transition-transform duration-500 ease-arch group-hover:translate-x-0" />
                  <span className="relative">Request a Quote</span>
                </Link>
              </li>
            </ul>
          </nav>
          <button
            type="button"
            className="relative z-10 flex size-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`absolute h-px w-7 bg-current transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
            <span className={`absolute h-px w-7 bg-current transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-charcoal px-6 pt-28 pb-10 text-ivory lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Mobile">
              <ul className="space-y-2">
                {[{ href: "/", label: "Home" }, ...nav].map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                      <Link href={item.href} className="flex items-baseline gap-4 font-serif text-5xl">
                        <span className="font-sans text-xs text-bronze">0{i + 1}</span>
                        {item.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
            <p className="text-sm text-ivory/60">A fictional portfolio demonstration by RS Technology Group.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
