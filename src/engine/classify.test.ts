import { describe, expect, it } from 'vitest'
import { classifyMessage } from './classify'
import { decide } from './decisionEngine'

describe('classifyMessage', () => {
  it('detects a billing dispute phrased in totally new words', () => {
    expect(classifyMessage('I noticed two separate withdrawals for the same trip, please refund one')).toBe(
      'billing_dispute',
    )
  })

  it('detects a pricing question', () => {
    expect(classifyMessage('What does the mountain retreat package cost for a couple?')).toBe(
      'pricing_question',
    )
  })

  it('detects a cancelled booking complaint', () => {
    expect(classifyMessage('My reservation just disappeared and I never cancelled it')).toBe(
      'booking_cancelled',
    )
  })

  it('detects a reputational threat', () => {
    expect(classifyMessage("Fix this or I'm leaving a 1-star review on every platform")).toBe(
      'urgent_threat',
    )
  })

  it('detects a new booking request', () => {
    expect(classifyMessage('Can I reserve the earliest available slot tomorrow?')).toBe('booking_new')
  })

  it('falls back to general_inquiry for unrecognized free text', () => {
    expect(classifyMessage('Do you offer gift cards?')).toBe('general_inquiry')
  })

  it('golden edge case: a freshly-typed, never-seen billing complaint still forces escalate end-to-end', () => {
    const message = 'Your system billed my card twice for one stay, I want that extra charge reversed immediately'
    const category = classifyMessage(message)
    const decision = decide({
      id: 'req-freeform',
      customerName: 'Someone New',
      tier: 'Standard',
      category,
      message,
      timestamp: new Date().toISOString(),
    })

    expect(category).toBe('billing_dispute')
    expect(decision.action).toBe('escalate')
    expect(decision.owner).toBe('Billing Manager')
    expect(decision.confidence).toBeLessThanOrEqual(40)
    expect(decision.suggestedResponse).toBeNull()
  })
})
