export default function BehaviorStats({
  behavior
}) {
  return (
    <div className="mt-4 rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Distances</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dispersion</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-3 py-2 font-medium text-gray-700">n</td>
            <td className="px-3 py-2 text-gray-600">{behavior.n}</td>
            <td className="px-3 py-2 text-gray-600">{behavior.dispersion.n}</td>
          </tr>
          <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-3 py-2 font-medium text-gray-700">25%</td>
            <td className="px-3 py-2 text-gray-600">{behavior.distances[0]} km</td>
            <td className="px-3 py-2 text-gray-600">{behavior.dispersion.angles[0]}&deg;</td>
          </tr>
          <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-3 py-2 font-medium text-gray-700">50%</td>
            <td className="px-3 py-2 text-gray-600">{behavior.distances[1]} km</td>
            <td className="px-3 py-2 text-gray-600">{behavior.dispersion.angles[1]}&deg;</td>
          </tr>
          <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-3 py-2 font-medium text-gray-700">75%</td>
            <td className="px-3 py-2 text-gray-600">{behavior.distances[2]} km</td>
            <td className="px-3 py-2 text-gray-600">{behavior.dispersion.angles[2]}&deg;</td>
          </tr>
          <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-3 py-2 font-medium text-gray-700">95%</td>
            <td className="px-3 py-2 text-gray-600">{behavior.distances[3]} km</td>
            <td className="px-3 py-2 text-gray-600">{behavior.dispersion.angles[3]}&deg;</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
