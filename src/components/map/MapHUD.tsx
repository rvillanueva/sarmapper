import { getDistance, getRhumbLineBearing } from "geolib";
import { Ruler, Compass } from "lucide-react";

interface MapHUDProps {
  ipp: { lng: number; lat: number } | null;
  direction: { lng: number; lat: number } | null;
  cursor: { lng: number; lat: number } | null;
}

function bearingToCardinal(deg: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const idx = Math.round(((deg % 360) / 22.5)) % 16;
  return dirs[idx];
}

export default function MapHUD({ ipp, direction, cursor }: MapHUDProps) {
  const showMeasurement = ipp && direction;

  let distanceKm = 0;
  let distanceMi = 0;
  let bearingDeg = 0;
  if (showMeasurement) {
    const meters = getDistance(
      { latitude: ipp!.lat, longitude: ipp!.lng },
      { latitude: direction!.lat, longitude: direction!.lng }
    );
    distanceKm = meters / 1000;
    distanceMi = meters / 1609.344;
    bearingDeg = getRhumbLineBearing(
      { latitude: ipp!.lat, longitude: ipp!.lng },
      { latitude: direction!.lat, longitude: direction!.lng }
    );
  }

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
      {showMeasurement && (
        <div className="flex items-center gap-3 rounded-md bg-white/95 backdrop-blur px-3.5 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.10),0_0_0_1px_rgba(26,24,22,0.16)]">
          <div className="flex items-center gap-1.5">
            <Ruler size={12} strokeWidth={1.75} className="text-warm-gray" />
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-warm-gray">Dist</span>
            <span className="font-mono text-[12px] text-charcoal tabular-nums">
              {distanceKm.toFixed(2)}
              <span className="text-warm-gray">km</span>
              <span className="text-warm-gray mx-1">·</span>
              {distanceMi.toFixed(2)}
              <span className="text-warm-gray">mi</span>
            </span>
          </div>
          <div className="w-px h-4 bg-rule-strong" />
          <div className="flex items-center gap-1.5">
            <Compass size={12} strokeWidth={1.75} className="text-warm-gray" />
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-warm-gray">Brg</span>
            <span className="font-mono text-[12px] text-charcoal tabular-nums">
              {Math.round(bearingDeg)}°
              <span className="text-warm-gray ml-1">{bearingToCardinal(bearingDeg)}</span>
            </span>
          </div>
        </div>
      )}
      {cursor && (
        <div className="hidden md:flex items-center gap-1.5 rounded-md bg-white/85 backdrop-blur px-2.5 py-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_0_0_1px_rgba(26,24,22,0.10)]">
          <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-warm-gray">Cursor</span>
          <span className="font-mono text-[11px] text-charcoal tabular-nums">
            {cursor.lat.toFixed(4)}, {cursor.lng.toFixed(4)}
          </span>
        </div>
      )}
    </div>
  );
}
