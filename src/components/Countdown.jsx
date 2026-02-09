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

export default function CountdownPage({ onBack, onReached }) {
  const [time, setTime] = useState(getTimeUntilValentine())
  const [message, setMessage] = useState('')

  useEffect(() => {
    const id = setInterval(() => {
      const t = getTimeUntilValentine()
      setTime(t)
      updateMessage(t)
      if (t.diff <= 0) {
        clearInterval(id)
        onReached()
      }
    }, 1000)
    return () => clearInterval(id)
  }, [])

  function updateMessage(t) {
    if (t.days > 3) setMessage(`${t.days} days until the magic 💫`)
    else if (t.days === 3) setMessage('Only 3 days left until the magic 💖')
    else if (t.days === 1) setMessage("Tomorrow is the day! 💕")
    else if (t.hours <= 1 && t.days === 0) setMessage('1 hour left… get ready!')
    else setMessage('Counting down…')
  }

  return (
    <section className="page countdown">
      <h2 className="count-title">hihihihihihihihi manich msaaadaaaa9 yakatkouti lmezyena 9oleeet Yesss💖</h2>
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

      <div className="controls">
        <button className="btn secondary" onClick={onBack}>
          ← Back
        </button>
      </div>
    </section>
  )
}
