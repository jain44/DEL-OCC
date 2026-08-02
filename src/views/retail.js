// ═══════════════════════════════════════════════════════════════
// RETAIL VIEW — Commerce Analytics & Labeled Charts
// Redesigned: Axis Scale + Value Labels for Top Items & Labeled Payment Donut
// ═══════════════════════════════════════════════════════════════
import { store } from '../data/store.js'
import { onSimUpdate, offSimUpdate } from '../data/simulator.js'
import { fmtCurrency, fmtTime, fmtNumber, animateCount } from '../utils/format.js'

let _updateHandler = null
let _page = 0
const PAGE_SIZE = 40

export function renderRetail(container) {
  const txns = store.retail_transactions
  const totalRev = txns.reduce((s, t) => s + parseInt(t.total_amount||0), 0)
  const avgTxn = Math.round(totalRev / (txns.length || 1))

  const itemCounts = {}
  txns.forEach(t => { itemCounts[t.item] = (itemCounts[t.item]||0) + 1 })
  const topItems = Object.entries(itemCounts).sort((a,b)=>b[1]-a[1]).slice(0,5)

  const hourlyRev = Array(24).fill(0)
  txns.forEach(t => {
    try { const h = new Date(t.txn_time).getHours(); hourlyRev[h] += parseInt(t.total_amount||0) }
    catch {}
  })

  container.innerHTML = `
    <!-- HEADER -->
    <div class="view-hd">
      <div class="view-hd-left">
        <div class="view-hd-icon">🛍</div>
        <div>
          <h1>RETAIL REVENUE &amp; COMMERCE</h1>
          <div class="view-hd-sub">${txns.length} TRANSACTIONS · ${fmtCurrency(totalRev)} TOTAL REVENUE</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        LIVE COMMERCE STREAM
      </div>
    </div>

    <!-- KPI STRIP -->
    <div class="kpi-row">
      <div class="kpi-tile" style="--accent: var(--accent-emerald)">
        <div class="kpi-label">TOTAL REVENUE</div>
        <div class="kpi-value" data-accent="acid" id="ret-total">${fmtCurrency(totalRev)}</div>
        <div class="kpi-sub">Today's airside sales</div>
        <div class="kpi-glyph">💰</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-blue)">
        <div class="kpi-label">TRANSACTIONS</div>
        <div class="kpi-value" data-accent="neon" id="ret-count">${txns.length}</div>
        <div class="kpi-sub">Total receipts</div>
        <div class="kpi-glyph">🧾</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-amber)">
        <div class="kpi-label">AVG TRANSACTION</div>
        <div class="kpi-value" data-accent="amber">₹${fmtNumber(avgTxn)}</div>
        <div class="kpi-sub">Basket size average</div>
        <div class="kpi-glyph">📊</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-purple)">
        <div class="kpi-label">TOP CATEGORY</div>
        <div class="kpi-value" style="font-size: 1.4rem; color: var(--accent-purple)">${topItems[0]?.[0] || 'Duty Free'}</div>
        <div class="kpi-sub">Highest volume item</div>
        <div class="kpi-glyph">🏆</div>
      </div>
    </div>

    <!-- MAIN GRID -->
    <div class="g21">
      <!-- LEFT: Live feed -->
      <div class="panel">
        <div class="panel-hd">
          <div class="panel-hd-label">💳 LIVE TRANSACTION FEED</div>
          <span class="live-tag"><span class="live-dot"></span> REAL-TIME</span>
        </div>
        <div class="panel-bd nopad">
          <div id="ret-feed" style="padding: 12px; max-height: 420px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px"></div>
        </div>
      </div>

      <!-- RIGHT: Charts with direct labels & axis scale -->
      <div class="gc">
        <div class="panel">
          <div class="panel-hd">
            <div class="panel-hd-label">🏆 TOP ITEMS BY VOLUME</div>
            <span class="mono text-muted" style="font-size:0.7rem">REAL SALES UNITS</span>
          </div>
          <div class="panel-bd" style="height: 180px"><canvas id="ret-items-chart"></canvas></div>
        </div>

        <div class="panel">
          <div class="panel-hd"><div class="panel-hd-label">💳 PAYMENT METHOD SPLIT</div></div>
          <div class="panel-bd" style="display:flex; flex-direction:column; gap:12px; align-items:center">
            <div style="width:130px; height:130px; position:relative">
              <canvas id="ret-payment-chart"></canvas>
            </div>
            <div id="ret-pay-legend" style="width:100%; display:flex; flex-direction:column; gap:4px"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- HOURLY CHART -->
    <div class="panel">
      <div class="panel-hd"><div class="panel-hd-label">📈 HOURLY REVENUE VELOCITY</div></div>
      <div class="panel-bd" style="height: 180px"><canvas id="ret-hourly-chart"></canvas></div>
    </div>

    <!-- CONTROLS & TABLE -->
    <div class="ctrl-bar">
      <div class="search-box">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input id="ret-search" placeholder="SEARCH ITEM, PNR, SHOP NAME..." />
      </div>
    </div>

    <div class="panel">
      <div class="panel-bd nopad">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>TXN ID</th><th>SHOP NAME</th><th>ITEM</th><th>PNR</th><th>FLIGHT</th><th>AMOUNT</th><th>QTY</th><th>PAYMENT</th><th>TIME</th><th>AIRSIDE</th>
              </tr>
            </thead>
            <tbody id="ret-tbody"></tbody>
          </table>
        </div>
        <div class="tbl-foot">
          <span class="page-info" id="ret-page-info"></span>
          <div class="pagination" id="ret-pagination"></div>
        </div>
      </div>
    </div>
  `

  _renderRetailCharts(topItems, hourlyRev)
  _renderRetailTable()

  const initial = store.retail_transactions.slice(0, 6)
  initial.forEach(t => _addFeedItem(t))

  document.getElementById('ret-search')?.addEventListener('input', e => {
    window._ret_search = e.target.value.toLowerCase(); _page = 0; _renderRetailTable()
  })

  _updateHandler = (txn) => {
    _addFeedItem(txn)
    const el = document.getElementById('ret-count')
    if (el) { const cur = parseInt(el.dataset.val || store.retail_transactions.length); animateCount(el, cur + 1) }
  }
  onSimUpdate('retail_txn', _updateHandler)
}

export function destroyRetail() {
  if (_updateHandler) offSimUpdate('retail_txn', _updateHandler)
}

function _addFeedItem(txn) {
  const feed = document.getElementById('ret-feed')
  if (!feed) return
  const item = document.createElement('div')
  item.style.cssText = 'display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:var(--bg-dark); border:1px solid var(--border-subtle); border-radius:8px;'
  item.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px">
      <div style="font-family:var(--font-display); font-size:1rem; font-weight:800; color:var(--accent-emerald)">${fmtCurrency(txn.total_amount)}</div>
      <div>
        <div style="font-weight:600; color:var(--text-main); font-size:0.85rem">${txn.item}</div>
        <div style="font-size:0.75rem; color:var(--text-muted)">${txn.shop_name}</div>
      </div>
    </div>
    <div style="text-align:right">
      <div class="chip neon" style="font-size:0.7rem">${txn.flight_id}</div>
      <div style="font-family:var(--font-mono); font-size:0.7rem; color:var(--text-dim); margin-top:2px">${fmtTime(txn.txn_time)}</div>
    </div>
  `
  feed.insertBefore(item, feed.firstChild)
  while (feed.children.length > 12) feed.removeChild(feed.lastChild)
}

function _renderRetailCharts(topItems, hourlyRev) {
  const itemsCtx = document.getElementById('ret-items-chart')
  if (itemsCtx) {
    const maxVal = Math.max(...topItems.map(x => x[1]), 10)
    new Chart(itemsCtx, {
      type: 'bar', data: {
        labels: topItems.map(x => x[0]),
        datasets: [{ data: topItems.map(x => x[1]), backgroundColor: ['#00E5C7','#7C8CFF','#B98CFF','#FFB454','#FF7A9C'], borderRadius: 4 }]
      },
      options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8B96AB' }, max: Math.ceil(maxVal * 1.15) },
          y: { grid: { display: false }, ticks: { color: '#E8EDF5' } }
        }
      }
    })
  }

  const payCtx = document.getElementById('ret-payment-chart')
  if (payCtx) {
    const pay = {}
    store.retail_transactions.forEach(t => { pay[t.payment_method] = (pay[t.payment_method]||0)+1 })
    const total = Object.values(pay).reduce((a,b) => a+b, 0) || 1
    const colors = ['#4FA8FF','#3DD68C','#B98CFF','#FFB454']

    new Chart(payCtx, {
      type: 'doughnut', data: {
        labels: Object.keys(pay),
        datasets: [{ data: Object.values(pay), backgroundColor: colors, borderWidth: 0 }]
      },
      options: { cutout: '70%', responsive: true, maintainAspectRatio: true,
        plugins: { legend: { display: false } }
      }
    })

    const legend = document.getElementById('ret-pay-legend')
    if (legend) {
      legend.innerHTML = Object.entries(pay).map(([method, count], idx) => {
        const pct = Math.round(count / total * 100)
        const color = colors[idx % colors.length]
        return `
          <div style="display:flex; align-items:center; justify-content:space-between">
            <div style="display:flex; align-items:center; gap:6px">
              <div style="width:8px; height:8px; border-radius:2px; background:${color}"></div>
              <span style="font-size:0.75rem; color:var(--text-main)">${method}</span>
            </div>
            <span style="font-family:var(--font-mono); font-size:0.75rem; font-weight:700; color:${color}">${pct}%</span>
          </div>
        `
      }).join('')
    }
  }

  const hourlyCtx = document.getElementById('ret-hourly-chart')
  if (hourlyCtx) {
    new Chart(hourlyCtx, {
      type: 'line', data: {
        labels: Array.from({length:24},(_,i)=>`${String(i).padStart(2,'0')}:00`),
        datasets: [{ data: hourlyRev, borderColor: '#34d399', borderWidth: 2, fill: true, backgroundColor: 'rgba(52,211,153,0.1)', tension: 0.4 }]
      },
      options: { responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false }, ticks: { color: '#94a3b8' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', callback: v => '₹' + (v/1000).toFixed(0) + 'K' } } }
      }
    })
  }
}

function _renderRetailTable() {
  let data = store.retail_transactions
  const search = window._ret_search || ''
  if (search) data = data.filter(t => t.item?.toLowerCase().includes(search) || t.pnr_code?.toLowerCase().includes(search) || t.shop_name?.toLowerCase().includes(search))
  if (data.length === 0) return
  const start = _page * PAGE_SIZE
  const rows = data.slice(start, start + PAGE_SIZE)
  const tbody = document.getElementById('ret-tbody')
  if (!tbody) return
  tbody.innerHTML = rows.map(t => `
    <tr>
      <td class="mono dim">${t.txn_id?.slice(0,16)}</td>
      <td class="bright">${t.shop_name}</td>
      <td class="bright text-accent">${t.item}</td>
      <td class="mono dim">${t.pnr_code}</td>
      <td class="mono bright">${t.flight_id}</td>
      <td class="mono bright text-emerald">${fmtCurrency(t.total_amount)}</td>
      <td class="mono">${t.quantity}</td>
      <td><span class="chip neon">${t.payment_method}</span></td>
      <td class="mono dim">${fmtTime(t.txn_time)}</td>
      <td>${t.is_airside ? '<span class="chip green">AIRSIDE</span>' : ''}</td>
    </tr>
  `).join('')
  const pageInfo = document.getElementById('ret-page-info')
  const pagination = document.getElementById('ret-pagination')
  if (pageInfo) pageInfo.textContent = `Showing ${start+1}–${Math.min(start+PAGE_SIZE,data.length)} of ${data.length} transactions`
  if (pagination) {
    const tp = Math.ceil(data.length / PAGE_SIZE)
    pagination.innerHTML = Array.from({length:Math.min(tp,8)},(_,i)=>`<button class="pg-btn ${i===_page?'active':''}" data-p="${i}">${i+1}</button>`).join('')
    pagination.querySelectorAll('.pg-btn').forEach(btn=>btn.addEventListener('click',()=>{_page=parseInt(btn.dataset.p);_renderRetailTable()}))
  }
}
