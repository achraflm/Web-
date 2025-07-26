"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function Chatbot({ isDark }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm N1cht's AI assistant. Ask me anything about his skills, projects, or experience!",
      isBot: true,
    },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const botResponses = {
    skills:
      "N1cht is proficient in Python, JavaScript/TypeScript, React/Next.js, Machine Learning, Cybersecurity, Algorithmic Trading, and Video Editing with After Effects!",
    projects:
      "Some of N1cht's notable projects include an AI-Powered Trading Bot, Cybersecurity Dashboard, Data Science Platform, and Video Content Studio.",
    experience:
      "N1cht has expertise in multiple domains including algorithmic trading, cybersecurity, data science, and creative design with a focus on innovative solutions.",
    contact:
      "You can reach N1cht at achraf.lemrani@gmail.com or through his social media links on GitHub, LinkedIn, and Instagram.",
    trading:
      "N1cht specializes in algorithmic trading with advanced machine learning predictions, risk management, and portfolio optimization strategies.",
    cybersecurity:
      "N1cht's cybersecurity expertise includes penetration testing, network security, incident response, and compliance with industry standards.",
    default:
      "That's an interesting question! N1cht is always exploring new technologies and creative solutions. Feel free to ask about his skills, projects, or experience!",
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
    }

    setMessages((prev) => [...prev, userMessage])

    // Simple keyword-based response
    const lowerInput = inputMessage.toLowerCase()
    let response = botResponses.default

    if (lowerInput.includes("skill") || lowerInput.includes("technology")) {
      response = botResponses.skills
    } else if (lowerInput.includes("project")) {
      response = botResponses.projects
    } else if (lowerInput.includes("experience") || lowerInput.includes("background")) {
      response = botResponses.experience
    } else if (lowerInput.includes("contact") || lowerInput.includes("email")) {
      response = botResponses.contact
    } else if (lowerInput.includes("trading") || lowerInput.includes("finance")) {
      response = botResponses.trading
    } else if (lowerInput.includes("security") || lowerInput.includes("cyber")) {
      response = botResponses.cybersecurity
    }

    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: response,
        isBot: true,
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)

    setInputMessage("")
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg transition-all duration-300 ${
          isDark
            ? "bg-purple-500 hover:bg-purple-600 hover:shadow-[0_0_30px_rgba(155,89,182,0.8)]"
            : "bg-cyan-500 hover:bg-cyan-600 hover:shadow-[0_0_30px_rgba(0,255,255,0.8)]"
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chatbot Window */}
      {isOpen && (
        <Card
          className={`fixed bottom-24 right-6 z-50 w-80 h-96 shadow-2xl transition-all duration-300 ${
            isDark ? "bg-black/90 border-purple-500/50" : "bg-white/90 border-cyan-500/50"
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
              N1cht's AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full p-4">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      message.isBot
                        ? isDark
                          ? "bg-purple-500/20 text-purple-100"
                          : "bg-cyan-500/20 text-cyan-800"
                        : isDark
                          ? "bg-gray-700 text-white"
                          : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything..."
                className={`flex-1 text-sm ${
                  isDark ? "border-purple-500/50 bg-black/50" : "border-cyan-500/50 bg-white/50"
                }`}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                size="sm"
                className={`${isDark ? "bg-purple-500 hover:bg-purple-600" : "bg-cyan-500 hover:bg-cyan-600"}`}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
