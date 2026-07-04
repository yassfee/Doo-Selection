import type { QueueItem } from '../types'
import PriorityBadge from './PriorityBadge'
import ActionBadge from './ActionBadge'
import { buildEscalationMailto } from '../utils/email'

export default function RequestDetail({
  item,
  onBack,
  onSend,
}: {
  item: QueueItem
  onBack: () => void
  onSend: (id: string) => void
}) {
  const { request, decision, status } = item

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={onBack}
        className="mb-6 text-sm font-semibold text-stone-600 hover:text-ink"
      >
        ← Back to queue
      </button>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <PriorityBadge priority={decision.priority} />
        <ActionBadge action={decision.action} />
        <span className="text-sm text-stone-500">{decision.confidence}% confidence</span>
      </div>

      <h1 className="text-2xl font-bold">{request.customerName}</h1>
      <p className="mt-1 text-sm text-stone-500">
        {request.tier} · {request.category.replace(/_/g, ' ')} ·{' '}
        {new Date(request.timestamp).toLocaleString()}
      </p>

      <div className="mt-6 rounded-2xl border border-stone-300 bg-white p-5 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Request
        </h2>
        <p className="mt-2 text-ink">{request.message}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-stone-300 bg-white p-5 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          AI reasoning
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-ink">
          {decision.reasons.map((reason, i) => (
            <li key={i}>{reason}</li>
          ))}
        </ul>
      </div>

      {decision.action === 'escalate' && (
        <div className="mt-6 rounded-2xl border border-red-300 bg-red-50 p-5 shadow-sm">
          <p className="text-lg font-bold text-red-700">
            ⚠️ AI will not act — escalated to {decision.owner}
          </p>
          <p className="mt-1 text-sm text-red-700">
            This case requires human judgment. No response has been drafted or sent on the
            customer's behalf.
          </p>
          <a
            href={buildEscalationMailto(item)}
            className="mt-4 inline-block rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-95"
          >
            📧 Email escalation to {decision.owner}
          </a>
        </div>
      )}

      {decision.action === 'auto_resolve' && (
        <div className="mt-6 rounded-2xl border border-stone-300 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Suggested response
          </h2>
          <p className="mt-2 text-ink">{decision.suggestedResponse}</p>
          <div className="mt-4 inline-block rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">
            ✅ Sent automatically
          </div>
        </div>
      )}

      {decision.action === 'assign' && (
        <div className="mt-6 rounded-2xl border border-stone-300 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Suggested response (draft)
          </h2>
          <p className="mt-2 text-ink">{decision.suggestedResponse}</p>
          {status === 'Sent' ? (
            <div className="mt-4 inline-block rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">
              ✅ Sent by {decision.owner}
            </div>
          ) : (
            <button
              onClick={() => onSend(request.id)}
              className="mt-4 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-95"
            >
              Review & Send
            </button>
          )}
        </div>
      )}
    </div>
  )
}
