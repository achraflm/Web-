'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CVFlatCardProps {
  isDark: boolean
}

export default function CVFlatCard({ isDark }: CVFlatCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-black/40 border border-purple-500/20 rounded-lg p-8 hover:border-purple-500/60 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-purple-300 mb-1">Curriculum Vitae</h3>
          <p className="text-slate-400">Achraf Lemrani</p>
        </div>
        <Button
          className="bg-purple-500 hover:bg-purple-600 text-white"
          asChild
        >
          <a href="/cv.pdf" download>
            <Download className="h-4 w-4 mr-2" />
            Download CV
          </a>
        </Button>
      </div>

      <div className="space-y-6">
        <section>
          <h4 className="text-lg font-bold text-purple-300 mb-3">Professional Summary</h4>
          <p className="text-slate-300 leading-relaxed">
            Full-stack developer and AI enthusiast with expertise in machine learning, web development, and cybersecurity. Passionate about creating innovative solutions and exploring cutting-edge technologies.
          </p>
        </section>

        <section>
          <h4 className="text-lg font-bold text-purple-300 mb-3">Core Competencies</h4>
          <div className="grid grid-cols-2 gap-2 text-slate-300 text-sm">
            <div>• Python & Data Science</div>
            <div>• React & Web Development</div>
            <div>• Machine Learning</div>
            <div>• Cybersecurity & CTF</div>
            <div>• API Design</div>
            <div>• Database Design</div>
          </div>
        </section>

        <section>
          <h4 className="text-lg font-bold text-purple-300 mb-3">Education</h4>
          <div className="space-y-2 text-slate-300 text-sm">
            <div>
              <p className="font-medium text-purple-300">ENSAM Meknès</p>
              <p className="text-slate-400">Engineering School</p>
            </div>
            <div>
              <p className="font-medium text-purple-300">Bac Sciences Mathématiques</p>
              <p className="text-slate-400">High School Diploma</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
