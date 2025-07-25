"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send } from "lucide-react"

export default function Chatbot({ isDark }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm N1cht's AI assistant. How can I help you today?", isBot: true },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const botResponses = {
    hello: "Hello! Welcome to N1cht's portfolio. I can help you learn more about Achraf's skills and projects.",
    skills:
      "N1cht specializes in Programming, Data Science, Cybersecurity, Finance & Trading, and Creative Design. Check out the Skills tab for detailed breakdowns!",
    projects:
      "N1cht has worked on AI Trading Bots, Cybersecurity Dashboards, Data Science Platforms, and Video Content Studios. Visit the Projects tab to see more!",
    contact: "You can reach N1cht at achraf.lemrani@gmail.com or through his social media links.",
    chess: "Want to play chess? Check out the Games tab for the Angels vs Demons chess game!",
    cv: "To download N1cht's CV, click the profile icon in the top-right corner. You'll need the password though! 😉",
    admin: "The admin panel is protected. Only N1cht has access to edit content and manage the portfolio.",
    default:
      "That's interesting! You can explore N1cht's portfolio using the tabs above, or ask me about his skills, projects, or contact information.",
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage = { id: Date.now(), text: inputMessage, isBot: false }
    setMessages((prev) => [...prev, userMessage])

    // Simple bot response logic
    const lowerInput = inputMessage.toLowerCase()
    let response = botResponses.default

    for (const [key, value] of Object.entries(botResponses)) {
      if (lowerInput.includes(key)) {
        response = value
        break
      }
    }

    setTimeout(() => {
      const botMessage = { id: Date.now() + 1, text: response, isBot: true }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)

    setInputMessage("")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-full w-14 h-14 shadow-lg transition-all duration-300 hover:scale-110 ${
            isDark
              ? "bg-purple-500 hover:bg-purple-600 hover:shadow-[0_0_30px_rgba(155,89,182,0.8)]"
              : "bg-cyan-500 hover:bg-cyan-600 hover:shadow-[0_0_30px_rgba(0,255,255,0.8)]"
          }`}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-96">
          <Card
            className={`h-full ${isDark ? "bg-black/90 border-purple-500/50" : "bg-white/90 border-cyan-500/50"} backdrop-blur-sm`}
          >
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                N1cht's AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full pb-4">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[80%] p-2 rounded-lg text-sm ${
                        message.isBot
                          ? isDark
                            ? "bg-purple-900/50 text-purple-100"
                            : "bg-cyan-100 text-cyan-900"
                          : isDark
                            ? "bg-purple-500 text-white"
                            : "bg-cyan-500 text-white"
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
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className={`flex-1 text-sm ${isDark ? "border-purple-500/50" : "border-cyan-500/50"}`}
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
        </div>
      )}
    </>
  )
}
