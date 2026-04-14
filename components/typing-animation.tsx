'use client'

import { useEffect, useState } from 'react'

interface TypingAnimationProps {
  phrases: string[]
  speed?: number
  delayBetweenPhrases?: number
}

export default function TypingAnimation({ 
  phrases, 
  speed = 50,
  delayBetweenPhrases = 2000
}: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex]
    let timer: NodeJS.Timeout

    if (isPaused) {
      timer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, delayBetweenPhrases)
      return () => clearTimeout(timer)
    }

    if (!isDeleting) {
      if (displayText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setDisplayText(currentPhrase.substring(0, displayText.length + 1))
        }, speed)
      } else {
        setIsPaused(true)
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1))
        }, speed / 2)
      } else {
        setIsDeleting(false)
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
      }
    }

    return () => clearTimeout(timer)
  }, [displayText, currentPhraseIndex, isDeleting, isPaused, phrases, speed, delayBetweenPhrases])

  return (
    <span className="min-h-8">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}
