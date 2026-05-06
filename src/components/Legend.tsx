import { useEffect, useState } from "react";
import { Info, X } from "lucide-react";

const MOBILE_QUERY = "(max-width: 720px)";

export default function Legend() {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(MOBILE_QUERY);
    const update = () => {
      setIsMobile(mql.matches);
      setOpen(!mql.matches);
    };
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return (
    <div className="absolute bottom-7 right-2 z-10 flex flex-col items-end">
      {open ? (
        <div className="bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.06),0_0_0_1px_var(--plk-rule-strong)] p-3 w-[220px]">
          <div className="flex items-center justify-between mb-2">
            <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-warm-gray">
              Legend
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close legend"
              className="p-0.5 rounded-sm text-warm-gray hover:bg-silver-light hover:text-charcoal cursor-pointer transition-colors"
            >
              <X size={12} strokeWidth={1.5} />
            </button>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="inline-block h-3 w-3 rounded-full bg-orange-brand border-2 border-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] shrink-0"
              />
              <span className="text-[12px] text-charcoal leading-snug">
                Initial Planning Point
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="inline-block h-2.5 w-2.5 rounded-full bg-ink border-2 border-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] shrink-0"
              />
              <span className="text-[12px] text-charcoal leading-snug">
                Direction of Travel
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="inline-block h-3 w-8 rounded-sm shrink-0 border border-rule"
                style={{
                  background:
                    "linear-gradient(to right, #2c7bb6 0%, #abd9e9 25%, #ffffbf 50%, #fdae61 75%, #d7191c 100%)",
                  opacity: 0.85,
                }}
              />
              <span className="text-[12px] text-charcoal leading-snug">
                Probability density (low &rarr; high)
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="inline-block w-4 shrink-0"
                style={{ borderTop: "2px solid #3a3632", opacity: 0.85 }}
              />
              <span className="text-[12px] text-charcoal leading-snug">
                Direction line
              </span>
            </li>
          </ul>
          <div className="mt-3 pt-2 border-t border-rule font-mono text-[9px] uppercase tracking-[0.12em] text-warm-gray leading-relaxed">
            {isMobile ? "Long-press" : "Right-click"} the map to place a marker
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open legend"
          className="flex items-center justify-center h-[29px] w-[29px] bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.06),0_0_0_1px_var(--plk-rule-strong)] text-charcoal hover:bg-snow cursor-pointer transition-colors"
        >
          <Info size={14} strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
}
