// ═══════════════════════════════════════════════════════════════
// BAGGAGE VIEW — Flow Diagram & Carousel Load Spectrum
// Redesigned: Horizontal Flow Diagram (Ramp → Transit → Belt → Claim)
// ═══════════════════════════════════════════════════════════════
import { store } from '../data/store.js'
import { onSimUpdate, offSimUpdate } from '../data/simulator.js'
import { fmtTime, fmtWeight, statusBadgeClass, animateCount } from '../utils/format.js'

let _updateHandler = null
let _page = 0
let _searchVal = ''
let _filterStatus = 'all'
const PAGE_SIZE = 50

export function renderBaggage(container) {
  container.innerHTML = `
    <!-- HEADER -->
    <div class="view-hd">
      <div class="view-hd-left">
        <div class="view-hd-icon">🧳</div>
        <div>
          <h1>BAGGAGE FLOW &amp; TRACKING MATRIX</h1>
          <div class="view-hd-sub">TERMINAL 3 CONVEYORS · ${store.baggage.length} TRACKED BAGS</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        LIVE BAGGAGE STREAM
      </div>
    </div>

    <!-- BAGGAGE FLOW DIAGRAM visual headline anchor -->
    <div class="panel mb16">
      <div class="panel-hd">
        <div class="panel-hd-label">
          <div class="dot-live"></div>
          🔄 BAGGAGE HANDLING FLOW SPECTRUM
        </div>
        <span class="mono text-muted" style="font-size:0.75rem">RAMP DISPATCH → CONVEYOR TRANSIT → BELT CLAIM → LOADED AIRCRAFT</span>
      </div>
      <div class="panel-bd">
        <div class="baggage-flow">
          
          <div class="flow-stage">
            <div class="flow-stage-count text-accent" id="flow-checkin">0</div>
            <div class="flow-stage-label">Check-In / Ramp</div>
            <div class="flow-stage-sub">Induction points</div>
          </div>

          <div class="flow-arrow">
            <div class="flow-arrow-line"><div class="flow-arrow-dot"></div></div>
            <div class="flow-arrow-head"></div>
          </div>

          <div class="flow-stage">
            <div class="flow-stage-count text-amber" id="flow-transit">0</div>
            <div class="flow-stage-label">In Transit</div>
            <div class="flow-stage-sub">High-speed sorting</div>
          </div>

          <div class="flow-arrow">
            <div class="flow-arrow-line"><div class="flow-arrow-dot" style="animation-delay:0.7s"></div></div>
            <div class="flow-arrow-head"></div>
          </div>

          <div class="flow-stage">
            <div class="flow-stage-count text-purple" id="flow-onbelt">0</div>
            <div class="flow-stage-label">On Belt / Claim</div>
            <div class="flow-stage-sub">Carousels 1–10</div>
          </div>

          <div class="flow-arrow">
            <div class="flow-arrow-line"><div class="flow-arrow-dot" style="animation-delay:1.4s"></div></div>
            <div class="flow-arrow-head"></div>
          </div>

          <div class="flow-stage">
            <div class="flow-stage-count text-acid" id="flow-loaded">0</div>
            <div class="flow-stage-label">Loaded Aboard</div>
            <div class="flow-stage-sub">Flight hold</div>
          </div>

        </div>

        <div style="display:flex; justify-content:flex-end; margin-top:12px">
          <div class="flow-mishandled">
            <div class="flow-mish-count" id="flow-mish">0</div>
            <div class="flow-mish-label">⚠ Mishandled / Routing Flags</div>
          </div>
        </div>
      </div>
    </div>

    <!-- CAROUSELS PANEL -->
    <div class="panel mb16">
      <div class="panel-hd">
        <div class="panel-hd-label">🎡 CAROUSEL LOAD DISTRIBUTION (1-10)</div>
      </div>
      <div class="panel-bd">
        <div class="carousel-row" id="carousel-grid"></div>
      </div>
    </div>

    <!-- CONTROLS & TABLE -->
    <div class="ctrl-bar">
      <div class="search-box">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input id="bg-search" placeholder="SEARCH TAG ID, FLIGHT, PNR..." />
      </div>
      <div class="filter-group" id="bg-chips">
        <button class="filter-btn active" data-val="all">ALL</button>
        <button class="filter-btn" data-val="Loaded">LOADED</button>
        <button class="filter-btn" data-val="In Transit">IN TRANSIT</button>
        <button class="filter-btn" data-val="On Belt">ON BELT</button>
        <button class="filter-btn" data-val="Delayed">DELAYED</button>
        <button class="filter-btn" data-val="Mishandled">MISHANDLED</button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-bd nopad">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>TAG ID</th><th>FLIGHT</th><th>PNR</th><th>WEIGHT</th><th>CAROUSEL</th><th>STATUS</th><th>AREA</th><th>SCAN TIME</th><th>MISHANDLED</th>
              </tr>
            </thead>
            <tbody id="bg-tbody"></tbody>
          </table>
        </div>
        <div class="tbl-foot">
          <span class="page-info" id="bg-page-info"></span>
          <div class="pagination" id="bg-pagination"></div>
        </div>
      </div>
    </div>
  `

  _renderCarousels()
  _updateFlowCounts()
  _renderTable()

  document.getElementById('bg-search')?.addEventListener('input', e => {
    _searchVal = e.target.value.toLowerCase(); _page = 0; _renderTable()
  })
  document.getElementById('bg-chips')?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn'); if (!btn) return
    document.querySelectorAll('#bg-chips .filter-btn').forEach(c => c.classList.remove('active'))
    btn.classList.add('active'); _filterStatus = btn.dataset.val; _page = 0; _renderTable()
  })

  _updateHandler = () => { _renderCarousels(); _updateFlowCounts(); _renderTable() }
  onSimUpdate('baggage', _updateHandler)
}

export function destroyBaggage() { if (_updateHandler) offSimUpdate('baggage', _updateHandler) }

function _updateFlowCounts() {
  const bags = store.baggage
  const loaded = bags.filter(b => b.status === 'Loaded').length
  const transit = bags.filter(b => b.status === 'In Transit').length
  const onbelt = bags.filter(b => b.status === 'On Belt').length
  const checkin = bags.filter(b => b.status === 'Check-In' || b.status === 'Delayed').length || (bags.length - loaded - transit - onbelt)
  const mish = bags.filter(b => b.mishandled).length

  animateCount(document.getElementById('flow-checkin'), Math.max(0, checkin))
  animateCount(document.getElementById('flow-transit'), transit)
  animateCount(document.getElementById('flow-onbelt'), onbelt)
  animateCount(document.getElementById('flow-loaded'), loaded)
  animateCount(document.getElementById('flow-mish'), mish)
}

function _renderCarousels() {
  const el = document.getElementById('carousel-grid')
  if (!el) return
  const carouselData = {}
  for (let i = 1; i <= 10; i++) carouselData[i] = { bags: 0 }
  store.baggage.forEach(b => {
    const c = b.carousel
    if (c >= 1 && c <= 10) carouselData[c].bags++
  })
  el.innerHTML = Object.entries(carouselData).map(([num, d]) => `
    <div class="carousel-cell">
      <div class="carousel-num">CAROUSEL ${num}</div>
      <div class="carousel-bags">${d.bags}</div>
      <div class="carousel-label">BAGS ON BELT</div>
    </div>
  `).join('')
}

function _renderTable() {
  let data = store.baggage
  if (_searchVal) data = data.filter(b =>
    b.tag_id?.toLowerCase().includes(_searchVal) ||
    b.flight_id?.toLowerCase().includes(_searchVal) ||
    b.pnr_code?.toLowerCase().includes(_searchVal)
  )
  if (_filterStatus !== 'all') data = data.filter(b => b.status === _filterStatus)
  const start = _page * PAGE_SIZE
  const rows = data.slice(start, start + PAGE_SIZE)
  const tbody = document.getElementById('bg-tbody')
  if (!tbody) return
  tbody.innerHTML = rows.map(b => `
    <tr class="${b.mishandled ? 'alert-row' : ''}">
      <td class="mono bright neon">${b.tag_id}</td>
      <td class="mono bright">${b.flight_id}</td>
      <td class="mono dim">${b.pnr_code}</td>
      <td class="mono">${fmtWeight(b.weight_kg)}</td>
      <td class="mono bright">${b.carousel}</td>
      <td><span class="chip ${statusBadgeClass(b.status)}">${b.status}</span></td>
      <td class="dim">${b.area || '--'}</td>
      <td class="mono dim">${fmtTime(b.scan_time)}</td>
      <td>${b.mishandled ? '<span class="chip red">⚠ MISHANDLED</span>' : '<span class="chip acid">OK</span>'}</td>
    </tr>
  `).join('')
  const pageInfo = document.getElementById('bg-page-info')
  const pagination = document.getElementById('bg-pagination')
  if (pageInfo) pageInfo.textContent = `DISPLAYING ${start+1}–${Math.min(start+PAGE_SIZE, data.length)} OF ${data.length} BAGS`
  if (pagination) {
    const tp = Math.ceil(data.length / PAGE_SIZE)
    pagination.innerHTML = Array.from({length:Math.min(tp,8)},(_,i)=>
      `<button class="pg-btn ${i===_page?'active':''}" data-p="${i}">${i+1}</button>`
    ).join('')
    pagination.querySelectorAll('.pg-btn').forEach(btn =>
      btn.addEventListener('click',()=>{ _page=parseInt(btn.dataset.p); _renderTable() })
    )
  }
}
