"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface DigitalClockProps {
  isDark: boolean
}

export default function DigitalClock({ isDark }: DigitalClockProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timerId)
  }, [])

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <Card
        className={`${
          isDark
            ? "bg-black/40 border-purple-500/40"
            : "bg-white/40 border-cyan-500/40"
        } backdrop-blur-sm shadow-lg`}
      >
        <CardHeader className="py-2">
          <CardTitle
            className={`flex items-center gap-2 text-sm font-semibold ${
              isDark ? "text-purple-300" : "text-cyan-600"
            }`}
          >
            <Clock className="h-4 w-4" />
            Digital Clock
          </CardTitle>
          <CardDescription
            className={`text-xs ${
              isDark ? "text-purple-200/80" : "text-cyan-700/80"
            }`}
          >
            {formatDate(time)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-2">
          <div
            className={`text-3xl font-bold tabular-nums ${
              isDark
                ? "text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.7)]"
                : "text-cyan-500 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]"
            }`}
          >
            {formatTime(time)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
