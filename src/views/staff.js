// ═══════════════════════════════════════════════════════════════
// STAFF VIEW — Roster, Department Deployments & Treemap Anchor
// Redesigned: CSS Department Treemap Visual Anchor + Roster Table
// ═══════════════════════════════════════════════════════════════
import { store } from '../data/store.js'

let _page = 0, _searchVal = '', _filterDept = 'all'
const PAGE_SIZE = 50

export function renderStaff(container) {
  const staff = store.staff_shifts
  const depts = [...new Set(staff.map(s => s.dept))].sort()
  const overtimeCount = staff.filter(s => s.overtime).length
  const deptCounts = {}
  staff.forEach(s => { deptCounts[s.dept] = (deptCounts[s.dept] || 0) + 1 })

  container.innerHTML = `
    <!-- HEADER -->
    <div class="view-hd">
      <div class="view-hd-left">
        <div class="view-hd-icon">👔</div>
        <div>
          <h1>STAFF ROSTER &amp; DEPLOYMENT MATRIX</h1>
          <div class="view-hd-sub">${staff.length} ACTIVE PERSONNEL ON SHIFT ACROSS ${depts.length} DEPARTMENTS</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        LIVE ROSTER FEED
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-row mb16">
      <div class="kpi-tile" style="--accent: var(--accent-blue)">
        <div class="kpi-label">TOTAL PERSONNEL</div>
        <div class="kpi-value" data-accent="neon">${staff.length}</div>
        <div class="kpi-sub">On active shift</div>
        <div class="kpi-glyph">👔</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-purple)">
        <div class="kpi-label">DEPARTMENTS</div>
        <div class="kpi-value">${depts.length}</div>
        <div class="kpi-sub">Airport operational units</div>
        <div class="kpi-glyph">🏢</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-amber)">
        <div class="kpi-label">OVERTIME SHIFTS</div>
        <div class="kpi-value" data-accent="amber">${overtimeCount}</div>
        <div class="kpi-sub">Extra shift allocation</div>
        <div class="kpi-glyph">⏰</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-emerald)">
        <div class="kpi-label">SHIFT DURATION</div>
        <div class="kpi-value" data-accent="acid">8h</div>
        <div class="kpi-sub">Standard shift length</div>
        <div class="kpi-glyph">🕐</div>
      </div>
    </div>

    <!-- DEPARTMENT TREEMAP VISUAL ANCHOR -->
    <div class="panel mb16">
      <div class="panel-hd">
        <div class="panel-hd-label">🏢 DEPARTMENT HEADCOUNT TREEMAP</div>
        <span class="mono text-muted" style="font-size:0.75rem">PROPORTIONAL STAFF DEPLOYMENT SPECTRUM</span>
      </div>
      <div class="panel-bd">
        <div class="dept-treemap" id="staff-treemap"></div>
      </div>
    </div>

    <!-- CONTROLS & TABLE -->
    <div class="ctrl-bar">
      <div class="search-box">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input id="staff-search" placeholder="SEARCH STAFF NAME, ID, GATE..." />
      </div>
      <div class="filter-group" id="staff-dept-chips">
        <button class="filter-btn active" data-val="all">ALL DEPTS</button>
        ${depts.map(d => `<button class="filter-btn" data-val="${d}">${d.toUpperCase()}</button>`).join('')}
      </div>
      <div class="filter-group">
        <button class="filter-btn" id="staff-ot-filter">OVERTIME ONLY ⏰</button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-bd nopad">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>STAFF ID</th><th>STAFF NAME</th><th>DEPARTMENT</th><th>ROLE</th><th>GATE ASSIGNMENT</th><th>SHIFT DATE</th><th>HOURS</th><th>OVERTIME</th><th>LANGUAGE</th>
              </tr>
            </thead>
            <tbody id="staff-tbody"></tbody>
          </table>
        </div>
        <div class="tbl-foot">
          <span class="page-info" id="staff-page-info"></span>
          <div class="pagination" id="staff-pagination"></div>
        </div>
      </div>
    </div>
  `

  _renderTreemap(deptCounts, staff.length)
  _renderStaffTable()

  document.getElementById('staff-search')?.addEventListener('input', e => { _searchVal = e.target.value.toLowerCase(); _page = 0; _renderStaffTable() })
  document.getElementById('staff-dept-chips')?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn'); if (!btn) return
    document.querySelectorAll('#staff-dept-chips .filter-btn').forEach(x => x.classList.remove('active'))
    btn.classList.add('active'); _filterDept = btn.dataset.val; _page = 0; _renderStaffTable()
  })
  let otOnly = false
  document.getElementById('staff-ot-filter')?.addEventListener('click', e => {
    otOnly = !otOnly; e.currentTarget.classList.toggle('active', otOnly)
    window._staff_ot = otOnly; _page = 0; _renderStaffTable()
  })
}

export function destroyStaff() {}

function _renderTreemap(deptCounts, totalStaff) {
  const container = document.getElementById('staff-treemap')
  if (!container) return

  const colorPalette = ['#38bdf8', '#34d399', '#c084fc', '#fbbf24', '#f43f5e', '#f97316', '#3b82f6', '#10b981']

  const sorted = Object.entries(deptCounts).sort((a,b) => b[1] - a[1])
  container.innerHTML = sorted.map(([dept, count], idx) => {
    const pct = Math.round((count / totalStaff) * 100)
    const color = colorPalette[idx % colorPalette.length]
    return `
      <div class="dept-treemap-cell" style="flex: ${count}; background: ${color}22; border: 1px solid ${color}66">
        <div class="dept-treemap-count" style="color: ${color}">${count}</div>
        <div class="dept-treemap-name">${dept}</div>
        <div class="dept-treemap-pct">${pct}% of staff</div>
      </div>
    `
  }).join('')
}

function _renderStaffTable() {
  let data = store.staff_shifts
  if (_searchVal) data = data.filter(s => s.name?.toLowerCase().includes(_searchVal) || s.staff_id?.toLowerCase().includes(_searchVal) || s.gate?.toLowerCase().includes(_searchVal))
  if (_filterDept !== 'all') data = data.filter(s => s.dept === _filterDept)
  if (window._staff_ot) data = data.filter(s => s.overtime)
  const start = _page * PAGE_SIZE
  const rows = data.slice(start, start + PAGE_SIZE)
  const tbody = document.getElementById('staff-tbody')
  if (!tbody) return
  tbody.innerHTML = rows.map(s => `
    <tr>
      <td class="mono dim">${s.staff_id}</td>
      <td class="bright text-accent">${s.name}</td>
      <td><span class="chip neon">${s.dept}</span></td>
      <td class="dim">${s.role}</td>
      <td class="mono bright">${s.gate || '--'}</td>
      <td class="mono dim">${s.shift_date || '--'}</td>
      <td class="mono">${s.hours}h</td>
      <td>${s.overtime ? '<span class="chip amber">⏰ OVERTIME</span>' : '<span class="chip grey">REGULAR</span>'}</td>
      <td class="dim">${s.language || '--'}</td>
    </tr>
  `).join('')
  const pageInfo = document.getElementById('staff-page-info')
  const pagination = document.getElementById('staff-pagination')
  if (pageInfo) pageInfo.textContent = `Showing ${start+1}–${Math.min(start+PAGE_SIZE,data.length)} of ${data.length} personnel`
  if (pagination) {
    const tp = Math.ceil(data.length / PAGE_SIZE)
    pagination.innerHTML = Array.from({length:Math.min(tp,8)},(_,i)=>`<button class="pg-btn ${i===_page?'active':''}" data-p="${i}">${i+1}</button>`).join('')
    pagination.querySelectorAll('.pg-btn').forEach(btn=>btn.addEventListener('click',()=>{_page=parseInt(btn.dataset.p);_renderStaffTable()}))
  }
}
