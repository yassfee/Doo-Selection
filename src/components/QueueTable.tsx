import type { QueueItem } from '../types'
import PriorityBadge from './PriorityBadge'
import ActionBadge from './ActionBadge'
import StatusBadge from './StatusBadge'

const rowTint: Record<string, string> = {
  escalate: 'bg-red-50/60',
  auto_resolve: 'bg-emerald-50/60',
  assign: 'bg-amber-50/60',
}

export default function QueueTable({
  items,
  onSelect,
}: {
  items: QueueItem[]
  onSelect: (id: string) => void
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-300 bg-white shadow-sm">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead>
          <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500">
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Customer / Scenario</th>
            <th className="px-4 py-3">AI Confidence</th>
            <th className="px-4 py-3">Recommended Action</th>
            <th className="px-4 py-3">Owner</th>
            <th className="px-4 py-3">Reason</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.request.id}
              onClick={() => onSelect(item.request.id)}
              className={`cursor-pointer border-b border-stone-100 last:border-0 hover:brightness-95 ${rowTint[item.decision.action]}`}
            >
              <td className="px-4 py-3">
                <PriorityBadge priority={item.decision.priority} />
              </td>
              <td className="px-4 py-3">
                <div className="font-semibold text-ink">{item.request.customerName}</div>
                <div className="text-xs text-stone-500">
                  {item.request.tier} · {item.request.category.replace(/_/g, ' ')}
                </div>
              </td>
              <td className="px-4 py-3 font-medium">{item.decision.confidence}%</td>
              <td className="px-4 py-3">
                <ActionBadge action={item.decision.action} />
              </td>
              <td className="px-4 py-3">{item.decision.owner}</td>
              <td className="px-4 py-3 max-w-xs truncate text-stone-600">{item.decision.reasons[0]}</td>
              <td className="px-4 py-3">
                <StatusBadge
                  status={item.status}
                  label={item.status === 'Sent' ? `Sent by ${item.decision.owner}` : undefined}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
