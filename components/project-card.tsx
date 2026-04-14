'use client'

import { Github, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ProjectCardProps {
  name: string
  description: string
  techStack: string[]
  githubLink?: string
  liveLink?: string
}

export default function ProjectCard({
  name,
  description,
  techStack,
  githubLink,
  liveLink,
}: ProjectCardProps) {
  return (
    <div className="group relative bg-black/40 border border-purple-500/20 rounded-lg p-6 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/10 rounded-lg transition-all duration-300" />
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-purple-300 mb-2">{name}</h3>
        <p className="text-slate-300 text-sm mb-4 line-clamp-3">{description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {techStack.map((tech) => (
            <Badge
              key={tech}
              variant="outline"
              className="bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20"
            >
              {tech}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          {githubLink && (
            <Button
              size="sm"
              variant="outline"
              className="border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10"
              asChild
            >
              <a href={githubLink} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-1" />
                Code
              </a>
            </Button>
          )}
          {liveLink && (
            <Button
              size="sm"
              variant="outline"
              className="border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10"
              asChild
            >
              <a href={liveLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Live
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
