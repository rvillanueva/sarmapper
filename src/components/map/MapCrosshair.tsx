interface MapCrosshairProps {
  visible: boolean;
}

export default function MapCrosshair({ visible }: MapCrosshairProps) {
  if (!visible) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div className="relative w-7 h-7">
        <span className="absolute inset-x-0 top-1/2 h-px bg-ink/70" />
        <span className="absolute inset-y-0 left-1/2 w-px bg-ink/70" />
        <span className="absolute inset-1.5 rounded-full border border-ink/70" />
      </div>
    </div>
  );
}
