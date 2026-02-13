import { useEffect, useState } from 'react'
import Landing from './components/Landing'
import CountdownWithLetters from './components/CountdownWithLetters'
import Particles from './components/Particles'
import './App.css'

function App() {
  const [page, setPage] = useState(() => {
    try {
      const saved = localStorage.getItem('valentine_page')
      return saved || 'landing'
    } catch (e) {
      return 'landing'
    }
  })

  const [yesClicked, setYesClicked] = useState(() => {
    try {
      return localStorage.getItem('valentine_yes') === '1'
    } catch (e) {
      return false
    }
  })

  useEffect(() => {
    localStorage.setItem('valentine_page', page)
  }, [page])

  useEffect(() => {
    localStorage.setItem('valentine_yes', yesClicked ? '1' : '0')
  }, [yesClicked])

  useEffect(() => {
    // If YES was clicked before, go straight to countdown
    const savedYes = localStorage.getItem('valentine_yes') === '1'
    if (savedYes) {
      setPage('countdown')
      return
    }
    
    // If today is Feb 14, go straight to countdown+letters
    const now = new Date()
    if (now.getMonth() === 1 && now.getDate() === 14) {
      setPage('countdown')
    }
  }, [])

  return (
    <div id="app-root">
      <Particles yes={yesClicked} />

      {page === 'landing' && (
        <Landing
          onYes={() => {
            setYesClicked(true)
            setTimeout(() => setPage('countdown'), 600)
          }}
          onNo={() => {
            /* playful behavior handled inside Landing */
          }}
        />
      )}

      {page === 'countdown' && (
        <CountdownWithLetters
          onBack={() => setPage('landing')}
        />
      )}
    </div>
  )
}

export default App
