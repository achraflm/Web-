"use client"

import { useState, useEffect, useRef } from "react"
import {
  Moon,
  Sun,
  Github,
  Linkedin,
  Instagram,
  ExternalLink,
  Play,
  Upload,
  User,
  Briefcase,
  Video,
  Edit3,
  FileText,
  Download,
  Lock,
  Unlock,
  GamepadIcon,
  Target,
  ImageIcon,
  Music,
  Settings,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import ChessGame from "@/components/chess-game"
import Chatbot from "@/components/chatbot"
import CTFGame from "@/components/ctf-game"

export default function Portfolio() {
  const [isDark, setIsDark] = useState(true)
  const [showMatrix, setShowMatrix] = useState(false)
  const [activeTab, setActiveTab] = useState("about")
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminCode, setAdminCode] = useState("")
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [editingSkills, setEditingSkills] = useState(false)
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [newSkillName, setNewSkillName] = useState("")
  const [newSkillLevel, setNewSkillLevel] = useState(50)
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [activeGame, setActiveGame] = useState("chess")

  const particleRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  // Particle effects only (no custom cursor)
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      // Create particles occasionally
      if (Math.random() < 0.1) {
        const newParticle = {
          id: Math.random(),
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1,
          color: isDark ? "#9b59b6" : "#00ffff",
        }
        setParticles((prev) => [...prev.slice(-20), newParticle])
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isDark])

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.02,
          }))
          .filter((p) => p.life > 0),
      )
    }, 16)

    return () => clearInterval(interval)
  }, [])

  const handleAdminLogin = () => {
    if (adminCode.toLowerCase() === "nacht faust") {
      setIsAdmin(true)
      setShowAdminLogin(false)
      setAdminCode("")
    } else {
      alert("Invalid admin code!")
    }
  }

  const handleCVDownload = () => {
    if (adminCode.toLowerCase() === "nacht faust") {
      // Simulate CV download
      const link = document.createElement("a")
      link.href = "/placeholder.pdf"
      link.download = "N1cht_CV.pdf"
      link.click()
      setShowAdminLogin(false)
      setAdminCode("")
    } else {
      alert("Invalid password!")
    }
  }

  const projects = [
    {
      id: 1,
      title: "AI-Powered Trading Bot",
      description: "Advanced algorithmic trading system with machine learning predictions and risk management.",
      tech: ["Python", "TensorFlow", "Finance APIs"],
      image: "/placeholder.svg?height=200&width=300",
      status: "completed",
    },
    {
      id: 2,
      title: "Cybersecurity Dashboard",
      description: "Real-time security monitoring system with threat detection and incident response.",
      tech: ["React", "Node.js", "Security APIs"],
      image: "/placeholder.svg?height=200&width=300",
      status: "in-progress",
    },
    {
      id: 3,
      title: "Data Science Platform",
      description: "Comprehensive analytics platform for big data processing and visualization.",
      tech: ["Python", "Pandas", "D3.js"],
      image: "/placeholder.svg?height=200&width=300",
      status: "completed",
    },
    {
      id: 4,
      title: "Video Content Studio",
      description: "Professional video editing suite with AI-powered effects and automation.",
      tech: ["After Effects", "React", "FFmpeg"],
      image: "/placeholder.svg?height=200&width=300",
      status: "planning",
    },
  ]

  const [skills, setSkills] = useState([
    {
      category: "Programming",
      skills: [
        { name: "Python", level: 95 },
        { name: "JavaScript/TypeScript", level: 90 },
        { name: "React/Next.js", level: 88 },
        { name: "Node.js", level: 85 },
        { name: "SQL/NoSQL", level: 82 },
      ],
    },
    {
      category: "Data Science",
      skills: [
        { name: "Machine Learning", level: 90 },
        { name: "Data Analysis", level: 92 },
        { name: "TensorFlow/PyTorch", level: 85 },
        { name: "Statistical Modeling", level: 88 },
        { name: "Big Data Processing", level: 80 },
      ],
    },
    {
      category: "Cybersecurity",
      skills: [
        { name: "Penetration Testing", level: 85 },
        { name: "Network Security", level: 88 },
        { name: "Incident Response", level: 82 },
        { name: "Risk Assessment", level: 90 },
        { name: "Compliance", level: 78 },
      ],
    },
    {
      category: "Finance & Trading",
      skills: [
        { name: "Algorithmic Trading", level: 92 },
        { name: "Risk Management", level: 88 },
        { name: "Financial Modeling", level: 85 },
        { name: "Market Analysis", level: 90 },
        { name: "Portfolio Optimization", level: 87 },
      ],
    },
    {
      category: "Creative & Design",
      skills: [
        { name: "After Effects", level: 90 },
        { name: "Photoshop", level: 88 },
        { name: "Illustrator", level: 85 },
        { name: "UI/UX Design", level: 82 },
        { name: "Video Editing", level: 92 },
      ],
    },
  ])

  const updateSkillLevel = (categoryIndex, skillIndex, newLevel) => {
    const newSkills = [...skills]
    newSkills[categoryIndex].skills[skillIndex].level = newLevel[0]
    setSkills(newSkills)
  }

  const videos = [
    {
      title: "Trading Algorithm Walkthrough",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "15:30",
    },
    {
      title: "Cybersecurity Best Practices",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "22:45",
    },
    {
      title: "Data Science Tutorial Series",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "8:12",
    },
  ]

  const addSkill = () => {
    if (newSkillName.trim()) {
      const newSkills = [...skills]
      newSkills[selectedCategory].skills.push({
        name: newSkillName.trim(),
        level: newSkillLevel,
      })
      setSkills(newSkills)
      setNewSkillName("")
      setNewSkillLevel(50)
    }
  }

  const deleteSkill = (categoryIndex, skillIndex) => {
    const newSkills = [...skills]
    newSkills[categoryIndex].skills.splice(skillIndex, 1)
    setSkills(newSkills)
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 relative overflow-hidden ${isDark ? "bg-[#0a0a0a] text-white" : "bg-white text-gray-900"}`}
    >
      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              backgroundColor: particle.color,
              opacity: particle.life,
              boxShadow: `0 0 ${particle.life * 10}px ${particle.color}`,
            }}
          />
        ))}
      </div>

      {/* Matrix Rain Background */}
      {showMatrix && (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
          <div className="matrix-rain"></div>
        </div>
      )}

      {/* Top Navigation */}
      <div className="fixed top-6 right-6 z-50 flex gap-2">
        {/* CV Download */}
        <Button
          onClick={() => setShowAdminLogin(true)}
          variant="outline"
          size="icon"
          className={`rounded-full border-2 transition-all duration-300 ${
            isDark
              ? "border-purple-500 bg-black/50 hover:bg-purple-500/20"
              : "border-cyan-500 bg-white/50 hover:bg-cyan-500/20"
          }`}
        >
          <FileText className={`h-5 w-5 ${isDark ? "text-purple-400" : "text-cyan-500"}`} />
        </Button>

        {/* Admin Toggle */}
        <Button
          onClick={() => setShowAdminLogin(!showAdminLogin)}
          variant="outline"
          size="icon"
          className={`rounded-full border-2 transition-all duration-300 ${
            isDark
              ? "border-purple-500 bg-black/50 hover:bg-purple-500/20"
              : "border-cyan-500 bg-white/50 hover:bg-cyan-500/20"
          }`}
        >
          {isAdmin ? (
            <Unlock className="h-5 w-5 text-green-400" />
          ) : (
            <Lock className={`h-5 w-5 ${isDark ? "text-purple-400" : "text-cyan-500"}`} />
          )}
        </Button>

        {/* Theme Toggle */}
        <Button
          onClick={() => setIsDark(!isDark)}
          variant="outline"
          size="icon"
          className={`rounded-full border-2 transition-all duration-300 ${
            isDark
              ? "border-purple-500 bg-black/50 hover:bg-purple-500/20 hover:shadow-[0_0_20px_rgba(155,89,182,0.5)]"
              : "border-cyan-500 bg-white/50 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]"
          }`}
        >
          {isDark ? <Sun className="h-5 w-5 text-purple-400" /> : <Moon className="h-5 w-5 text-cyan-500" />}
        </Button>
      </div>

      {/* CV Download Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className={`w-96 ${isDark ? "bg-black border-purple-500" : "bg-white border-cyan-500"}`}>
            <CardHeader>
              <CardTitle className={`text-center ${isDark ? "text-purple-400" : "text-cyan-500"}`}>
                Download CV
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cvPassword">Enter Password</Label>
                <Input
                  id="cvPassword"
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter password..."
                  className={`${isDark ? "border-purple-500/50" : "border-cyan-500/50"}`}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCVDownload}
                  className={`flex-1 ${isDark ? "bg-purple-500 hover:bg-purple-600" : "bg-cyan-500 hover:bg-cyan-600"}`}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={() => setShowAdminLogin(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hero Section */}
      <section
        className="min-h-screen flex items-center justify-center relative overflow-hidden z-10"
        onMouseEnter={() => setShowMatrix(true)}
        onMouseLeave={() => setShowMatrix(false)}
      >
        <div className="text-center z-10 px-4">
          {/* Profile Picture */}
          <div
            className={`relative mx-auto mb-8 w-48 h-48 rounded-full overflow-hidden border-4 transition-all duration-300 ${
              isDark
                ? "border-purple-500 shadow-[0_0_50px_rgba(155,89,182,0.8)]"
                : "border-cyan-500 shadow-[0_0_50px_rgba(0,255,255,0.8)]"
            }`}
          >
            <Image
              src={isDark ? "/images/profile-dark.jpg" : "/images/profile-light.jpg"}
              alt="N1cht Profile Picture"
              width={192}
              height={192}
              className="object-cover w-full h-full"
              crossOrigin="anonymous"
            />
            <div
              className={`absolute inset-0 rounded-full animate-pulse ${
                isDark ? "bg-purple-500/20" : "bg-cyan-500/20"
              }`}
            ></div>
          </div>

          {/* Glitch Name Effect */}
          <h1
            className={`text-6xl md:text-8xl font-bold mb-4 font-orbitron glitch-text ${
              isDark ? "text-purple-400" : "text-cyan-500"
            }`}
            data-text="N1CHT"
          >
            N1CHT
          </h1>

          <h2 className={`text-2xl md:text-3xl mb-6 font-rajdhani ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
            Developer & Content Editor
          </h2>

          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed font-exo">
            Crafting digital experiences through code and content. Passionate about creating innovative solutions that
            bridge technology and creativity.
          </p>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-12">
            {[
              { icon: Github, href: "https://github.com/achraflm", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/achraf-lemrani-30615731a/", label: "LinkedIn" },
              { icon: Instagram, href: "https://www.instagram.com/n1cht_faust/", label: "Instagram" },
            ].map(({ icon: Icon, href, label }) => (
              <Button
                key={label}
                variant="outline"
                size="lg"
                className={`rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                  isDark
                    ? "border-purple-500 bg-black/50 hover:bg-purple-500/20 hover:shadow-[0_0_30px_rgba(155,89,182,0.8)]"
                    : "border-cyan-500 bg-white/50 hover:bg-cyan-500/20 hover:shadow-[0_0_30px_rgba(0,255,255,0.8)]"
                }`}
                asChild
              >
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <Icon className={`h-6 w-6 ${isDark ? "text-purple-400" : "text-cyan-500"}`} />
                  <span className="sr-only">{label}</span>
                </a>
              </Button>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className={`animate-bounce ${isDark ? "text-purple-400" : "text-cyan-500"}`}>
            <div className="w-6 h-10 border-2 rounded-full mx-auto relative">
              <div
                className={`w-1 h-3 rounded-full mx-auto mt-2 animate-pulse ${
                  isDark ? "bg-purple-400" : "bg-cyan-500"
                }`}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Tabs */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList
              className={`grid w-full grid-cols-6 mb-12 ${
                isDark ? "bg-black/50 border border-purple-500/30" : "bg-white/50 border border-cyan-500/30"
              }`}
            >
              <TabsTrigger
                value="about"
                className={`flex items-center gap-2 font-rajdhani ${isDark ? "data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300" : "data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-600"}`}
              >
                <User className="h-4 w-4" />
                About
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className={`flex items-center gap-2 font-rajdhani ${isDark ? "data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300" : "data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-600"}`}
              >
                <Target className="h-4 w-4" />
                Skills
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className={`flex items-center gap-2 font-rajdhani ${isDark ? "data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300" : "data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-600"}`}
              >
                <Briefcase className="h-4 w-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className={`flex items-center gap-2 font-rajdhani ${isDark ? "data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300" : "data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-600"}`}
              >
                <Video className="h-4 w-4" />
                Design & Video
              </TabsTrigger>
              <TabsTrigger
                value="games"
                className={`flex items-center gap-2 font-rajdhani ${isDark ? "data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300" : "data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-600"}`}
              >
                <GamepadIcon className="h-4 w-4" />
                Games
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger
                  value="admin"
                  className={`flex items-center gap-2 font-rajdhani ${isDark ? "data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300" : "data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-600"}`}
                >
                  <Settings className="h-4 w-4" />
                  Admin
                </TabsTrigger>
              )}
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-8">
              <div className="text-center">
                <h2
                  className={`text-4xl md:text-5xl font-bold mb-8 font-orbitron ${isDark ? "text-purple-400" : "text-cyan-500"}`}
                >
                  About N1cht
                </h2>
                <div className="max-w-4xl mx-auto space-y-6">
                  <Card
                    className={`p-8 ${isDark ? "bg-black/50 border-purple-500/30 hover:border-purple-500 hover:shadow-[0_0_30px_rgba(155,89,182,0.3)]" : "bg-white/50 border-cyan-500/30 hover:border-cyan-500 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]"}`}
                  >
                    <CardContent className="space-y-6">
                      <p className="text-lg font-exo leading-relaxed">
                        Hello! I'm Achraf Lemrani, also known as "N1cht" in the digital realm. I'm a passionate
                        developer and content editor with expertise spanning multiple domains - from algorithmic trading
                        and cybersecurity to data science and creative design.
                      </p>
                      <p className="text-lg font-exo leading-relaxed">
                        My journey combines technical mastery with creative vision, building solutions that not only
                        solve complex problems but also engage users through compelling visual storytelling and
                        intuitive design.
                      </p>

                      {/* Contact Email */}
                      <div
                        className={`flex items-center justify-center gap-2 p-4 rounded-lg ${isDark ? "bg-purple-900/20 border border-purple-500/30" : "bg-cyan-900/20 border border-cyan-500/30"}`}
                      >
                        <Mail className={`h-5 w-5 ${isDark ? "text-purple-400" : "text-cyan-500"}`} />
                        <a
                          href="mailto:achraf.lemrani@gmail.com"
                          className={`font-exo hover:underline ${isDark ? "text-purple-300" : "text-cyan-600"}`}
                        >
                          achraf.lemrani@gmail.com
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-8">
              <div className="text-center">
                <div className="flex justify-between items-center mb-16">
                  <h2
                    className={`text-4xl md:text-5xl font-bold font-orbitron ${isDark ? "text-purple-400" : "text-cyan-500"}`}
                  >
                    Technical Expertise
                  </h2>
                  {isAdmin && (
                    <Button
                      onClick={() => setEditingSkills(!editingSkills)}
                      variant="outline"
                      className={`${isDark ? "border-purple-500/50 hover:bg-purple-500/20" : "border-cyan-500/50 hover:bg-cyan-500/20"}`}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      {editingSkills ? "Save Changes" : "Edit Skills"}
                    </Button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skills.map((category, categoryIndex) => (
                    <Card
                      key={categoryIndex}
                      className={`p-6 ${isDark ? "bg-black/50 border-purple-500/30 hover:border-purple-500" : "bg-white/50 border-cyan-500/30 hover:border-cyan-500"}`}
                    >
                      <CardHeader>
                        <CardTitle className={`text-lg font-rajdhani ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                          {category.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {category.skills.map((skill, skillIndex) => (
                          <div key={skillIndex} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-exo text-sm">{skill.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">{skill.level}%</span>
                                {isAdmin && editingSkills && (
                                  <Button
                                    onClick={() => deleteSkill(categoryIndex, skillIndex)}
                                    variant="outline"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-red-400 hover:bg-red-500/20"
                                  >
                                    ×
                                  </Button>
                                )}
                              </div>
                            </div>
                            {editingSkills && isAdmin ? (
                              <Slider
                                value={[skill.level]}
                                onValueChange={(value) => updateSkillLevel(categoryIndex, skillIndex, value)}
                                max={100}
                                step={1}
                                className={`${isDark ? "accent-purple-500" : "accent-cyan-500"}`}
                              />
                            ) : (
                              <Progress
                                value={skill.level}
                                className={`h-2 ${isDark ? "bg-purple-900/30" : "bg-cyan-900/30"}`}
                              />
                            )}
                          </div>
                        ))}

                        {/* Add New Skill Form */}
                        {isAdmin && editingSkills && (
                          <div className="mt-4 p-3 border-t border-gray-600 space-y-2">
                            <Input
                              placeholder="New skill name"
                              value={newSkillName}
                              onChange={(e) => setNewSkillName(e.target.value)}
                              className="text-sm"
                            />
                            <div className="flex items-center gap-2">
                              <Slider
                                value={[newSkillLevel]}
                                onValueChange={(value) => setNewSkillLevel(value[0])}
                                max={100}
                                step={1}
                                className="flex-1"
                              />
                              <span className="text-xs text-gray-400 w-8">{newSkillLevel}%</span>
                            </div>
                            <Button
                              onClick={() => {
                                setSelectedCategory(categoryIndex)
                                addSkill()
                              }}
                              size="sm"
                              className={`w-full text-xs ${isDark ? "bg-purple-500 hover:bg-purple-600" : "bg-cyan-500 hover:bg-cyan-600"}`}
                            >
                              Add Skill
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-8">
              <div className="text-center">
                <h2
                  className={`text-4xl md:text-5xl font-bold mb-16 font-orbitron ${isDark ? "text-purple-400" : "text-cyan-500"}`}
                >
                  My Projects
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {projects.map((project) => (
                    <Card
                      key={project.id}
                      className={`group cursor-pointer transition-all duration-500 hover:scale-105 tilt-card ${isDark ? "bg-black/50 border-purple-500/30 hover:border-purple-500 hover:shadow-[0_0_40px_rgba(155,89,182,0.4)]" : "bg-white/50 border-cyan-500/30 hover:border-cyan-500 hover:shadow-[0_0_40px_rgba(0,255,255,0.4)]"}`}
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <Image
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-4 right-4">
                              <ExternalLink className={`h-6 w-6 ${isDark ? "text-purple-400" : "text-cyan-500"}`} />
                            </div>
                          </div>
                          <div
                            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${project.status === "completed" ? "bg-green-500/80 text-white" : project.status === "in-progress" ? "bg-yellow-500/80 text-white" : "bg-blue-500/80 text-white"}`}
                          >
                            {project.status}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3
                            className={`text-xl font-bold mb-3 font-rajdhani ${isDark ? "text-purple-300" : "text-cyan-600"}`}
                          >
                            {project.title}
                          </h3>
                          <p className="text-gray-400 mb-4 font-exo">{project.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.tech.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${isDark ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-cyan-500/20 text-cyan-600 border border-cyan-500/30"}`}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Design & Video Tab */}
            <TabsContent value="media" className="space-y-8">
              <div className="text-center">
                <h2
                  className={`text-4xl md:text-5xl font-bold mb-16 font-orbitron ${isDark ? "text-purple-400" : "text-cyan-500"}`}
                >
                  Design & Video
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {videos.map((video, index) => (
                    <Card
                      key={index}
                      className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${isDark ? "bg-black/50 border-purple-500/30 hover:border-purple-500 hover:shadow-[0_0_30px_rgba(155,89,182,0.3)]" : "bg-white/50 border-cyan-500/30 hover:border-cyan-500 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]"}`}
                    >
                      <CardContent className="p-0">
                        <div className="relative">
                          <Image
                            src={video.thumbnail || "/placeholder.svg"}
                            alt={video.title}
                            width={320}
                            height={180}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg">
                            <Play className={`h-12 w-12 ${isDark ? "text-purple-400" : "text-cyan-500"}`} />
                          </div>
                          <div
                            className={`absolute bottom-2 right-2 px-2 py-1 rounded text-sm font-semibold ${isDark ? "bg-purple-500/80 text-white" : "bg-cyan-500/80 text-white"}`}
                          >
                            {video.duration}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg font-rajdhani">{video.title}</h3>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {isAdmin && (
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button
                      size="lg"
                      className={`rounded-full px-8 py-4 font-semibold transition-all duration-300 hover:scale-105 ${isDark ? "bg-purple-500 hover:bg-purple-600 hover:shadow-[0_0_30px_rgba(155,89,182,0.8)]" : "bg-cyan-500 hover:bg-cyan-600 hover:shadow-[0_0_30px_rgba(0,255,255,0.8)]"}`}
                    >
                      <Video className="h-5 w-5 mr-2" />
                      Upload Video
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className={`rounded-full px-8 py-4 font-semibold transition-all duration-300 hover:scale-105 ${isDark ? "border-purple-500 hover:bg-purple-500/20" : "border-cyan-500 hover:bg-cyan-500/20"}`}
                    >
                      <ImageIcon className="h-5 w-5 mr-2" />
                      Upload Image
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className={`rounded-full px-8 py-4 font-semibold transition-all duration-300 hover:scale-105 ${isDark ? "border-purple-500 hover:bg-purple-500/20" : "border-cyan-500 hover:bg-cyan-500/20"}`}
                    >
                      <Music className="h-5 w-5 mr-2" />
                      Upload Audio
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Games Tab */}
            <TabsContent value="games" className="space-y-8">
              <div className="text-center">
                <h2
                  className={`text-4xl md:text-5xl font-bold mb-16 font-orbitron ${isDark ? "text-purple-400" : "text-cyan-500"}`}
                >
                  Challenge Zone
                </h2>

                {/* Game Selection */}
                <div className="flex justify-center gap-4 mb-8">
                  <Button
                    onClick={() => setActiveGame("chess")}
                    variant={activeGame === "chess" ? "default" : "outline"}
                    className={`${isDark ? "bg-purple-500 hover:bg-purple-600" : "bg-cyan-500 hover:bg-cyan-600"}`}
                  >
                    ♟️ Chess Battle
                  </Button>
                  <Button
                    onClick={() => setActiveGame("ctf")}
                    variant={activeGame === "ctf" ? "default" : "outline"}
                    className={`${isDark ? "bg-purple-500 hover:bg-purple-600" : "bg-cyan-500 hover:bg-cyan-600"}`}
                  >
                    🛡️ Hack Me CTF
                  </Button>
                </div>

                {activeGame === "chess" && <ChessGame isDark={isDark} />}
                {activeGame === "ctf" && <CTFGame isDark={isDark} />}
              </div>
            </TabsContent>

            {/* Admin Tab */}
            {isAdmin && (
              <TabsContent value="admin" className="space-y-8">
                <div className="text-center">
                  <h2
                    className={`text-4xl md:text-5xl font-bold mb-16 font-orbitron ${isDark ? "text-purple-400" : "text-cyan-500"}`}
                  >
                    Admin Control Panel
                  </h2>
                  <div className="max-w-4xl mx-auto space-y-6">
                    {/* Skills Management */}
                    <Card
                      className={`p-6 ${isDark ? "bg-black/50 border-purple-500/30" : "bg-white/50 border-cyan-500/30"}`}
                    >
                      <CardHeader>
                        <CardTitle className={`${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                          Skills Management
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-exo mb-4">
                          Go to the Skills tab and click "Edit Skills" to modify mastery levels with interactive
                          sliders.
                        </p>
                        <Button
                          onClick={() => setActiveTab("skills")}
                          className={`${isDark ? "bg-purple-500 hover:bg-purple-600" : "bg-cyan-500 hover:bg-cyan-600"}`}
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Manage Skills
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Media Upload */}
                    <Card
                      className={`p-6 ${isDark ? "bg-black/50 border-purple-500/30" : "bg-white/50 border-cyan-500/30"}`}
                    >
                      <CardHeader>
                        <CardTitle className={`${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                          Media Upload Center
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-exo mb-4">
                          Upload videos, images, and audio files to the Design & Video section.
                        </p>
                        <Button
                          onClick={() => setActiveTab("media")}
                          className={`${isDark ? "bg-purple-500 hover:bg-purple-600" : "bg-cyan-500 hover:bg-cyan-600"}`}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Go to Media Upload
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Project Management */}
                    <div className="space-y-4">
                      <h3 className={`text-xl font-bold font-rajdhani ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                        Project Management
                      </h3>
                      {projects.map((project) => (
                        <Card
                          key={project.id}
                          className={`p-4 ${isDark ? "bg-black/30 border-purple-500/20" : "bg-white/30 border-cyan-500/20"}`}
                        >
                          <CardContent className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Image
                                src={project.image || "/placeholder.svg"}
                                alt={project.title}
                                width={60}
                                height={40}
                                className="rounded object-cover"
                              />
                              <div className="text-left">
                                <h4
                                  className={`font-bold font-rajdhani ${isDark ? "text-purple-300" : "text-cyan-600"}`}
                                >
                                  {project.title}
                                </h4>
                                <p className="text-sm text-gray-400 font-exo">{project.status}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className={`${isDark ? "border-purple-500/50 hover:bg-purple-500/20" : "border-cyan-500/50 hover:bg-cyan-500/20"}`}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className={`${isDark ? "border-purple-500/50 hover:bg-purple-500/20" : "border-cyan-500/50 hover:bg-cyan-500/20"}`}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot isDark={isDark} />

      {/* Footer with Hidden Password Hint */}
      <footer
        className={`py-12 text-center border-t relative z-10 ${isDark ? "border-purple-500/30" : "border-cyan-500/30"}`}
      >
        <p className="font-exo">© 2024 N1cht "Achraf Lemrani". Crafted with passion and code.</p>
        <p className="text-xs text-gray-600 mt-2 opacity-30">🔑 nacht faust</p>
      </footer>
    </div>
  )
}
