// ═══════════════════════════════════════════════════════════════
// GATES VIEW — Visual Terminal 3 Spatial Floor Plan
// Redesigned: SVG Concourse Floor Plan (B1-B25 Pier A, B26-B50 Pier B)
// ═══════════════════════════════════════════════════════════════
import { store } from '../data/store.js'
import { onSimUpdate, offSimUpdate } from '../data/simulator.js'
import { fmtTime, statusBadgeClass } from '../utils/format.js'
import { getGateEvents, getGateStaff } from '../data/store.js'
import { openModal } from './modal.js'

let _updateHandler = null
const PIER_A = Array.from({ length: 25 }, (_, i) => `B${i+1}`)
const PIER_B = Array.from({ length: 25 }, (_, i) => `B${i+26}`)

export function renderGates(container) {
  container.innerHTML = `
    <!-- HEADER -->
    <div class="view-hd">
      <div class="view-hd-left">
        <div class="view-hd-icon">🚪</div>
        <div>
          <h1>TERMINAL 3 GATE SPATIAL MAP</h1>
          <div class="view-hd-sub">50 ACTIVE GATES · PIER A (B1-B25) &amp; PIER B (B26-B50)</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        LIVE GATE TRACKING
      </div>
    </div>

    <!-- STATS -->
    <div class="stat-strip mb16">
      <div class="stat-pill"><span class="sv text-amber" id="g-boarding">0</span><span class="sl">BOARDING NOW</span></div>
      <div class="stat-pill"><span class="sv text-accent" id="g-available">0</span><span class="sl">VACANT / AVAILABLE</span></div>
      <div class="stat-pill"><span class="sv text-muted" id="g-departed">0</span><span class="sl">DEPARTED</span></div>
      <div class="stat-pill"><span class="sv text-red" id="g-conflict">0</span><span class="sl">GATE CONFLICTS</span></div>
    </div>

    <!-- LEGEND -->
    <div class="flex gap16 mb16" style="font-size:0.75rem; font-family:var(--font-mono)">
      <div class="flex items-center gap4"><div style="width:10px;height:10px;border-radius:2px;background:var(--accent-amber)"></div> BOARDING</div>
      <div class="flex items-center gap4"><div style="width:10px;height:10px;border-radius:2px;background:var(--accent-blue)"></div> CHECK-IN OPEN</div>
      <div class="flex items-center gap4"><div style="width:10px;height:10px;border-radius:2px;background:rgba(52,211,153,0.3);border:1px solid var(--accent-emerald)"></div> DEPARTED</div>
      <div class="flex items-center gap4"><div style="width:10px;height:10px;border-radius:2px;background:var(--bg-dark);border:1px solid var(--border-subtle)"></div> VACANT</div>
      <div class="flex items-center gap4"><div style="width:10px;height:10px;border-radius:2px;background:var(--accent-rose)"></div> CONFLICT</div>
    </div>

    <!-- SPATIAL FLOOR PLAN SVG PANEL -->
    <div class="panel mb16">
      <div class="panel-hd">
        <div class="panel-hd-label">📍 T3 TERMINAL CONCOURSE SPATIAL LAYOUT</div>
        <span class="mono text-muted" style="font-size:0.75rem">PIER A (NORTH) · CENTRAL HUB · PIER B (SOUTH) · CLICK GATE FOR TELEMETRY</span>
      </div>
      <div class="panel-bd nopad">
        <div class="floor-plan-wrap">
          <div id="fp-svg-holder"></div>
        </div>
      </div>
    </div>

    <!-- GATE EVENTS + CHART -->
    <div class="g2">
      <div class="panel">
        <div class="panel-hd">
          <div class="panel-hd-label">
            <div class="dot-live"></div>
            GATE EVENT STREAM
          </div>
        </div>
        <div class="panel-bd nopad">
          <div id="gate-event-log" style="max-height:280px; overflow-y:auto; padding:8px; display:flex; flex-direction:column; gap:4px"></div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-hd">
          <div class="panel-hd-label">📊 EVENTS BY CATEGORY</div>
        </div>
        <div class="panel-bd" style="height:260px">
          <canvas id="gate-event-chart"></canvas>
        </div>
      </div>
    </div>
  `

  _renderFloorPlan()
  _renderEventLog()
  _renderEventChart()

  _updateHandler = () => {
    _renderFloorPlan()
    _renderEventLog()
  }
  onSimUpdate('flights', _updateHandler)
}

export function destroyGates() {
  if (_updateHandler) offSimUpdate('flights', _updateHandler)
}

function _getGateFlights() {
  const gateMap = {}
  store.flights.forEach(f => {
    if (f.gate) {
      if (!gateMap[f.gate]) gateMap[f.gate] = []
      gateMap[f.gate].push(f)
    }
  })
  return gateMap
}

function _renderFloorPlan() {
  const holder = document.getElementById('fp-svg-holder')
  if (!holder) return
  const gateFlights = _getGateFlights()

  let boarding = 0, available = 0, departed = 0, conflict = 0

  // We draw Pier A (top/left arm) and Pier B (bottom/right arm) around a Central Spine
  const svgWidth = 1000
  const svgHeight = 440

  let svg = `<svg class="floor-plan-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <!-- Background Building Outline -->
    <!-- Central Hub -->
    <rect x="420" y="160" width="160" height="120" rx="12" fill="#0f172a" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
    <text x="500" y="215" font-family="Outfit" font-size="13" font-weight="800" fill="#38bdf8" text-anchor="middle">CENTRAL PROCESSOR</text>
    <text x="500" y="235" font-family="JetBrains Mono" font-size="9" fill="#94a3b8" text-anchor="middle">SECURITY &amp; IMMIGRATION</text>

    <!-- Pier A Corridor (Left Pier) -->
    <rect x="40" y="80" width="380" height="40" rx="6" fill="#0f172a" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
    <text x="230" y="104" font-family="Outfit" font-size="11" font-weight="700" fill="#64748b" text-anchor="middle">CONCOURSE PIER A (GATES B1 – B25)</text>

    <!-- Pier B Corridor (Right Pier) -->
    <rect x="580" y="80" width="380" height="40" rx="6" fill="#0f172a" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
    <text x="770" y="104" font-family="Outfit" font-size="11" font-weight="700" fill="#64748b" text-anchor="middle">CONCOURSE PIER B (GATES B26 – B50)</text>
  `

  // Helper to draw gate cell
  function drawGateNode(gate, x, y, width, height) {
    const flights = gateFlights[gate] || []
    const activeFlights = flights.filter(f => f._simStatus !== 'Departed' && f._simStatus !== 'Arrived')
    const f = activeFlights[0] || flights[0]

    let fillColor = '#090d16'
    let strokeColor = 'rgba(255,255,255,0.1)'
    let textColor = '#94a3b8'
    let fltId = 'VACANT'

    if (flights.length > 1 && activeFlights.length > 1) {
      fillColor = 'rgba(244,63,94,0.3)'; strokeColor = '#f43f5e'; textColor = '#f43f5e'; fltId = 'CONFLICT!'; conflict++
    } else if (f) {
      const s = f._simStatus || 'Scheduled'
      if (s === 'Boarding' || s === 'Gate Closing') {
        fillColor = 'rgba(251,191,36,0.35)'; strokeColor = '#fbbf24'; textColor = '#fbbf24'; fltId = f.flight_id; boarding++
      } else if (s === 'Departed' || s === 'Arrived') {
        fillColor = 'rgba(52,211,153,0.1)'; strokeColor = 'rgba(52,211,153,0.3)'; textColor = '#34d399'; fltId = 'DEP'; departed++
      } else {
        fillColor = 'rgba(56,189,248,0.15)'; strokeColor = 'rgba(56,189,248,0.4)'; textColor = '#38bdf8'; fltId = f.flight_id; available++
      }
    } else {
      /* VACANT — NEUTRAL dark styling, NOT red! */
      fillColor = '#090d16'; strokeColor = 'rgba(255,255,255,0.08)'; textColor = '#64748b'; available++
    }

    return `
      <g class="fp-gate" onclick="window._openGateModal('${gate}')">
        <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="5" fill="${fillColor}" stroke="${strokeColor}" stroke-width="1.2" />
        <text x="${x + width/2}" y="${y + 12}" class="fp-gate-label" fill="${textColor}">${gate}</text>
        <text x="${x + width/2}" y="${y + 24}" class="fp-gate-flight" fill="${textColor}">${fltId}</text>
      </g>
    `
  }

  // Draw Pier A Gates: Top row (B1–B13), Bottom row (B14–B25)
  PIER_A.slice(0, 13).forEach((gate, idx) => {
    const x = 40 + idx * 28.5
    svg += drawGateNode(gate, x, 36, 26, 36)
  })
  PIER_A.slice(13, 25).forEach((gate, idx) => {
    const x = 40 + idx * 31
    svg += drawGateNode(gate, x, 126, 28, 36)
  })

  // Draw Pier B Gates: Top row (B26–B38), Bottom row (B39–B50)
  PIER_B.slice(0, 13).forEach((gate, idx) => {
    const x = 580 + idx * 28.5
    svg += drawGateNode(gate, x, 36, 26, 36)
  })
  PIER_B.slice(13, 25).forEach((gate, idx) => {
    const x = 580 + idx * 31
    svg += drawGateNode(gate, x, 126, 28, 36)
  })

  // Lower aprons & jetbridge lines
  svg += `
    <path d="M 400,120 L 420,160 M 580,160 L 600,120" stroke="rgba(56,189,248,0.3)" stroke-width="2" stroke-dasharray="4 4" />
    <text x="500" y="360" font-family="Outfit" font-size="12" font-weight="700" fill="#64748b" text-anchor="middle">APRON TARMAC &amp; TAXIWAY STAGING AREA</text>
  `

  svg += `</svg>`
  holder.innerHTML = svg

  const boardingEl = document.getElementById('g-boarding')
  const availEl = document.getElementById('g-available')
  const depEl = document.getElementById('g-departed')
  const confEl = document.getElementById('g-conflict')
  if (boardingEl) boardingEl.textContent = boarding
  if (availEl) availEl.textContent = available
  if (depEl) depEl.textContent = departed
  if (confEl) confEl.textContent = conflict
}

function _renderEventLog() {
  const el = document.getElementById('gate-event-log')
  if (!el) return
  const events = store.gate_events.slice(0, 25)
  el.innerHTML = events.map(e => `
    <div style="padding:6px 8px; background:var(--bg-surface); border:1px solid var(--border-subtle); border-left:3px solid ${e.delayed ? 'var(--accent-amber)' : 'var(--accent-blue)'}">
      <div style="display:flex; justify-content:space-between; align-items:center">
        <span style="font-size:0.75rem; font-weight:600; color:var(--text-main)">${e.event_type}</span>
        <span class="mono" style="font-size:0.68rem; color:var(--text-dim)">${fmtTime(e.event_time)}</span>
      </div>
      <div style="font-size:0.7rem; color:var(--text-muted); margin-top:2px">
        Gate ${e.gate} · Flight ${e.flight_id} · Staff: ${e.staff_id}
      </div>
    </div>
  `).join('')
}

function _renderEventChart() {
  const ctx = document.getElementById('gate-event-chart')
  if (!ctx) return
  const typeCounts = {}
  store.gate_events.forEach(e => { typeCounts[e.event_type] = (typeCounts[e.event_type] || 0) + 1 })
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(typeCounts),
      datasets: [{ data: Object.values(typeCounts), backgroundColor: '#38bdf8', borderRadius: 3 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
        y: { grid: { display: false }, ticks: { color: '#f8fafc' } }
      }
    }
  })
}

window._openGateModal = function(gate) {
  const flights = store.flights.filter(f => f.gate === gate)
  const events = getGateEvents(gate)
  const staff = getGateStaff(gate)

  const body = `
    <div class="modal-sect">
      <div class="modal-sect-title">ASSIGNED FLIGHTS (GATE ${gate})</div>
      ${flights.length ? flights.map(f => `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--bg-dark); border:1px solid var(--border-subtle); border-radius:6px; margin-bottom:6px">
          <div>
            <div class="mono text-accent" style="font-weight:700">${f.flight_id}</div>
            <div style="font-size:0.78rem; color:var(--text-muted)">${f.airline} → ${f.destination}</div>
          </div>
          <span class="chip ${statusBadgeClass(f._simStatus)}">${f._simStatus || 'Scheduled'}</span>
          <span class="mono text-acid" style="font-size:0.78rem">${fmtTime(f.sched_dep)}</span>
        </div>
      `).join('') : '<div style="color:var(--text-dim); font-size:0.8rem">NO ACTIVE FLIGHT ASSIGNMENTS</div>'}
    </div>

    <div class="modal-sect">
      <div class="modal-sect-title">RECENT GATE EVENTS</div>
      <div class="timeline">
        ${events.slice(0, 5).map(e => `
          <div class="tl-item">
            <div class="tl-line"><div class="tl-dot"></div><div class="tl-connector"></div></div>
            <div class="tl-body">
              <div class="tl-t">${e.event_type}</div>
              <div class="tl-s">${fmtTime(e.event_time)} · Priority: ${e.priority}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `

  openModal(`GATE TELEMETRY // ${gate}`, `TERMINAL 3 · ASSIGNED FLIGHTS: ${flights.length}`, body)
}
