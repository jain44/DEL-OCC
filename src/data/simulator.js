// ═══════════════════════════════════════════════════════════════
// SIMULATOR — Real-time simulation engine
// 60× simulated clock, flight status machine, event generator
// ═══════════════════════════════════════════════════════════════
import { store } from './store.js'
import { emitAlert } from '../utils/alerts.js'

const SIM_SPEEDS = [10, 30, 60, 120, 300]
let speedIdx = 2 // default 60×

export const sim = {
  running: true,
  speedMultiplier: 60,
  simTime: new Date('2024-11-01T06:00:00'),
  lastTick: Date.now(),
  listeners: {},
  _retailIdx: 0,
  _tickCount: 0,
}

export function startSimulator() {
  _tick()
}

export function pauseSimulator() { sim.running = false }
export function resumeSimulator() { sim.running = true; _tick() }

export function increaseSpeed() {
  speedIdx = Math.min(speedIdx + 1, SIM_SPEEDS.length - 1)
  sim.speedMultiplier = SIM_SPEEDS[speedIdx]
}
export function decreaseSpeed() {
  speedIdx = Math.max(speedIdx - 1, 0)
  sim.speedMultiplier = SIM_SPEEDS[speedIdx]
}
export function getSpeed() { return SIM_SPEEDS[speedIdx] }

export function onSimUpdate(event, cb) {
  if (!sim.listeners[event]) sim.listeners[event] = []
  sim.listeners[event].push(cb)
}
export function offSimUpdate(event, cb) {
  if (sim.listeners[event]) {
    sim.listeners[event] = sim.listeners[event].filter(f => f !== cb)
  }
}

function _emit(event, data) {
  ;(sim.listeners[event] || []).forEach(cb => cb(data))
}

// ── Main tick (runs every real second) ──────────────────────
function _tick() {
  if (!sim.running) return
  const now = Date.now()
  const realElapsed = (now - sim.lastTick) / 1000 // seconds
  sim.lastTick = now

  // Advance simulated time
  sim.simTime = new Date(sim.simTime.getTime() + realElapsed * sim.speedMultiplier * 1000)

  // Update flight statuses
  _updateFlightStatuses()

  sim._tickCount++

  // Security queue update every 15 ticks (~15s)
  if (sim._tickCount % 15 === 0) {
    _updateSecurityQueues()
    _emit('security', null)
  }

  // Retail tick every 5 ticks
  if (sim._tickCount % 5 === 0) {
    _emitRetailTransaction()
  }

  // Baggage tick every 30 ticks
  if (sim._tickCount % 30 === 0) {
    _updateBaggage()
    _emit('baggage', null)
  }

  // Overview KPI every 10 ticks
  if (sim._tickCount % 10 === 0) {
    _emit('overview', null)
  }

  // Random alert event every 8–35 ticks
  if (sim._tickCount % (8 + Math.floor(Math.random() * 27)) === 0) {
    _generateRandomEvent()
  }

  _emit('tick', { simTime: sim.simTime, tick: sim._tickCount })

  setTimeout(_tick, 1000)
}

// ── Flight status machine ─────────────────────────────────────
const STATUS_PROGRESSION = [
  { label: 'Scheduled',      mins: -120, color: 'grey' },
  { label: 'Check-In Open',  mins: -90,  color: 'blue' },
  { label: 'Boarding',       mins: -40,  color: 'amber' },
  { label: 'Gate Closing',   mins: -10,  color: 'red' },
  { label: 'Departed',       mins: 0,    color: 'green' },
  { label: 'Arrived',        mins: 90,   color: 'green' },
]

function _updateFlightStatuses() {
  const now = sim.simTime
  let changed = false

  store.flights.forEach(f => {
    if (!f.sched_dep) return
    const depTime = new Date(f.sched_dep)
    const deltaMin = (now - depTime) / 60000

    let newStatus = 'Scheduled'
    let newColor = 'grey'

    for (const stage of STATUS_PROGRESSION) {
      if (deltaMin >= stage.mins) {
        newStatus = stage.label
        newColor = stage.color
      }
    }

    // Override with delay if applicable
    if (f.delay_mins > 0 && newStatus !== 'Departed' && newStatus !== 'Arrived') {
      if (deltaMin > -15 && deltaMin < 0) {
        newStatus = 'Delayed'
        newColor = 'red'
      }
    }

    if (f._simStatus !== newStatus) {
      f._simStatus = newStatus
      f._simColor = newColor
      changed = true
    }
  })

  if (changed) _emit('flights', null)
}

// ── Security queue updates ─────────────────────────────────────
function _updateSecurityQueues() {
  store.security_screening.forEach(s => {
    const delta = Math.floor((Math.random() - 0.5) * 30)
    s.queue_length = Math.max(5, Math.min(200, (s.queue_length || 50) + delta))
    s.throughput_per_hr = Math.max(150, Math.min(500,
      (s.throughput_per_hr || 300) + Math.floor((Math.random() - 0.5) * 40)
    ))
  })
}

// ── Retail transaction emitter ─────────────────────────────────
function _emitRetailTransaction() {
  const txns = store.retail_transactions
  if (!txns.length) return
  const txn = txns[sim._retailIdx % txns.length]
  sim._retailIdx++
  _emit('retail_txn', txn)
}

// ── Baggage status cycling ─────────────────────────────────────
function _updateBaggage() {
  const sample = store.baggage.slice(0, 50)
  sample.forEach(b => {
    const r = Math.random()
    if (r < 0.7)      b.status = 'Loaded'
    else if (r < 0.83) b.status = 'In Transit'
    else if (r < 0.92) b.status = 'On Belt'
    else if (r < 0.97) b.status = 'Delayed'
    else               b.status = 'Mishandled'
    b.mishandled = b.status === 'Mishandled'
  })
}

// ── Random event generator ─────────────────────────────────────
const EVENT_TYPES = [
  _atcHold, _crewDelay, _securityFlag, _maintAlert,
  _vipBoarding, _gateChange, _flightDiverted, _weatherAlert
]

function _generateRandomEvent() {
  const fn = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)]
  fn()
}

function _randomFlight() {
  return store.flights[Math.floor(Math.random() * Math.min(store.flights.length, 200))]
}
function _randomPassenger() {
  return store.passengers[Math.floor(Math.random() * Math.min(store.passengers.length, 500))]
}
function _randomMaint() {
  return store.maintenance_logs[Math.floor(Math.random() * store.maintenance_logs.length)]
}

function _atcHold() {
  const f = _randomFlight()
  if (!f) return
  emitAlert({
    id: `atc-${Date.now()}`,
    type: 'critical',
    icon: '🔴',
    title: `ATC Hold — ${f.flight_id}`,
    msg: `${f.airline} flight to ${f.destination} held by ATC. +${30 + Math.floor(Math.random()*60)}min delay expected.`,
    flightId: f.flight_id
  })
}
function _crewDelay() {
  const f = _randomFlight()
  if (!f) return
  emitAlert({
    id: `crew-${Date.now()}`,
    type: 'warning',
    icon: '🟡',
    title: `Crew Delay — ${f.flight_id}`,
    msg: `${f.airline} crew not reported for ${f.flight_id} to ${f.destination}. Gate: ${f.gate}`,
    flightId: f.flight_id
  })
}
function _securityFlag() {
  const lane = Math.floor(Math.random() * 8) + 1
  const pnr = store.security_screening[Math.floor(Math.random() * store.security_screening.length)]?.pnr_code || 'PP-****0000'
  emitAlert({
    id: `sec-${Date.now()}`,
    type: 'critical',
    icon: '🔐',
    title: `Security Alert — Lane ${lane}`,
    msg: `Passenger ${pnr} flagged for secondary screening at Lane ${lane}. XRAY-${lane} requires attention.`,
    lane
  })
}
function _maintAlert() {
  const m = _randomMaint()
  if (!m || m.resolved) return
  emitAlert({
    id: `maint-${Date.now()}`,
    type: 'warning',
    icon: '🔧',
    title: `Maintenance — ${m.tail_number}`,
    msg: `Work order ${m.work_order}: ${m.defect_type} on ${m.tail_number}. Severity ${m.severity}. Status: ${m._simStatus}`,
    workOrder: m.work_order
  })
}
function _vipBoarding() {
  const vips = store.passengers.filter(p => p.is_vip)
  if (!vips.length) return
  const p = vips[Math.floor(Math.random() * vips.length)]
  emitAlert({
    id: `vip-${Date.now()}`,
    type: 'vip',
    icon: '⭐',
    title: `VIP Boarding — ${p.first_name} ${p.last_name}`,
    msg: `VIP passenger (${p.booking_class}) boarding ${p.flight_id} at Gate ${p.gate}. Arrange escort.`,
    pnr: p.pnr_code
  })
}
function _gateChange() {
  const f = _randomFlight()
  if (!f) return
  const gates = ['B1','B2','B3','B4','B5','B6','B7','B8','B9','B10','B11','B12']
  const newGate = gates[Math.floor(Math.random() * gates.length)]
  emitAlert({
    id: `gate-${Date.now()}`,
    type: 'warning',
    icon: '🚪',
    title: `Gate Change — ${f.flight_id}`,
    msg: `${f.airline} ${f.flight_id} to ${f.destination} moved to Gate ${newGate}. PA announcement required.`,
    flightId: f.flight_id
  })
  f.gate = newGate
}
function _flightDiverted() {
  const f = _randomFlight()
  if (!f) return
  emitAlert({
    id: `divert-${Date.now()}`,
    type: 'critical',
    icon: '↩️',
    title: `Diversion Alert — ${f.flight_id}`,
    msg: `${f.airline} ${f.flight_id} (${f.aircraft_type}) reporting turbulence. Monitoring situation.`,
    flightId: f.flight_id
  })
}
function _weatherAlert() {
  const conditions = ['Heavy fog', 'Thunderstorm', 'Strong crosswinds', 'Low visibility', 'Hail warning']
  const c = conditions[Math.floor(Math.random() * conditions.length)]
  emitAlert({
    id: `wx-${Date.now()}`,
    type: 'warning',
    icon: '⛈️',
    title: `Weather Advisory`,
    msg: `${c} reported in DEL airspace. ${1 + Math.floor(Math.random()*5)} flights may be affected. Monitoring.`
  })
}
