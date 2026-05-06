import { useEffect, useState, useRef } from "react";
import { MapPin, Navigation, Crosshair, Copy, X } from "lucide-react";
import searchMap from "../../store/searchMap";

interface ContextMenuState {
  point: { x: number; y: number };
  lngLat: { lng: number; lat: number };
}

export default function MapContextMenu() {
  const [menu, setMenu] = useState<ContextMenuState | null>(null);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (evt: any) => {
      if (!evt.originalEvent) return;
      evt.originalEvent.preventDefault?.();
      setMenu({
        point: { x: evt.point.x, y: evt.point.y },
        lngLat: { lng: evt.lngLat.lng, lat: evt.lngLat.lat },
      });
    };
    const closeOnMove = () => setMenu(null);
    const closeOnPlacingChange = () => setMenu(null);
    searchMap.on("contextmenu", handler);
    searchMap.on("move", closeOnMove);
    searchMap.on("placing.change", closeOnPlacingChange);
    return () => {
      searchMap.off("contextmenu", handler);
      searchMap.off("move", closeOnMove);
      searchMap.off("placing.change", closeOnPlacingChange);
    };
  }, []);

  useEffect(() => {
    if (!menu) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(null);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(null);
    };
    window.addEventListener("mousedown", onDocClick);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("keydown", onEsc);
    };
  }, [menu]);

  if (!menu) return null;

  const items = [
    {
      icon: MapPin,
      label: "Set IPP here",
      action: () => {
        searchMap.setIPPMarker(menu.lngLat);
        setMenu(null);
      },
    },
    {
      icon: Navigation,
      label: "Set Direction here",
      action: () => {
        searchMap.setDestinationMarker(menu.lngLat);
        setMenu(null);
      },
    },
    {
      icon: Crosshair,
      label: "Center map here",
      action: () => {
        searchMap.flyTo(menu.lngLat);
        setMenu(null);
      },
    },
    {
      icon: Copy,
      label: copied ? "Copied!" : "Copy coordinates",
      action: async () => {
        const text = `${menu.lngLat.lat.toFixed(6)}, ${menu.lngLat.lng.toFixed(6)}`;
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {
          // ignore
        }
      },
    },
  ];

  // Constrain to viewport
  const left = Math.min(menu.point.x, window.innerWidth - 220);
  const top = Math.min(menu.point.y, window.innerHeight - 220);

  return (
    <div
      ref={ref}
      className="absolute z-40 min-w-[200px] rounded-md bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.16),0_0_0_1px_rgba(26,24,22,0.16)]"
      style={{ left, top }}
    >
      <div className="px-2.5 py-1.5 flex items-center justify-between gap-2 border-b border-rule mb-1">
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-warm-gray tabular-nums">
          {menu.lngLat.lat.toFixed(5)}, {menu.lngLat.lng.toFixed(5)}
        </span>
        <button
          onClick={() => setMenu(null)}
          className="p-0.5 rounded-xs text-warm-gray hover:text-charcoal cursor-pointer"
          aria-label="Close"
        >
          <X size={12} strokeWidth={1.75} />
        </button>
      </div>
      {items.map(({ icon: Icon, label, action }) => (
        <button
          key={label}
          onClick={action}
          className="w-full flex items-center gap-2.5 rounded-sm px-2.5 py-2 font-mono text-[11px] uppercase tracking-[0.10em] text-charcoal hover:bg-snow transition-colors cursor-pointer text-left"
        >
          <Icon size={13} strokeWidth={1.75} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
