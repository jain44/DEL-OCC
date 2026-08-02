// ═══════════════════════════════════════════════════════════════
// THEME MANAGER — Instant Theme Switcher
// Modes: Slate (Default Dark), Cyber Neon HUD, Amber Tactical Night
// ═══════════════════════════════════════════════════════════════

export const THEMES = [
  { id: 'slate', name: '🌌 Slate Dark', label: 'SLATE' },
  { id: 'cyber', name: '⚡ Cyber Neon', label: 'CYBER' },
  { id: 'amber', name: '🌇 Amber Tactical', label: 'AMBER' }
]

let currentThemeIdx = 0

export function cycleTheme() {
  currentThemeIdx = (currentThemeIdx + 1) % THEMES.length
  const theme = THEMES[currentThemeIdx]
  applyTheme(theme.id)
  return theme
}

export function applyTheme(themeId) {
  const root = document.documentElement
  if (themeId === 'cyber') {
    root.style.setProperty('--bg-dark', '#020617')
    root.style.setProperty('--bg-surface', '#0f172a')
    root.style.setProperty('--bg-elevated', '#1e293b')
    root.style.setProperty('--accent-blue', '#00d4ff')
    root.style.setProperty('--accent-emerald', '#a8ff3e')
    root.style.setProperty('--accent-amber', '#ffb800')
    root.style.setProperty('--accent-rose', '#ff3e5e')
  } else if (themeId === 'amber') {
    root.style.setProperty('--bg-dark', '#120c04')
    root.style.setProperty('--bg-surface', '#1c150b')
    root.style.setProperty('--bg-elevated', '#2a1f13')
    root.style.setProperty('--accent-blue', '#f59e0b')
    root.style.setProperty('--accent-emerald', '#fbbf24')
    root.style.setProperty('--accent-amber', '#f97316')
    root.style.setProperty('--accent-rose', '#ef4444')
  } else {
    // Default Slate
    root.style.removeProperty('--bg-dark')
    root.style.removeProperty('--bg-surface')
    root.style.removeProperty('--bg-elevated')
    root.style.removeProperty('--accent-blue')
    root.style.removeProperty('--accent-emerald')
    root.style.removeProperty('--accent-amber')
    root.style.removeProperty('--accent-rose')
  }
}
