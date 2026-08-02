// ═══════════════════════════════════════════════════════════════
// SECURITY VIEW — Screening Lanes & Checkpoint Telemetry
// Redesigned: Direct Bar Values + Max Capacity Reference Line + % Donuts
// ═══════════════════════════════════════════════════════════════
import { store } from '../data/store.js'
import { onSimUpdate, offSimUpdate } from '../data/simulator.js'
import { fmtTime, animateCount } from '../utils/format.js'

let _updateHandler = null
let _page = 0
const PAGE_SIZE = 40

export function renderSecurity(container) {
  container.innerHTML = `
    <!-- HEADER -->
    <div class="view-hd">
      <div class="view-hd-left">
        <div class="view-hd-icon">🔐</div>
        <div>
          <h1>SECURITY &amp; CHECKPOINT OPERATIONS</h1>
          <div class="view-hd-sub">TERMINAL 3 · 8 SCREENING LANES ACTIVE</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        LIVE CHECKPOINT METRICS
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-row">
      <div class="kpi-tile" style="--accent: var(--accent-emerald)">
        <div class="kpi-label">CLEARED PASSENGERS</div>
        <div class="kpi-value" data-accent="acid" id="sec-clear">0</div>
        <div class="kpi-sub">Standard screening pass</div>
        <div class="kpi-glyph">✅</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-rose)">
        <div class="kpi-label">FLAGGED FOR CHECK</div>
        <div class="kpi-value" data-accent="red" id="sec-flagged">0</div>
        <div class="kpi-sub">Flagged items/x-ray</div>
        <div class="kpi-glyph">🚨</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-amber)">
        <div class="kpi-label">SECONDARY SEARCH</div>
        <div class="kpi-value" data-accent="amber" id="sec-secondary">0</div>
        <div class="kpi-sub">Secondary lane check</div>
        <div class="kpi-glyph">🔍</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-blue)">
        <div class="kpi-label">AVG THROUGHPUT</div>
        <div class="kpi-value" data-accent="neon" id="sec-thruput">0/hr</div>
        <div class="kpi-sub">Across active lanes</div>
        <div class="kpi-glyph">⚡</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-purple)">
        <div class="kpi-label">AVG WAIT TIME</div>
        <div class="kpi-value" id="sec-wait">0s</div>
        <div class="kpi-sub">Screening wait duration</div>
        <div class="kpi-glyph">⏱</div>
      </div>
    </div>

    <!-- LANE GRID WITH MAX CAPACITY REFERENCE -->
    <div class="panel">
      <div class="panel-hd">
        <div class="panel-hd-label">🔐 SCREENING LANES QUEUE STATUS</div>
        <span class="live-tag"><span class="live-dot"></span> LIVE UPDATES</span>
      </div>
      <div class="panel-bd">
        <div class="lane-grid" id="sec-lane-grid"></div>
      </div>
    </div>

    <!-- CHARTS WITH DIRECT VALUE LABELS & REFERENCE LINE -->
    <div class="g2">
      <!-- Queue Bars with Reference Line -->
      <div class="panel">
        <div class="panel-hd">
          <div class="panel-hd-label">📊 QUEUE LENGTH BY LANE</div>
          <span class="mono text-muted" style="font-size:0.7rem">MAX CAPACITY THRESHOLD = 100 PAX</span>
        </div>
        <div class="panel-bd" style="padding:16px 20px">
          <div id="sec-bar-spectrum" class="lane-bar-wrap"></div>
        </div>
      </div>

      <!-- Outcome Donuts with Percents -->
      <div class="panel">
        <div class="panel-hd">
          <div class="panel-hd-label">📈 SCREENING OUTCOME BREAKDOWN</div>
        </div>
        <div class="panel-bd" style="display:flex; flex-direction:column; gap:16px; align-items:center; justify-content:center">
          <div style="width:160px; height:160px; position:relative">
            <canvas id="sec-result-chart"></canvas>
          </div>
          <div id="sec-result-legend" style="width:100%; display:flex; flex-direction:column; gap:6px"></div>
        </div>
      </div>
    </div>

    <!-- TABLE & CONTROLS -->
    <div class="ctrl-bar">
      <div class="search-box">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input id="sec-search" placeholder="SEARCH PNR, SCREENING ID..." />
      </div>
      <div class="filter-group" id="sec-chips">
        <button class="filter-btn active" data-val="all">ALL</button>
        <button class="filter-btn" data-val="Clear">CLEARED</button>
        <button class="filter-btn" data-val="Secondary Check">SECONDARY</button>
        <button class="filter-btn" data-val="Flagged">FLAGGED</button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-bd nopad">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>SCREENING ID</th><th>PNR</th><th>LANE</th><th>ENTRY TIME</th><th>RESULT</th><th>FLAGGED</th><th>WAIT (SEC)</th><th>SECONDARY</th>
              </tr>
            </thead>
            <tbody id="sec-tbody"></tbody>
          </table>
        </div>
        <div class="tbl-foot">
          <span class="page-info" id="sec-page-info"></span>
          <div class="pagination" id="sec-pagination"></div>
        </div>
      </div>
    </div>
  `

  _renderLanes()
  _updateKpis()
  _renderBarSpectrum()
  _renderResultChart()
  _renderTable()

  document.getElementById('sec-search')?.addEventListener('input', e => { window._sec_search = e.target.value.toLowerCase(); _page = 0; _renderTable() })
  document.getElementById('sec-chips')?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn'); if (!btn) return
    document.querySelectorAll('#sec-chips .filter-btn').forEach(x => x.classList.remove('active'))
    btn.classList.add('active'); window._sec_filter = btn.dataset.val; _page = 0; _renderTable()
  })

  _updateHandler = () => { _renderLanes(); _updateKpis(); _renderBarSpectrum(); _renderResultChart() }
  onSimUpdate('security', _updateHandler)
}

export function destroySecurity() {
  if (_updateHandler) offSimUpdate('security', _updateHandler)
}

function _getLaneData() {
  const lanes = {}
  for (let i = 1; i <= 8; i++) lanes[i] = { queues: [], waits: [], throughputs: [], flagged: 0 }
  store.security_screening.forEach(s => {
    const l = parseInt(s.lane)
    if (l >= 1 && l <= 8) {
      lanes[l].queues.push(parseInt(s.queue_length) || 50)
      lanes[l].waits.push(parseInt(s.wait_secs) || 60)
      lanes[l].throughputs.push(parseInt(s.throughput_per_hr) || 300)
      if (s.flagged) lanes[l].flagged++
    }
  })
  return lanes
}

function avg(arr) { return arr.length ? Math.round(arr.reduce((s,x)=>s+x,0)/arr.length) : 0 }

function _renderLanes() {
  const el = document.getElementById('sec-lane-grid')
  if (!el) return
  const lanes = _getLaneData()
  el.innerHTML = Object.entries(lanes).map(([num, d]) => {
    const avgQ = avg(d.queues)
    const avgW = avg(d.waits)
    const throughput = avg(d.throughputs)
    const pct = Math.min(100, avgQ)
    const color = pct > 70 ? 'var(--accent-rose)' : pct > 40 ? 'var(--accent-amber)' : 'var(--accent-emerald)'
    return `
      <div class="lane-card">
        <div class="lane-num">LANE ${num}</div>
        <div class="lane-qbar-wrap">
          <div class="lane-qbar-fill" style="height:${pct}%; background:${color}"></div>
        </div>
        <div style="font-weight:700; font-size:0.9rem; color:${color}">${avgQ} pax</div>
        <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px">${throughput}/hr · ${avgW}s wait</div>
      </div>
    `
  }).join('')
}

function _renderBarSpectrum() {
  const container = document.getElementById('sec-bar-spectrum')
  if (!container) return
  const lanes = _getLaneData()
  const maxCapacity = 120

  container.innerHTML = Object.entries(lanes).map(([num, d]) => {
    const avgQ = avg(d.queues)
    const avgW = avg(d.waits)
    const pct = Math.min(100, (avgQ / maxCapacity) * 100)
    const color = avgQ > 80 ? 'var(--accent-rose)' : avgQ > 50 ? 'var(--accent-amber)' : 'var(--accent-emerald)'
    const statusText = avgQ > 80 ? 'HIGH' : avgQ > 50 ? 'MODERATE' : 'NORMAL'
    const statusClass = avgQ > 80 ? 'red' : avgQ > 50 ? 'amber' : 'green'

    return `
      <div class="lane-bar-row">
        <div class="lane-bar-label">LANE ${num}</div>
        <div class="lane-bar-track">
          <!-- Max reference line at 100 pax -->
          <div class="lane-bar-ref-line" style="left: ${((100 / maxCapacity) * 100).toFixed(1)}%"></div>
          <div class="lane-bar-fill" style="width: ${pct.toFixed(1)}%; background: ${color}">
            <span class="lane-bar-value">${avgQ} pax</span>
          </div>
        </div>
        <div class="lane-bar-stat">${avgW}s</div>
        <div><span class="chip ${statusClass}">${statusText}</span></div>
      </div>
    `
  }).join('')
}

function _updateKpis() {
  const sec = store.security_screening
  animateCount(document.getElementById('sec-clear'), sec.filter(s=>s.result==='Clear').length)
  animateCount(document.getElementById('sec-flagged'), sec.filter(s=>s.flagged).length)
  animateCount(document.getElementById('sec-secondary'), sec.filter(s=>s.secondary_check).length)
  const avgThru = Math.round(sec.reduce((s,x)=>s+(parseInt(x.throughput_per_hr)||300),0)/sec.length)
  const el = document.getElementById('sec-thruput')
  if (el) el.textContent = avgThru + '/hr'
  const avgWait = Math.round(sec.reduce((s,x)=>s+(parseInt(x.wait_secs)||60),0)/sec.length)
  const wel = document.getElementById('sec-wait')
  if (wel) wel.textContent = avgWait + 's'
}

function _renderResultChart() {
  const resultCtx = document.getElementById('sec-result-chart')
  if (!resultCtx) return

  const sec = store.security_screening
  const clear = sec.filter(s=>s.result==='Clear').length
  const second = sec.filter(s=>s.result==='Secondary Check').length
  const flagged = sec.filter(s=>s.flagged).length
  const total = clear + second + flagged || 1

  new Chart(resultCtx, {
    type: 'doughnut',
    data: {
      labels: ['Cleared', 'Secondary Check', 'Flagged'],
      datasets: [{ data: [clear, second, flagged], backgroundColor: ['#3DD68C','#FFB454','#FF5470'], borderWidth: 0 }]
    },
    options: {
      cutout: '72%', responsive: true, maintainAspectRatio: true,
      plugins: { legend: { display: false } }
    }
  })

  const legend = document.getElementById('sec-result-legend')
  if (legend) {
    const items = [
      { label: 'Cleared', count: clear, pct: Math.round(clear/total*100), color: '#3DD68C' },
      { label: 'Secondary Check', count: second, pct: Math.round(second/total*100), color: '#FFB454' },
      { label: 'Flagged / X-Ray', count: flagged, pct: Math.round(flagged/total*100), color: '#FF5470' }
    ]
    legend.innerHTML = items.map(item => `
      <div style="display:flex; align-items:center; justify-content:space-between">
        <div style="display:flex; align-items:center; gap:6px">
          <div style="width:8px; height:8px; border-radius:2px; background:${item.color}"></div>
          <span style="font-size:0.8rem; color:var(--text-main)">${item.label}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px">
          <span style="font-family:var(--font-mono); font-size:0.8rem; font-weight:700; color:${item.color}">${item.pct}%</span>
          <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted)">(${item.count})</span>
        </div>
      </div>
    `).join('')
  }
}

function _renderTable() {
  let data = store.security_screening
  const search = window._sec_search || ''
  const filter = window._sec_filter || 'all'
  if (search) data = data.filter(s => s.screening_id?.toLowerCase().includes(search) || s.pnr_code?.toLowerCase().includes(search))
  if (filter !== 'all') data = data.filter(s => s.result === filter)
  const start = _page * PAGE_SIZE
  const rows = data.slice(start, start + PAGE_SIZE)
  const tbody = document.getElementById('sec-tbody')
  if (!tbody) return
  tbody.innerHTML = rows.map(s => `
    <tr class="${s.flagged ? 'alert-row' : ''}">
      <td class="mono bright neon">${s.screening_id}</td>
      <td class="mono dim">${s.pnr_code}</td>
      <td class="mono bright">LANE ${s.lane}</td>
      <td class="mono dim">${fmtTime(s.entry_time)}</td>
      <td><span class="chip ${s.result==='Clear'?'green':s.flagged?'red':'amber'}">${s.result}</span></td>
      <td>${s.flagged ? '<span class="chip red">⚠ FLAGGED</span>' : '<span class="chip green">OK</span>'}</td>
      <td class="mono">${s.wait_secs}s</td>
      <td>${s.secondary_check ? '<span class="chip amber">YES</span>' : '<span class="chip grey">NO</span>'}</td>
    </tr>
  `).join('')
  const pageInfo = document.getElementById('sec-page-info')
  const pagination = document.getElementById('sec-pagination')
  if (pageInfo) pageInfo.textContent = `Showing ${start+1}–${Math.min(start+PAGE_SIZE,data.length)} of ${data.length} records`
  if (pagination) {
    const tp = Math.ceil(data.length / PAGE_SIZE)
    pagination.innerHTML = Array.from({length:Math.min(tp,8)},(_,i)=>`<button class="pg-btn ${i===_page?'active':''}" data-p="${i}">${i+1}</button>`).join('')
    pagination.querySelectorAll('.pg-btn').forEach(btn=>btn.addEventListener('click',()=>{_page=parseInt(btn.dataset.p);_renderTable()}))
  }
}
