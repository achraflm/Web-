'use client'

import { useState } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import SplashCursor from '@/components/ui/splash-cursor'
import BackgroundPathsEnhanced from '@/components/ui/background-paths-enhanced'
import { ExpandableTabs, ExpandableTabsList, ExpandableTabsTrigger, ExpandableTabsContent } from '@/components/expandable-tabs'
import ExpandableChat from '@/components/expandable-chat'
import GlowingConnections from '@/components/glowing-connections'
import ChessGame from '@/components/chess-game'
import CircuitSimulator from '@/components/circuit-simulator'
import { Code, Mail, Github, Linkedin, ExternalLink } from 'lucide-react'

function Page() {
  const [isDark, setIsDark] = useState(true)

  return (
    <ThemeProvider attribute="class" defaultTheme={isDark ? 'dark' : 'light'} enableSystem>
      <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-slate-950' : 'bg-white'}`}>
        {/* Background Effects */}
        <BackgroundPathsEnhanced isDark={isDark} />
        <SplashCursor />
        <GlowingConnections />

        {/* Main Content */}
        <div className="relative z-10">
          {/* Header */}
          <header className="border-b border-slate-800 backdrop-blur-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  Developer Portfolio
                </h1>
              </div>
              <button
                onClick={() => setIsDark(!isDark)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-medium text-white"
              >
                {isDark ? '🌙' : '☀️'}
              </button>
            </div>
          </header>

          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-6 py-24">
            <div className="text-center space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold text-white">
                Welcome to My Portfolio
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Explore interactive projects, games, and demonstrations of cutting-edge technologies
              </p>
              <div className="flex justify-center gap-4">
                <a href="#about" className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                  Explore
                </a>
              </div>
            </div>
          </section>

          {/* Main Tabs Section */}
          <section id="about" className="max-w-7xl mx-auto px-6 py-16">
            <ExpandableTabs defaultValue="projects">
              <ExpandableTabsList className="flex justify-center gap-4 flex-wrap mb-12">
                <ExpandableTabsTrigger value="projects" className="px-6 py-3 rounded-lg border border-slate-700 hover:border-purple-500 transition-colors text-white font-medium flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Featured Projects
                </ExpandableTabsTrigger>
                <ExpandableTabsTrigger value="about" className="px-6 py-3 rounded-lg border border-slate-700 hover:border-cyan-500 transition-colors text-white font-medium">
                  About Me
                </ExpandableTabsTrigger>
                <ExpandableTabsTrigger value="contact" className="px-6 py-3 rounded-lg border border-slate-700 hover:border-purple-500 transition-colors text-white font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact
                </ExpandableTabsTrigger>
              </ExpandableTabsList>

              {/* Projects Tab */}
              <ExpandableTabsContent value="projects" className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="rounded-lg border border-slate-700 overflow-hidden hover:border-purple-500 transition-colors">
                    <div className="p-6 bg-slate-900/50">
                      <h3 className="text-xl font-bold text-white mb-2">Interactive Chess Game</h3>
                      <p className="text-slate-400 mb-4">Play chess with AI opponent powered by Stockfish engine with Heaven vs Hell theme</p>
                      <ChessGame />
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-700 overflow-hidden hover:border-cyan-500 transition-colors">
                    <div className="p-6 bg-slate-900/50">
                      <h3 className="text-xl font-bold text-white mb-2">Circuit Simulator</h3>
                      <p className="text-slate-400 mb-4">Design and simulate electrical circuits with interactive components</p>
                      <CircuitSimulator />
                    </div>
                  </div>
                </div>
              </ExpandableTabsContent>

              {/* About Tab */}
              <ExpandableTabsContent value="about" className="space-y-6">
                <div className="rounded-lg border border-slate-700 p-8 bg-slate-900/50">
                  <h3 className="text-2xl font-bold text-white mb-4">About Me</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    I'm a passionate developer with expertise in interactive technologies, game development, and educational tools. 
                    My work focuses on creating engaging experiences that combine beautiful design with robust functionality.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    I specialize in React, TypeScript, WebGL, and creative coding. I enjoy building projects that push the boundaries 
                    of what's possible on the web, from physics simulations to interactive visualizations.
                  </p>
                </div>
              </ExpandableTabsContent>

              {/* Contact Tab */}
              <ExpandableTabsContent value="contact" className="space-y-6">
                <div className="rounded-lg border border-slate-700 p-8 bg-slate-900/50">
                  <h3 className="text-2xl font-bold text-white mb-6">Get In Touch</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-lg border border-slate-600 hover:border-purple-500 transition-colors group">
                      <Github className="w-6 h-6 text-slate-400 group-hover:text-purple-500 transition-colors" />
                      <div>
                        <div className="text-sm text-slate-400">GitHub</div>
                        <div className="text-white font-medium">View My Code</div>
                      </div>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-lg border border-slate-600 hover:border-cyan-500 transition-colors group">
                      <Linkedin className="w-6 h-6 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                      <div>
                        <div className="text-sm text-slate-400">LinkedIn</div>
                        <div className="text-white font-medium">Connect</div>
                      </div>
                    </a>
                    <a href="mailto:hello@example.com" className="flex items-center gap-3 p-4 rounded-lg border border-slate-600 hover:border-purple-500 transition-colors group">
                      <Mail className="w-6 h-6 text-slate-400 group-hover:text-purple-500 transition-colors" />
                      <div>
                        <div className="text-sm text-slate-400">Email</div>
                        <div className="text-white font-medium">Send Message</div>
                      </div>
                    </a>
                  </div>
                </div>
              </ExpandableTabsContent>
            </ExpandableTabs>
          </section>

          {/* Footer */}
          <footer className="border-t border-slate-800 mt-24 py-8">
            <div className="max-w-7xl mx-auto px-6 text-center text-slate-400">
              <p>© 2026 Developer Portfolio. Built with React and creative coding.</p>
            </div>
          </footer>
        </div>

        {/* Floating Chat */}
        <ExpandableChat />
      </div>
    </ThemeProvider>
  )
}

export default Page
