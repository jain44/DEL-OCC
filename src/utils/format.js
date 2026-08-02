// ═══════════════════════════════════════════════════════════════
// FORMAT UTILITIES
// ═══════════════════════════════════════════════════════════════

export function fmtTime(dateStr) {
  if (!dateStr) return '--:--'
  try {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  } catch { return '--:--' }
}

export function fmtDate(dateStr) {
  if (!dateStr) return '---'
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return '---' }
}

export function fmtDateTime(dateStr) {
  if (!dateStr) return '---'
  try {
    return new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    })
  } catch { return '---' }
}

export function fmtCurrency(n) {
  const num = parseInt(n) || 0
  if (num >= 10000000) return `₹${(num/10000000).toFixed(1)}Cr`
  if (num >= 100000)   return `₹${(num/100000).toFixed(1)}L`
  if (num >= 1000)     return `₹${(num/1000).toFixed(1)}K`
  return `₹${num.toLocaleString('en-IN')}`
}

export function fmtNumber(n) {
  return (parseInt(n) || 0).toLocaleString('en-IN')
}

export function fmtDelay(mins) {
  const m = parseInt(mins) || 0
  if (m === 0) return null
  if (m < 60) return `+${m}m`
  return `+${Math.floor(m/60)}h ${m%60}m`
}

export function fmtPct(n) {
  return `${parseFloat(n || 0).toFixed(1)}%`
}

export function fmtWeight(kg) {
  return `${parseFloat(kg || 0).toFixed(1)} kg`
}

export function statusBadgeClass(status) {
  const s = (status || '').toLowerCase()
  if (s.includes('board') || s.includes('check-in')) return 'amber pulse-amber'
  if (s.includes('depart') || s.includes('arriv') || s.includes('clear') || s.includes('ok') || s.includes('loaded')) return 'green'
  if (s.includes('delay') || s.includes('cancel') || s.includes('flag') || s.includes('mishandled') || s.includes('gate clos')) return 'red pulse-red'
  if (s.includes('schedul') || s.includes('open') || s.includes('in transit')) return 'blue'
  if (s.includes('progress') || s.includes('transit')) return 'cyan'
  if (s.includes('resolv') || s.includes('deliver')) return 'green'
  if (s.includes('on belt')) return 'amber'
  return 'grey'
}

export function severityClass(sev) {
  const s = parseInt(sev)
  if (s === 1) return 'red'
  if (s === 2) return 'amber'
  return 'blue'
}

export function airlineShort(airline) {
  const map = {
    'IndiGo': '6E', 'Vistara': 'UK', 'Air India': 'AI',
    'British Airways': 'BA', 'Emirates': 'EK', 'Qatar Airways': 'QR',
    'Lufthansa': 'LH', 'KLM': 'KL', 'Air France': 'AF',
    'SpiceJet': 'SG', 'Air India Express': 'IX', 'Singapore Airlines': 'SQ'
  }
  return map[airline] || airline?.slice(0,2)?.toUpperCase() || '??'
}

export function airlineColor(airline) {
  const colors = {
    'IndiGo': '#0ea5e9', 'Vistara': '#a855f7', 'Air India': '#ef4444',
    'British Airways': '#1d4ed8', 'Emirates': '#d97706', 'Qatar Airways': '#7c3aed',
    'Lufthansa': '#fbbf24', 'KLM': '#0891b2', 'Air France': '#3b82f6',
    'SpiceJet': '#f97316', 'Air India Express': '#dc2626', 'Singapore Airlines': '#fbbf24'
  }
  return colors[airline] || '#94a3b8'
}

/** Animated number counter */
export function animateCount(el, to, duration = 800, prefix = '', suffix = '') {
  if (!el) return
  const from = parseInt(el.dataset.val || 0)
  el.dataset.val = to
  const start = performance.now()
  const diff = to - from
  function step(now) {
    const progress = Math.min((now - start) / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3) // ease-out-cubic
    el.textContent = prefix + Math.round(from + diff * ease).toLocaleString('en-IN') + suffix
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export function timeSince(date) {
  if (!date) return ''
  const s = Math.floor((new Date() - new Date(date)) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s/60)}m ago`
  return `${Math.floor(s/3600)}h ago`
}
