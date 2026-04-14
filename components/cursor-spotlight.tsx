'use client'

import { useEffect, useState } from 'react'

export default function CursorSpotlight() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      className="fixed pointer-events-none z-40 transition-all duration-75"
      style={{
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, rgba(147, 51, 234, 0.05) 40%, transparent 70%)`,
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        filter: 'blur(40px)',
      }}
    />
  )
}
