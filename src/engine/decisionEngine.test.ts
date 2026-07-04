import { describe, expect, it } from 'vitest'
import { decide } from './decisionEngine'
import { scenarios } from '../data/scenarios'
import type { Request } from '../types'

const [vipCancelled, newBooking, billingDispute, pricingQuestion, urgentThreat] = scenarios

describe('decisionEngine', () => {
  it('scenario 1: VIP booking cancelled -> High priority, assign to Account Manager', () => {
    const decision = decide(vipCancelled)
    expect(decision.priority).toBe('High')
    expect(decision.action).toBe('assign')
    expect(decision.owner).toBe('Account Manager')
    expect(decision.confidence).toBeGreaterThanOrEqual(65)
    expect(decision.confidence).toBeLessThanOrEqual(75)
  })

  it('scenario 2: new customer booking earliest slot -> Medium priority, auto_resolve', () => {
    const decision = decide(newBooking)
    expect(decision.priority).toBe('Medium')
    expect(decision.action).toBe('auto_resolve')
    expect(decision.owner).toBe('AI Agent')
    expect(decision.confidence).toBeGreaterThanOrEqual(90)
  })

  it('scenario 3: charged twice -> Critical priority, ALWAYS escalate, capped confidence', () => {
    const decision = decide(billingDispute)
    expect(decision.priority).toBe('Critical')
    expect(decision.action).toBe('escalate')
    expect(decision.owner).toBe('Billing Manager')
    expect(decision.confidence).toBeGreaterThanOrEqual(30)
    expect(decision.confidence).toBeLessThanOrEqual(40)
    expect(decision.suggestedResponse).toBeNull()
  })

  it('scenario 4: simple pricing question -> Low priority, auto_resolve', () => {
    const decision = decide(pricingQuestion)
    expect(decision.priority).toBe('Low')
    expect(decision.action).toBe('auto_resolve')
    expect(decision.owner).toBe('AI Agent')
    expect(decision.confidence).toBeGreaterThanOrEqual(95)
  })

  it('scenario 5: urgent + threatens bad review -> Critical priority, escalate to Support Manager', () => {
    const decision = decide(urgentThreat)
    expect(decision.priority).toBe('Critical')
    expect(decision.action).toBe('escalate')
    expect(decision.owner).toBe('Support Manager (on-call)')
    expect(decision.suggestedResponse).toBeNull()
  })

  it('golden edge case: financial dispute escalates even if other signals look confident/low-risk', () => {
    const suspiciouslyConfidentDispute: Request = {
      id: 'req-edge',
      customerName: 'Test Customer',
      tier: 'VIP', // even VIP tier
      category: 'billing_dispute',
      message: 'Just a tiny simple double charge, definitely charged twice, super clear cut case.',
      timestamp: '2026-07-04T09:00:00Z',
    }

    const decision = decide(suspiciouslyConfidentDispute)

    expect(decision.action).toBe('escalate')
    expect(decision.owner).toBe('Billing Manager')
    expect(decision.confidence).toBeLessThanOrEqual(40)
    expect(decision.suggestedResponse).toBeNull()
  })
})
