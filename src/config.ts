// Demo config: routes every escalation email to one inbox regardless of Owner.
// In production this would map Owner -> the real team's shared inbox.
export const SUPPORT_MANAGER_EMAIL = 'yassfee923@gmail.com'

// Operational context surfaced in the engine's reasoning output. These are
// read-only signals for this demo (they inform WHY a decision reads the way
// it does) rather than new branching logic — see decisionEngine.ts.
export const STAFF_ON_SHIFT = 2
export const APPOINTMENT_SLOTS_LEFT_TODAY = 3
export const REFUND_MANAGER_APPROVAL_THRESHOLD = 200
