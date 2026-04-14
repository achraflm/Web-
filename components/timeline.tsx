'use client'

interface TimelineItem {
  title: string
  subtitle: string
  description: string
  date: string
}

interface TimelineProps {
  items: TimelineItem[]
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-purple-500/20" />

      {/* Timeline items */}
      <div className="space-y-12 ml-20">
        {items.map((item, index) => (
          <div key={index} className="relative">
            {/* Dot */}
            <div className="absolute -left-16 top-1 w-9 h-9 bg-black border-2 border-purple-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full" />
            </div>

            {/* Content */}
            <div className="bg-black/40 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/60 transition-all duration-300">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-bold text-purple-300">{item.title}</h3>
                <span className="text-xs text-slate-400">{item.date}</span>
              </div>
              <p className="text-sm text-slate-400 mb-2">{item.subtitle}</p>
              <p className="text-sm text-slate-300">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
