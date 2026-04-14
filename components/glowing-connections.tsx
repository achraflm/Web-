"use client"

import { useEffect, useRef } from "react"

interface GlowingConnectionsProps {
  isDark?: boolean
}

export function GlowingConnections({ isDark = true }: GlowingConnectionsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Animation variables
    let animationId: number
    let time = 0

    const animate = () => {
      time += 0.01

      // Clear canvas
      ctx.fillStyle = isDark ? "rgba(10, 10, 10, 0.1)" : "rgba(255, 255, 255, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Get all major sections
      const sections = document.querySelectorAll("section")
      const points: Array<{ x: number; y: number; element: Element }> = []

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          points.push({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            element: section,
          })
        }
      })

      // Draw connections between nearby points
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[j].x - points[i].x
          const dy = points[j].y - points[i].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Only draw if points are reasonably close
          if (distance < 600) {
            const opacity = (1 - distance / 600) * 0.3
            const wave = Math.sin(time + distance * 0.01) * 0.5 + 0.5

            // Create gradient
            const gradient = ctx.createLinearGradient(points[i].x, points[i].y, points[j].x, points[j].y)

            if (isDark) {
              gradient.addColorStop(0, `rgba(155, 89, 182, ${opacity * wave})`)
              gradient.addColorStop(0.5, `rgba(155, 89, 182, ${opacity * wave * 0.5})`)
              gradient.addColorStop(1, `rgba(0, 255, 255, ${opacity * wave})`)
            } else {
              gradient.addColorStop(0, `rgba(0, 255, 255, ${opacity * wave})`)
              gradient.addColorStop(0.5, `rgba(0, 255, 255, ${opacity * wave * 0.5})`)
              gradient.addColorStop(1, `rgba(155, 89, 182, ${opacity * wave})`)
            }

            ctx.strokeStyle = gradient
            ctx.lineWidth = 1.5
            ctx.lineCap = "round"
            ctx.lineJoin = "round"

            // Add glow effect
            ctx.shadowColor = isDark ? "rgba(155, 89, 182, 0.5)" : "rgba(0, 255, 255, 0.5)"
            ctx.shadowBlur = 10

            ctx.beginPath()
            ctx.moveTo(points[i].x, points[i].y)
            ctx.lineTo(points[j].x, points[j].y)
            ctx.stroke()

            ctx.shadowBlur = 0
          }
        }
      }

      // Draw glowing nodes at section centers
      points.forEach((point) => {
        const pulse = Math.sin(time * 2 + Math.random() * Math.PI) * 0.5 + 0.5

        if (isDark) {
          ctx.fillStyle = `rgba(155, 89, 182, ${0.3 + pulse * 0.3})`
          ctx.shadowColor = "rgba(155, 89, 182, 0.8)"
        } else {
          ctx.fillStyle = `rgba(0, 255, 255, ${0.3 + pulse * 0.3})`
          ctx.shadowColor = "rgba(0, 255, 255, 0.8)"
        }

        ctx.shadowBlur = 15
        ctx.beginPath()
        ctx.arc(point.x, point.y, 3 + pulse * 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [isDark])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-5" style={{ opacity: 0.6 }} />
}

export default GlowingConnections
