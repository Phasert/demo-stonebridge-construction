import { BeforeAfter } from "./before-after";
import { Facade } from "./scenes";
import { Ground, Tree } from "@/lib/iso";

const Frame = ({ variant }: { variant: "old" | "new" }) => (
  <svg viewBox="-200 -200 440 330" preserveAspectRatio="xMidYMid slice" style={{ background: variant === "old" ? "#bdb3a2" : "#ebe7de" }} aria-hidden="true">
    <g transform="translate(-50 10)">
      <Ground x0={-60} x1={220} z0={-50} z1={130} fill={variant === "old" ? "#9c927f" : "#ddd7cb"} />
      <Facade variant={variant} />
      {variant === "new" && <><Tree x={-20} z={95} /><Tree x={175} z={80} s={0.9} /></>}
    </g>
  </svg>
);

export function RenovationCompare() {
  return <BeforeAfter before={<Frame variant="old" />} after={<Frame variant="new" />} label="Drag to compare the building before and after renovation" beforeLabel="Before · 1904 shell" afterLabel="After · concept" />;
}
