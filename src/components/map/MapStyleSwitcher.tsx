import { Mountain, Satellite, Map as MapIcon, Moon } from "lucide-react";
import { MAP_STYLES, type MapStyleId } from "../../services/SearchMap";

const styleIcons: Record<MapStyleId, typeof Mountain> = {
  outdoors: Mountain,
  satellite: Satellite,
  streets: MapIcon,
  dark: Moon,
};

interface MapStyleSwitcherProps {
  active: MapStyleId;
  onChange: (id: MapStyleId) => void;
}

export default function MapStyleSwitcher({ active, onChange }: MapStyleSwitcherProps) {
  return (
    <div className="absolute top-12 right-3 z-30 flex flex-col gap-1 rounded-md bg-white/95 backdrop-blur p-1 shadow-[0_2px_8px_rgba(0,0,0,0.10),0_0_0_1px_rgba(26,24,22,0.16)]">
      {(Object.keys(MAP_STYLES) as MapStyleId[]).map((id) => {
        const style = MAP_STYLES[id];
        const Icon = styleIcons[id];
        const isActive = id === active;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            title={style.label}
            aria-label={`Switch to ${style.label} basemap`}
            className={`flex items-center gap-2 rounded-sm px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors cursor-pointer ${
              isActive
                ? "bg-ink text-white"
                : "bg-transparent text-charcoal hover:bg-snow"
            }`}
          >
            <Icon size={13} strokeWidth={1.75} />
            <span>{style.label}</span>
          </button>
        );
      })}
    </div>
  );
}
