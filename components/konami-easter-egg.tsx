'use client'

import { useEffect, useState } from 'react'

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export default function KonamiEasterEgg() {
  const [keySequence, setKeySequence] = useState<string[]>([])
  const [showRain, setShowRain] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = [...keySequence, e.key]
      const lastTen = newSequence.slice(-10)
      setKeySequence(lastTen)

      if (lastTen.join('') === KONAMI_CODE.join('')) {
        setShowRain(true)
        setTimeout(() => setShowRain(false), 3000)
        setKeySequence([])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [keySequence])

  if (!showRain) return null

  return (
    <>
      <style>{`
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
      `}</style>
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
    </>
  )
}
