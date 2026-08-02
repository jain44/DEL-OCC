// ═══════════════════════════════════════════════════════════════
// MAIN — App bootstrap, router, HUD navigation, simulation
// ═══════════════════════════════════════════════════════════════
import { loadAllData } from './data/loader.js'
import { initStore, store } from './data/store.js'
import { startSimulator, pauseSimulator, resumeSimulator, increaseSpeed, decreaseSpeed, getSpeed, onSimUpdate } from './data/simulator.js'
import { onAlert, alertStore, dismissAlert } from './utils/alerts.js'
import { initParticles } from './utils/particles.js'

import { renderOverview, destroyOverview } from './views/overview.js'
import { renderFlights, destroyFlights } from './views/flights.js'
import { renderGates, destroyGates } from './views/gates.js'
import { renderBaggage, destroyBaggage } from './views/baggage.js'
import { renderPassengers, destroyPassengers } from './views/passengers.js'
import { renderSecurity, destroySecurity } from './views/security.js'
import { renderMaintenance, destroyMaintenance } from './views/maintenance.js'
import { renderStaff, destroyStaff } from './views/staff.js'
import { renderRetail, destroyRetail } from './views/retail.js'
import { initModal } from './views/modal.js'

const VIEWS = {
  overview:    { render: renderOverview,    destroy: destroyOverview    },
  flights:     { render: renderFlights,     destroy: destroyFlights     },
  gates:       { render: renderGates,       destroy: destroyGates       },
  baggage:     { render: renderBaggage,     destroy: destroyBaggage     },
  passengers:  { render: renderPassengers,  destroy: destroyPassengers  },
  security:    { render: renderSecurity,    destroy: destroySecurity    },
  maintenance: { render: renderMaintenance, destroy: destroyMaintenance },
  staff:       { render: renderStaff,       destroy: destroyStaff       },
  retail:      { render: renderRetail,      destroy: destroyRetail      },
}

let _currentView = null
const FILE_LABELS = [
  { key: 'flights',             label: 'flights.csv' },
  { key: 'passengers',          label: 'passengers.csv' },
  { key: 'baggage',             label: 'baggage.csv' },
  { key: 'gate_events',         label: 'gate_events.csv' },
  { key: 'security_screening',  label: 'security_screening.csv' },
  { key: 'maintenance_logs',    label: 'maintenance_logs.csv' },
  { key: 'staff_shifts',        label: 'staff_shifts.csv' },
  { key: 'retail_transactions', label: 'retail_transactions.csv' },
]

async function boot() {
  initParticles()
  _renderBootFiles()
  await _loadWithProgress()
  await _bootReady()
  _initApp()
}

function _renderBootFiles() {
  const container = document.getElementById('boot-files')
  if (!container) return
  container.innerHTML = FILE_LABELS.map(f => `
    <div class="boot-file-row" id="boot-row-${f.key}">
      <div class="boot-file-name">${f.label}</div>
      <div class="boot-file-bar-wrap">
        <div class="boot-file-bar" id="boot-bar-${f.key}"></div>
      </div>
      <div class="boot-file-pct" id="boot-pct-${f.key}">0%</div>
    </div>
  `).join('')
}

async function _loadWithProgress() {
  let loadedCount = 0
  const raw = await loadAllData((key, pct) => {
    const bar = document.getElementById(`boot-bar-${key}`)
    const pctEl = document.getElementById(`boot-pct-${key}`)
    if (bar) bar.style.width = pct + '%'
    if (pctEl) pctEl.textContent = pct + '%'
    
    if (pct === 100) loadedCount++
    const totalPct = Math.round((loadedCount / FILE_LABELS.length) * 100)
    const totalBar = document.getElementById('boot-total-bar')
    if (totalBar) totalBar.style.width = totalPct + '%'

    const statusEl = document.getElementById('boot-status')
    if (statusEl) statusEl.textContent = `LOADING DATASET // ${key.toUpperCase()}`
  })
  initStore(raw)
}

async function _bootReady() {
  const statusEl = document.getElementById('boot-status')
  const messages = [
    'PARSING TELEMETRY STREAMS',
    'INITIALIZING IN-MEMORY DATA STORE',
    'BUILDING CROSS-REFERENCE INDEXES',
    'STARTING REAL-TIME SIMULATION ENGINE',
    'SYSTEM ONLINE // ALL UNITS ACTIVE'
  ]
  for (const msg of messages) {
    if (statusEl) statusEl.textContent = msg
    await _sleep(180)
  }
  await _sleep(250)
  const boot = document.getElementById('boot-screen')
  if (boot) boot.classList.add('fade-out')
  await _sleep(600)
}

function _sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function _initApp() {
  const app = document.getElementById('app')
  if (app) app.classList.add('visible')

  initModal()
  _initHeader()
  _initNav()
  _initAlertDrawer()
  _initAlertListener()
  _initTicker()

  startSimulator()
  navigateTo('overview')

  onSimUpdate('tick', ({ simTime }) => {
    _updateClock(simTime)
  })
}

function _initHeader() {
  _updateRealClock()
  setInterval(_updateRealClock, 1000)

  let isPaused = false
  const ppBtn = document.getElementById('sim-playpause')
  document.getElementById('sim-faster')?.addEventListener('click', () => {
    increaseSpeed()
    document.getElementById('sim-speed-label').textContent = getSpeed() + '×'
  })
  document.getElementById('sim-slower')?.addEventListener('click', () => {
    decreaseSpeed()
    document.getElementById('sim-speed-label').textContent = getSpeed() + '×'
  })
  ppBtn?.addEventListener('click', () => {
    isPaused = !isPaused
    if (isPaused) { pauseSimulator(); ppBtn.textContent = '▶'; ppBtn.classList.remove('active') }
    else { resumeSimulator(); ppBtn.textContent = '⏸'; ppBtn.classList.add('active') }
  })

  document.getElementById('alerts-btn')?.addEventListener('click', () => {
    document.getElementById('alert-drawer')?.classList.toggle('open')
  })
}

function _updateRealClock() {
  const now = new Date()
  const timeEl = document.getElementById('clock-time')
  const dateEl = document.getElementById('clock-date')
  if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  if (dateEl) dateEl.textContent = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function _updateClock(simTime) {
  const el = document.getElementById('sim-time-display')
}

function _initNav() {
  document.querySelectorAll('.nav-tab[data-view]').forEach(item => {
    item.addEventListener('click', () => {
      navigateTo(item.dataset.view)
    })
  })
}

export function navigateTo(viewId) {
  document.querySelectorAll('.nav-tab').forEach(n => n.classList.remove('active'))
  document.querySelector(`.nav-tab[data-view="${viewId}"]`)?.classList.add('active')

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'))

  if (_currentView && VIEWS[_currentView]) {
    try { VIEWS[_currentView].destroy() } catch {}
  }
  _currentView = viewId

  const viewEl = document.getElementById(`view-${viewId}`)
  if (!viewEl) return
  viewEl.innerHTML = ''
  viewEl.classList.add('active')

  if (VIEWS[viewId]) {
    try { VIEWS[viewId].render(viewEl) } catch (e) { console.error(`Error rendering view [${viewId}]:`, e) }
  }

  document.getElementById('main')?.scrollTo(0, 0)
}

function _initAlertDrawer() {
  document.getElementById('alert-close')?.addEventListener('click', () => {
    document.getElementById('alert-drawer')?.classList.remove('open')
  })
}

function _initAlertListener() {
  onAlert(alert => {
    _renderAlertItem(alert)
    _updateAlertBadge()
    _updateNavBadges()
    _updateAlertRail()
  })
}

function _renderAlertItem(alert) {
  const list = document.getElementById('alert-list')
  if (!list) return
  const item = document.createElement('div')
  item.className = `alert-item ${alert.type || 'info'}`
  item.id = `alert-${alert.id}`
  item.innerHTML = `
    <div class="alert-title">${alert.title}</div>
    <div class="alert-msg">${alert.msg}</div>
    <div class="alert-time">${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
    <button class="alert-dismiss" onclick="window._dismissAlert('${alert.id}')">✕</button>
  `
  list.insertBefore(item, list.firstChild)
  while (list.children.length > 25) list.removeChild(list.lastChild)
}

window._dismissAlert = function(id) {
  dismissAlert(id)
  const el = document.getElementById(`alert-${id}`)
  if (el) el.remove()
  _updateAlertBadge()
}

function _updateAlertBadge() {
  const count = alertStore.length
  const badge = document.getElementById('alerts-count')
  if (badge) {
    badge.textContent = Math.min(count, 99)
    if (count > 0) badge.classList.add('show')
    else badge.classList.remove('show')
  }
}

function _updateNavBadges() {
  const criticalFlights = alertStore.filter(a => a.type === 'critical' && a.flightId).length
  const secAlerts = alertStore.filter(a => a.title?.includes('Security')).length
  const maintAlerts = alertStore.filter(a => a.title?.includes('Maintenance')).length

  const fb = document.getElementById('nav-badge-flights')
  if (fb) { fb.textContent = criticalFlights; fb.classList.toggle('show', criticalFlights > 0) }
  const sb = document.getElementById('nav-badge-security')
  if (sb) { sb.textContent = secAlerts; sb.classList.toggle('show', secAlerts > 0) }
  const mb = document.getElementById('nav-badge-maint')
  if (mb) { mb.textContent = maintAlerts; mb.classList.toggle('show', maintAlerts > 0) }
}

function _initTicker() {
  const items = [
    { type: 'info',     text: 'DEL OCC SYSTEM ONLINE // TELEMETRY LINKED' },
    { type: 'ok',       text: 'TERMINAL 3 OPERATIONAL // 50 ACTIVE GATES' },
    { type: 'info',     text: `${store.flights.length} FLIGHTS MONITORED // REAL-TIME SIM ACTIVE` },
    { type: 'warning',  text: `${store.flights.filter(f=>f.delay_mins>0).length} FLIGHTS DELAYED // MONITORING AIRSPACE` },
    { type: 'ok',       text: `${store.passengers.length} PASSENGERS PROCESSED IN CURRENT WINDOW` },
    { type: 'info',     text: 'SECURITY CHECKPOINTS: 8 LANES ACTIVE' },
    { type: 'ok',       text: `${store.baggage.length} BAGGAGE TAGS TRACKED ACROSS 10 CAROUSELS` },
    { type: 'warning',  text: `${store.maintenance_logs.filter(m=>!m.resolved).length} OPEN MAINTENANCE WORK ORDERS` },
  ]

  const ticker = document.getElementById('ticker-inner')
  if (!ticker) return
  // Duplicate for seamless loop
  const allItems = [...items, ...items]
  ticker.innerHTML = allItems.map(item => `
    <span class="ticker-item ${item.type}">
      <span class="ticker-dot"></span>
      ${item.text}
    </span>
  `).join('')

  onAlert(alert => {
    const span = document.createElement('span')
    span.className = `ticker-item ${alert.type === 'critical' ? 'critical' : alert.type === 'vip' ? 'warning' : 'info'}`
    span.innerHTML = `<span class="ticker-dot"></span>${alert.title} · ${alert.msg.slice(0, 80)}`
    ticker.appendChild(span.cloneNode(true))
    ticker.insertBefore(span, ticker.firstChild)
    if (ticker.children.length > 40) ticker.removeChild(ticker.lastChild)
  })
}

function _updateAlertRail() {
  const count = alertStore.length
  const hasCritical = alertStore.some(a => a.type === 'critical')

  // Badge
  const badge = document.getElementById('alert-rail-badge')
  const dot = document.getElementById('alert-rail-dot')
  const text = document.getElementById('alert-rail-text')
  const countEl = document.getElementById('alert-rail-count')

  if (badge) badge.classList.toggle('has-critical', hasCritical)
  if (dot) dot.classList.toggle('pulsing', hasCritical)

  if (count > 0) {
    if (text) text.textContent = hasCritical ? 'CRITICAL ALERTS' : `${count} ACTIVE ALERT${count>1?'S':''}`
    if (countEl) { countEl.textContent = Math.min(count, 99); countEl.style.display = ''; countEl.classList.toggle('critical', hasCritical) }
  } else {
    if (text) text.textContent = 'SYSTEM NOMINAL'
    if (countEl) countEl.style.display = 'none'
  }

  // Logo icon pulse
  const logoIcon = document.getElementById('logo-icon')
  if (logoIcon) logoIcon.classList.toggle('has-alerts', hasCritical)
}

boot().catch(console.error)
