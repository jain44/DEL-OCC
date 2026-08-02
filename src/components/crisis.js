// ═══════════════════════════════════════════════════════════════
// CRISIS DRILL SIMULATOR — Emergency Protocol Trigger
// Triggers Airport Emergencies (CAT III Fog, Runway Closure, VIP Lockdown)
// ═══════════════════════════════════════════════════════════════
import { store } from '../data/store.js'
import { emitAlert } from '../utils/alerts.js'
import { openModal } from '../views/modal.js'
import { playAlertSound } from '../utils/audio.js'

export function triggerCrisisDrill(type) {
  playAlertSound()

  if (type === 'fog') {
    _triggerFogCrisis()
  } else if (type === 'runway') {
    _triggerRunwayClosure()
  } else if (type === 'vip') {
    _triggerVipLockdown()
  }
}

function _triggerFogCrisis() {
  // Mark 30% of flights as delayed due to weather
  let affectedCount = 0
  store.flights.forEach(f => {
    if (f._simStatus === 'Scheduled' || f._simStatus === 'Check-In Open' || f._simStatus === 'Boarding') {
      f.delay_mins = (f.delay_mins || 0) + 45
      f.delay_reason = 'WX'
      f._simStatus = 'Delayed'
      affectedCount++
    }
  })

  emitAlert({
    id: `crisis-fog-${Date.now()}`,
    type: 'critical',
    icon: '🌁',
    title: 'EMERGENCY: CAT III DENSE FOG PROTOCOL',
    msg: `Visibility dropped below 100m. ${affectedCount} flights placed on low-visibility holding patterns. Runway visual range active.`
  })

  openModal(
    '🌁 EMERGENCY PROTOCOL: CAT III DENSE FOG',
    'AIRPORT OPS RESPONSE MATRIX // LOW VISIBILITY ADVISORY',
    `
      <div class="modal-sect">
        <div class="modal-sect-title">CRISIS SITUATION REPORT</div>
        <div style="background: var(--accent-rose-glow); border: 1px solid var(--accent-rose); padding: 14px; border-radius: 8px; color: var(--accent-rose); font-weight: 600; margin-bottom: 16px">
          ⚠️ VISIBILITY REDUCED TO 75 METERS AT DEL TERMINAL 3 AIRFIELD
        </div>
        <div class="info-grid">
          <div class="info-item"><div class="l">Affected Flights</div><div class="v text-rose font-bold">${affectedCount} Departures</div></div>
          <div class="info-item"><div class="l">RVR Sensor Status</div><div class="v">CAT III B Active</div></div>
          <div class="info-item"><div class="l">Ground Movement</div><div class="v text-amber">Follow-Me Escort Required</div></div>
        </div>
      </div>

      <div class="modal-sect">
        <div class="modal-sect-title">RECOMMENDED ACTIONS</div>
        <ul style="padding-left: 20px; font-size: 0.85rem; color: var(--text-main); display: flex; flex-direction: column; gap: 8px">
          <li>Issue PA announcements across T3 gates regarding CAT III delay matrix.</li>
          <li>Notify ground handling to initiate warm beverage distribution in holding lounges.</li>
          <li>Coordinate with ATC for staggered pushback releases every 12 minutes.</li>
        </ul>
      </div>
    `
  )
}

function _triggerRunwayClosure() {
  emitAlert({
    id: `crisis-rwy-${Date.now()}`,
    type: 'critical',
    icon: '⛔',
    title: 'CRISIS: RUNWAY 29L EMERGENCY CLOSURE',
    msg: 'Foreign Object Debris (FOD) reported on RWY 29L. Airfield ops clearing runway. All traffic diverted to RWY 28.'
  })

  openModal(
    '⛔ EMERGENCY: RUNWAY 29L CLOSURE',
    'AIRFIELD SAFETY MATRIX // FOD CLEARANCE DRILL',
    `
      <div class="modal-sect">
        <div class="modal-sect-title">AIRFIELD STATUS</div>
        <div style="background: var(--accent-amber-glow); border: 1px solid var(--accent-amber); padding: 14px; border-radius: 8px; color: var(--accent-amber); font-weight: 600; margin-bottom: 16px">
          ⚠️ RUNWAY 29L TEMPORARILY CLOSED FOR FOD CLEARANCE SPECTRUM
        </div>
        <div class="info-grid">
          <div class="info-item"><div class="l">Active Runway</div><div class="v text-emerald">RWY 28 Single Runway Operations</div></div>
          <div class="info-item"><div class="l">Estimated Clearance</div><div class="v">18 Minutes</div></div>
          <div class="info-item"><div class="l">Inbound Diverts</div><div class="v text-amber">3 Flights Holding</div></div>
        </div>
      </div>
    `
  )
}

function _triggerVipLockdown() {
  const vips = store.passengers.filter(p => p.is_vip)

  emitAlert({
    id: `crisis-vip-${Date.now()}`,
    type: 'warning',
    icon: '⭐',
    title: 'PROTOCOL: AIR FORCE ONE / VIP AIRSIDE DRILL',
    msg: `VIP Protocol activated for ${vips.length} high-priority passengers. Gate B4 & B5 security lane priority enforced.`
  })

  openModal(
    '⭐ VIP SECURITY DRILL ACTIVATED',
    'HIGH-LEVEL AIRSIDE ESCORT PROTOCOL',
    `
      <div class="modal-sect">
        <div class="modal-sect-title">VIP MANIFEST DETECTED</div>
        <div style="background: var(--accent-purple-glow); border: 1px solid var(--accent-purple); padding: 14px; border-radius: 8px; color: var(--accent-purple); font-weight: 600; margin-bottom: 16px">
          ⭐ ${vips.length} REGISTERED VIP DELEGATES BOARDING WITHIN 30 MINUTES
        </div>
        <div class="info-grid">
          <div class="info-item"><div class="l">Escort Officers</div><div class="v text-neon">4 Assigned</div></div>
          <div class="info-item"><div class="l">Fast-Track Lane</div><div class="v text-emerald">Lane 1 & 2 Reserved</div></div>
          <div class="info-item"><div class="l">Lounge Status</div><div class="v">Executive T3 Ready</div></div>
        </div>
      </div>
    `
  )
}
