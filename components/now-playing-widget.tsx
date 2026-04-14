'use client'

import { useEffect, useState } from 'react'
import { Music } from 'lucide-react'

interface TrackData {
  name: string
  artist: string
  image?: string
  isPlaying: boolean
}

export default function NowPlayingWidget() {
  const [track, setTrack] = useState<TrackData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchSpotifyTrack = async () => {
      try {
        // This would require Spotify API integration
        // For now, we'll show a placeholder
        setTrack({
          name: 'Loading...',
          artist: 'Spotify',
          isPlaying: true,
        })
      } catch (error) {
        console.log('[v0] Spotify API not configured')
      }
    }

    fetchSpotifyTrack()
    // Update every 10 seconds
    const interval = setInterval(fetchSpotifyTrack, 10000)
    return () => clearInterval(interval)
  }, [])

  if (!track) return null

  return (
    <div className="fixed bottom-24 left-6 z-40 bg-black/50 border border-purple-500/30 rounded-lg p-4 w-64 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Music className="h-12 w-12 text-purple-400 animate-spin" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-purple-300 truncate">{track.name}</p>
          <p className="text-xs text-gray-400 truncate">{track.artist}</p>
          <div className="flex gap-1 mt-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 bg-purple-500 rounded-full"
                style={{
                  height: `${4 + i * 2}px`,
                  animation: `pulse 0.8s ease-in-out ${i * 0.1}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
