import React, { useEffect } from 'react'
import '../App.css'

export default function Particles({ yes }) {
  useEffect(() => {
    const container = document.createElement('div')
    container.className = 'particles'
    document.body.appendChild(container)

    const icons = ['❤️', '💖', '🎻', '🩰', '💕', '💗', '🖤', '🎀', '🌙', '✨', '🎵','💃','📚','⭐','🌕','🥊']

    let interval = setInterval(() => {
      const el = document.createElement('div')
      el.className = 'particle'
      el.textContent = icons[Math.floor(Math.random() * icons.length)]

      // Random position across entire viewport
      el.style.left = Math.random() * 100 + 'vw'
      el.style.top = Math.random() * 100 + 'vh'

      el.style.fontSize = (14 + Math.random() * 32) + 'px'
      el.style.opacity = 0.7
      el.style.animation = `float-particle ${6 + Math.random() * 6}s linear forwards`

      container.appendChild(el)

      setTimeout(() => {
        try { el.remove() } catch (e) {}
      }, 14000)
    }, yes ? 600 : 1400)










    return () => {
      clearInterval(interval)
      try { container.remove() } catch (e) {}
    }
  }, [yes])

  return null
}

