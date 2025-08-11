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
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleSendMessage = async () => {
    if (input.trim() === "") return

    const userMessage = { sender: "user", text: input.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate bot response
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const botResponse = { sender: "bot", text: `Echo: ${userMessage.text}` }
    setMessages((prev) => [...prev, botResponse])
    setIsTyping(false)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={`fixed bottom-6 left-6 z-50 rounded-full w-10 h-10 shadow-lg transition-all duration-300 ${
          isDark
            ? "bg-purple-600 hover:bg-purple-700 border-purple-500"
            : "bg-cyan-600 hover:bg-cyan-700 border-cyan-500"
        }`}
      >
        {isOpen ? <X className="h-4 w-4 text-white" /> : <MessageCircle className="h-4 w-4 text-white" />}
      </Button>

      {isOpen && (
        <div className="fixed bottom-20 left-6 z-50">
          <Card
            className={`w-80 h-96 ${
              isDark ? "bg-black/90 border-purple-500/50" : "bg-white/90 border-cyan-500/50"
            } backdrop-blur-sm shadow-xl`}
          >
            <CardHeader className="pb-2">
              <CardTitle className={`flex items-center gap-2 text-sm ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                <Bot className="h-4 w-4" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[280px] p-3">
              <ScrollArea className="flex-1 p-2 border rounded-md mb-3">
                <div className="space-y-3">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.sender === "bot" && (
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isDark ? "bg-purple-600" : "bg-cyan-600"
                          } text-white`}
                        >
                          <Bot className="h-3 w-3" />
                        </div>
                      )}
                      <div
                        className={`p-2 rounded-lg max-w-[70%] text-sm ${
                          msg.sender === "user"
                            ? isDark
                              ? "bg-purple-700 text-white"
                              : "bg-cyan-600 text-white"
                            : isDark
                              ? "bg-gray-700 text-gray-100"
                              : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {msg.text}
                      </div>
                      {msg.sender === "user" && (
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isDark ? "bg-gray-600" : "bg-gray-400"
                          } text-white`}
                        >
                          <User className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isDark ? "bg-purple-600" : "bg-cyan-600"
                        } text-white`}
                      >
                        <Bot className="h-3 w-3" />
                      </div>
                      <div
                        className={`p-2 rounded-lg max-w-[70%] text-sm ${
                          isDark ? "bg-gray-700 text-gray-100" : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <span className="animate-pulse">...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSendMessage()
                  }}
                  className={`text-sm ${isDark ? "bg-gray-800 border-purple-700 text-white" : "bg-gray-50 border-cyan-700"}`}
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className={isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-cyan-600 hover:bg-cyan-700"}
                  disabled={isTyping}
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
