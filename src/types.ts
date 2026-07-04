export type Priority = 'Critical' | 'High' | 'Medium' | 'Low'

export type Action = 'auto_resolve' | 'assign' | 'escalate'

export type Owner =
  | 'AI Agent'
  | 'Account Manager'
  | 'Billing Manager'
  | 'Support Manager (on-call)'

export type CustomerTier = 'VIP' | 'New' | 'Standard'

export type Category =
  | 'booking_cancelled'
  | 'booking_new'
  | 'billing_dispute'
  | 'pricing_question'
  | 'urgent_threat'
  | 'general_inquiry'

export type Status = 'Pending' | 'Auto-resolved' | 'Escalated' | 'Sent'

export interface Request {
  id: string
  customerName: string
  tier: CustomerTier
  category: Category
  message: string
  timestamp: string
}

export interface Decision {
  priority: Priority
  action: Action
  owner: Owner
  confidence: number
  reasons: string[]
  suggestedResponse: string | null
}

export interface QueueItem {
  request: Request
  decision: Decision
  status: Status
  sentBy?: string
}
