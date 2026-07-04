import type { Decision, Request } from '../types'
import {
  APPOINTMENT_SLOTS_LEFT_TODAY,
  REFUND_MANAGER_APPROVAL_THRESHOLD,
  STAFF_ON_SHIFT,
} from '../config'

export function decide(request: Request): Decision {
  const name = request.customerName

  // HARD RULE — financial disputes / charge errors ALWAYS escalate.
  // This is an explicit early-return: no scoring, no confidence math can override it.
  // AI must never promise money back.
  if (request.category === 'billing_dispute') {
    return {
      priority: 'Critical',
      action: 'escalate',
      owner: 'Billing Manager',
      confidence: 35,
      reasons: [
        'Financial dispute / charge error detected',
        'Hard rule: financial disputes always escalate to a human, regardless of confidence',
        'AI must never commit to a refund on the customer\'s behalf',
        `Refunds above $${REFUND_MANAGER_APPROVAL_THRESHOLD} require manager approval — routed to Billing Manager either way`,
        'Customer sentiment is angry — needs careful human handling',
      ],
      suggestedResponse: null,
    }
  }

  switch (request.category) {
    case 'booking_cancelled':
      return {
        priority: 'High',
        action: 'assign',
        owner: 'Account Manager',
        confidence: 70,
        reasons: [
          request.tier === 'VIP'
            ? 'VIP status confirmed via VIP knowledge base — relationship needs a human touch before contact'
            : 'Relationship needs a human touch before contact',
          'Root cause is clear: booking was cancelled unexpectedly and can be rebooked',
          `Only ${STAFF_ON_SHIFT} staff on shift right now — routed for prioritized human follow-up`,
        ],
        suggestedResponse: `Hi ${name}, we're very sorry — your booking was cancelled due to a system error on our end, not by you. We've identified an available replacement and would like to confirm the details with you personally before rebooking.`,
      }

    case 'booking_new':
      return {
        priority: 'Medium',
        action: 'auto_resolve',
        owner: 'AI Agent',
        confidence: 93,
        reasons: [
          'Request is unambiguous: book the earliest available slot',
          'Low risk — standard booking flow, no exceptions requested',
          `Only ${APPOINTMENT_SLOTS_LEFT_TODAY} slots left today — confirmed immediately to secure it`,
        ],
        suggestedResponse: `Hi ${name}, you're booked into the earliest available slot today. A confirmation has been sent to your email.`,
      }

    case 'pricing_question':
      return {
        priority: 'Low',
        action: 'auto_resolve',
        owner: 'AI Agent',
        confidence: 97,
        reasons: [
          'FAQ-style question with a factual, published answer',
          'No account changes, payments, or commitments involved',
          'No risk in automating a direct response',
        ],
        suggestedResponse: `Hi ${name}, thanks for asking! Our packages range from $150–$450 per person depending on the tour. Let us know which one you're interested in and we'll confirm exact pricing.`,
      }

    case 'urgent_threat':
      return {
        priority: 'Critical',
        action: 'escalate',
        owner: 'Support Manager (on-call)',
        confidence: 55,
        reasons: [
          'Reputational risk — customer explicitly threatens a public bad review',
          'Emotional volatility detected',
          'Tone and judgment call required — not safe for an automated reply',
          `Only ${STAFF_ON_SHIFT} staff on shift — flagged for immediate attention given limited capacity`,
        ],
        suggestedResponse: null,
      }

    case 'general_inquiry':
      return {
        priority: 'Medium',
        action: 'assign',
        owner: 'Support Manager (on-call)',
        confidence: 50,
        reasons: [
          "Message didn't clearly match a known request type",
          'Routed to a human for manual triage rather than guessing',
        ],
        suggestedResponse: `Hi ${name}, thanks for reaching out — one of our team members will review your message and get back to you shortly.`,
      }
  }
}
