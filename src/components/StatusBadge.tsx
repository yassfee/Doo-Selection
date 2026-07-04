import type { Status } from '../types'

const styles: Record<Status, string> = {
  Pending: 'bg-stone-200 text-ink',
  'Auto-resolved': 'bg-emerald-500 text-white',
  Escalated: 'bg-red-600 text-white',
  Sent: 'bg-sky-500 text-white',
}

export default function StatusBadge({ status, label }: { status: Status; label?: string }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {label ?? status}
    </span>
  )
}
