export default function BehaviorStats({
  behavior
}) {
  const headerClass = "px-3 py-2.5 text-left font-mono text-[10px] tracking-[0.14em] uppercase text-warm-gray font-normal";
  const rowLabelClass = "px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-charcoal";
  const cellClass = "px-3 py-2.5 text-[13px] text-slate-warm font-light tabular-nums";

  return (
    <div className="mt-5 rounded-sm border border-rule overflow-hidden bg-snow">
      <table className="w-full">
        <thead>
          <tr className="bg-silver-light border-b border-rule">
            <th className={headerClass}></th>
            <th className={headerClass}>Distances</th>
            <th className={headerClass}>Dispersion</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rule">
          <tr>
            <td className={rowLabelClass}>n</td>
            <td className={cellClass}>{behavior.n}</td>
            <td className={cellClass}>{behavior.dispersion.n}</td>
          </tr>
          <tr>
            <td className={rowLabelClass}>25%</td>
            <td className={cellClass}>{behavior.distances[0]} km</td>
            <td className={cellClass}>{behavior.dispersion.angles[0]}&deg;</td>
          </tr>
          <tr>
            <td className={rowLabelClass}>50%</td>
            <td className={cellClass}>{behavior.distances[1]} km</td>
            <td className={cellClass}>{behavior.dispersion.angles[1]}&deg;</td>
          </tr>
          <tr>
            <td className={rowLabelClass}>75%</td>
            <td className={cellClass}>{behavior.distances[2]} km</td>
            <td className={cellClass}>{behavior.dispersion.angles[2]}&deg;</td>
          </tr>
          <tr>
            <td className={rowLabelClass}>95%</td>
            <td className={cellClass}>{behavior.distances[3]} km</td>
            <td className={cellClass}>{behavior.dispersion.angles[3]}&deg;</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
