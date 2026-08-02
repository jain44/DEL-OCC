// ═══════════════════════════════════════════════════════════════
// OVERVIEW VIEW — COMMAND CENTER OPERATIONAL DASHBOARD
// Redesigned: Bento KPI Grid · Labeled Donuts · Live Feed
// ═══════════════════════════════════════════════════════════════
import { store } from '../data/store.js'
import { onSimUpdate, offSimUpdate } from '../data/simulator.js'
import { fmtCurrency, fmtNumber, animateCount, statusBadgeClass, fmtTime } from '../utils/format.js'

let charts = {}
let _updateHandler = null

export function renderOverview(container) {
  container.innerHTML = `
    <!-- VIEW HEADER -->
    <div class="view-hd">
      <div class="view-hd-left">
        <div class="view-hd-icon">⚡</div>
        <div>
          <h1>COMMAND OVERVIEW &amp; OPERATIONAL MATRIX</h1>
          <div class="view-hd-sub">DEL TERMINAL 3 · REAL-TIME TELEMETRY STREAM</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        LIVE TELEMETRY STREAM
      </div>
    </div>

    <!-- BENTO KPI GRID — asymmetric, consequential metrics get more weight -->
    <div class="ov-bento">
      <!-- Hero: On-Time Performance — the most operationally consequential KPI -->
      <div class="kpi-tile ov-bento-hero" style="--accent: var(--accent-emerald)">
        <div class="kpi-label">ON-TIME PERFORMANCE</div>
        <div class="kpi-value" data-accent="acid" id="ov-kpi-ontime">0%</div>
        <div class="kpi-sub">Flights on schedule today</div>
        <div style="margin-top: 10px; height: 4px; background: var(--bg-elevated); border-radius: 2px; overflow:hidden">
          <div id="ov-otp-bar" style="height:100%; background: var(--accent-emerald); border-radius:2px; transition: width 0.6s ease; width: 0%"></div>
        </div>
        <div class="kpi-glyph">✅</div>
      </div>

      <!-- Incidents & Alerts — next most consequential -->
      <div class="kpi-tile" style="--accent: var(--accent-rose)">
        <div class="kpi-label">INCIDENTS &amp; ALERTS</div>
        <div class="kpi-value" data-accent="red" id="ov-kpi-alerts">0</div>
        <div class="kpi-sub">Active operational flags</div>
        <div class="kpi-glyph">🚨</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-blue)">
        <div class="kpi-label">TOTAL FLIGHTS</div>
        <div class="kpi-value" data-accent="neon" id="ov-kpi-flights">0</div>
        <div class="kpi-sub">Active departures today</div>
        <div class="kpi-glyph">✈</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-amber)">
        <div class="kpi-label">AVG DELAY</div>
        <div class="kpi-value" data-accent="amber" id="ov-kpi-delay">0m</div>
        <div class="kpi-sub">Across delayed flights</div>
        <div class="kpi-glyph">⏱</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-blue)">
        <div class="kpi-label">PASSENGERS</div>
        <div class="kpi-value" id="ov-kpi-pax">0</div>
        <div class="kpi-sub">Processed in window</div>
        <div class="kpi-glyph">👥</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-emerald)">
        <div class="kpi-label">BAGS LOADED</div>
        <div class="kpi-value" id="ov-kpi-bags">0</div>
        <div class="kpi-sub">Checked baggage items</div>
        <div class="kpi-glyph">🧳</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-purple)">
        <div class="kpi-label">SECURITY THROUGHPUT</div>
        <div class="kpi-value" id="ov-kpi-sec">0/hr</div>
        <div class="kpi-sub">Avg 8 screening lanes</div>
        <div class="kpi-glyph">🔐</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-emerald)">
        <div class="kpi-label">RETAIL REVENUE</div>
        <div class="kpi-value" data-accent="acid" id="ov-kpi-rev">₹0</div>
        <div class="kpi-sub">Pre-flight purchases</div>
        <div class="kpi-glyph">🛍</div>
      </div>
    </div>

    <!-- MAIN MATRIX LAYOUT -->
    <div class="g21">
      
      <!-- LEFT COLUMN -->
      <div class="gc">
        
        <!-- Flight status chart & Legend -->
        <div class="panel">
          <div class="panel-hd">
            <div class="panel-hd-label">
              <div class="dot-live"></div>
              FLIGHT STATUS DISTRIBUTION
            </div>
            <span class="mono text-muted" style="font-size:0.75rem">REAL-TIME</span>
          </div>
          <div class="panel-bd" style="display:grid; grid-template-columns: 200px 1fr; gap: 20px; align-items: center">
            <div style="width:200px; height:200px; position:relative; display:flex; align-items:center; justify-content:center">
              <canvas id="ov-status-chart"></canvas>
              <div style="position:absolute; text-align:center; pointer-events:none">
                <div style="font-family:var(--font-display); font-size:2rem; font-weight:800; letter-spacing:-0.04em; color:var(--text-main)" id="ov-total-count">0</div>
                <div style="font-size:0.7rem; color:var(--text-muted); font-weight:600; letter-spacing:0.05em">FLIGHTS</div>
              </div>
            </div>
            <div id="ov-status-legend" class="gc" style="gap:8px"></div>
          </div>
        </div>

        <!-- Airline OTP Bar Chart -->
        <div class="panel">
          <div class="panel-hd">
            <div class="panel-hd-label">📊 AIRLINE ON-TIME PERFORMANCE (OTP %)</div>
          </div>
          <div class="panel-bd" style="height: 200px">
            <canvas id="ov-airline-chart"></canvas>
          </div>
        </div>

        <!-- Recent Flight Activity Feed -->
        <div class="panel">
          <div class="panel-hd">
            <div class="panel-hd-label">
              <div class="dot-live"></div>
              LIVE DEPARTURE MONITOR
            </div>
            <span class="text-muted" style="font-size:0.75rem">CLICK ROW FOR FLIGHT TELEMETRY</span>
          </div>
          <div class="panel-bd nopad">
            <div id="ov-flight-feed" style="max-height:240px; overflow-y:auto; padding:6px"></div>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN -->
      <div class="gc">
        
        <!-- Delay Causes — LABELED DONUT -->
        <div class="panel">
          <div class="panel-hd">
            <div class="panel-hd-label">⏱ DELAY CAUSE MATRIX</div>
          </div>
          <div class="panel-bd">
            <div id="ov-delay-legend" style="display:flex; flex-direction:column; gap:6px"></div>
          </div>
        </div>

        <!-- Security Lanes Mini Bar Strip -->
        <div class="panel">
          <div class="panel-hd">
            <div class="panel-hd-label">🔐 SECURITY LANE QUEUE SPECTRUM</div>
          </div>
          <div class="panel-bd">
            <div id="ov-sec-lanes" class="lane-grid"></div>
          </div>
        </div>

        <!-- Staff Coverage -->
        <div class="panel">
          <div class="panel-hd">
            <div class="panel-hd-label">👔 STAFF DEPLOYMENT</div>
          </div>
          <div class="panel-bd" id="ov-staff-panel" style="display:flex; flex-direction:column; gap:8px"></div>
        </div>

      </div>

    </div>

    <!-- BOTTOM ROW: BAGGAGE + RETAIL SPECTRUMS -->
    <div class="g2">
      <div class="panel">
        <div class="panel-hd">
          <div class="panel-hd-label">🧳 BAGGAGE HANDLING METRICS</div>
        </div>
        <div class="panel-bd" style="height:160px">
          <canvas id="ov-bag-chart"></canvas>
        </div>
      </div>

      <div class="panel">
        <div class="panel-hd">
          <div class="panel-hd-label">🛍 RETAIL HOURLY VELOCITY</div>
        </div>
        <div class="panel-bd" style="height:160px">
          <canvas id="ov-retail-chart"></canvas>
        </div>
      </div>
    </div>
  `

  _initCharts()
  _updateOverview()

  _updateHandler = () => _updateOverview()
  onSimUpdate('overview', _updateHandler)
  onSimUpdate('flights', _updateHandler)
}

export function destroyOverview() {
  if (_updateHandler) offSimUpdate('overview', _updateHandler)
  Object.values(charts).forEach(c => c?.destroy?.())
  charts = {}
}

function _initCharts() {
  const chartDefaults = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10
      }
    },
    animation: { duration: 600, easing: 'easeInOutQuart' }
  }

  const statusCtx = document.getElementById('ov-status-chart')
  if (statusCtx) {
    charts.status = new Chart(statusCtx, {
      type: 'doughnut',
      data: { labels: [], datasets: [{ data: [], backgroundColor: [], borderWidth: 0, hoverOffset: 6 }] },
      options: { ...chartDefaults, cutout: '74%', responsive: true, maintainAspectRatio: true }
    })
  }

  const airlineCtx = document.getElementById('ov-airline-chart')
  if (airlineCtx) {
    charts.airline = new Chart(airlineCtx, {
      type: 'bar',
      data: { labels: [], datasets: [{ data: [], backgroundColor: '#38bdf8', borderRadius: 4 }] },
      options: {
        ...chartDefaults, indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' }, max: 100 },
          y: { grid: { display: false }, ticks: { color: '#f8fafc' } }
        },
        plugins: {
          ...chartDefaults.plugins,
          datalabels: false
        }
      }
    })
  }

  const bagCtx = document.getElementById('ov-bag-chart')
  if (bagCtx) {
    charts.bag = new Chart(bagCtx, {
      type: 'bar',
      data: {
        labels: ['Loaded', 'In Transit', 'On Belt', 'Delayed', 'Mishandled'],
        datasets: [{ data: [], backgroundColor: ['#34d399','#38bdf8','#fbbf24','#f97316','#f43f5e'], borderWidth: 0, borderRadius: 4 }]
      },
      options: {
        ...chartDefaults, responsive: true, maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#94a3b8' }
          }
        }
      }
    })
  }

  const retailCtx = document.getElementById('ov-retail-chart')
  if (retailCtx) {
    const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2,'0')}:00`)
    const data = hours.map(() => Math.floor(Math.random() * 200000 + 20000))
    charts.retail = new Chart(retailCtx, {
      type: 'line',
      data: {
        labels: hours,
        datasets: [{
          data, borderColor: '#34d399', borderWidth: 2,
          fill: true, backgroundColor: 'rgba(52,211,153,0.08)',
          tension: 0.4, pointRadius: 0
        }]
      },
      options: {
        ...chartDefaults, responsive: true, maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', maxTicksLimit: 8 } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', callback: v => '₹' + (v/1000).toFixed(0) + 'K' } }
        }
      }
    })
  }
}

function _updateOverview() {
  const flights = store.flights
  const pax = store.passengers
  const bags = store.baggage
  const sec = store.security_screening
  const retail = store.retail_transactions
  const staff = store.staff_shifts

  const delayed = flights.filter(f => f.delay_mins > 0)
  const onTime = flights.filter(f => f.delay_mins === 0)
  const avgDelay = delayed.length ? Math.round(delayed.reduce((s,f) => s + parseInt(f.delay_mins||0), 0) / delayed.length) : 0
  const totalRev = retail.reduce((s, t) => s + parseInt(t.total_amount||0), 0)
  const avgThroughput = Math.round(sec.reduce((s,s2) => s + (parseInt(s2.throughput_per_hr)||300), 0) / (sec.length || 1))

  // KPI updates
  animateCount(document.getElementById('ov-kpi-flights'), flights.length)
  const onTimePct = Math.round(onTime.length / (flights.length || 1) * 100)
  const el = document.getElementById('ov-kpi-ontime')
  if (el) animateCount(el, onTimePct, 800, '', '%')

  // OTP progress bar
  const otpBar = document.getElementById('ov-otp-bar')
  if (otpBar) {
    otpBar.style.width = onTimePct + '%'
    otpBar.style.background = onTimePct >= 80 ? 'var(--accent-emerald)' : onTimePct >= 60 ? 'var(--accent-amber)' : 'var(--accent-rose)'
  }

  animateCount(document.getElementById('ov-kpi-delay'), avgDelay, 800, '+', 'm')
  animateCount(document.getElementById('ov-kpi-pax'), pax.length)
  const bagsLoaded = bags.filter(b => b.status === 'Loaded').length
  animateCount(document.getElementById('ov-kpi-bags'), bagsLoaded)
  animateCount(document.getElementById('ov-kpi-sec'), avgThroughput, 800, '', '/hr')
  
  const revEl = document.getElementById('ov-kpi-rev')
  if (revEl) { revEl.textContent = fmtCurrency(totalRev); revEl.dataset.val = totalRev }

  // Flight Status donut
  const statusGroups = {}
  flights.forEach(f => {
    const s = f._simStatus || 'Scheduled'
    statusGroups[s] = (statusGroups[s] || 0) + 1
  })
  const statusColorMap = {
    'Scheduled': '#8B96AB', 'Check-In Open': '#4FA8FF', 'Boarding': '#FFB454',
    'Gate Closing': '#f97316', 'Departed': '#3DD68C', 'Arrived': '#63D9E8',
    'Delayed': '#FF5470', 'Cancelled': '#B98CFF'
  }
  const labels = Object.keys(statusGroups)
  const data = Object.values(statusGroups)
  const colors = labels.map(l => statusColorMap[l] || '#8B96AB')
  const total = data.reduce((a,b) => a+b, 0)

  if (charts.status) {
    charts.status.data.labels = labels
    charts.status.data.datasets[0].data = data
    charts.status.data.datasets[0].backgroundColor = colors
    charts.status.update('none')
  }

  const totalEl = document.getElementById('ov-total-count')
  if (totalEl) totalEl.textContent = fmtNumber(flights.length)

  // Legend with count + % labels (the "real dashboard" fix)
  const legend = document.getElementById('ov-status-legend')
  if (legend) {
    legend.innerHTML = labels.map((l, i) => `
      <div style="display:flex; align-items:center; gap:8px">
        <div style="width:8px; height:8px; border-radius:2px; background:${colors[i]}; flex-shrink:0"></div>
        <span style="font-size:0.8rem; color:var(--text-main); flex:1">${l}</span>
        <span style="font-family:var(--font-mono); font-size:0.78rem; color:var(--text-muted)">${Math.round(data[i]/total*100)}%</span>
        <span style="font-family:var(--font-mono); font-size:0.78rem; color:var(--text-main); font-weight:700; min-width:36px; text-align:right">${data[i]}</span>
      </div>
    `).join('')
  }

  // Airline OTP bar chart
  const airlineStats = {}
  flights.forEach(f => {
    if (!airlineStats[f.airline]) airlineStats[f.airline] = { total: 0, onTime: 0 }
    airlineStats[f.airline].total++
    if (f.delay_mins == 0) airlineStats[f.airline].onTime++
  })
  const sortedAirlines = Object.entries(airlineStats)
    .map(([name, s]) => ({ name, pct: Math.round(s.onTime / s.total * 100) }))
    .sort((a, b) => b.pct - a.pct).slice(0, 8)

  if (charts.airline) {
    charts.airline.data.labels = sortedAirlines.map(a => a.name)
    charts.airline.data.datasets[0].data = sortedAirlines.map(a => a.pct)
    charts.airline.data.datasets[0].backgroundColor = sortedAirlines.map(a =>
      a.pct >= 80 ? '#34d399' : a.pct >= 60 ? '#fbbf24' : '#f43f5e'
    )
    charts.airline.update()
  }

  // Delay Cause — labeled list instead of un-labeled donut
  const delayCauses = { ATC: 0, CREW: 0, TECH: 0, WX: 0, TURNAROUND: 0 }
  flights.forEach(f => { if (f.delay_reason && delayCauses[f.delay_reason] !== undefined) delayCauses[f.delay_reason]++ })
  const causeColors = { ATC: '#FF5470', CREW: '#FFB454', TECH: '#B98CFF', WX: '#4FA8FF', TURNAROUND: '#3DD68C' }
  const causeTotal = Object.values(delayCauses).reduce((a,b) => a+b, 0) || 1
  const delayLegend = document.getElementById('ov-delay-legend')
  if (delayLegend) {
    delayLegend.innerHTML = Object.entries(delayCauses).map(([cause, count]) => {
      const pct = Math.round(count / causeTotal * 100)
      const color = causeColors[cause]
      return `
        <div style="display:flex; flex-direction:column; gap:4px">
          <div style="display:flex; align-items:center; justify-content:space-between">
            <div style="display:flex; align-items:center; gap:6px">
              <div style="width:10px; height:10px; border-radius:2px; background:${color}; flex-shrink:0"></div>
              <span style="font-family:var(--font-mono); font-size:0.72rem; font-weight:700; color:var(--text-main)">${cause}</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px">
              <span style="font-family:var(--font-mono); font-size:0.8rem; font-weight:700; color:${color}">${pct}%</span>
              <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--text-muted)">${count}</span>
            </div>
          </div>
          <div style="height:6px; background:var(--bg-elevated); border-radius:3px; overflow:hidden">
            <div style="height:100%; width:${pct}%; background:${color}; border-radius:3px; transition:width 0.4s ease"></div>
          </div>
        </div>
      `
    }).join('')
  }

  // Baggage bar chart
  const bagStats = { Loaded: 0, 'In Transit': 0, 'On Belt': 0, Delayed: 0, Mishandled: 0 }
  bags.forEach(b => { if (bagStats[b.status] !== undefined) bagStats[b.status]++ })
  if (charts.bag) {
    charts.bag.data.datasets[0].data = Object.values(bagStats)
    charts.bag.update()
  }

  // Security lanes
  const laneData = {}
  sec.forEach(s => {
    const l = parseInt(s.lane)
    if (l >= 1 && l <= 8) {
      if (!laneData[l]) laneData[l] = { queues: [] }
      laneData[l].queues.push(parseInt(s.queue_length) || 50)
    }
  })
  const secEl = document.getElementById('ov-sec-lanes')
  if (secEl) {
    secEl.innerHTML = Array.from({ length: 8 }, (_, i) => {
      const l = i + 1
      const d = laneData[l]
      const avgQ = d ? Math.round(d.queues.reduce((s,x) => s+x,0) / d.queues.length) : Math.floor(Math.random()*100)
      const pct = Math.min(100, avgQ)
      const color = pct > 70 ? 'var(--accent-rose)' : pct > 40 ? 'var(--accent-amber)' : 'var(--accent-emerald)'
      return `
        <div class="lane-card">
          <div class="lane-num">L${l}</div>
          <div class="lane-qbar-wrap">
            <div class="lane-qbar-fill" style="height:${pct}%; background:${color}"></div>
          </div>
          <div style="font-family:var(--font-mono); font-size:0.75rem; color:${color}; font-weight:700">${avgQ}</div>
        </div>
      `
    }).join('')
  }

  // Staff deployment
  const deptCount = {}
  staff.forEach(s => { deptCount[s.dept] = (deptCount[s.dept] || 0) + 1 })
  const staffEl = document.getElementById('ov-staff-panel')
  if (staffEl) {
    staffEl.innerHTML = Object.entries(deptCount).map(([d, n]) => `
      <div style="display:flex; align-items:center; justify-content:space-between">
        <span style="font-size:0.82rem; color:var(--text-main); font-weight:500">${d}</span>
        <span class="chip neon" style="font-size:0.7rem">${n} STAFF</span>
      </div>
    `).join('')
  }

  // Live departure feed
  const feedEl = document.getElementById('ov-flight-feed')
  if (feedEl) {
    const recent = flights.slice(0, 10)
    feedEl.innerHTML = recent.map(f => {
      const cls = statusBadgeClass(f._simStatus || 'Scheduled')
      return `
        <div style="display:flex; align-items:center; gap:12px; padding:8px 12px; border-bottom:1px solid var(--border-subtle); cursor:pointer" onclick="window._openFlightModal?.('${f.flight_id}')">
          <span class="chip ${cls}" style="min-width:100px; justify-content:center">${f._simStatus || 'Scheduled'}</span>
          <span class="mono text-accent" style="font-weight:700; min-width:65px">${f.flight_id}</span>
          <span style="font-size:0.82rem; color:var(--text-main); flex:1">${f.airline} → ${f.destination}</span>
          <span style="font-family:var(--font-mono); font-size:0.78rem; color:var(--text-muted)">${fmtTime(f.sched_dep)}</span>
          ${f.delay_mins > 0 ? `<span class="chip red" style="font-size:0.68rem">+${f.delay_mins}m</span>` : ''}
        </div>
      `
    }).join('')
  }
}
