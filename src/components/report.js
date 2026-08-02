// ═══════════════════════════════════════════════════════════════
// SHIFT HANDOVER REPORT GENERATOR — Executive Summary Modal
// Generates printable operational handover report
// ═══════════════════════════════════════════════════════════════
import { store } from '../data/store.js'
import { alertStore } from '../utils/alerts.js'
import { openModal } from '../views/modal.js'
import { fmtCurrency, fmtNumber } from '../utils/format.js'

export function generateShiftReport() {
  const flights = store.flights
  const totalRev = store.retail_transactions.reduce((s, t) => s + parseInt(t.total_amount||0), 0)
  const delayed = flights.filter(f => f.delay_mins > 0)
  const onTimePct = Math.round((flights.filter(f=>f.delay_mins===0).length / (flights.length||1)) * 100)
  const mishandledBags = store.baggage.filter(b=>b.mishandled).length
  const openMaint = store.maintenance_logs.filter(m=>!m.resolved).length

  const reportDate = new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const body = `
    <div style="background:var(--bg-dark); border:1px solid var(--border-subtle); padding:20px; border-radius:12px; font-family:var(--font-ui)">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--accent-blue); padding-bottom:12px; margin-bottom:16px">
        <div>
          <div style="font-family:var(--font-display); font-size:1.3rem; font-weight:800; color:var(--text-main)">DEL OCC — SHIFT HANDOVER REPORT</div>
          <div style="font-size:0.78rem; color:var(--text-muted)">INDIRA GANDHI INTL AIRPORT · TERMINAL 3 COMMAND CENTER</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono); font-size:0.8rem; color:var(--accent-blue); font-weight:600">${reportDate}</div>
          <div class="chip green" style="margin-top:4px">SHIFT COMPLETE</div>
        </div>
      </div>

      <div class="stat-strip mb16" style="justify-content:space-between">
        <div class="stat-pill"><span class="sv text-accent">${flights.length}</span><span class="sl">TOTAL FLIGHTS</span></div>
        <div class="stat-pill"><span class="sv text-emerald">${onTimePct}%</span><span class="sl">ON-TIME RATE</span></div>
        <div class="stat-pill"><span class="sv text-rose">${delayed.length}</span><span class="sl">DELAYED</span></div>
        <div class="stat-pill"><span class="sv text-emerald">${fmtCurrency(totalRev)}</span><span class="sl">RETAIL REV</span></div>
        <div class="stat-pill"><span class="sv text-purple">${store.passengers.length}</span><span class="sl">PASSENGERS</span></div>
      </div>

      <div class="modal-sect">
        <div class="modal-sect-title">CRITICAL EXCEPTIONS SUMMARY</div>
        <div class="info-grid">
          <div class="info-item"><div class="l">Mishandled Baggage</div><div class="v ${mishandledBags>0?'text-rose':'text-emerald'}">${mishandledBags} Items</div></div>
          <div class="info-item"><div class="l">Open Maintenance Orders</div><div class="v ${openMaint>0?'text-amber':'text-emerald'}">${openMaint} Pending</div></div>
          <div class="info-item"><div class="l">Total Shift Incidents</div><div class="v">${alertStore.length} Alerts</div></div>
        </div>
      </div>

      <div class="modal-sect">
        <div class="modal-sect-title">RECENT OPERATIONAL INCIDENTS</div>
        <div style="display:flex; flex-direction:column; gap:6px; max-height:180px; overflow-y:auto">
          ${alertStore.length ? alertStore.slice(0, 5).map(a => `
            <div style="padding:8px 12px; background:var(--bg-surface); border-left:3px solid ${a.type==='critical'?'var(--accent-rose)':'var(--accent-amber)'}; border-radius:4px; font-size:0.78rem">
              <span style="font-weight:700; color:var(--text-main)">${a.title}</span> — ${a.msg}
            </div>
          `).join('') : '<div style="font-size:0.8rem; color:var(--text-muted)">No critical incidents recorded during shift.</div>'}
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:20px; border-top:1px solid var(--border-subtle); padding-top:16px">
        <button class="btn-ghost" onclick="window.print()">🖨️ PRINT SHIFT REPORT</button>
      </div>
    </div>
  `

  openModal('📄 EXECUTIVE SHIFT HANDOVER REPORT', 'OFFICIAL SHIFT LOG SUMMARY SHEET', body)
}
