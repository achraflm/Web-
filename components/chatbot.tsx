"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

interface ChatbotProps {
  isDark: boolean
}

export default function Chatbot({ isDark }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm N1cht's AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputMessage,
        isUser: true,
        timestamp: new Date(),
      }

      setMessages([...messages, newMessage])
      setInputMessage("")

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: messages.length + 2,
          text: getAIResponse(inputMessage),
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
      }, 1000)
    }
  }

  const getAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("skills") || lowerMessage.includes("programming")) {
      return "N1cht specializes in Python, JavaScript/TypeScript, React/Next.js, machine learning, cybersecurity, and algorithmic trading. He's also skilled in creative design with After Effects and video editing!"
    }

    if (lowerMessage.includes("projects") || lowerMessage.includes("work")) {
      return "N1cht has worked on various projects including AI-powered trading bots, cybersecurity dashboards, data science platforms, and video content studios. Each project combines technical expertise with creative vision!"
    }

    if (lowerMessage.includes("contact") || lowerMessage.includes("email")) {
      return "You can reach N1cht at achraf.lemrani@gmail.com or connect through his social media links on GitHub, LinkedIn, and Instagram!"
    }

    if (lowerMessage.includes("chess") || lowerMessage.includes("game")) {
      return "N1cht has built an interactive chess game with AI opponent and a CTF hacking challenge! You can find them in the Games section. Try challenging the AI!"
    }

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! Welcome to N1cht's portfolio. I'm here to help you learn more about his skills, projects, and experience. What would you like to know?"
    }

    return "That's an interesting question! N1cht is passionate about combining technology with creativity. Feel free to explore his portfolio sections or ask me about his skills, projects, or how to get in touch!"
  }

  return (
    <>
      {/* Chat Toggle Button */}
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

      {/* Chat Window */}
      {isOpen && (
        <Card
          className={`fixed bottom-24 right-6 z-50 w-80 h-96 shadow-2xl transition-all duration-300 ${
            isDark
              ? "bg-black/90 border-purple-500/50 backdrop-blur-sm"
              : "bg-white/90 border-cyan-500/50 backdrop-blur-sm"
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle className={`text-lg font-rajdhani ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
              N1cht Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm font-exo ${
                      message.isUser
                        ? isDark
                          ? "bg-purple-500 text-white"
                          : "bg-cyan-500 text-white"
                        : isDark
                          ? "bg-gray-800 text-gray-200"
                          : "bg-gray-100 text-gray-800"
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
                className={`flex-1 ${isDark ? "border-purple-500/50" : "border-cyan-500/50"}`}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage()
                  }
                }}
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
