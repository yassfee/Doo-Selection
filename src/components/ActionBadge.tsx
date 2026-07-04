import type { Action } from '../types'

const styles: Record<Action, string> = {
  auto_resolve: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
  assign: 'bg-amber-100 text-amber-800 border border-amber-300',
  escalate: 'bg-red-100 text-red-800 border border-red-300',
}

const labels: Record<Action, string> = {
  auto_resolve: 'Auto-Resolve',
  assign: 'Assign',
  escalate: 'Escalate',
}

export default function ActionBadge({ action }: { action: Action }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${styles[action]}`}>
      {labels[action]}
    </span>
  )
}
