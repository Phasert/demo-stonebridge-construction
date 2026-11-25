"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { services } from "@/lib/data";

type Values = { name: string; email: string; phone: string; service: string; budget: string; timeline: string; message: string; consent: boolean };
type Errors = Partial<Record<keyof Values, string>>;

const initial: Values = { name: "", email: "", phone: "", service: "", budget: "", timeline: "", message: "", consent: false };
const budgets = ["Under $250k", "$250k – $1M", "$1M – $5M", "$5M +"];
const timelines = ["Within 3 months", "3 – 6 months", "6 – 12 months", "Just exploring"];

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) e.email = "Please enter a valid email address.";
  if (v.phone && !/^[+()\d\s-]{7,}$/.test(v.phone)) e.phone = "Please enter a valid phone number.";
  if (!v.service) e.service = "Please choose a service.";
  if (!v.budget) e.budget = "Please select an indicative budget.";
  if (v.message.trim().length < 20) e.message = "Tell us a little more (at least 20 characters).";
  if (!v.consent) e.consent = "Please confirm you understand this is a demo form.";
  return e;
}

const field = "peer w-full border-0 border-b border-charcoal/25 bg-transparent px-0 pt-6 pb-3 text-lg outline-none transition-colors focus:border-bronze focus:ring-0 aria-[invalid=true]:border-red-700";

export function QuoteForm() {
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    const next = { ...v, [k]: val };
    setV(next);
    if (touched) setErrors(validate(next));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const errs = validate(v);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) { document.getElementById(`q-${first}`)?.focus(); return; }
    setState("sending");
    // Demo only: nothing is transmitted anywhere.
    setTimeout(() => setState("done"), 1200);
  };

  const err = (k: keyof Values) => errors[k] && <p id={`q-${k}-err`} className="mt-2 text-sm text-red-700">{errors[k]}</p>;
  const a = (k: keyof Values) => ({ id: `q-${k}`, "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `q-${k}-err` : undefined });

  return (
    <AnimatePresence mode="wait">
      {state === "done" ? (
        <motion.div key="done" role="status" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border border-bronze/40 bg-white p-10 sm:p-14">
          <svg viewBox="0 0 52 52" className="size-16 text-bronze" aria-hidden="true">
            <motion.circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
            <motion.path d="M15 27 l7 7 l15 -16" fill="none" stroke="currentColor" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.5 }} />
          </svg>
          <p className="eyebrow mt-8 text-bronze">Demo submission complete</p>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl">Thank you, {v.name.split(" ")[0]}.</h2>
          <p className="mt-5 max-w-lg leading-relaxed text-charcoal/70">
            Your form passed validation — but <strong>this is a portfolio demonstration</strong>. Nothing has been sent, stored or delivered to any company, and no one will contact you.
          </p>
          <button type="button" onClick={() => { setV(initial); setErrors({}); setTouched(false); setState("idle"); }} className="mt-8 text-xs font-semibold tracking-[0.2em] uppercase underline underline-offset-8">
            Start a new request
          </button>
        </motion.div>
      ) : (
        <motion.form key="form" noValidate onSubmit={submit} exit={{ opacity: 0, y: -20 }} className="grid gap-x-10 gap-y-8 sm:grid-cols-2" aria-describedby="demo-note">
          <p id="demo-note" className="flex items-start gap-3 bg-charcoal px-5 py-4 text-sm text-ivory sm:col-span-2">
            <span className="mt-1 size-2 shrink-0 rotate-45 bg-bronze" aria-hidden="true" />
            Demo form — submissions are validated in your browser only and are never sent to a real company.
          </p>
          <div>
            <label htmlFor="q-name" className="eyebrow text-charcoal/60">Full name *</label>
            <input {...a("name")} autoComplete="name" className={field} value={v.name} onChange={(e) => set("name", e.target.value)} />
            {err("name")}
          </div>
          <div>
            <label htmlFor="q-email" className="eyebrow text-charcoal/60">Email *</label>
            <input {...a("email")} type="email" autoComplete="email" className={field} value={v.email} onChange={(e) => set("email", e.target.value)} />
            {err("email")}
          </div>
          <div>
            <label htmlFor="q-phone" className="eyebrow text-charcoal/60">Phone (optional)</label>
            <input {...a("phone")} type="tel" autoComplete="tel" className={field} value={v.phone} onChange={(e) => set("phone", e.target.value)} />
            {err("phone")}
          </div>
          <div>
            <label htmlFor="q-service" className="eyebrow text-charcoal/60">Service *</label>
            <select {...a("service")} className={`${field} cursor-pointer`} value={v.service} onChange={(e) => set("service", e.target.value)}>
              <option value="">Select a service</option>
              {services.map((s) => <option key={s.slug}>{s.name}</option>)}
            </select>
            {err("service")}
          </div>
          <fieldset className="sm:col-span-2" aria-describedby={errors.budget ? "q-budget-err" : undefined}>
            <legend className="eyebrow mb-4 text-charcoal/60">Indicative budget *</legend>
            <div className="flex flex-wrap gap-3">
              {budgets.map((b, i) => (
                <label key={b} className="cursor-pointer">
                  <input id={i === 0 ? "q-budget" : undefined} type="radio" name="budget" value={b} checked={v.budget === b} onChange={() => set("budget", b)} className="peer sr-only" />
                  <span className="block border border-charcoal/20 px-5 py-3 text-sm transition-colors peer-checked:border-charcoal peer-checked:bg-charcoal peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bronze hover:border-bronze">{b}</span>
                </label>
              ))}
            </div>
            {err("budget")}
          </fieldset>
          <fieldset className="sm:col-span-2">
            <legend className="eyebrow mb-4 text-charcoal/60">Ideal start</legend>
            <div className="flex flex-wrap gap-3">
              {timelines.map((t) => (
                <label key={t} className="cursor-pointer">
                  <input type="radio" name="timeline" value={t} checked={v.timeline === t} onChange={() => set("timeline", t)} className="peer sr-only" />
                  <span className="block border border-charcoal/20 px-5 py-3 text-sm transition-colors peer-checked:border-bronze peer-checked:bg-bronze peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bronze hover:border-bronze">{t}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="sm:col-span-2">
            <label htmlFor="q-message" className="eyebrow text-charcoal/60">Project details *</label>
            <textarea {...a("message")} rows={5} className={`${field} resize-y`} value={v.message} onChange={(e) => set("message", e.target.value)} placeholder="Site location, scope, any drawings or constraints…" />
            <div className="mt-1 flex justify-between">{err("message") ?? <span />}<span className="text-xs text-charcoal/40">{v.message.length} characters</span></div>
          </div>
          <div className="sm:col-span-2">
            <label className="flex cursor-pointer items-start gap-3 text-sm text-charcoal/75">
              <input {...a("consent")} type="checkbox" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-0.5 size-5 accent-bronze" />
              I understand this is a demonstration website and my enquiry will not be sent to anyone.
            </label>
            {err("consent")}
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={state === "sending"} className="group inline-flex items-center gap-5 bg-charcoal px-9 py-5 text-xs font-semibold tracking-[0.2em] text-ivory uppercase transition-colors hover:bg-bronze disabled:opacity-70">
              {state === "sending" ? "Validating…" : "Submit demo request"}
              <span className="block h-px w-8 bg-current transition-all duration-500 group-hover:w-14" />
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
