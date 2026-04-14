'use client'

import { useState, useEffect } from 'react'

interface SkillBadgeProps {
  name: string
  level: number
  category?: string
}

export default function SkillBadge({ name, level, category }: SkillBadgeProps) {
  const [displayLevel, setDisplayLevel] = useState(0)

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      if (current < level) {
        current += Math.ceil(level / 20)
        setDisplayLevel(Math.min(current, level))
      } else {
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [level])

  return (
    <div className="bg-black/40 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/60 transition-all duration-300">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-purple-300">{name}</span>
        <span className="text-xs text-slate-400">{displayLevel}%</span>
      </div>
      <div className="w-full h-2 bg-purple-500/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000"
          style={{ width: `${displayLevel}%` }}
        />
      </div>
      {category && (
        <p className="text-xs text-slate-500 mt-1">{category}</p>
      )}
    </div>
  )
}
