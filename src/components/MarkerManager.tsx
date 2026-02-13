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
    <div className="marker-manager">
      <span className="marker__name">{name}</span>
      {lngLat ? (
        <div>
          <input
            className="lng-lat-input"
            value={lngLatInput}
            onChange={(evt) => handleInputChange(evt.target.value)}
          />
          {lngLatInputIsDirty && (
            <button onClick={setLngLatFromInput}>Update</button>
          )}
          <div>
            <button onClick={() => setLngLat(mapLngLat)}>Set Here</button>
            <button onClick={() => flyTo(lngLat)}>Go To</button>
            <button onClick={remove}>Clear</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setLngLat(mapLngLat)}>Add</button>
      )}
    </div>
  );
}
