// ═══════════════════════════════════════════════════════════════
// AUDIO SYNTHESIZER — Native Web Audio API UI & Radar Sound FX
// Zero external files required
// ═══════════════════════════════════════════════════════════════

let audioCtx = null
let soundEnabled = false

export function toggleAudio() {
  soundEnabled = !soundEnabled
  if (soundEnabled && !audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (soundEnabled) playChime()
  return soundEnabled
}

export function isAudioEnabled() {
  return soundEnabled
}

/** Soft UI Click Chime */
export function playClick() {
  if (!soundEnabled || !audioCtx) return
  try {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.05)
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + 0.05)
  } catch {}
}

/** Soft Futuristic Navigation Chime */
export function playChime() {
  if (!soundEnabled || !audioCtx) return
  try {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime) // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.1) // E5
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + 0.15)
  } catch {}
}

/** Radar Ping Sound */
export function playRadarPing() {
  if (!soundEnabled || !audioCtx) return
  try {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(1200, audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + 0.3)
  } catch {}
}

/** Emergency Alert Warning Sound */
export function playAlertSound() {
  if (!soundEnabled || !audioCtx) return
  try {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(440, audioCtx.currentTime)
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1)
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + 0.25)
  } catch {}
}
