/** Static architectural poster shown while the 3D scene loads, or when WebGL / motion is unavailable. */
export function HeroPoster() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <rect width="1600" height="900" fill="#202725" />
      <g stroke="#A68A64" strokeOpacity=".18" strokeWidth="1">
        {Array.from({ length: 33 }, (_, i) => <path key={`v${i}`} d={`M${i * 50} 0V900`} />)}
        {Array.from({ length: 19 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * 50}H1600`} />)}
      </g>
      <g fill="none" stroke="#A68A64" strokeWidth="2" opacity=".7">
        {/* crane */}
        <path d="M520 760V180M500 760V180M500 180h20M400 170h760M400 150h120M1060 170v240" />
        {Array.from({ length: 29 }, (_, i) => <path key={i} d={`M500 ${760 - i * 20} L520 ${740 - i * 20}`} />)}
        <path d="M1010 470h100v14h-100z" />
        {/* frame */}
        <path d="M900 760V520h520v240M900 600h520M900 680h520M1030 520v240M1160 520v240M1290 520v240" />
      </g>
      <path d="M0 760H1600" stroke="#A68A64" strokeOpacity=".5" />
    </svg>
  );
}
