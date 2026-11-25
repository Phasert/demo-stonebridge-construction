import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center bg-charcoal px-5 pt-20 text-center text-ivory">
      <p className="font-serif text-[10rem] leading-none text-bronze/40">404</p>
      <h1 className="mt-4 font-serif text-4xl">This plot is still vacant.</h1>
      <Link href="/" className="mt-10 bg-bronze px-8 py-4 text-xs font-semibold tracking-[0.2em] text-white uppercase">Return home</Link>
    </section>
  );
}
