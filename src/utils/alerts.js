// ═══════════════════════════════════════════════════════════════
// ALERTS UTILITY — global alert bus
// ═══════════════════════════════════════════════════════════════

const alertListeners = []
export const alertStore = []

export function emitAlert(alert) {
  alert.time = new Date()
  alertStore.unshift(alert)
  if (alertStore.length > 50) alertStore.pop()
  alertListeners.forEach(cb => cb(alert))
}

export function onAlert(cb) { alertListeners.push(cb) }
export function offAlert(cb) {
  const i = alertListeners.indexOf(cb)
  if (i !== -1) alertListeners.splice(i, 1)
}
export function dismissAlert(id) {
  const i = alertStore.findIndex(a => a.id === id)
  if (i !== -1) alertStore.splice(i, 1)
}
