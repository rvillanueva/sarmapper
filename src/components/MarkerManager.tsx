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
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <span className="text-sm font-semibold text-gray-800">{name}</span>
      {lngLat ? (
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <input
              className="flex-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-700 shadow-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
              value={lngLatInput}
              onChange={(evt) => handleInputChange(evt.target.value)}
            />
            {lngLatInputIsDirty && (
              <button
                onClick={setLngLatFromInput}
                className="rounded-md bg-gray-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Update
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLngLat(mapLngLat)}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Set Here
            </button>
            <button
              onClick={() => flyTo(lngLat)}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Go To
            </button>
            <button
              onClick={remove}
              className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setLngLat(mapLngLat)}
          className="mt-2 rounded-md bg-gray-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors cursor-pointer"
        >
          Add
        </button>
      )}
    </div>
  );
}
