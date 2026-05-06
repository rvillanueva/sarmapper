import { useState, useRef, useEffect } from "react";
import { Layers } from "lucide-react";
import searchMap from "../store/searchMap";
import {
  MAP_STYLES,
  DEFAULT_MAP_STYLE,
  type MapStyleId,
} from "../services/map/mapStyles";

export default function MapSwitcher() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<MapStyleId>(DEFAULT_MAP_STYLE.id);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  const select = (id: MapStyleId, url: string) => {
    setActiveId(id);
    searchMap.setMapStyle(url);
    setOpen(false);
  };

  return (
    <div
      ref={ref}
      className="absolute top-[110px] left-[10px] z-10 flex flex-col items-start"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Map style"
        aria-expanded={open}
        className="flex items-center justify-center h-[29px] w-[29px] bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.06),0_0_0_1px_var(--plk-rule-strong)] text-charcoal hover:bg-snow cursor-pointer transition-colors"
      >
        <Layers size={14} strokeWidth={1.75} />
      </button>
      {open && (
        <div className="mt-1 bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.06),0_0_0_1px_var(--plk-rule-strong)] overflow-hidden">
          {MAP_STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => select(s.id, s.url)}
              className={`block w-full text-left px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                activeId === s.id
                  ? "bg-ink text-white"
                  : "bg-white text-charcoal hover:bg-snow"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
