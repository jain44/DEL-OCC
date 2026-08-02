// ═══════════════════════════════════════════════════════════════
// 2D FLIGHT RADAR VECTOR MAP — Animated Airfield & Plane Nodes
// Interactive canvas with runways 28, 29L & active vectors
// ═══════════════════════════════════════════════════════════════
import { store } from '../data/store.js'
import { openFlightModal } from '../views/flights.js'
import { playRadarPing } from '../utils/audio.js'

export function renderRadarCanvas(container) {
  container.innerHTML = `
    <div style="position:relative; width:100%; height:320px; background:var(--bg-dark); border-radius:10px; overflow:hidden; border:1px solid var(--border-subtle)">
      <canvas id="radar-canvas" style="width:100%; height:100%"></canvas>
      <div style="position:absolute; top:12px; left:16px; font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); pointer-events:none">
        <span style="color:var(--accent-blue); font-weight:700">DEL AIRSPACE RADAR</span> // RWY 28 / 29L / 11 · RANGE 40 NM
      </div>
      <div style="position:absolute; bottom:12px; right:16px; font-family:var(--font-mono); font-size:0.72rem; color:var(--accent-emerald); pointer-events:none" id="radar-count-label">
        ACTIVE VECTORS: 12
      </div>
    </div>
  `

  const canvas = document.getElementById('radar-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  let width = canvas.width = canvas.offsetWidth
  let height = canvas.height = canvas.offsetHeight

  window.addEventListener('resize', () => {
    if (canvas && canvas.offsetWidth) {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }
  })

  // Simulated active aircraft vectors
  const flights = store.flights.slice(0, 16)
  const planeNodes = flights.map((f, i) => {
    const angle = (i / flights.length) * Math.PI * 2
    const radius = 60 + Math.random() * (Math.min(width, height) / 2 - 80)
    return {
      flightId: f.flight_id,
      airline: f.airline,
      dest: f.destination,
      x: width / 2 + Math.cos(angle) * radius,
      y: height / 2 + Math.sin(angle) * radius,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      alt: Math.floor(180 + Math.random() * 160) * 100, // FL180 - FL340
      spd: Math.floor(220 + Math.random() * 140), // 220 - 360 knots
      status: f._simStatus || 'En-Route'
    }
  })

  let sweepAngle = 0

  function drawRadar() {
    if (!document.getElementById('radar-canvas')) return

    ctx.clearRect(0, 0, width, height)

    const cx = width / 2
    const cy = height / 2
    const maxR = Math.min(width, height) / 2 - 20

    // Concentric Radar Rings
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)'
    ctx.lineWidth = 1
    for (let r = 40; r <= maxR; r += 45) {
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Crosshairs
    ctx.beginPath()
    ctx.moveTo(cx - maxR, cy)
    ctx.lineTo(cx + maxR, cy)
    ctx.moveTo(cx, cy - maxR)
    ctx.lineTo(cx, cy + maxR)
    ctx.stroke()

    // Airfield Runways (28 / 29L)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(cx - 50, cy - 10)
    ctx.lineTo(cx + 50, cy + 10) // RWY 28
    ctx.moveTo(cx - 60, cy + 15)
    ctx.lineTo(cx + 40, cy + 35) // RWY 29L
    ctx.stroke()

    // Airfield Label
    ctx.fillStyle = '#38bdf8'
    ctx.font = '600 10px JetBrains Mono'
    ctx.fillText('DEL T3 / IGI AIRFIELD', cx - 55, cy - 20)

    // Radar Sweep Line
    sweepAngle += 0.015
    if (sweepAngle > Math.PI * 2) {
      sweepAngle = 0
      playRadarPing()
    }

    const sx = cx + Math.cos(sweepAngle) * maxR
    const sy = cy + Math.sin(sweepAngle) * maxR

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(sx, sy)
    ctx.stroke()

    // Sweep cone gradient
    ctx.fillStyle = 'rgba(56, 189, 248, 0.04)'
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, maxR, sweepAngle - 0.4, sweepAngle)
    ctx.closePath()
    ctx.fill()

    // Aircraft Nodes & Telemetry Tags
    planeNodes.forEach(p => {
      p.x += p.vx
      p.y += p.vy

      // Keep within radar perimeter
      const dist = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2)
      if (dist > maxR - 10) {
        p.vx *= -1
        p.vy *= -1
      }

      // Draw plane icon dot
      ctx.fillStyle = p.status === 'Delayed' ? '#f43f5e' : '#34d399'
      ctx.beginPath()
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
      ctx.fill()

      // Vector Line
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(p.x + p.vx * 12, p.y + p.vy * 12)
      ctx.stroke()

      // Telemetry Data Box
      ctx.fillStyle = '#f8fafc'
      ctx.font = '600 10px JetBrains Mono'
      ctx.fillText(p.flightId, p.x + 8, p.y - 2)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '9px JetBrains Mono'
      ctx.fillText(`FL${Math.round(p.alt / 100)} ${p.spd}kt`, p.x + 8, p.y + 10)
    })

    requestAnimationFrame(drawRadar)
  }

  // Click on plane to open modal
  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    planeNodes.forEach(p => {
      const dist = Math.sqrt((clickX - p.x) ** 2 + (clickY - p.y) ** 2)
      if (dist < 15) {
        openFlightModal(p.flightId)
      }
    })
  })

  drawRadar()
}
