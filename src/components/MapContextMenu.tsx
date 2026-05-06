import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Crosshair, Navigation } from "lucide-react";

interface Props {
  x: number;
  y: number;
  hasIpp: boolean;
  hasDirection: boolean;
  onPlaceIpp: () => void;
  onPlaceDirection: () => void;
  onClose: () => void;
}

const MENU_OFFSET = 4;

export default function MapContextMenu({
  x,
  y,
  hasIpp,
  hasDirection,
  onPlaceIpp,
  onPlaceDirection,
  onClose,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: x + MENU_OFFSET, top: y + MENU_OFFSET });

  useLayoutEffect(() => {
    const node = ref.current;
    const parent = node?.offsetParent as HTMLElement | null;
    if (!node || !parent) return;
    const menuRect = node.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    let left = x + MENU_OFFSET;
    let top = y + MENU_OFFSET;
    if (left + menuRect.width > parentRect.width - 8) {
      left = Math.max(8, x - menuRect.width - MENU_OFFSET);
    }
    if (top + menuRect.height > parentRect.height - 8) {
      top = Math.max(8, y - menuRect.height - MENU_OFFSET);
    }
    setPos({ left, top });
  }, [x, y]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("touchstart", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Place marker"
      className="sar-map-context-menu absolute z-20 min-w-[220px] bg-white rounded-md border border-rule-strong overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.04)]"
      style={{ left: pos.left, top: pos.top }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <button
        role="menuitem"
        onClick={() => {
          onPlaceIpp();
          onClose();
        }}
        className="flex items-center gap-2 w-full text-left px-3 py-2.5 sm:py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-charcoal hover:bg-snow cursor-pointer"
      >
        <Crosshair size={13} strokeWidth={1.75} className="text-orange-brand" />
        {hasIpp ? "Move planning point here" : "Place planning point"}
      </button>
      <button
        role="menuitem"
        onClick={() => {
          onPlaceDirection();
          onClose();
        }}
        className="flex items-center gap-2 w-full text-left px-3 py-2.5 sm:py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-charcoal hover:bg-snow border-t border-rule cursor-pointer"
      >
        <Navigation size={13} strokeWidth={1.75} />
        {hasDirection ? "Move direction here" : "Place direction"}
      </button>
    </div>
  );
}
