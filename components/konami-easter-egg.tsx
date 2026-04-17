'use client'

import { useEffect, useState } from 'react'

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

const keyframeStyles = `
  @keyframes fall {
    from {
      transform: translateY(-10vh);
      opacity: 1;
    }
    to {
      transform: translateY(100vh);
      opacity: 0;
    }
  }
`

export default function KonamiEasterEgg() {
  const [keySequence, setKeySequence] = useState<string[]>([])
  const [showRain, setShowRain] = useState(false)

  useEffect(() => {
    // Inject keyframe styles on mount
    if (typeof document !== 'undefined' && !document.getElementById('konami-styles')) {
      const style = document.createElement('style')
      style.id = 'konami-styles'
      style.textContent = keyframeStyles
      document.head.appendChild(style)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      setKeySequence((prevSequence) => {
        const newSequence = [...prevSequence, e.key]
        const lastTen = newSequence.slice(-10)

        if (lastTen.join('') === KONAMI_CODE.join('')) {
          setShowRain(true)
          setTimeout(() => setShowRain(false), 3000)
          return []
        }
        return lastTen
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!showRain) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-purple-500 font-bold text-xl"
          style={{
            left: `${Math.random() * 100}%`,
            animation: `fall ${2 + Math.random() * 1}s linear forwards`,
            opacity: 0.7,
          }}
        >
          {['ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ'][Math.floor(Math.random() * 10)]}
        </div>
      ))}
    </div>
  )
}
