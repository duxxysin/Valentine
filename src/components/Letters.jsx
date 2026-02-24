import React, { useState, useEffect } from 'react'
import '../App.css'

export default function Letters({ onBack }) {
  const [opened, setOpened] = useState([false, false])
  // Always show letters
  const [unlocked] = useState(true)

  function open(index) {
    setOpened(prev => prev.map((v, i) => (i === index ? !v : v)))
  }

  return (
    <section className="page letters">
      <div className="letters-content">
        <h2 className="letters-title">Special Letters for You 💌</h2>
        
        {/* Letters are always visible */}
        
        <div className="envelopes">
          <div 
            className={`envelope ${opened[0] ? 'opened' : ''}`} 
            onClick={() => open(0)}
            style={{ cursor: 'pointer', opacity: 1 }}
          >
            <div className="front">
              Letter 1 — Anniversary
            </div>
            <div className="inside">
              <h3>Our Anniversary</h3>
              <p>Every day with you is a blessing. Thank you for being my light. ❤️</p>
            </div>
          </div>

          <div 
            className={`envelope ${opened[1] ? 'opened' : ''}`} 
            onClick={() => open(1)}
            style={{ cursor: 'pointer', opacity: 1 }}
          >
            <div className="front">
              Letter 2 — Valentine's Day
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
