import { useState, useRef, useEffect } from "react";
import { Layers } from "lucide-react";
import searchMap from "../store/searchMap";

const STYLES = [
  { id: "topo", label: "Topo", url: "mapbox://styles/mapbox/outdoors-v12" },
  {
    id: "satellite",
    label: "Satellite",
    url: "mapbox://styles/mapbox/satellite-streets-v12",
  },
  { id: "streets", label: "Streets", url: "mapbox://styles/mapbox/streets-v12" },
  { id: "dark", label: "Dark", url: "mapbox://styles/mapbox/dark-v11" },
] as const;

type StyleId = (typeof STYLES)[number]["id"];

export default function MapSwitcher() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<StyleId>("topo");
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

  const select = (id: StyleId, url: string) => {
    setActiveId(id);
    searchMap.setMapStyle(url);
    setOpen(false);
  };

  return (
    <div
      ref={ref}
      className="absolute bottom-3 right-3 z-10 flex flex-col items-end"
    >
      {open && (
        <div className="mb-1 bg-white border border-rule-strong rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
          {STYLES.map((s) => (
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
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Map style"
        aria-expanded={open}
        className="flex items-center justify-center h-8 w-8 bg-white/95 backdrop-blur-sm border border-rule-strong rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-charcoal hover:bg-white cursor-pointer transition-colors"
      >
        <Layers size={14} strokeWidth={1.75} />
      </button>
    </div>
  );
}
