"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface DigitalClockProps {
  isDark: boolean
}

export default function DigitalClock({ isDark }: DigitalClockProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timerId)
  }, [])

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
  }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    }
    return date.toLocaleDateString(undefined, options)
  }

  return (
    <div
      className={`${
        isDark ? "bg-black/40 border-purple-500/40 text-purple-300" : "bg-white/40 border-cyan-500/40 text-cyan-600"
      } backdrop-blur-sm shadow-lg border rounded-lg p-4 min-w-[160px]`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-4 w-4" />
        <span className="text-sm font-medium">Live Time</span>
      </div>
      <div
        className={`text-2xl font-bold tabular-nums ${
          isDark
            ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
            : "text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
        }`}
      >
        {formatTime(time)}
      </div>
      <div className={`text-sm ${isDark ? "text-purple-200/80" : "text-cyan-600/80"}`}>{formatDate(time)}</div>
    </div>
  )
}
