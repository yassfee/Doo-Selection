import { SUPPORT_MANAGER_EMAIL } from '../config'
import type { QueueItem } from '../types'

export function buildEscalationMailto(item: QueueItem): string {
  const { request, decision } = item

  const subject = `[ESCALATION - ${decision.priority}] ${request.customerName} — ${request.category.replace(/_/g, ' ')}`

  const bodyLines = [
    `Customer: ${request.customerName} (${request.tier})`,
    `Owner assigned: ${decision.owner}`,
    `Priority: ${decision.priority}`,
    '',
    'Original message:',
    request.message,
    '',
    'AI reasoning:',
    ...decision.reasons.map((r) => `- ${r}`),
    '',
    'AI did not draft or send a response for this request — human judgment required.',
  ]

  const subjectParam = encodeURIComponent(subject)
  const bodyParam = encodeURIComponent(bodyLines.join('\n'))

  return `mailto:${SUPPORT_MANAGER_EMAIL}?subject=${subjectParam}&body=${bodyParam}`
}
