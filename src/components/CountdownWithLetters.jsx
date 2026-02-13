import React, { useEffect, useState } from 'react'
import '../App.css'

function getTimeUntilValentine() {
  const now = new Date()
  let year = now.getFullYear()
  const valentine = new Date(year, 1, 14, 0, 0, 0)
  if (now > valentine) valentine.setFullYear(year + 1)
  const diff = valentine - now
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds, diff }
}

export default function CountdownWithLetters({ onBack }) {
  const [time, setTime] = useState(getTimeUntilValentine())
  const [message, setMessage] = useState('')
  const [opened, setOpened] = useState([false, false])
  const [unlocked, setUnlocked] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [fireworks, setFireworks] = useState([])

  useEffect(() => {
    const id = setInterval(() => {
      const t = getTimeUntilValentine()
      setTime(t)
      updateMessage(t)
      if (t.diff <= 0) {
        setUnlocked(true)
        clearInterval(id)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const force = params.get('forceUnlock') === 'true' || params.get('forceUnlock') === '1'
    if (force) {
      setUnlocked(true)
      return
    }

    const now = new Date()
    if (now.getMonth() === 1 && now.getDate() === 14) setUnlocked(true)
  }, [])

  useEffect(() => {
    if (unlocked) {
      // show celebration overlay when letters unlock (Feb 14 or preview)
      setShowCelebration(true)
      // trigger continuous waves of fireworks over 10 seconds
      const burstPositions = [
        { x: 10, y: 15 },
        { x: 30, y: 10 },
        { x: 50, y: 12 },
        { x: 70, y: 14 },
        { x: 90, y: 18 },
        { x: 20, y: 80 },
        { x: 50, y: 85 },
        { x: 80, y: 82 },
      ]
      const newFireworks = []
      
      // trigger bursts every 1.5s for 20 seconds (13 waves)
      for (let wave = 0; wave < 13; wave++) {
        setTimeout(() => {
          burstPositions.forEach((pos, idx) => {
            setTimeout(() => {
              newFireworks.push({ id: Math.random() * 100000, x: pos.x + (Math.random() - 0.5) * 10, y: pos.y + (Math.random() - 0.5) * 10 })
              setFireworks([...newFireworks])
            }, idx * 150)
          })
        }, wave * 1500)
      }
      // auto-hide celebration message after 7s, but keep fireworks floating
      const t = setTimeout(() => setShowCelebration(false), 7000)
      return () => clearTimeout(t)
    }
    return undefined
  }, [unlocked])

  function updateMessage(t) {
    if (t.days > 3) setMessage(`${t.days} days until the magic 💫`)
    else if (t.days === 3) setMessage('Only 3 days left until the magic 💖')
    else if (t.days === 1) setMessage("Tomorrow is the day! 💕")
    else if (t.days === 0 && t.hours > 0) setMessage(`${t.hours} hour${t.hours > 1 ? 's' : ''} left… get ready!`)
    else if (t.days === 0) setMessage('✨ HAPPY VALENTINE\'S DAY ✨\n❤️ Happy Anniversary ❤️')
    else setMessage('Counting down…')
  }

  function toggleLetter(index) {
    if (!unlocked) {
      alert('💌 Letters unlock on February 14')
      return
    }
    setOpened(prev => prev.map((v, i) => (i === index ? !v : v)))
  }

  return (
    <section className="page countdown-with-letters">
      {/* Countdown Section */}
      <div className="countdown-section">
        <h2 className="count-title">hihihihihi katkoutiiii said yessssss letsgoooooooooo 💖</h2>
        <div className="timer">
          <div className="unit">
            <div className="value">{String(time.days).padStart(2, '0')}</div>
            <div className="label">Days</div>
          </div>
          <div className="sep">:</div>
          <div className="unit">
            <div className="value">{String(time.hours).padStart(2, '0')}</div>
            <div className="label">Hours</div>
          </div>
          <div className="sep">:</div>
          <div className="unit">
            <div className="value">{String(time.minutes).padStart(2, '0')}</div>
            <div className="label">Minutes</div>
          </div>
          <div className="sep">:</div>
          <div className="unit">
            <div className="value">{String(time.seconds).padStart(2, '0')}</div>
            <div className="label">Seconds</div>
          </div>
        </div>
        <div className="fun-message">{message}</div>
      </div>

      {/* Letters Section */}
      <div className="letters-section">
        <div className="letters-content">
          <h2 className="letters-title">Special Letters for You 💌</h2>
          
          <div className="lock-status">
            {!unlocked && <p>🔒 Letters unlock on February 14</p>}
          </div>
          
          <div className="envelopes">
          <div 
            className={`envelope ${opened[0] ? 'opened' : ''} ${!unlocked ? 'locked' : ''}`} 
            onClick={() => toggleLetter(0)}
            style={{ cursor: unlocked ? 'pointer' : 'not-allowed', opacity: unlocked ? 1 : 0.6 }}
          >
            <div className="front">
              {!unlocked && '🔒'} Anniversary
            </div>
            <div className="inside">
              <h3>Happy Anniversary</h3>
              <p>“Grow old with me, the best is yet to be.” — Robert Browning</p>
              <p style={{ marginTop: '0.6rem' }}>“nhebk akther meli tehlem.”— Sinda Ben Said ❤️</p>
            </div>
          </div>

          <div 
            className={`envelope ${opened[1] ? 'opened' : ''} ${!unlocked ? 'locked' : ''}`} 
            onClick={() => toggleLetter(1)}
            style={{ cursor: unlocked ? 'pointer' : 'not-allowed', opacity: unlocked ? 1 : 0.6 }}
          >
            <div className="front">
              {!unlocked && '🔒'} Valentine's Day
            </div>
            <div className="inside">
              <h3>Happy Valentine's Day</h3>
              <p>“At the touch of love, everyone becomes a poet.” — Plato</p>
              <p style={{ marginTop: '0.6rem' }}>“Love is composed of a single soul inhabiting two bodies.” — Aristotle</p>
            </div>
          </div>
          </div>
        </div>

      </div>

      {/* Fireworks (persistent background) */}
      <div className="fireworks-container">
        {fireworks.map(fw => (
          <div key={fw.id} className="firework-burst" style={{ left: `${fw.x}%`, top: `${fw.y}%` }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} className={`firework-particle fp${i % 6}`} />
            ))}
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div className="controls">
        <button className="btn secondary" onClick={onBack}>
          ← Back to Landing
        </button>
      </div>
        {/* Celebration overlay (shows when unlocked) */}
        {showCelebration && (
          <div className="celebration-overlay" onClick={() => setShowCelebration(false)}>
            <div className="celebration-message" role="dialog" aria-live="polite">
              <h1>Happy to us, baby</h1>
              <p className="big-love">I love you a looottttt, a lottttt 💖</p>
              <div className="celebration-hearts">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i} className={`heart h${i % 4}`}>❤</span>
                ))}
              </div>
              <div className="confetti">
                {Array.from({ length: 28 }).map((_, i) => (
                  <span key={i} className={`confetti-piece c${i % 6}`} />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
  )
}
