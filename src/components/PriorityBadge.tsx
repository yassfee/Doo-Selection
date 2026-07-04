import type { Priority } from '../types'

const styles: Record<Priority, string> = {
  Critical: 'bg-red-600 text-white',
  High: 'bg-orange-500 text-white',
  Medium: 'bg-amber-300 text-ink',
  Low: 'bg-stone-200 text-ink',
}

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${styles[priority]}`}>
      {priority}
    </span>
  )
}
