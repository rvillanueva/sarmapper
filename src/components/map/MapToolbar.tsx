import { MapPin, Navigation, Eraser } from "lucide-react";

interface MapToolbarProps {
  hasIpp: boolean;
  hasDirection: boolean;
  placingMode: null | "ipp" | "direction";
  onPlaceIpp: () => void;
  onPlaceDirection: () => void;
  onClearAll: () => void;
}

export default function MapToolbar({
  hasIpp,
  hasDirection,
  placingMode,
  onPlaceIpp,
  onPlaceDirection,
  onClearAll,
}: MapToolbarProps) {
  const btnBase =
    "group flex items-center gap-2 rounded-sm px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors cursor-pointer border";
  const idle =
    "bg-white text-charcoal border-rule-strong hover:border-charcoal hover:bg-snow";
  const active = "bg-ink text-white border-ink";
  const danger =
    "bg-white text-orange-brand border-rule-strong hover:bg-orange-tint hover:border-orange-brand";

  return (
    <div className="absolute bottom-3 left-3 z-30 flex flex-col gap-1 rounded-md bg-white/95 backdrop-blur p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.10),0_0_0_1px_rgba(26,24,22,0.16)]">
      <button
        onClick={onPlaceIpp}
        className={`${btnBase} ${placingMode === "ipp" ? active : idle}`}
        title="Click on map to place Initial Planning Point (I)"
      >
        <MapPin size={13} strokeWidth={1.75} />
        <span>{placingMode === "ipp" ? "Click map…" : hasIpp ? "Move IPP" : "Drop IPP"}</span>
        <kbd className="ml-1 px-1 py-px rounded-xs bg-silver-light text-warm-gray text-[9px] tracking-normal group-hover:bg-white">
          I
        </kbd>
      </button>
      <button
        onClick={onPlaceDirection}
        className={`${btnBase} ${placingMode === "direction" ? active : idle}`}
        title="Click on map to place Direction of Travel (D)"
      >
        <Navigation size={13} strokeWidth={1.75} />
        <span>
          {placingMode === "direction"
            ? "Click map…"
            : hasDirection
              ? "Move Direction"
              : "Drop Direction"}
        </span>
        <kbd className="ml-1 px-1 py-px rounded-xs bg-silver-light text-warm-gray text-[9px] tracking-normal group-hover:bg-white">
          D
        </kbd>
      </button>
      {(hasIpp || hasDirection) && (
        <button
          onClick={onClearAll}
          className={`${btnBase} ${danger}`}
          title="Clear all markers (C)"
        >
          <Eraser size={13} strokeWidth={1.75} />
          <span>Clear</span>
          <kbd className="ml-1 px-1 py-px rounded-xs bg-orange-tint text-orange-brand text-[9px] tracking-normal">
            C
          </kbd>
        </button>
      )}
    </div>
  );
}
