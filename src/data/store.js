// ═══════════════════════════════════════════════════════════════
// DATA STORE — normalized in-memory store + cross-reference maps
// ═══════════════════════════════════════════════════════════════
import { mapTable } from './loader.js'

export const store = {
  flights: [],
  passengers: [],
  baggage: [],
  gate_events: [],
  security_screening: [],
  maintenance_logs: [],
  staff_shifts: [],
  retail_transactions: [],

  // Index maps for O(1) lookups
  _idx: {
    flightById: {},          // flight_id → flight
    passByPnr: {},           // pnr_code → passenger
    passByFlight: {},        // flight_id → [passengers]
    baggageByFlight: {},     // flight_id → [bags]
    baggageByPnr: {},        // pnr_code → [bags]
    gateEventsByFlight: {},  // flight_id → [events]
    gateEventsByGate: {},    // gate → [events]
    screeningByPnr: {},      // pnr_code → screening
    maintenanceByFlight: {}, // flight_id → [logs]
    maintenanceByTail: {},   // tail_number → [logs]
    retailByFlight: {},      // flight_id → [txns]
    retailByPnr: {},         // pnr_code → [txns]
    staffByGate: {},         // gate → [staff]
  }
}

export function initStore(raw) {
  // Map all tables
  store.flights             = mapTable('flights',             raw.flights)
  store.passengers          = mapTable('passengers',          raw.passengers)
  store.baggage             = mapTable('baggage',             raw.baggage)
  store.gate_events         = mapTable('gate_events',         raw.gate_events)
  store.security_screening  = mapTable('security_screening',  raw.security_screening)
  store.maintenance_logs    = mapTable('maintenance_logs',    raw.maintenance_logs)
  store.staff_shifts        = mapTable('staff_shifts',        raw.staff_shifts)
  store.retail_transactions = mapTable('retail_transactions', raw.retail_transactions)

  // Inject simulated variance
  _injectSimulatedVariance()

  // Build indices
  _buildIndices()
}

// ── Inject realistic variance into monotone data ─────────────
function _injectSimulatedVariance() {
  const statuses = ['Scheduled', 'Check-In Open', 'Boarding', 'Gate Closed', 'Departed', 'Arrived', 'Delayed', 'Cancelled']
  const delayReasons = ['ATC', 'CREW', 'TECH', 'WX', 'TURNAROUND', '']
  const bagStatuses = ['Loaded', 'In Transit', 'On Belt', 'Delivered', 'Mishandled', 'Delayed']
  const gateEventTypes = ['Boarding Start', 'Boarding Complete', 'Gate Open', 'Gate Close', 'Aircraft Push', 'Aircraft Dock', 'Fuel Complete']
  const secResults = ['Clear', 'Clear', 'Clear', 'Clear', 'Secondary Check', 'Flagged']
  const maintTypes = ['Inspection', 'Repair', 'Part Replacement', 'Engine Check', 'Software Update', 'Safety Audit']
  const maintDefects = ['Hydraulic leak', 'Sensor fault', 'Tire wear', 'Navigation error', 'Engine vibration', 'Brake issue', 'None']
  const gates = ['B1','B2','B3','B4','B5','B6','B7','B8','B9','B10','B11','B12','B13','B14','B15','B16','B17','B18','B19','B20']
  const staffDepts = ['Security', 'Ground Handling', 'Ops', 'Retail', 'Immigration', 'Customs', 'Maintenance']
  const staffRoles = ['Agent', 'Supervisor', 'Manager', 'Technician', 'Officer', 'Coordinator']
  const retailers = ['Duty Free', 'IndiGo Café', 'Starbucks', 'WHSmith', 'Shoppers Stop', 'Food Court', 'Grab & Go']
  const items = ['Perfume', 'Whisky', 'Chocolate', 'Electronics', 'Snacks', 'Coffee', 'Books', 'Cosmetics', 'Toys', 'Clothing']
  const paymentMethods = ['Card', 'Cash', 'UPI', 'Miles', 'Contactless']

  // Flights — assign gates and varied delay reasons
  store.flights.forEach((f, i) => {
    f.gate = gates[i % gates.length]
    f.delay_mins = parseInt(f.delay_mins) || 0
    f.delay_reason = f.delay_reason || (f.delay_mins > 0 ? delayReasons[i % 5] : '')
    f.capacity = parseInt(f.capacity) || 200
    f.pax_count = parseInt(f.pax_count) || Math.floor(f.capacity * (0.6 + Math.random() * 0.35))
    f.load_factor = parseFloat(f.load_factor) || (f.pax_count / f.capacity * 100).toFixed(1)
    f.bag_count = parseInt(f.bag_count) || Math.floor(f.pax_count * 0.8)
    f.is_international = String(f.is_international) === 'True'
    f.is_holiday = String(f.is_holiday) === 'True'
    f._simStatus = 'Scheduled' // will be set by simulator
    f._simDelay = f.delay_mins
  })

  // Baggage — inject status variety
  store.baggage.forEach((b, i) => {
    const r = Math.random()
    if (r < 0.72)      b.status = 'Loaded'
    else if (r < 0.85) b.status = 'In Transit'
    else if (r < 0.94) b.status = 'On Belt'
    else if (r < 0.98) b.status = 'Delayed'
    else               b.status = 'Mishandled'
    b.mishandled = b.status === 'Mishandled'
    b.weight_kg = parseFloat(b.weight_kg) || 15
    b.carousel = parseInt(b.carousel) || (i % 10 + 1)
  })

  // Gate events — inject event type variety
  store.gate_events.forEach((e, i) => {
    e.event_type = gateEventTypes[i % gateEventTypes.length]
    e.priority = i % 10 === 0 ? 'Urgent' : i % 4 === 0 ? 'Priority' : 'Routine'
    e.delayed = Math.random() < 0.15
    e.gate = gates[i % gates.length]
    e.duration_mins = parseInt(e.duration_mins) || 30
  })

  // Security — inject varied results and queue lengths
  store.security_screening.forEach((s, i) => {
    const r = Math.random()
    s.result = r < 0.88 ? 'Clear' : r < 0.95 ? 'Secondary Check' : 'Flagged'
    s.flagged = s.result === 'Flagged'
    s.secondary_check = s.result === 'Secondary Check' || s.flagged
    s.lane = parseInt(s.lane) || (i % 8 + 1)
    s.queue_length = Math.floor(15 + Math.random() * 85)
    s.wait_secs = parseInt(s.wait_secs) || Math.floor(30 + Math.random() * 120)
    s.throughput_per_hr = parseInt(s.throughput_per_hr) || Math.floor(280 + Math.random() * 160)
  })

  // Maintenance — inject severity & type variety
  store.maintenance_logs.forEach((m, i) => {
    m.work_type = maintTypes[i % maintTypes.length]
    m.defect_type = maintDefects[i % maintDefects.length]
    m.severity = (i % 3) + 1
    m.resolved = Math.random() < 0.35
    m.duration_hrs = parseInt(m.duration_hrs) || Math.floor(1 + Math.random() * 12)
    m._simStatus = m.resolved ? 'Resolved' : i % 3 === 0 ? 'In Progress' : 'Open'
  })

  // Staff — inject dept & role variety
  store.staff_shifts.forEach((s, i) => {
    s.dept = staffDepts[i % staffDepts.length]
    s.role = staffRoles[i % staffRoles.length]
    s.overtime = Math.random() < 0.12
    s.gate = gates[i % gates.length]
    s.hours = parseInt(s.hours) || 8
  })

  // Passengers — variety
  store.passengers.forEach((p, i) => {
    p.is_vip = String(p.is_vip) === 'True' || Math.random() < 0.05
    p.special_assistance = String(p.special_assistance) === 'True' || Math.random() < 0.04
    p.age = parseInt(p.age) || 30
    p.wait_time_hrs = parseFloat(p.wait_time_hrs) || Math.random() * 3
  })

  // Retail — inject item variety
  store.retail_transactions.forEach((t, i) => {
    t.shop_name = retailers[i % retailers.length]
    t.item = items[i % items.length]
    t.payment_method = paymentMethods[i % paymentMethods.length]
    t.total_amount = parseInt(t.total_amount) || Math.floor(500 + Math.random() * 5000)
    t.unit_price = parseInt(t.unit_price) || Math.floor(t.total_amount * (0.8 + Math.random() * 0.5))
    t.quantity = parseInt(t.quantity) || 1
  })
}

// ── Build cross-reference indices ─────────────────────────────
function _buildIndices() {
  const idx = store._idx

  store.flights.forEach(f => {
    idx.flightById[f.flight_id] = f
    idx.passByFlight[f.flight_id] = []
    idx.baggageByFlight[f.flight_id] = []
    idx.gateEventsByFlight[f.flight_id] = []
    idx.maintenanceByFlight[f.flight_id] = []
    idx.retailByFlight[f.flight_id] = []
  })

  store.passengers.forEach(p => {
    idx.passByPnr[p.pnr_code] = p
    if (idx.passByFlight[p.flight_id]) idx.passByFlight[p.flight_id].push(p)
  })

  store.baggage.forEach(b => {
    if (!idx.baggageByPnr[b.pnr_code]) idx.baggageByPnr[b.pnr_code] = []
    idx.baggageByPnr[b.pnr_code].push(b)
    if (idx.baggageByFlight[b.flight_id]) idx.baggageByFlight[b.flight_id].push(b)
  })

  store.gate_events.forEach(e => {
    if (!idx.gateEventsByGate[e.gate]) idx.gateEventsByGate[e.gate] = []
    idx.gateEventsByGate[e.gate].push(e)
    if (idx.gateEventsByFlight[e.flight_id]) idx.gateEventsByFlight[e.flight_id].push(e)
  })

  store.security_screening.forEach(s => {
    idx.screeningByPnr[s.pnr_code] = s
  })

  store.maintenance_logs.forEach(m => {
    if (!idx.maintenanceByTail[m.tail_number]) idx.maintenanceByTail[m.tail_number] = []
    idx.maintenanceByTail[m.tail_number].push(m)
    if (idx.maintenanceByFlight[m.flight_id]) idx.maintenanceByFlight[m.flight_id].push(m)
  })

  store.staff_shifts.forEach(s => {
    if (!idx.staffByGate[s.gate]) idx.staffByGate[s.gate] = []
    idx.staffByGate[s.gate].push(s)
  })

  store.retail_transactions.forEach(t => {
    if (!idx.retailByPnr[t.pnr_code]) idx.retailByPnr[t.pnr_code] = []
    idx.retailByPnr[t.pnr_code].push(t)
    if (idx.retailByFlight[t.flight_id]) idx.retailByFlight[t.flight_id].push(t)
  })
}

// ── Query helpers ─────────────────────────────────────────────
export function getFlightPassengers(flightId) {
  return store._idx.passByFlight[flightId] || []
}
export function getFlightBaggage(flightId) {
  return store._idx.baggageByFlight[flightId] || []
}
export function getFlightGateEvents(flightId) {
  return store._idx.gateEventsByFlight[flightId] || []
}
export function getFlightMaintenance(flightId) {
  return store._idx.maintenanceByFlight[flightId] || []
}
export function getFlightRetail(flightId) {
  return store._idx.retailByFlight[flightId] || []
}
export function getPassengerSecurity(pnrCode) {
  return store._idx.screeningByPnr[pnrCode] || null
}
export function getPassengerBaggage(pnrCode) {
  return store._idx.baggageByPnr[pnrCode] || []
}
export function getGateEvents(gate) {
  return store._idx.gateEventsByGate[gate] || []
}
export function getGateStaff(gate) {
  return store._idx.staffByGate[gate] || []
}
export function getTailMaintenance(tail) {
  return store._idx.maintenanceByTail[tail] || []
}
