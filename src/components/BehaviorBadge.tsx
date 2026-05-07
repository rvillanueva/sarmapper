import { useEffect, useState } from "react";
import { Footprints, X } from "lucide-react";
import { names } from "../data/behaviors";

interface BehaviorLike {
  hierarchy: string[];
}

interface BehaviorBadgeProps {
  behavior: BehaviorLike | null;
  onOpenDetails: () => void;
}

const MOBILE_QUERY = "(max-width: 720px)";

function lookup(map: Record<string, string>, key: string | undefined) {
  if (!key) return null;
  return map[key] ?? key;
}

export default function BehaviorBadge({ behavior, onOpenDetails }: BehaviorBadgeProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(MOBILE_QUERY);
    const update = () => setOpen(!mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (!behavior) return null;

  const [profileKey, environmentKey, terrainKey] = behavior.hierarchy;
  const profileName = lookup(names.profiles, profileKey) ?? "Unknown";
  const environmentName = lookup(names.environments, environmentKey);
  const terrainName = lookup(names.terrain, terrainKey);
  const breadcrumb = [environmentName, terrainName].filter(Boolean).join(" · ");

  if (open) {
    return (
      <div className="bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.06),0_0_0_1px_var(--plk-rule-strong)] w-[220px] overflow-hidden">
        <div className="flex items-center justify-between px-3 pt-3 pb-1.5">
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-warm-gray">
            Selected Behavior
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Hide selected behavior"
            className="p-0.5 rounded-sm text-warm-gray hover:bg-silver-light hover:text-charcoal cursor-pointer transition-colors"
          >
            <X size={12} strokeWidth={1.5} />
          </button>
        </div>
        <button
          type="button"
          onClick={onOpenDetails}
          aria-label="Open behavior details and selectors"
          className="block w-full text-left px-3 pb-3 cursor-pointer hover:bg-snow transition-colors"
        >
          <div className="font-serif text-[15px] text-ink leading-tight">
            {profileName}
          </div>
          {breadcrumb && (
            <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-warm-gray">
              {breadcrumb}
            </div>
          )}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setOpen(true)}
      aria-label={`Selected behavior: ${profileName}. Tap to expand.`}
      className="flex items-center gap-2 h-[29px] pl-2 pr-2.5 bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.06),0_0_0_1px_var(--plk-rule-strong)] text-charcoal hover:bg-snow cursor-pointer transition-colors"
    >
      <Footprints size={14} strokeWidth={1.75} />
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] truncate max-w-[110px]">
        {profileName}
      </span>
    </button>
  );
}
