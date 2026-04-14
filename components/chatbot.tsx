"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, MessageCircle, X } from "lucide-react"

interface ChatbotProps {
  isDark: boolean
}

export default function Chatbot({ isDark }: ChatbotProps) {
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hello! I'm your AI assistant. How can I help you today?" },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleSendMessage = async () => {
    if (input.trim() === "") return

    const userMessage = { sender: "user" as const, text: input.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const responses = [
      `That's interesting! You mentioned: "${userMessage.text}". Tell me more!`,
      `I understand. "${userMessage.text}" is a great point. How can I assist further?`,
      `Thanks for sharing! Regarding "${userMessage.text}", I'm here to help.`,
      `Got it! "${userMessage.text}" - let me know if you need any clarification.`,
    ]

    const botResponse = {
      sender: "bot" as const,
      text: responses[Math.floor(Math.random() * responses.length)],
    }
    setMessages((prev) => [...prev, botResponse])
    setIsTyping(false)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={`fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg transition-all duration-300 hover:scale-110 ${
          isDark
            ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 border-purple-500"
            : "bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 border-cyan-500"
        }`}
      >
        {isOpen ? <X className="h-5 w-5 text-white" /> : <MessageCircle className="h-5 w-5 text-white" />}
      </Button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50">
          <Card
            className={`w-96 h-[500px] flex flex-col ${
              isDark ? "bg-black/95 border-purple-500/50" : "bg-white/95 border-cyan-500/50"
            } backdrop-blur-sm shadow-2xl rounded-lg`}
          >
            <CardHeader className="pb-3 border-b">
              <CardTitle
                className={`flex items-center gap-2 text-base ${isDark ? "text-purple-300" : "text-cyan-600"}`}
              >
                <Bot className="h-5 w-5" />
                AI Assistant
              </CardTitle>
              <p className={`text-xs ${isDark ? "text-purple-200/60" : "text-cyan-700/60"}`}>
                Ask me anything about the portfolio
              </p>
            </CardHeader>

            <CardContent className="flex flex-col flex-1 p-4 overflow-hidden">
              <ScrollArea className="flex-1 pr-4 mb-4">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.sender === "bot" && (
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isDark ? "bg-purple-600" : "bg-cyan-600"
                          } text-white`}
                        >
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-lg max-w-[75%] text-sm leading-relaxed ${
                          msg.sender === "user"
                            ? isDark
                              ? "bg-purple-700 text-white rounded-br-none"
                              : "bg-cyan-600 text-white rounded-br-none"
                            : isDark
                              ? "bg-gray-700 text-gray-100 rounded-bl-none"
                              : "bg-gray-200 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                      {msg.sender === "user" && (
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isDark ? "bg-gray-600" : "bg-gray-400"
                          } text-white`}
                        >
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-end gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isDark ? "bg-purple-600" : "bg-cyan-600"
                        } text-white`}
                      >
                        <Bot className="h-4 w-4" />
                      </div>
                      <div
                        className={`p-3 rounded-lg text-sm ${
                          isDark ? "bg-gray-700 text-gray-100" : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <span className="animate-pulse">Typing...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex gap-2 border-t pt-3">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !isTyping) handleSendMessage()
                  }}
                  className={`text-sm flex-1 ${
                    isDark
                      ? "bg-gray-800 border-purple-700 text-white placeholder-gray-500"
                      : "bg-gray-50 border-cyan-700 text-gray-900 placeholder-gray-400"
                  }`}
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className={`${isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-cyan-600 hover:bg-cyan-700"}`}
                  disabled={isTyping || input.trim() === ""}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
