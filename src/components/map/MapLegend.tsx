import { ChevronDown, ChevronRight } from "lucide-react";

interface MapLegendProps {
  open: boolean;
  onToggle: () => void;
  hasIpp: boolean;
  hasDirection: boolean;
}

export default function MapLegend({ open, onToggle, hasIpp, hasDirection }: MapLegendProps) {
  return (
    <div className="absolute top-12 right-[calc(0.75rem+130px)] z-30 max-w-[260px]">
      <div className="rounded-md bg-white/95 backdrop-blur shadow-[0_2px_8px_rgba(0,0,0,0.10),0_0_0_1px_rgba(26,24,22,0.16)]">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 cursor-pointer hover:bg-snow rounded-md"
          aria-expanded={open}
        >
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-warm-gray">
            Legend
          </span>
          {open ? (
            <ChevronDown size={12} strokeWidth={1.75} className="text-warm-gray" />
          ) : (
            <ChevronRight size={12} strokeWidth={1.75} className="text-warm-gray" />
          )}
        </button>
        {open && (
          <div className="px-3 pb-3 space-y-2 border-t border-rule pt-2">
            <LegendRow swatch={<Dot color="var(--plk-orange)" size={12} />} label="Initial Planning Point" muted={!hasIpp} />
            <LegendRow swatch={<Dot color="var(--plk-charcoal)" size={9} />} label="Direction of Travel" muted={!hasDirection} />
            <LegendRow swatch={<Ring color="var(--plk-orange)" />} label="Distance ring (25/50/75/95%)" muted={!hasIpp} />
            <LegendRow swatch={<DashLine color="var(--plk-slate)" />} label="Dispersion fan" muted={!hasIpp || !hasDirection} />
            <LegendRow swatch={<Line color="var(--plk-charcoal)" />} label="Direction of travel line" muted={!hasIpp || !hasDirection} />
            <div className="pt-2 mt-1 border-t border-rule font-mono text-[9px] tracking-[0.10em] uppercase text-warm-gray leading-relaxed">
              Right-click map for actions · I/D drops markers · C clears
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LegendRow({
  swatch,
  label,
  muted,
}: {
  swatch: React.ReactNode;
  label: string;
  muted?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${muted ? "opacity-40" : ""}`}>
      <div className="flex items-center justify-center w-5 shrink-0">{swatch}</div>
      <span className="text-[11px] text-charcoal font-light leading-tight">{label}</span>
    </div>
  );
}

function Dot({ color, size }: { color: string; size: number }) {
  return (
    <span
      className="inline-block rounded-full border-2 border-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
      style={{ background: color, width: size, height: size }}
    />
  );
}

function Ring({ color }: { color: string }) {
  return (
    <span
      className="inline-block rounded-full border-2"
      style={{ borderColor: color, width: 14, height: 14, opacity: 0.7 }}
    />
  );
}

function Line({ color }: { color: string }) {
  return <span className="inline-block w-4 h-0.5" style={{ background: color }} />;
}

function DashLine({ color }: { color: string }) {
  return (
    <span
      className="inline-block w-4 h-0.5"
      style={{
        backgroundImage: `repeating-linear-gradient(to right, ${color} 0 3px, transparent 3px 6px)`,
        height: 2,
      }}
    />
  );
}
