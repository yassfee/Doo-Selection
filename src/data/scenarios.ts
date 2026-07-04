import type { Request } from '../types'

export const scenarios: Request[] = [
  {
    id: 'req-1',
    customerName: 'Eleanor Whitfield',
    tier: 'VIP',
    category: 'booking_cancelled',
    message:
      "My booking for the Obsidian Hollow suite next weekend just vanished from my account. I didn't cancel it — I need this fixed today, I have guests arriving.",
    timestamp: '2026-07-04T08:12:00Z',
  },
  {
    id: 'req-2',
    customerName: 'Marcus Chen',
    tier: 'New',
    category: 'booking_new',
    message:
      "Hi, I just signed up. Can I book the earliest available slot today for the Frostvell Summit tour? Whatever's soonest works for me.",
    timestamp: '2026-07-04T08:20:00Z',
  },
  {
    id: 'req-3',
    customerName: 'Priya Nair',
    tier: 'Standard',
    category: 'billing_dispute',
    message:
      "I was charged TWICE for my Whispering Dunes booking. $400 taken out two times. I want a refund right now, this is unacceptable.",
    timestamp: '2026-07-04T08:25:00Z',
  },
  {
    id: 'req-4',
    customerName: 'Jonah Ibrahim',
    tier: 'Standard',
    category: 'pricing_question',
    message: 'Quick question — how much does the Crimson Rift desert package cost per person?',
    timestamp: '2026-07-04T08:30:00Z',
  },
  {
    id: 'req-5',
    customerName: 'Dana Kowalski',
    tier: 'Standard',
    category: 'urgent_threat',
    message:
      "This is the third time my Stormbreaker Isles trip has had an issue and nobody has helped. Fix this now or I'm leaving a 1-star review everywhere I can.",
    timestamp: '2026-07-04T08:35:00Z',
  },
]
