import React, { useState, useEffect } from 'react'
import '../App.css'

export default function Letters({ onBack }) {
  const [opened, setOpened] = useState([false, false])
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    const now = new Date()
    if (now.getMonth() === 1 && now.getDate() === 14) setUnlocked(true)
  }, [])

  function open(index) {
    if (!unlocked) {
      alert('💌 Letters unlock on Feb 14')
      return
    }
    setOpened(prev => prev.map((v, i) => (i === index ? !v : v)))
  }

  return (
    <section className="page letters">
      <div className="letters-content">
        <h2 className="letters-title">Special Letters for You 💌</h2>
        
        <div className="lock-status">
          {!unlocked && <p>🔒 Letters unlock on February 14</p>}
        </div>
        
        <div className="envelopes">
          <div 
            className={`envelope ${opened[0] ? 'opened' : ''} ${!unlocked ? 'locked' : ''}`} 
            onClick={() => open(0)}
            style={{ cursor: unlocked ? 'pointer' : 'not-allowed', opacity: unlocked ? 1 : 0.6 }}
          >
            <div className="front">
              {!unlocked && '🔒'} Letter 1 — Anniversary
            </div>
            <div className="inside">
              <h3>Our Anniversary</h3>
              <p>Every day with you is a blessing. Thank you for being my light. ❤️</p>
            </div>
          </div>

          <div 
            className={`envelope ${opened[1] ? 'opened' : ''} ${!unlocked ? 'locked' : ''}`} 
            onClick={() => open(1)}
            style={{ cursor: unlocked ? 'pointer' : 'not-allowed', opacity: unlocked ? 1 : 0.6 }}
          >
            <div className="front">
              {!unlocked && '🔒'} Letter 2 — Valentine's Day
            </div>
            <div className="inside">
              <h3>Happy Valentine's Day</h3>
              <p>I love you more than dreams — nhebk akther meli tehlem. 🍁</p>
            </div>
          </div>
        </div>

        <div className="controls">
          <button className="btn secondary" onClick={() => onBack ? onBack() : window.history.back()}>
            ← Back to Countdown
          </button>
        </div>
      </div>
    </section>
  )
}
