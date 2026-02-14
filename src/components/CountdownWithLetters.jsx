import React, { useEffect, useState } from 'react'
import '../App.css'
import movieNightPoster from '../assets/MovieNightPost.png'
import anniversaryImg from '../assets/Anniversary.png'
import valentineVideo from '../assets/Valentine.mp4'

function getTimeUntilValentine() {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentDay = now.getDate()
  
  // If we're on Feb 14, show 00:00:00
  if (currentMonth === 1 && currentDay === 14) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, diff: 0 }
  }
  
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

function getTimeUntilPlanEnd() {
  const now = new Date()
  let year = now.getFullYear()
  const planStart = new Date(year, 1, 14, 17, 0, 0) // Feb 14 17:00 (5 PM)
  if (now > planStart) planStart.setFullYear(year + 1)
  const diff = planStart - now
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds, diff }
}

function isPlanAvailable() {
  const now = new Date()
  const planAvailableTime = new Date(now.getFullYear(), 1, 14, 5, 0, 0) // Feb 14 5:00 AM
  return now >= planAvailableTime
}

export default function CountdownWithLetters({ onBack }) {
  const [time, setTime] = useState(getTimeUntilValentine())
  const [planTime, setPlanTime] = useState(getTimeUntilPlanEnd())
  const [message, setMessage] = useState('')
  const [opened, setOpened] = useState([false, false])
  const [unlocked, setUnlocked] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [fireworks, setFireworks] = useState([])
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [planAvailable, setPlanAvailable] = useState(() => isPlanAvailable())
  const audioRef = React.useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const forcePlan = params.get('forcePlan') === 'true' || params.get('forcePlan') === '1'
    
    const id = setInterval(() => {
      const t = getTimeUntilValentine()
      setTime(t)
      updateMessage(t)
      if (t.diff <= 0) {
        setUnlocked(true)
        clearInterval(id)
      }
      if (!forcePlan) {
        setPlanAvailable(isPlanAvailable())
      }
    }, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      const pt = getTimeUntilPlanEnd()
      setPlanTime(pt)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // Background Music
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.3
      audio.loop = true
      // Try to play with user interaction
      const playAudio = () => {
        audio.play().catch(err => {
          // Browser autoplay policy - user needs to interact first
          console.log('Audio autoplay blocked, awaiting user interaction')
        })
      }
      playAudio()
      // Also try on first user interaction
      const handleUserInteraction = () => {
        if (audio.paused) {
          audio.play()
        }
        document.removeEventListener('click', handleUserInteraction)
        document.removeEventListener('keydown', handleUserInteraction)
      }
      document.addEventListener('click', handleUserInteraction)
      document.addEventListener('keydown', handleUserInteraction)
      return () => {
        document.removeEventListener('click', handleUserInteraction)
        document.removeEventListener('keydown', handleUserInteraction)
      }
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const force = params.get('forceUnlock') === 'true' || params.get('forceUnlock') === '1'
    const forcePlan = params.get('forcePlan') === 'true' || params.get('forcePlan') === '1'
    
    if (force) {
      setUnlocked(true)
    }
    
    if (forcePlan) {
      setPlanAvailable(true)
    }

    const now = new Date()
    if (now.getMonth() === 1 && now.getDate() === 14) setUnlocked(true)
  }, [])

  useEffect(() => {
    if (unlocked) {
      // show celebration overlay when letters unlock (Feb 14 or preview)
      setShowCelebration(true)
      // trigger continuous waves of fireworks over shorter period
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
      
      // trigger bursts every 1.1s for 10 seconds (9 waves)
      for (let wave = 0; wave < 9; wave++) {
        setTimeout(() => {
          burstPositions.forEach((pos, idx) => {
            setTimeout(() => {
              newFireworks.push({ id: Math.random() * 100000, x: pos.x + (Math.random() - 0.5) * 10, y: pos.y + (Math.random() - 0.5) * 10 })
              setFireworks([...newFireworks])
            }, idx * 150)
          })
        }, wave * 1100)
      }
      // auto-hide celebration message after 4s
      const t = setTimeout(() => setShowCelebration(false), 4000)
      return () => clearTimeout(t)
    }
    return undefined
  }, [unlocked])

  function updateMessage(t) {
    if (t.days > 3) setMessage(`${t.days} days until the magic 💫`)
    else if (t.days === 3) setMessage('Only 3 days left until the magic 💖')
    else if (t.days === 1) setMessage("Tomorrow is the day! 💕")
    else if (t.days === 0 && t.hours > 0) setMessage(`${t.hours} hour${t.hours > 1 ? 's' : ''} left… get ready!`)
    else if (t.days === 0 && t.hours === 0 && t.minutes === 0) setMessage('You will enjoy it 💖✨')
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
      {/* Posts Section - Anniversary & Valentine (show only after countdown ends) */}
      {unlocked && (
      <div className="posts-section">
        <div className="post-image-card post-left">
          <img src={anniversaryImg} alt="Happy Anniversary" className="post-img" />
        </div>

        <div className="post-video-card post-right">
          <video 
            src={valentineVideo} 
            alt="Happy Valentine's Day" 
            className="post-video"
            controls
            autoPlay
            loop
            muted
          />
        </div>
      </div>
      )}

      {/* Plan Button (show from Feb 14 5:00 AM) */}
      {unlocked && planAvailable && (
      <div className="plan-section">
        <button className="btn primary plan-btn" onClick={() => setShowPlanModal(true)}>
          ✨ Our Plan – February 14 ✨
        </button>
        <a href="https://discord.gg/bdCPbcPR" target="_blank" rel="noopener noreferrer" className="btn primary discord-btn">
          💜 Join Our Discord Server 💜
        </a>
      </div>
      )}

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

      {showPlanModal && (
        <div className="plan-modal-overlay" onClick={() => setShowPlanModal(false)}>
          <div className="plan-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPlanModal(false)}>✕</button>
            
            <h2 className="plan-title">Our Plan – February 14</h2>
            <p className="plan-subtitle">Be ready at 17:00 ✨</p>
            
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-time">17:00</div>
                <div className="timeline-activity">
                  <h4>Meet Up</h4>
                  <p>Get together & start the celebration 💕</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-time">17:30</div>
                <div className="timeline-activity">
                  <h4>Puzzle Game</h4>
                  <p>we will play "we were here" Game</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-time">21:00</div>
                <div className="timeline-activity">
                  <h4>MiniGames</h4>
                  <p>we will get alot of choices</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-time">23:00</div>
                <div className="timeline-activity">
                  <h4>Movie & Relaxation</h4>
                  <p>we will watch a movie & relax </p>
                </div> 
              </div>
            </div>

            <div className="plan-countdown">
              <p>Time until the plan starts:</p>
              <div className="mini-timer">
                <span>{String(planTime.days).padStart(2, '0')}d</span>
                <span>{String(planTime.hours).padStart(2, '0')}h</span>
                <span>{String(planTime.minutes).padStart(2, '0')}m</span>
                <span>{String(planTime.seconds).padStart(2, '0')}s</span>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Background Music */}
      <audio 
        ref={audioRef}
        src="https://assets.mixkit.co/active_storage/sfx/2741/2741-preview.mp3"
        type="audio/mpeg"
        style={{ display: 'none' }}
      />

        {/* Celebration overlay (shows when unlocked) */}
        {showCelebration && (
          <div className="celebration-overlay" onClick={() => setShowCelebration(false)}>
            <div className="celebration-message" role="dialog" aria-live="polite">
              <h1>Happy to us baby💖</h1>
              <p className="big-love">Nheeeeeeeeeebk barcha barcha ya 3asltii 💖💖💖</p>
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
