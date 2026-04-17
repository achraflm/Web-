'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DownloadCVButton() {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    
    try {
      // Try to download the CV file
      const link = document.createElement('a')
      link.href = '/cv_Achraf_Lemrani.pdf'
      link.download = 'Achraf_Lemrani_CV.pdf'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.log('[v0] Download failed:', error)
      alert('CV file not available. Please try again later.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex justify-center">
      <Button
        onClick={handleDownload}
        disabled={isDownloading}
        className="relative px-8 py-6 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold text-lg group transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/75"
      >
        <Download className="mr-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
        {isDownloading ? 'Downloading...' : 'Download CV'}
      </Button>
    </div>
  )
}
