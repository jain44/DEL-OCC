// ═══════════════════════════════════════════════════════════════
// MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════

export function openModal(title, subtitle, bodyHTML) {
  document.getElementById('modal-title').textContent = title
  document.getElementById('modal-subtitle').textContent = subtitle || ''
  document.getElementById('modal-body').innerHTML = bodyHTML
  document.getElementById('modal-backdrop').classList.add('open')
}

export function closeModal() {
  document.getElementById('modal-backdrop').classList.remove('open')
}

export function initModal() {
  document.getElementById('modal-close')?.addEventListener('click', closeModal)
  document.getElementById('modal-backdrop')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal()
  })
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal()
  })
}
