export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 40 40" className="size-9" aria-hidden="true">
        <rect x="1" y="1" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M6 30 Q20 12 34 30" fill="none" stroke="#A68A64" strokeWidth="2" />
        <path d="M6 30h28M11 30V24M20 30V20M29 30V24" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span className="leading-none">
        <span className="block font-serif text-[1.35rem] font-semibold tracking-wide">Stonebridge</span>
        <span className="mt-1 block text-[0.58rem] font-semibold tracking-[0.42em] uppercase opacity-70">Construction</span>
      </span>
    </span>
  );
}
