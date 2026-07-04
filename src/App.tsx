import { useRef, useState } from 'react'
import { scenarios } from './data/scenarios'
import { decide } from './engine/decisionEngine'
import { classifyMessage } from './engine/classify'
import { buildQueueItem, sortByPriority } from './engine/queue'
import QueueTable from './components/QueueTable'
import RequestDetail from './components/RequestDetail'
import NewRequestForm from './components/NewRequestForm'
import type { CustomerTier, QueueItem, Request } from './types'

export default function App() {
  const [items, setItems] = useState<QueueItem[]>(() => sortByPriority(scenarios.map(buildQueueItem)))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const nextIndexRef = useRef(0)

  function appendLive(incoming: Request) {
    const decision = decide(incoming)
    const newItem: QueueItem = { request: incoming, decision, status: 'Pending' }

    setItems((prev) => sortByPriority([...prev, newItem]))

    // Simulate the engine acting on its own decision a beat after it lands in the queue.
    if (decision.action === 'auto_resolve' || decision.action === 'escalate') {
      const finalStatus = decision.action === 'auto_resolve' ? 'Auto-resolved' : 'Escalated'
      setTimeout(() => {
        setItems((prev) =>
          prev.map((it) => (it.request.id === incoming.id ? { ...it, status: finalStatus } : it)),
        )
      }, 900)
    }
  }

  function handleSimulate() {
    const template = scenarios[nextIndexRef.current % scenarios.length]
    nextIndexRef.current += 1

    appendLive({
      ...template,
      id: `${template.id}-sim-${Date.now()}`,
      timestamp: new Date().toISOString(),
    })
  }

  function handleNewRequest(input: { customerName: string; tier: CustomerTier; message: string }) {
    setShowForm(false)
    const incoming: Request = {
      id: `req-manual-${Date.now()}`,
      customerName: input.customerName,
      tier: input.tier,
      category: classifyMessage(input.message),
      message: input.message,
      timestamp: new Date().toISOString(),
    }
    appendLive(incoming)
    setSelectedId(incoming.id)
  }

  function handleSend(id: string) {
    setItems((prev) =>
      prev.map((it) => (it.request.id === id ? { ...it, status: 'Sent' } : it)),
    )
  }

  const selectedItem = items.find((it) => it.request.id === selectedId) ?? null

  const counts = {
    total: items.length,
    autoResolved: items.filter((it) => it.status === 'Auto-resolved').length,
    escalated: items.filter((it) => it.status === 'Escalated').length,
    pending: items.filter((it) => it.status === 'Pending').length,
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="flex items-center justify-between border-b border-stone-300 bg-cream/80 px-8 py-6 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-bold text-cream">
            T
          </span>
          <div>
            <h1 className="text-3xl font-bold">Decision Queue</h1>
            <p className="mt-1 text-sm text-stone-600">
              AI-triaged customer requests, sorted by priority.
            </p>
          </div>
        </div>
        {!selectedItem && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm((v) => !v)}
              className="rounded-full border border-ink px-5 py-3 text-sm font-semibold text-ink shadow-sm transition hover:bg-ink hover:text-cream active:scale-95"
            >
              📝 Type a request
            </button>
            <button
              onClick={handleSimulate}
              className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-95"
            >
              + Simulate incoming request
            </button>
          </div>
        )}
      </header>

      <main className="px-8 py-8">
        {!selectedItem && (
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="In queue" value={counts.total} />
            <StatCard label="Auto-resolved" value={counts.autoResolved} tone="text-emerald-600" />
            <StatCard label="Escalated" value={counts.escalated} tone="text-red-600" />
            <StatCard label="Pending human" value={counts.pending} tone="text-amber-600" />
          </div>
        )}
        {selectedItem ? (
          <RequestDetail item={selectedItem} onBack={() => setSelectedId(null)} onSend={handleSend} />
        ) : (
          <>
            {showForm && (
              <NewRequestForm onSubmit={handleNewRequest} onCancel={() => setShowForm(false)} />
            )}
            <QueueTable items={items} onSelect={setSelectedId} />
          </>
        )}
      </main>
    </div>
  )
}

function StatCard({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-2xl border border-stone-300 bg-white px-5 py-4 shadow-sm">
      <div className={`text-2xl font-bold ${tone ?? 'text-ink'}`}>{value}</div>
      <div className="text-xs uppercase tracking-wide text-stone-500">{label}</div>
    </div>
  )
}
