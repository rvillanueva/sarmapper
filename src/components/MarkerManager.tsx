import { useState, useEffect } from 'react';
import LngLat from '../services/LngLat';

function parseLatLngString(str: string) {
  const split = str.split(',');
  const lng = Number(split[1]);
  const lat = Number(split[0]);
  if (!isNaN(lat) && !isNaN(lng)) {
    return { lng, lat };
  }
  return null;
}

function roundToPrecision(value: number, precision = 0) {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}

function coordinatesToString(coords: any) {
  coords = new LngLat(coords).toJSON();
  return `${roundToPrecision(coords.lat, 6)}, ${roundToPrecision(coords.lng, 6)}`;
}

interface MarkerManagerProps {
  name: string;
  lngLat: any;
  setLngLat: (lngLat: any) => void;
  remove: () => void;
  flyTo: (lngLat: any) => void;
  mapLngLat: any;
}

export default function MarkerManager({ name, lngLat, setLngLat, remove, flyTo, mapLngLat }: MarkerManagerProps) {
  const [lngLatInput, setLngLatInput] = useState(() =>
    lngLat ? coordinatesToString(lngLat) : ''
  );
  const [lngLatInputIsDirty, setLngLatInputIsDirty] = useState(false);

  useEffect(() => {
    if (lngLat) {
      setLngLatInput(coordinatesToString(lngLat));
      setLngLatInputIsDirty(false);
    }
  }, [lngLat]);

  function handleInputChange(str: string) {
    setLngLatInput(str);
    setLngLatInputIsDirty(true);
  }

  function setLngLatFromInput() {
    const parsed = parseLatLngString(lngLatInput);
    if (parsed) {
      setLngLat(parsed);
    } else {
      setLngLatInput(lngLat ? coordinatesToString(lngLat) : '');
      setLngLatInputIsDirty(false);
    }
  }

  return (
    <div className="rounded-sm border border-rule bg-snow p-4">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-warm-gray mb-3">
        {name}
      </div>
      {lngLat ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              className="flex-1 rounded-sm border border-rule-strong bg-white px-3 py-2 font-mono text-[12px] text-charcoal outline-none focus:border-charcoal transition-colors"
              value={lngLatInput}
              onChange={(evt) => handleInputChange(evt.target.value)}
            />
            {lngLatInputIsDirty && (
              <button
                onClick={setLngLatFromInput}
                className="rounded-sm bg-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white hover:bg-charcoal transition-colors cursor-pointer"
              >
                Update
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLngLat(mapLngLat)}
              className="rounded-sm border border-rule-strong bg-white px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-charcoal hover:border-charcoal hover:bg-snow transition-colors cursor-pointer"
            >
              Set Here
            </button>
            <button
              onClick={() => flyTo(lngLat)}
              className="rounded-sm border border-rule-strong bg-white px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-charcoal hover:border-charcoal hover:bg-snow transition-colors cursor-pointer"
            >
              Go To
            </button>
            <button
              onClick={remove}
              className="rounded-sm border border-transparent bg-transparent px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-orange-brand hover:bg-orange-tint transition-colors cursor-pointer ml-auto"
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setLngLat(mapLngLat)}
          className="rounded-sm bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white hover:bg-charcoal transition-colors cursor-pointer"
        >
          + Add Marker
        </button>
      )}
    </div>
  );
}
