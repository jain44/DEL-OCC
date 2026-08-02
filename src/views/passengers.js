// ═══════════════════════════════════════════════════════════════
// PASSENGERS VIEW — Passenger Manifest & VIP Hub
// Redesigned: Labeled Breakdown + Stacked Bar for Nationality Legibility
// ═══════════════════════════════════════════════════════════════
import { store } from '../data/store.js'
import { fmtTime } from '../utils/format.js'
import { getPassengerSecurity, getPassengerBaggage } from '../data/store.js'
import { openModal } from './modal.js'

let _page = 0, _searchVal = '', _filterClass = 'all', _filterGroup = 'all'
const PAGE_SIZE = 50

export function renderPassengers(container) {
  const pax = store.passengers
  const vipCount = pax.filter(p => p.is_vip).length
  const specialCount = pax.filter(p => p.special_assistance).length
  const economy = pax.filter(p => p.booking_class === 'Economy').length
  const business = pax.filter(p => p.booking_class === 'Business').length
  const ageGroups = [...new Set(pax.map(p => p.age_group))].filter(Boolean)

  container.innerHTML = `
    <!-- HEADER -->
    <div class="view-hd">
      <div class="view-hd-left">
        <div class="view-hd-icon">👥</div>
        <div>
          <h1>PASSENGER HUB &amp; MANIFEST TRACKER</h1>
          <div class="view-hd-sub">${pax.length} PASSENGERS IN CURRENT SYSTEM WINDOW</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        LIVE MANIFEST TRACKING
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-row">
      <div class="kpi-tile" style="--accent: var(--accent-blue)">
        <div class="kpi-label">TOTAL PASSENGERS</div>
        <div class="kpi-value" data-accent="neon">${pax.length}</div>
        <div class="kpi-sub">Registered manifest</div>
        <div class="kpi-glyph">👥</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-purple)">
        <div class="kpi-label">ECONOMY CLASS</div>
        <div class="kpi-value">${economy}</div>
        <div class="kpi-sub">Standard seating</div>
        <div class="kpi-glyph">💺</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-emerald)">
        <div class="kpi-label">BUSINESS CLASS</div>
        <div class="kpi-value" data-accent="acid">${business}</div>
        <div class="kpi-sub">Premium lounge access</div>
        <div class="kpi-glyph">👔</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-amber)">
        <div class="kpi-label">VIP PASSENGERS</div>
        <div class="kpi-value" data-accent="amber">${vipCount}</div>
        <div class="kpi-sub">Priority escort required</div>
        <div class="kpi-glyph">⭐</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-blue)">
        <div class="kpi-label">SPECIAL ASSISTANCE</div>
        <div class="kpi-value">${specialCount}</div>
        <div class="kpi-sub">Wheelchair / escort</div>
        <div class="kpi-glyph">♿</div>
      </div>
    </div>

    <!-- CHARTS WITH DIRECT PERCENTAGES -->
    <div class="g2">
      <!-- Nationality Breakdown -->
      <div class="panel">
        <div class="panel-hd"><div class="panel-hd-label">🌍 NATIONALITY DISTRIBUTION (DIRECT PROPORTIONS)</div></div>
        <div class="panel-bd" style="display:flex; flex-direction:column; gap:14px">
          <div id="pax-nat-bars" style="display:flex; flex-direction:column; gap:8px"></div>
        </div>
      </div>

      <!-- Age Group -->
      <div class="panel">
        <div class="panel-hd"><div class="panel-hd-label">👶 AGE GROUP SPECTRUM</div></div>
        <div class="panel-bd" style="height: 220px">
          <canvas id="pax-age-chart"></canvas>
        </div>
      </div>
    </div>

    <!-- CONTROLS & TABLE -->
    <div class="ctrl-bar">
      <div class="search-box">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input id="pax-search" placeholder="SEARCH PASSENGER NAME, PNR, FLIGHT..." />
      </div>
      <div class="filter-group" id="pax-class-chips">
        <button class="filter-btn active" data-val="all">ALL CLASSES</button>
        <button class="filter-btn" data-val="Economy">ECONOMY</button>
        <button class="filter-btn" data-val="Business">BUSINESS</button>
      </div>
      <div class="filter-group" id="pax-group-chips">
        ${['all',...ageGroups].map(g => `<button class="filter-btn ${g==='all'?'active':''}" data-val="${g}">${g === 'all' ? 'ALL AGES' : g}</button>`).join('')}
      </div>
      <div class="filter-group">
        <button class="filter-btn" id="pax-vip-filter">VIP ONLY ⭐</button>
        <button class="filter-btn" id="pax-special-filter">SPECIAL ASSIST ♿</button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-bd nopad">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>PASSENGER NAME</th><th>PNR</th><th>FLIGHT</th><th>GATE</th><th>CLASS</th><th>AGE GROUP</th><th>NATIONALITY</th><th>SEAT</th><th>STATUS</th><th>WAIT</th><th>BAGS</th>
              </tr>
            </thead>
            <tbody id="pax-tbody"></tbody>
          </table>
        </div>
        <div class="tbl-foot">
          <span class="page-info" id="pax-page-info"></span>
          <div class="pagination" id="pax-pagination"></div>
        </div>
      </div>
    </div>
  `

  _renderCharts()
  _renderTable()

  document.getElementById('pax-search')?.addEventListener('input', e => { _searchVal = e.target.value.toLowerCase(); _page = 0; _renderTable() })
  document.getElementById('pax-class-chips')?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn'); if (!btn) return
    document.querySelectorAll('#pax-class-chips .filter-btn').forEach(x => x.classList.remove('active'))
    btn.classList.add('active'); _filterClass = btn.dataset.val; _page = 0; _renderTable()
  })
  document.getElementById('pax-group-chips')?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn'); if (!btn) return
    document.querySelectorAll('#pax-group-chips .filter-btn').forEach(x => x.classList.remove('active'))
    btn.classList.add('active'); _filterGroup = btn.dataset.val; _page = 0; _renderTable()
  })

  let vipOnly = false, specialOnly = false
  document.getElementById('pax-vip-filter')?.addEventListener('click', e => {
    vipOnly = !vipOnly; e.currentTarget.classList.toggle('active', vipOnly)
    window._pax_vip = vipOnly; _page = 0; _renderTable()
  })
  document.getElementById('pax-special-filter')?.addEventListener('click', e => {
    specialOnly = !specialOnly; e.currentTarget.classList.toggle('active', specialOnly)
    window._pax_special = specialOnly; _page = 0; _renderTable()
  })
}

export function destroyPassengers() {}

function _renderCharts() {
  const natContainer = document.getElementById('pax-nat-bars')
  if (natContainer) {
    const natCounts = {}
    store.passengers.forEach(p => { natCounts[p.nationality] = (natCounts[p.nationality] || 0) + 1 })
    const total = store.passengers.length || 1
    const sorted = Object.entries(natCounts).sort((a,b) => b[1]-a[1]).slice(0, 6)

    const colors = ['#7C8CFF', '#00E5C7', '#FFB454', '#FF7A9C', '#63D9E8', '#B98CFF']

    natContainer.innerHTML = sorted.map(([nat, count], i) => {
      const pct = Math.round(count / total * 100)
      const color = colors[i % colors.length]
      return `
        <div style="display:flex; flex-direction:column; gap:4px">
          <div style="display:flex; align-items:center; justify-content:space-between">
            <span style="font-size:0.8rem; font-weight:600; color:var(--text-main)">${nat}</span>
            <div style="display:flex; align-items:center; gap:8px">
              <span style="font-family:var(--font-mono); font-size:0.82rem; font-weight:700; color:${color}">${pct}%</span>
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted)">(${count} pax)</span>
            </div>
          </div>
          <div style="height:8px; background:var(--bg-elevated); border-radius:4px; overflow:hidden">
            <div style="height:100%; width:${pct}%; background:${color}; border-radius:4px"></div>
          </div>
        </div>
      `
    }).join('')
  }

  const ageCtx = document.getElementById('pax-age-chart')
  if (ageCtx) {
    const ageCounts = {}
    store.passengers.forEach(p => { ageCounts[p.age_group] = (ageCounts[p.age_group] || 0) + 1 })
    new Chart(ageCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(ageCounts),
        datasets: [{ data: Object.values(ageCounts), backgroundColor: '#38bdf8', borderRadius: 4 }]
      },
      options: { responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
        }
      }
    })
  }
}

function _renderTable() {
  let data = store.passengers
  if (_searchVal) data = data.filter(p =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(_searchVal) ||
    p.pnr_code?.toLowerCase().includes(_searchVal) ||
    p.flight_id?.toLowerCase().includes(_searchVal)
  )
  if (_filterClass !== 'all') data = data.filter(p => p.booking_class === _filterClass)
  if (_filterGroup !== 'all') data = data.filter(p => p.age_group === _filterGroup)
  if (window._pax_vip) data = data.filter(p => p.is_vip)
  if (window._pax_special) data = data.filter(p => p.special_assistance)

  const start = _page * PAGE_SIZE
  const rows = data.slice(start, start + PAGE_SIZE)
  const tbody = document.getElementById('pax-tbody')
  if (!tbody) return
  tbody.innerHTML = rows.map(p => `
    <tr class="${p.is_vip ? 'vip-row' : ''}" onclick="window._openPaxModal('${p.pnr_code}')">
      <td class="bright">${p.first_name} ${p.last_name} ${p.is_vip ? '⭐' : ''}</td>
      <td class="mono dim">${p.pnr_code}</td>
      <td class="mono bright neon">${p.flight_id}</td>
      <td class="mono">${p.gate || '--'}</td>
      <td><span class="chip ${p.booking_class === 'Business' ? 'purple' : 'grey'}">${p.booking_class}</span></td>
      <td><span class="chip neon">${p.age_group || '--'}</span></td>
      <td class="dim">${p.nationality}</td>
      <td class="mono bright">${p.seat}</td>
      <td>${p.is_vip ? '<span class="chip amber">VIP ⭐</span>' : p.special_assistance ? '<span class="chip neon">ASSIST ♿</span>' : '<span class="chip grey">REGULAR</span>'}</td>
      <td class="mono dim">${p.wait_time_hrs ? parseFloat(p.wait_time_hrs).toFixed(1)+'h' : '--'}</td>
      <td class="mono bright">${p.bag_count || 0}</td>
    </tr>
  `).join('')

  const pageInfo = document.getElementById('pax-page-info')
  const pagination = document.getElementById('pax-pagination')
  if (pageInfo) pageInfo.textContent = `Showing ${start+1}–${Math.min(start+PAGE_SIZE,data.length)} of ${data.length} passengers`
  if (pagination) {
    const tp = Math.ceil(data.length / PAGE_SIZE)
    pagination.innerHTML = Array.from({length:Math.min(tp,8)},(_,i) =>
      `<button class="pg-btn ${i===_page?'active':''}" data-p="${i}">${i+1}</button>`
    ).join('')
    pagination.querySelectorAll('.pg-btn').forEach(btn =>
      btn.addEventListener('click',()=>{ _page=parseInt(btn.dataset.p); _renderTable() })
    )
  }
}

window._openPaxModal = function(pnrCode) {
  const p = store._idx.passByPnr[pnrCode]
  if (!p) return
  const sec = getPassengerSecurity(pnrCode)
  const bags = getPassengerBaggage(pnrCode)

  const body = `
    <div class="modal-sect">
      <div class="modal-sect-title">PASSENGER PROFILE (${p.pnr_code})</div>
      <div class="info-grid">
        <div class="info-item"><div class="l">Name</div><div class="v">${p.first_name} ${p.last_name} ${p.is_vip ? '⭐' : ''}</div></div>
        <div class="info-item"><div class="l">PNR Code</div><div class="v mono">${p.pnr_code}</div></div>
        <div class="info-item"><div class="l">Age / Gender</div><div class="v">${p.age} / ${p.gender}</div></div>
        <div class="info-item"><div class="l">Nationality</div><div class="v">${p.nationality}</div></div>
        <div class="info-item"><div class="l">Assigned Seat</div><div class="v mono">${p.seat}</div></div>
        <div class="info-item"><div class="l">Booking Class</div><div><span class="chip ${p.booking_class==='Business'?'purple':'grey'}">${p.booking_class}</span></div></div>
        <div class="info-item"><div class="l">Assigned Gate</div><div class="v mono">${p.gate || '--'}</div></div>
        <div class="info-item"><div class="l">Check-In Time</div><div class="v mono">${fmtTime(p.checkin_time)}</div></div>
      </div>
    </div>

    ${sec ? `
    <div class="modal-sect">
      <div class="modal-sect-title">SECURITY SCREENING RESULT</div>
      <div class="info-grid">
        <div class="info-item"><div class="l">Status</div><div><span class="chip ${sec.result==='Clear'?'green':sec.flagged?'red':'amber'}">${sec.result}</span></div></div>
        <div class="info-item"><div class="l">Screening Lane</div><div class="v mono">LANE ${sec.lane}</div></div>
        <div class="info-item"><div class="l">Wait Duration</div><div class="v">${sec.wait_secs}s</div></div>
      </div>
    </div>` : ''}

    <div class="modal-sect">
      <div class="modal-sect-title">CHECKED BAGGAGE (${bags.length} BAGS)</div>
      ${bags.length ? bags.map(b => `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--bg-dark); border:1px solid var(--border-subtle); border-radius:6px; margin-bottom:6px">
          <span class="mono text-neon" style="font-weight:700">${b.tag_id}</span>
          <span style="font-size:0.8rem; color:var(--text-muted)">${b.weight_kg?.toFixed(1)} kg · Carousel ${b.carousel}</span>
          <span class="chip ${b.mishandled?'red':'green'}">${b.status}</span>
        </div>
      `).join('') : '<div style="font-size:0.8rem; color:var(--text-muted)">No checked baggage</div>'}
    </div>
  `

  openModal(`${p.first_name} ${p.last_name}`, `PNR: ${p.pnr_code} · FLIGHT: ${p.flight_id}`, body)
}
