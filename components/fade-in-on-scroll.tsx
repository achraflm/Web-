'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface FadeInOnScrollProps {
  children: ReactNode
  className?: string
  delay?: number
}

export default function FadeInOnScroll({ 
  children, 
  className = '',
  delay = 0 
}: FadeInOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            element.classList.add('opacity-100', 'translate-y-0')
            element.classList.remove('opacity-0', 'translate-y-10')
          }, delay)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(element)
    return () => observer.unobserve(element)
  }, [delay])

  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-10 transition-all duration-700 ${className}`}
    >
      {children}
    </div>
  )
}
