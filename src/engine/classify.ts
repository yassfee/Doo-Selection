import type { Category } from '../types'

// Lightweight keyword-signal classifier — deliberately rule-based, not an
// external API call, so the live demo has zero network dependency.
// Billing/financial keywords are checked first and independently: they can
// coexist with other signals (e.g. an angry cancellation) and still win,
// which is what feeds the hard escalation rule in decisionEngine.ts.
const SIGNALS: Array<{ category: Category; keywords: RegExp }> = [
  {
    category: 'billing_dispute',
    keywords:
      /((charged?|billed).{0,15}twice|double charg|overcharg|refund|money back|billing (error|issue|mistake)|(charged?|billed).*(wrong|extra)|revers(e|ed) (the |that )?charge)/i,
  },
  {
    category: 'urgent_threat',
    keywords: /(bad review|1-?star|leave a review|negative review|report(ing)? you|social media|never (book|use).*again)/i,
  },
  {
    category: 'booking_cancelled',
    keywords:
      /(cancel(led|ed)? my (booking|reservation)|(booking|reservation).*(disappeared|vanished|is gone)|(didn'?t|never) cancel)/i,
  },
  {
    category: 'pricing_question',
    keywords: /(how much|what.*cost|price|pricing|per person|per night)/i,
  },
  {
    category: 'booking_new',
    keywords: /(book|reserve|availability|earliest|slot|schedule)/i,
  },
]

export function classifyMessage(message: string): Category {
  for (const signal of SIGNALS) {
    if (signal.keywords.test(message)) {
      return signal.category
    }
  }
  return 'general_inquiry'
}
