// ═══════════════════════════════════════════════════════════════
// FLIGHTS VIEW — Airline Gantt Timeline + FIDS Monitor
// Redesigned: Active Airline Gantt Block Top Visual + Drilldown Table
// ═══════════════════════════════════════════════════════════════
import { store } from '../data/store.js'
import { onSimUpdate, offSimUpdate } from '../data/simulator.js'
import { fmtTime, fmtDelay, statusBadgeClass, airlineColor, animateCount, fmtNumber, fmtPct } from '../utils/format.js'
import { getFlightPassengers, getFlightBaggage, getFlightGateEvents, getFlightMaintenance, getFlightRetail } from '../data/store.js'
import { openModal } from './modal.js'

let _filtered = []
let _sortCol = 'sched_dep'
let _sortDir = 1
let _page = 0
const PAGE_SIZE = 50
let _searchVal = ''
let _filterStatus = 'all'
let _filterType = 'all'
let _filterAirline = 'all'
let _updateHandler = null

export function renderFlights(container) {
  const airlines = [...new Set(store.flights.map(f => f.airline))].sort()

  container.innerHTML = `
    <!-- HEADER -->
    <div class="view-hd">
      <div class="view-hd-left">
        <div class="view-hd-icon">✈</div>
        <div>
          <h1>FLIGHT TIMELINE &amp; FIDS MONITOR</h1>
          <div class="view-hd-sub">DEL DEPARTURES · ${store.flights.length} MONITORED FLIGHTS</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        LIVE RADAR FEED
      </div>
    </div>

    <!-- KPI STRIP -->
    <div class="kpi-row mb2">
      <div class="kpi-tile" style="--accent:var(--neon)">
        <div class="kpi-label">TOTAL FLIGHTS</div>
        <div class="kpi-value" data-accent="neon" id="fl-kpi-total">${store.flights.length}</div>
        <div class="kpi-sub">Today's schedule</div>
      </div>
      <div class="kpi-tile" style="--accent:var(--amber)">
        <div class="kpi-label">BOARDING NOW</div>
        <div class="kpi-value" data-accent="amber" id="fl-kpi-boarding">0</div>
        <div class="kpi-sub">Active gate calls</div>
      </div>
      <div class="kpi-tile" style="--accent:var(--red)">
        <div class="kpi-label">DELAYED FLIGHTS</div>
        <div class="kpi-value" data-accent="red" id="fl-kpi-delayed">${store.flights.filter(f=>f.delay_mins>0).length}</div>
        <div class="kpi-sub">+15m delay threshold</div>
      </div>
      <div class="kpi-tile" style="--accent:var(--acid)">
        <div class="kpi-label">DEPARTED</div>
        <div class="kpi-value" data-accent="acid" id="fl-kpi-departed">0</div>
        <div class="kpi-sub">En-route to destination</div>
      </div>
    </div>

    <!-- AIRLINE GANTT TIMELINE visual hero anchor -->
    <div class="panel mb16">
      <div class="panel-hd">
        <div class="panel-hd-label">
          <div class="dot-live"></div>
          📅 AIRLINE DEPARTURE TIMELINE GANTT (NEXT 8 HOURS)
        </div>
        <span class="mono text-muted" style="font-size:0.75rem">Y = AIRLINE · X = TIME · HOVER/CLICK FOR DETAILS</span>
      </div>
      <div class="panel-bd">
        <div id="fl-gantt-container"></div>
      </div>
    </div>

    <!-- CONTROL BAR -->
    <div class="ctrl-bar">
      <div class="search-box">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input id="fl-search" placeholder="SEARCH FLIGHT, DESTINATION, AIRLINE..." />
      </div>

      <div class="filter-group" id="fl-status-chips">
        <button class="filter-btn active" data-val="all">ALL</button>
        <button class="filter-btn" data-val="Scheduled">SCHEDULED</button>
        <button class="filter-btn" data-val="Check-In Open">CHECK-IN</button>
        <button class="filter-btn" data-val="Boarding">BOARDING</button>
        <button class="filter-btn" data-val="Departed">DEPARTED</button>
        <button class="filter-btn" data-val="Delayed">DELAYED</button>
      </div>

      <div class="filter-group">
        <button class="filter-btn active" id="fl-type-all" data-type="all">ALL TYPES</button>
        <button class="filter-btn" id="fl-type-intl" data-type="intl">INTL</button>
        <button class="filter-btn" id="fl-type-dom"  data-type="dom">DOMESTIC</button>
      </div>

      <select class="filter-select" id="fl-airline-filter">
        <option value="all">ALL AIRLINES</option>
        ${airlines.map(a => `<option value="${a}">${a}</option>`).join('')}
      </select>
    </div>

    <!-- TABLE PANEL -->
    <div class="panel">
      <div class="panel-bd nopad">
        <div class="tbl-wrap">
          <table class="tbl" id="fl-table">
            <thead>
              <tr>
                <th data-col="flight_id">FLIGHT</th>
                <th data-col="airline">AIRLINE</th>
                <th data-col="destination">DESTINATION</th>
                <th data-col="sched_dep">SCHED DEP</th>
                <th data-col="actual_dep">ACTUAL DEP</th>
                <th data-col="_simStatus">STATUS</th>
                <th data-col="gate">GATE</th>
                <th data-col="delay_mins">DELAY</th>
                <th data-col="aircraft_type">AIRCRAFT</th>
                <th data-col="flight_type">TYPE</th>
                <th data-col="load_factor">LOAD</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody id="fl-tbody"></tbody>
          </table>
        </div>

        <div class="tbl-foot">
          <span class="page-info" id="fl-page-info"></span>
          <div class="pagination" id="fl-pagination"></div>
        </div>
      </div>
    </div>
  `

  _bindEvents(container)
  _applyFilters()
  _renderGantt()
  _renderTable()

  _updateHandler = () => {
    _updateKpis()
    _renderGantt()
    _renderTable()
  }
  onSimUpdate('flights', _updateHandler)
}

export function destroyFlights() {
  if (_updateHandler) offSimUpdate('flights', _updateHandler)
}

function _renderGantt() {
  const container = document.getElementById('fl-gantt-container')
  if (!container) return

  // Show top airlines
  const airlines = [...new Set(store.flights.map(f => f.airline))].sort().slice(0, 10)
  
  // Calculate 8-hour window starting from earliest active flight or 06:00
  const nowHour = 6 // Standard reference window start hour
  const hours = Array.from({ length: 8 }, (_, i) => (nowHour + i) % 24)
  const windowStartSecs = nowHour * 3600
  const windowDurationSecs = 8 * 3600

  let html = `
    <div class="gantt-wrap">
      <div class="gantt-inner">
        <div class="gantt-header">
          ${hours.map(h => `
            <div class="gantt-hour-label">${String(h).padStart(2,'0')}:00</div>
          `).join('')}
        </div>
  `

  airlines.forEach(airline => {
    const flightsForAirline = store.flights.filter(f => f.airline === airline)
    html += `
      <div class="gantt-row">
        <div class="gantt-airline-label">${airline}</div>
        <div class="gantt-track" style="--gantt-hours: 8">
    `

    flightsForAirline.forEach(f => {
      // Parse time string e.g. "07:45"
      if (!f.sched_dep) return
      const [h, m] = f.sched_dep.split(':').map(Number)
      const depSecs = h * 3600 + m * 60
      const relSecs = depSecs - windowStartSecs

      if (relSecs >= 0 && relSecs < windowDurationSecs) {
        const leftPct = (relSecs / windowDurationSecs) * 100
        const widthPct = Math.max(3, (45 * 60 / windowDurationSecs) * 100) // 45m block width
        
        const s = f._simStatus || 'Scheduled'
        const statusClass = s === 'Boarding' ? 'boarding' :
                            s === 'Departed' ? 'departed' :
                            f.delay_mins > 0 ? 'delayed' :
                            s === 'Check-In Open' ? 'checkin' : 'scheduled'

        html += `
          <div class="gantt-block ${statusClass}"
               style="left: ${leftPct.toFixed(1)}%; width: ${widthPct.toFixed(1)}%"
               title="${f.flight_id} → ${f.destination} (${f.sched_dep}) Gate ${f.gate || '--'} [${s}]"
               onclick="window._openFlightModal('${f.flight_id}')">
            ${f.flight_id} (${f.gate || '--'})
          </div>
        `
      }
    })

    html += `
        </div>
      </div>
    `
  })

  html += `
      </div>
    </div>
  `

  container.innerHTML = html
}

function _bindEvents(container) {
  container.querySelector('#fl-search')?.addEventListener('input', e => {
    _searchVal = e.target.value.toLowerCase()
    _page = 0
    _applyFilters()
    _renderTable()
  })

  container.querySelector('#fl-status-chips')?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn')
    if (!btn) return
    container.querySelectorAll('#fl-status-chips .filter-btn').forEach(c => c.classList.remove('active'))
    btn.classList.add('active')
    _filterStatus = btn.dataset.val
    _page = 0
    _applyFilters()
    _renderTable()
  })

  container.querySelectorAll('[data-type]').forEach(chip => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('[data-type]').forEach(c => c.classList.remove('active'))
      chip.classList.add('active')
      _filterType = chip.dataset.type
      _page = 0
      _applyFilters()
      _renderTable()
    })
  })

  container.querySelector('#fl-airline-filter')?.addEventListener('change', e => {
    _filterAirline = e.target.value
    _page = 0
    _applyFilters()
    _renderTable()
  })

  container.querySelector('#fl-table thead')?.addEventListener('click', e => {
    const th = e.target.closest('th[data-col]')
    if (!th) return
    const col = th.dataset.col
    if (_sortCol === col) _sortDir *= -1
    else { _sortCol = col; _sortDir = 1 }
    container.querySelectorAll('#fl-table thead th').forEach(t => t.classList.remove('sort-asc','sort-desc'))
    th.classList.add(_sortDir === 1 ? 'sort-asc' : 'sort-desc')
    _applyFilters()
    _renderTable()
  })
}

function _applyFilters() {
  let f = store.flights

  if (_searchVal) {
    f = f.filter(fl =>
      fl.flight_id?.toLowerCase().includes(_searchVal) ||
      fl.destination?.toLowerCase().includes(_searchVal) ||
      fl.airline?.toLowerCase().includes(_searchVal) ||
      fl.gate?.toLowerCase().includes(_searchVal)
    )
  }
  if (_filterStatus !== 'all') {
    f = f.filter(fl => fl._simStatus === _filterStatus)
  }
  if (_filterType === 'intl') f = f.filter(fl => fl.is_international)
  if (_filterType === 'dom')  f = f.filter(fl => !fl.is_international)
  if (_filterAirline !== 'all') f = f.filter(fl => fl.airline === _filterAirline)

  f = [...f].sort((a, b) => {
    let av = a[_sortCol] ?? '', bv = b[_sortCol] ?? ''
    if (!isNaN(parseFloat(av)) && !isNaN(parseFloat(bv))) {
      av = parseFloat(av); bv = parseFloat(bv)
    }
    if (av < bv) return -_sortDir
    if (av > bv) return _sortDir
    return 0
  })

  _filtered = f
}

function _renderTable() {
  _updateKpis()
  const tbody = document.getElementById('fl-tbody')
  if (!tbody) return

  const start = _page * PAGE_SIZE
  const rows = _filtered.slice(start, start + PAGE_SIZE)

  tbody.innerHTML = rows.map(f => {
    const delay = fmtDelay(f.delay_mins)
    const cls = statusBadgeClass(f._simStatus || 'Scheduled')
    const loadPct = parseFloat(f.load_factor) || 70
    const loadColor = loadPct >= 90 ? 'var(--acid)' : loadPct >= 70 ? 'var(--amber)' : 'var(--red)'
    return `
      <tr data-flight="${f.flight_id}">
        <td class="mono bright neon">${f.flight_id}</td>
        <td>
          <div class="flex items-center gap8">
            <div style="width:6px;height:6px;border-radius:50%;background:${airlineColor(f.airline)};flex-shrink:0"></div>
            <span>${f.airline}</span>
          </div>
        </td>
        <td class="mono bright">${f.destination}</td>
        <td class="mono">${fmtTime(f.sched_dep)}</td>
        <td class="mono">${fmtTime(f.actual_dep || f.sched_dep)}</td>
        <td><span class="chip ${cls}">${f._simStatus || 'Scheduled'}</span></td>
        <td class="mono bright">${f.gate || '--'}</td>
        <td>${delay ? `<span class="chip red" style="font-size:0.55rem">${delay} ${f.delay_reason || ''}</span>` : '<span class="text-acid" style="font-size:0.65rem">ON TIME</span>'}</td>
        <td class="mono dim">${f.aircraft_type || '--'}</td>
        <td><span class="chip ${f.is_international ? 'neon' : 'grey'}" style="font-size:0.55rem">${f.flight_type || (f.is_international ? 'INTL' : 'DOM')}</span></td>
        <td>
          <div class="flex items-center gap8">
            <div class="pbar-wrap" style="width:40px">
              <div class="pbar-fill" style="width:${loadPct}%; background:${loadColor}"></div>
            </div>
            <span class="mono" style="font-size:0.62rem; color:${loadColor}">${loadPct.toFixed(0)}%</span>
          </div>
        </td>
        <td>
          <button class="btn-ghost" style="padding:2px 6px; font-size:0.58rem" onclick="window._openFlightModal('${f.flight_id}')">
            TELEMETRY →
          </button>
        </td>
      </tr>
    `
  }).join('')

  tbody.querySelectorAll('tr[data-flight]').forEach(tr => {
    tr.addEventListener('click', e => {
      if (e.target.closest('button')) return
      openFlightModal(tr.dataset.flight)
    })
  })

  const pageInfo = document.getElementById('fl-page-info')
  const pagination = document.getElementById('fl-pagination')
  if (pageInfo) pageInfo.textContent = `DISPLAYING ${start+1}–${Math.min(start+PAGE_SIZE, _filtered.length)} OF ${_filtered.length} FLIGHTS`
  if (pagination) {
    const totalPages = Math.ceil(_filtered.length / PAGE_SIZE)
    pagination.innerHTML = Array.from({ length: Math.min(totalPages, 8) }, (_, i) => `
      <button class="pg-btn ${i === _page ? 'active' : ''}" data-p="${i}">${i+1}</button>
    `).join('')
    pagination.querySelectorAll('.pg-btn').forEach(btn => {
      btn.addEventListener('click', () => { _page = parseInt(btn.dataset.p); _renderTable() })
    })
  }
}

function _updateKpis() {
  const boarding = store.flights.filter(f => f._simStatus === 'Boarding').length
  const departed = store.flights.filter(f => f._simStatus === 'Departed').length
  animateCount(document.getElementById('fl-kpi-boarding'), boarding)
  animateCount(document.getElementById('fl-kpi-departed'), departed)
}

export function openFlightModal(flightId) {
  const f = store._idx.flightById[flightId]
  if (!f) return
  const pax = getFlightPassengers(flightId)
  const bags = getFlightBaggage(flightId)
  const events = getFlightGateEvents(flightId)
  const maint = getFlightMaintenance(flightId)
  const retail = getFlightRetail(flightId)

  const cls = statusBadgeClass(f._simStatus || 'Scheduled')
  const delay = fmtDelay(f.delay_mins)
  const vips = pax.filter(p => p.is_vip)
  const economy = pax.filter(p => p.booking_class === 'Economy').length
  const business = pax.filter(p => p.booking_class === 'Business').length

  const body = `
    <!-- Route Arc -->
    <div class="route-display">
      <div>
        <div class="route-iata text-neon">DEL</div>
        <div class="route-city">DELHI T3</div>
      </div>
      <div class="route-line">
        <div class="route-dash"></div>
        <div class="route-plane text-neon">✈</div>
        <div class="route-dash"></div>
      </div>
      <div style="text-align:right">
        <div class="route-iata text-acid">${f.destination}</div>
        <div class="route-city">${f.destination}</div>
      </div>
    </div>

    <!-- Flight Info Matrix -->
    <div class="modal-sect">
      <div class="modal-sect-title">TELEMETRY DATA</div>
      <div class="info-grid">
        <div class="info-item"><div class="l">Status</div><div><span class="chip ${cls}">${f._simStatus || 'Scheduled'}</span></div></div>
        <div class="info-item"><div class="l">Gate</div><div class="v mono">${f.gate || '--'}</div></div>
        <div class="info-item"><div class="l">Sched Dep</div><div class="v mono">${fmtTime(f.sched_dep)}</div></div>
        <div class="info-item"><div class="l">Actual Dep</div><div class="v mono">${fmtTime(f.actual_dep || f.sched_dep)}</div></div>
        <div class="info-item"><div class="l">Delay</div><div>${delay ? `<span class="chip red">${delay} — ${f.delay_reason}</span>` : '<span class="chip acid">ON TIME</span>'}</div></div>
        <div class="info-item"><div class="l">Aircraft</div><div class="v mono">${f.aircraft_type} (${f.tail_number})</div></div>
        <div class="info-item"><div class="l">Distance</div><div class="v mono">${fmtNumber(f.distance_km)} km</div></div>
        <div class="info-item"><div class="l">Fuel Load</div><div class="v mono">${fmtNumber(f.fuel_kg)} kg</div></div>
        <div class="info-item"><div class="l">Load Factor</div><div class="v mono">${fmtPct(f.load_factor)}</div></div>
      </div>
    </div>

    <!-- Passengers -->
    <div class="modal-sect">
      <div class="modal-sect-title">PASSENGER METRICS (${pax.length} MANIFEST)</div>
      <div class="stat-strip">
        <div class="stat-pill"><span class="sv">${pax.length}</span><span class="sl">/ ${f.capacity} CAP</span></div>
        <div class="stat-pill"><span class="sv text-neon">${economy}</span><span class="sl">ECONOMY</span></div>
        <div class="stat-pill"><span class="sv text-purple">${business}</span><span class="sl">BUSINESS</span></div>
        <div class="stat-pill"><span class="sv text-amber">${vips.length}</span><span class="sl">VIP</span></div>
      </div>
    </div>

    <!-- Gate Events -->
    ${events.length ? `
    <div class="modal-sect">
      <div class="modal-sect-title">GATE TIMELINE LOG</div>
      <div class="timeline">
        ${events.slice(0, 5).map(e => `
          <div class="tl-item">
            <div class="tl-line">
              <div class="tl-dot"></div>
              <div class="tl-connector"></div>
            </div>
            <div class="tl-body">
              <div class="tl-t">${e.event_type} — Gate ${e.gate}</div>
              <div class="tl-s">${fmtTime(e.event_time)} · Priority: ${e.priority} · Staff ID: ${e.staff_id}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>` : ''}
  `

  openModal(
    `${f.flight_id} // ${f.airline}`,
    `ORIGIN: ${f.origin} → DEST: ${f.destination} · TAIL: ${f.tail_number}`,
    body
  )
}

window._openFlightModal = openFlightModal
