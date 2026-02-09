import React, { useRef, useEffect, useState } from 'react'
import kuromiImg from '../assets/KUROMI.png'
import '../App.css'

export default function Landing({ onYes }) {
  const noRef = useRef(null)
  const [quote, setQuote] = useState('')
  const [kuromiMsg, setKuromiMsg] = useState('')

  function jumpNo() {
    const btn = noRef.current
    if (!btn) return
    const x = Math.random() * (window.innerWidth - btn.offsetWidth)
    const y = Math.random() * (window.innerHeight - btn.offsetHeight)
    btn.style.position = 'fixed'
    btn.style.left = x + 'px'
    btn.style.top = y + 'px'
    btn.style.zIndex = '100'
  }



  useEffect(() => {
    const el = document.querySelector('.landing-title')
    if (el) {
      el.classList.add('enter')
    }
    return undefined
  }, [])

  // Interactive title: per-character quotes + acrostic builder
  const titleText = "Will you be my Valentine ?"

  // Final acrostic words mapped to the title letters (ignore punctuation)
  const titleLetters = titleText.replace(/[^A-Za-z]/g, '').split('')

  const acrosticLines = [
    "With every moment we share, my world feels brighter and more complete.",
    "In your presence, I find comfort, peace, and a happiness I never knew before.",
    "Little things about you make my heart smile in ways words can't explain.",
    "Loving you has become the most beautiful part of my life.",
    "You inspire me to be better, dream bigger, and love deeper every day.",
    "On the days when life feels heavy, you are my calm and my light.",
    "Understanding you, supporting you, and standing beside you is all I ever want to do.",
    "Because of you, love feels real, warm, and magical.",
    "Every memory with you is a treasure I hold close to my heart.",
    "My feelings for you grow stronger with every passing day.",
    "You are not just someone I love, you are someone I cherish deeply.",
    "Very few people can make a heart feel this full.",
    "All I wish for is to keep creating beautiful moments with you.",
    "Let this day be another memory of our story together.",
    "Every smile of yours is a gift to my soul.",
    "Nothing makes me happier than seeing you happy.",
    "Today and always, you are the one I choose.",
    "In every future I imagine, you are there with me.",
    "Now I only have one question in my heart.",
    "Endlessly and sincerely… will you be my Valentine?"
  ]

  const [hoverIndex, setHoverIndex] = useState(-1)

  function handleCharHover(index) {
    setHoverIndex(index)
  }

  function handleCharLeave() { setHoverIndex(-1) }

  useEffect(() => {
    const kuromiMessages = [
      'yhebkk barchaa raaw',
      'Say yes, khalyh yafrah',
      'You are his everything',
      'He has been waiting for this',
      'You can\'t say no to him',
      'You make him smile daily',
      'tansech raw yhebk akther meli tehlem',
      'Be his Valentine, please',
      'He\'s the one for you',
      'Just say yes plz'
    ]

    let msgIndex = 0
    const firstTimeout = setTimeout(() => {
      setKuromiMsg(kuromiMessages[0])
      setTimeout(() => setKuromiMsg(''), 3000)
      msgIndex = 1
    }, 2000)

    const interval = setInterval(() => {
      setKuromiMsg(kuromiMessages[msgIndex % kuromiMessages.length])
      msgIndex++
      setTimeout(() => setKuromiMsg(''), 3000)
    }, 9000)

    return () => {
      clearTimeout(firstTimeout)
      clearInterval(interval)
    }
  }, [])

  return (
    <section className="page landing">
      {kuromiMsg && (
        <div className="kuromi-wingman">
          <img
            src={kuromiImg}
            alt="Kuromi"
            className="kuromi-icon-img"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              const fb = e.currentTarget.parentNode.querySelector('.kuromi-icon-fallback')
              if (fb) fb.style.display = 'flex'
            }}
          />
          <div className="kuromi-icon-fallback" aria-hidden>😈</div>
          <div className="kuromi-message">{kuromiMsg}</div>
        </div>
      )}

      <div className="landing-content">
        <p className="landing-subtitle">Nhebk akther meli tehlem &nbsp;</p>
        
        <h1 className="landing-title">
          {(() => {
            // render title preserving spaces/punctuation but wire hover for letters only
            const letters = titleText.split('')
            let letterPos = 0
            return letters.map((ch, i) => {
              const isLetter = /[A-Za-z]/.test(ch)
              if (isLetter) {
                const pos = letterPos
                letterPos += 1
                return (
                  <span
                    key={i}
                    className={`title-char ${hoverIndex === pos ? 'active' : ''}`}
                    onMouseEnter={() => handleCharHover(pos)}
                    onMouseLeave={handleCharLeave}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleCharHover(pos) }}
                  >
                    {ch}
                  </span>
                )
              }
              return (
                <span key={i} className="title-space">{ch}</span>
              )
            })
          })()}
        </h1>

        <div className="buttons">
          <button
            className="btn yes"
            onClick={onYes}
            onMouseEnter={(e) => e.currentTarget.classList.add('hover')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('hover')}
          >
            Yes
          </button>

          <button
            ref={noRef}
            className="btn no"
            onMouseEnter={jumpNo}
            onClick={() => alert("You can't say no ❤️")}
          >
            No 😅
          </button>
        </div>

        <div className="hint">Hover each letter to reveal a special message ✨</div>
        {quote && <div className="kuromi-quote">{quote}</div>}
        {/* Hover display: show full line when hovering each title letter */}
        <div className="acrostic-box">
          {hoverIndex >= 0 && acrosticLines[hoverIndex] && (
            <div className="acrostic-line-reveal">{acrosticLines[hoverIndex]}</div>
          )}
        </div>
      </div>
    </section>
  )
}
