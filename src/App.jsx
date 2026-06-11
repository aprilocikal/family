import { useState, useEffect, useCallback } from 'react'
import IntroScene from './components/IntroScene/IntroScene'
import Hero from './components/Hero/Hero'
import LoveLetter from './components/LoveLetter/LoveLetter'
import Reasons from './components/Reasons/Reasons'
import Gallery from './components/Gallery/Gallery'
import Garden from './components/Garden/Garden'
import Streak from './components/Streak/Streak'
import GameSection from './components/MiniGames/GameSection'
import RedStringMap from './components/RedStringMap/RedStringMap'
import Finale from './components/Finale/Finale'
import MusicPlayer from './components/MusicPlayer/MusicPlayer'
import PetalRain from './components/PetalRain/PetalRain'
import ParticleCanvas from './components/ParticleCanvas/ParticleCanvas'
import HiddenLetter from './components/HiddenLetter/HiddenLetter'

function App() {
  const [introComplete, setIntroComplete] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)

  const handleIntroOpen = useCallback(() => {
    setIsMusicPlaying(true)
  }, [])

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true)
    // Small delay before showing content for smooth transition
    setTimeout(() => setShowContent(true), 100)
  }, [])

  // Setup global scroll reveal observer
  useEffect(() => {
    if (!showContent) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    // Observe all elements with .reveal class
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    }, 200)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [showContent])

  return (
    <>
      {/* Intro Scene - shows first */}
      {!introComplete && (
        <IntroScene
          onComplete={handleIntroComplete}
          onOpen={handleIntroOpen}
        />
      )}

      {/* Ambient Effects - always active after intro */}
      <div className="cinematic-vignette" />
      <PetalRain isActive={showContent} />
      <ParticleCanvas isActive={showContent} />

      {/* Main Content */}
      {showContent && (
        <main id="main-site">
          <Hero />
          <LoveLetter />
          <Reasons />
          <Gallery />
          <Garden />
          <Streak />
          <GameSection />
          <RedStringMap />
          <Finale />
        </main>
      )}

      {/* Floating UI Elements */}
      <MusicPlayer isVisible={showContent} forcePlay={isMusicPlaying} />
      <HiddenLetter isVisible={showContent} />
    </>
  )
}

export default App
