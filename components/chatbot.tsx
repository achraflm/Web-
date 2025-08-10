"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Minimize2, X, Bot, User, Sparkles } from "lucide-react"

const ChatBot = ({ isDark }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "👋 Hey! I'm Achraf's AI assistant. Ask me anything about him or his work!",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // --- Basic keyword intelligence ---
  const knowledgeBase = {
    skills: {
      keywords: ["skills", "technologies", "programming"],
      response: "🚀 Achraf works with React, Next.js, Python, Node.js, and more!",
    },
    projects: {
      keywords: ["projects", "portfolio"],
      response: "💼 Achraf built a Chess AI, Cybersecurity CTF platform, and several games.",
    },
  }

  // --- Simulated AI replies for unknown questions ---
  const fillerReplies = [
    "Hmm 🤔 interesting question! I’ll need to think about that.",
    "I’m not 100% sure, but I can find out for you!",
    "That’s outside my main knowledge, but Achraf might know!",
    "Let’s see… oh! That’s a tricky one!",
  ]

  const generateResponse = (userMessage) => {
    const lower = userMessage.toLowerCase()
    for (const [_, data] of Object.entries(knowledgeBase)) {
      if (data.keywords.some((kw) => lower.includes(kw))) return data.response
    }
    return fillerReplies[Math.floor(Math.random() * fillerReplies.length)]
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMsg = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInputMessage("")
    setIsTyping(true)

    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        type: "bot",
        content: generateResponse(userMsg.content),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg ${
            isDark
              ? "bg-gradient-to-r from-purple-500 to-pink-500"
              : "bg-gradient-to-r from-cyan-500 to-blue-500"
          }`}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card
          className={`fixed bottom-20 right-6 z-50 w-80 h-[400px] shadow-2xl flex flex-col ${
            isDark
              ? "bg-gray-900 border-purple-500/30"
              : "bg-white border-cyan-500/30"
          }`}
        >
          <CardHeader className="py-2 flex justify-between items-center">
            <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
              <Bot className="h-4 w-4" /> AI Assistant
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" /> Online
              </Badge>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex flex-col flex-1 p-3">
            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-2 text-sm ${
                        m.type === "user"
                          ? isDark ? "bg-purple-600 text-white" : "bg-cyan-600 text-white"
                          : isDark ? "bg-gray-800 text-purple-100" : "bg-gray-100 text-cyan-900"
                      }`}
                    >
                      {m.content}
                      <div className="text-[10px] opacity-70 mt-1">
                        {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className={`p-2 rounded-lg text-sm ${isDark ? "bg-gray-800 text-purple-100" : "bg-gray-100 text-cyan-900"}`}>
                      Typing...
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="flex gap-2 mt-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className={isDark ? "bg-gray-800 text-purple-100" : "bg-white text-cyan-900"}
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping} className={isDark ? "bg-purple-600" : "bg-cyan-600"}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default ChatBot
