import { useState } from 'react'
import type { CustomerTier } from '../types'

export default function NewRequestForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (input: { customerName: string; tier: CustomerTier; message: string }) => void
  onCancel: () => void
}) {
  const [customerName, setCustomerName] = useState('')
  const [tier, setTier] = useState<CustomerTier>('Standard')
  const [message, setMessage] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    onSubmit({ customerName: customerName.trim() || 'Anonymous Customer', tier, message: message.trim() })
    setCustomerName('')
    setTier('Standard')
    setMessage('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl border border-stone-300 bg-white p-5 shadow-sm"
    >
      <h2 className="text-sm font-semibold text-stone-700">
        Type a request — the engine classifies it live, no canned scenarios
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Customer name (optional)"
          className="rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value as CustomerTier)}
          className="rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-accent"
        >
          <option value="Standard">Standard</option>
          <option value="New">New</option>
          <option value="VIP">VIP</option>
        </select>
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type the customer's message here..."
        rows={3}
        className="mt-3 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <div className="mt-3 flex gap-3">
        <button
          type="submit"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-95"
        >
          Submit request
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-100"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
