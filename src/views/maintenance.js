// ═══════════════════════════════════════════════════════════════
// MAINTENANCE VIEW — Full-Bleed Severity Work Order Kanban
// Redesigned: Full-Bleed Primary Kanban (no duplicate table), Column Severity Colors
// ═══════════════════════════════════════════════════════════════
import { store } from '../data/store.js'
import { fmtTime, fmtDate } from '../utils/format.js'
import { openModal } from './modal.js'

let _searchVal = ''
let _selectedTail = 'all'

export function renderMaintenance(container) {
  const logs = store.maintenance_logs
  const open = logs.filter(m => m._simStatus === 'Open')
  const inProg = logs.filter(m => m._simStatus === 'In Progress')
  const resolved = logs.filter(m => m._simStatus === 'Resolved')
  const tails = [...new Set(logs.map(m => m.tail_number))].sort()

  container.innerHTML = `
    <!-- HEADER -->
    <div class="view-hd">
      <div class="view-hd-left">
        <div class="view-hd-icon">🔧</div>
        <div>
          <h1>AIRCRAFT MAINTENANCE CONTROL KANBAN</h1>
          <div class="view-hd-sub">${logs.length} WORK ORDERS · ${tails.length} FLEET TAILS MONITORED</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        LIVE WORK ORDER STREAM
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-row mb16">
      <div class="kpi-tile" style="--accent: var(--accent-rose)">
        <div class="kpi-label">OPEN ORDERS</div>
        <div class="kpi-value" data-accent="red">${open.length}</div>
        <div class="kpi-sub">Pending technician action</div>
        <div class="kpi-glyph">🔴</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-amber)">
        <div class="kpi-label">IN PROGRESS</div>
        <div class="kpi-value" data-accent="amber">${inProg.length}</div>
        <div class="kpi-sub">Active hangar work</div>
        <div class="kpi-glyph">🔧</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-emerald)">
        <div class="kpi-label">RESOLVED TODAY</div>
        <div class="kpi-value" data-accent="acid">${resolved.length}</div>
        <div class="kpi-sub">Cleared &amp; released</div>
        <div class="kpi-glyph">✅</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-blue)">
        <div class="kpi-label">FLEET AIRCRAFT</div>
        <div class="kpi-value" data-accent="neon">${tails.length}</div>
        <div class="kpi-sub">Registered tail numbers</div>
        <div class="kpi-glyph">✈</div>
      </div>
    </div>

    <!-- CONTROLS -->
    <div class="ctrl-bar mb16">
      <div class="search-box">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input id="maint-search" placeholder="SEARCH WORK ORDER, TAIL, DEFECT..." />
      </div>
      <select class="filter-select" id="maint-tail-filter">
        <option value="all">ALL AIRCRAFT TAILS</option>
        ${tails.map(t => `<option value="${t}">${t}</option>`).join('')}
      </select>
    </div>

    <!-- FULL-BLEED KANBAN BOARD HERO -->
    <div class="panel" style="flex:1">
      <div class="panel-hd">
        <div class="panel-hd-label">📋 FULL-BLEED WORK ORDER KANBAN BOARD</div>
        <span class="mono text-muted" style="font-size:0.75rem">COLOR-CODED BY SEVERITY &amp; STATUS · CLICK CARD FOR FULL TELEMETRY</span>
      </div>
      <div class="panel-bd" style="padding:16px">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: start" id="maint-kanban-cols">
          
          <!-- Column 1: Open Orders (Red Accent) -->
          <div style="background: var(--bg-dark); border: 1px solid rgba(244,63,94,0.3); border-top: 3px solid var(--accent-rose); border-radius: 10px; overflow: hidden">
            <div style="padding: 14px 18px; background: rgba(244, 63, 94, 0.12); border-bottom: 1px solid rgba(244,63,94,0.2); font-weight: 700; color: var(--accent-rose); display: flex; justify-content: space-between; align-items:center">
              <span style="font-family:var(--font-display); letter-spacing:0.02em">🔴 OPEN WORK ORDERS</span>
              <span class="chip red" id="maint-count-open">${open.length}</span>
            </div>
            <div id="maint-col-open" style="padding: 14px; display: flex; flex-direction: column; gap: 12px; max-height: 600px; overflow-y: auto">
              ${_kanbanCards(open)}
            </div>
          </div>

          <!-- Column 2: In Progress (Amber Accent) -->
          <div style="background: var(--bg-dark); border: 1px solid rgba(251,191,36,0.3); border-top: 3px solid var(--accent-amber); border-radius: 10px; overflow: hidden">
            <div style="padding: 14px 18px; background: rgba(251, 191, 36, 0.12); border-bottom: 1px solid rgba(251,191,36,0.2); font-weight: 700; color: var(--accent-amber); display: flex; justify-content: space-between; align-items:center">
              <span style="font-family:var(--font-display); letter-spacing:0.02em">🟡 IN PROGRESS HANGAR</span>
              <span class="chip amber" id="maint-count-inprog">${inProg.length}</span>
            </div>
            <div id="maint-col-inprog" style="padding: 14px; display: flex; flex-direction: column; gap: 12px; max-height: 600px; overflow-y: auto">
              ${_kanbanCards(inProg)}
            </div>
          </div>

          <!-- Column 3: Resolved (Green Accent) -->
          <div style="background: var(--bg-dark); border: 1px solid rgba(52,211,153,0.3); border-top: 3px solid var(--accent-emerald); border-radius: 10px; overflow: hidden">
            <div style="padding: 14px 18px; background: rgba(52, 211, 153, 0.12); border-bottom: 1px solid rgba(52,211,153,0.2); font-weight: 700; color: var(--accent-emerald); display: flex; justify-content: space-between; align-items:center">
              <span style="font-family:var(--font-display); letter-spacing:0.02em">✅ RESOLVED &amp; RELEASED</span>
              <span class="chip green" id="maint-count-resolved">${resolved.length}</span>
            </div>
            <div id="maint-col-resolved" style="padding: 14px; display: flex; flex-direction: column; gap: 12px; max-height: 600px; overflow-y: auto">
              ${_kanbanCards(resolved)}
            </div>
          </div>

        </div>
      </div>
    </div>
  `

  document.getElementById('maint-search')?.addEventListener('input', e => {
    _searchVal = e.target.value.toLowerCase()
    _filterKanban()
  })
  document.getElementById('maint-tail-filter')?.addEventListener('change', e => {
    _selectedTail = e.target.value
    _filterKanban()
  })

  container.addEventListener('click', e => {
    const card = e.target.closest('[data-wo]')
    if (card) _openMaintModal(card.dataset.wo)
  })
}

export function destroyMaintenance() {}

function _kanbanCards(items) {
  if (!items || !items.length) {
    return `<div style="text-align:center; padding:20px; color:var(--text-dim); font-size:0.8rem">No work orders</div>`
  }
  return items.map(m => {
    const sevClass = m.severity == 1 ? 'red' : m.severity == 2 ? 'amber' : 'neon'
    const borderColor = m.severity == 1 ? 'var(--accent-rose)' : m.severity == 2 ? 'var(--accent-amber)' : 'var(--accent-blue)'
    return `
      <div data-wo="${m.work_order}" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-left: 4px solid ${borderColor}; padding: 14px; border-radius: 8px; cursor: pointer; transition: transform 0.15s, border-color 0.15s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px">
          <span class="mono bright neon" style="font-weight:700">${m.work_order}</span>
          <span class="chip ${sevClass}" style="font-size:0.65rem">SEV-${m.severity}</span>
        </div>
        <div style="font-weight:700; color:var(--text-main); font-size:0.9rem; margin-bottom:6px">${m.defect_type}</div>
        <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.75rem; color:var(--text-muted)">
          <span class="mono" style="color:var(--text-main)">Tail: <strong>${m.tail_number}</strong></span>
          <span class="mono">${m.duration_hrs}h</span>
        </div>
        <div style="font-size:0.7rem; color:var(--text-dim); margin-top:6px; display:flex; justify-content:space-between; align-items:center">
          <span>Flight: ${m.flight_id || '--'}</span>
          <span>Tech: ${m.tech_id}</span>
        </div>
      </div>
    `
  }).join('')
}

function _filterKanban() {
  let logs = store.maintenance_logs
  if (_searchVal) {
    logs = logs.filter(m =>
      m.work_order?.toLowerCase().includes(_searchVal) ||
      m.defect_type?.toLowerCase().includes(_searchVal) ||
      m.tail_number?.toLowerCase().includes(_searchVal) ||
      m.tech_id?.toLowerCase().includes(_searchVal)
    )
  }
  if (_selectedTail !== 'all') logs = logs.filter(m => m.tail_number === _selectedTail)

  const open = logs.filter(m => m._simStatus === 'Open')
  const inProg = logs.filter(m => m._simStatus === 'In Progress')
  const resolved = logs.filter(m => m._simStatus === 'Resolved')

  const openCol = document.getElementById('maint-col-open')
  const inProgCol = document.getElementById('maint-col-inprog')
  const resolvedCol = document.getElementById('maint-col-resolved')

  if (openCol) openCol.innerHTML = _kanbanCards(open)
  if (inProgCol) inProgCol.innerHTML = _kanbanCards(inProg)
  if (resolvedCol) resolvedCol.innerHTML = _kanbanCards(resolved)

  const openCnt = document.getElementById('maint-count-open')
  const inProgCnt = document.getElementById('maint-count-inprog')
  const resolvedCnt = document.getElementById('maint-count-resolved')
  if (openCnt) openCnt.textContent = open.length
  if (inProgCnt) inProgCnt.textContent = inProg.length
  if (resolvedCnt) resolvedCnt.textContent = resolved.length
}

function _openMaintModal(workOrder) {
  const m = store.maintenance_logs.find(x => x.work_order === workOrder)
  if (!m) return
  const body = `
    <div class="modal-sect">
      <div class="modal-sect-title">WORK ORDER DETAILS</div>
      <div class="info-grid">
        <div class="info-item"><div class="l">Work Order</div><div class="v mono">${m.work_order}</div></div>
        <div class="info-item"><div class="l">Tail Number</div><div class="v mono">${m.tail_number}</div></div>
        <div class="info-item"><div class="l">Flight ID</div><div class="v mono">${m.flight_id}</div></div>
        <div class="info-item"><div class="l">Work Type</div><div class="v">${m.work_type}</div></div>
        <div class="info-item"><div class="l">Defect Type</div><div class="v">${m.defect_type}</div></div>
        <div class="info-item"><div class="l">Fix Type</div><div class="v">${m.fix_type}</div></div>
        <div class="info-item"><div class="l">Severity</div><div><span class="chip ${m.severity==1?'red':m.severity==2?'amber':'neon'}">SEV-${m.severity}</span></div></div>
        <div class="info-item"><div class="l">Status</div><div><span class="chip ${m._simStatus==='Resolved'?'green':m._simStatus==='In Progress'?'amber':'red'}">${m._simStatus}</span></div></div>
        <div class="info-item"><div class="l">Duration</div><div class="v">${m.duration_hrs}h</div></div>
        <div class="info-item"><div class="l">Technician ID</div><div class="v mono">${m.tech_id}</div></div>
      </div>
    </div>
  `
  openModal(`WORK ORDER: ${m.work_order}`, `AIRCRAFT: ${m.tail_number} · SEVERITY: ${m.severity}`, body)
}
