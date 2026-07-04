import { decide } from './decisionEngine'
import type { Priority, QueueItem, Request, Status } from '../types'

const PRIORITY_ORDER: Record<Priority, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
}

function initialStatus(action: QueueItem['decision']['action']): Status {
  if (action === 'auto_resolve') return 'Auto-resolved'
  if (action === 'escalate') return 'Escalated'
  return 'Pending'
}

export function buildQueueItem(request: Request): QueueItem {
  const decision = decide(request)
  return {
    request,
    decision,
    status: initialStatus(decision.action),
  }
}

export function sortByPriority(items: QueueItem[]): QueueItem[] {
  return [...items].sort((a, b) => PRIORITY_ORDER[a.decision.priority] - PRIORITY_ORDER[b.decision.priority])
}
