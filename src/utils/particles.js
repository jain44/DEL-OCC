// ═══════════════════════════════════════════════════════════════
// PARTICLE CANVAS — Sci-Fi Command Center Grid & Flight Nodes
// ═══════════════════════════════════════════════════════════════

export function initParticles() {
  const canvas = document.getElementById('bg-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  let width = canvas.width = window.innerWidth
  let height = canvas.height = window.innerHeight

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
  })

  // Particles / Flight nodes
  const nodes = Array.from({ length: 45 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: Math.random() * 1.8 + 0.8,
    color: Math.random() > 0.3 ? 'rgba(0, 212, 255, ' : 'rgba(168, 255, 62, ',
    alpha: Math.random() * 0.5 + 0.2
  }))

  function draw() {
    ctx.clearRect(0, 0, width, height)

    // Subtle background grid
    const gridSize = 40
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.025)'
    ctx.lineWidth = 1
    ctx.beginPath()

    for (let x = 0; x < width; x += gridSize) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
    }
    ctx.stroke()

    // Draw connecting vectors between close nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 140) {
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 140)})`
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          ctx.stroke()
        }
      }
    }

    // Update and draw nodes
    nodes.forEach(n => {
      n.x += n.vx
      n.y += n.vy

      if (n.x < 0) n.x = width
      if (n.x > width) n.x = 0
      if (n.y < 0) n.y = height
      if (n.y > height) n.y = 0

      ctx.fillStyle = `${n.color}${n.alpha})`
      ctx.beginPath()
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
      ctx.fill()
    })

    requestAnimationFrame(draw)
  }

  draw()
}
