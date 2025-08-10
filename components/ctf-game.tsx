"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, Eye, Wifi, Trophy, Target, CheckCircle, XCircle, Lightbulb, Flag } from "lucide-react"

const CTFGame = ({ isDark }) => {
  const [completedChallenges, setCompletedChallenges] = useState(new Set())
  const [currentAnswers, setCurrentAnswers] = useState({})
  const [showHints, setShowHints] = useState({})
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState({})

  const challenges = {
    crypto: [
      {
        id: "crypto1",
        title: "Caesar's Secret",
        difficulty: "Easy",
        points: 100,
        description: "Julius Caesar used this cipher to protect his messages. Can you decode this?",
        challenge: "WKLV LV D VHFUHW PHVVDJH",
        hint: "Try shifting each letter by 3 positions backward in the alphabet",
        answer: "THIS IS A SECRET MESSAGE",
        explanation: "Caesar cipher with shift of 3. Each letter is shifted 3 positions forward in the alphabet.",
      },
      {
        id: "crypto2",
        title: "Base64 Mystery",
        difficulty: "Easy",
        points: 150,
        description: "This looks like encoded text. What encoding method was used?",
        challenge: "SGFja2VyIEZsYWc6IENURntCYXNlNjRfRGVjb2RlZH0=",
        hint: "This is a common encoding method used in web applications, often ending with '='",
        answer: "CTF{Base64_Decoded}",
        explanation: "Base64 encoding. Decode the string to reveal the flag.",
      },
      {
        id: "crypto3",
        title: "XOR Challenge",
        difficulty: "Medium",
        points: 200,
        description: "XOR encryption with a single byte key. The key is the ASCII value of 'K'.",
        challenge: "Encrypted hex: 1f0a1c0e1b1c0a1f0e1b1c0a1f0e1b1c",
        hint: "XOR each byte with 75 (ASCII value of 'K'). Convert hex to bytes first.",
        answer: "CTF{XOR_MASTER}",
        explanation: "XOR each hex byte with 0x4B (75 in decimal, ASCII 'K') to get the flag.",
      },
    ],
    web: [
      {
        id: "web1",
        title: "Hidden Flag",
        difficulty: "Easy",
        points: 100,
        description: "Sometimes the most obvious place is the best hiding spot.",
        challenge: " CTF{HTML_COMMENTS_ARE_VISIBLE} ",
        hint: "Check the HTML source code for comments",
        answer: "CTF{HTML_COMMENTS_ARE_VISIBLE}",
        explanation: "The flag is hidden in an HTML comment. Always check the source code!",
      },
      {
        id: "web2",
        title: "SQL Injection",
        difficulty: "Medium",
        points: 200,
        description: "Login bypass challenge. Username: admin, Password: ?",
        challenge: "SELECT * FROM users WHERE username='admin' AND password='[YOUR_INPUT]'",
        hint: "Try to make the password check always return true using SQL logic",
        answer: "' OR '1'='1",
        explanation: "SQL injection payload that makes the WHERE clause always true: ' OR '1'='1",
      },
      {
        id: "web3",
        title: "Directory Traversal",
        difficulty: "Hard",
        points: 300,
        description: "Can you access the secret file outside the web directory?",
        challenge: "URL: /view?file=welcome.txt",
        hint: "Try using ../ to navigate up directories to access /etc/passwd or similar",
        answer: "../../../etc/passwd",
        explanation: "Directory traversal using ../ to escape the web directory and access system files.",
      },
    ],
    forensics: [
      {
        id: "forensics1",
        title: "Hidden Message",
        difficulty: "Easy",
        points: 100,
        description: "There's a secret message hidden in this text using steganography.",
        challenge: "The Quick Brown Fox Jumps Over The Lazy Dog",
        hint: "Look at the first letter of each word",
        answer: "TQBFJOTLD",
        explanation: "Take the first letter of each word to reveal the hidden message.",
      },
      {
        id: "forensics2",
        title: "Binary Analysis",
        difficulty: "Medium",
        points: 200,
        description: "Convert this binary to ASCII to find the flag.",
        challenge: "0100001101010100010001100111101101000010010010010100111001000001010100100101100101111101",
        hint: "Split into 8-bit chunks and convert each to ASCII characters",
        answer: "CTF{BINARY}",
        explanation: "Binary to ASCII conversion: split into 8-bit groups and convert each to its ASCII character.",
      },
      {
        id: "forensics3",
        title: "Hex Dump Analysis",
        difficulty: "Hard",
        points: 300,
        description: "Analyze this hex dump to find the hidden flag.",
        challenge: "43 54 46 7B 48 45 58 5F 41 4E 41 4C 59 53 49 53 7D",
        hint: "Convert each hex pair to its ASCII character",
        answer: "CTF{HEX_ANALYSIS}",
        explanation: "Hex to ASCII conversion: each pair of hex digits represents one ASCII character.",
      },
    ],
    network: [
      {
        id: "network1",
        title: "Port Scanner",
        difficulty: "Easy",
        points: 100,
        description: "Which port is commonly used for HTTP traffic?",
        challenge: "Standard web server port number",
        hint: "It's the default port for unencrypted web traffic",
        answer: "80",
        explanation: "Port 80 is the standard port for HTTP (unencrypted web) traffic.",
      },
      {
        id: "network2",
        title: "Protocol Analysis",
        difficulty: "Medium",
        points: 200,
        description: "What protocol is used for secure web traffic?",
        challenge: "Encrypted web communication protocol",
        hint: "It's HTTP but with encryption (SSL/TLS)",
        answer: "HTTPS",
        explanation: "HTTPS (HTTP Secure) is HTTP over SSL/TLS encryption for secure web communication.",
      },
      {
        id: "network3",
        title: "Packet Analysis",
        difficulty: "Hard",
        points: 300,
        description: "In a TCP handshake, what are the three steps?",
        challenge: "Three-way handshake sequence",
        hint: "SYN, SYN-ACK, and then what?",
        answer: "SYN, SYN-ACK, ACK",
        explanation: "TCP three-way handshake: 1) SYN, 2) SYN-ACK, 3) ACK to establish connection.",
      },
    ],
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "crypto":
        return Lock
      case "web":
        return Shield
      case "forensics":
        return Eye
      case "network":
        return Wifi
      default:
        return Target
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "crypto":
        return isDark ? "text-yellow-400" : "text-yellow-600"
      case "web":
        return isDark ? "text-red-400" : "text-red-600"
      case "forensics":
        return isDark ? "text-green-400" : "text-green-600"
      case "network":
        return isDark ? "text-blue-400" : "text-blue-600"
      default:
        return isDark ? "text-purple-400" : "text-purple-600"
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500"
      case "Medium":
        return "bg-yellow-500"
      case "Hard":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleSubmit = (challengeId, category) => {
    const answer = currentAnswers[challengeId]?.trim()
    if (!answer) return

    const challenge = challenges[category].find((c) => c.id === challengeId)
    const isCorrect = answer.toLowerCase() === challenge.answer.toLowerCase()

    if (isCorrect) {
      setCompletedChallenges((prev) => new Set([...prev, challengeId]))
      setScore((prev) => prev + challenge.points)
      setCurrentAnswers((prev) => ({ ...prev, [challengeId]: "" }))
    } else {
      setAttempts((prev) => ({ ...prev, [challengeId]: (prev[challengeId] || 0) + 1 }))
    }
  }

  const toggleHint = (challengeId) => {
    setShowHints((prev) => ({ ...prev, [challengeId]: !prev[challengeId] }))
  }

  const totalChallenges = Object.values(challenges).flat().length
  const completedCount = completedChallenges.size
  const progressPercentage = (completedCount / totalChallenges) * 100

  return (
    <Card
      className={`max-w-6xl mx-auto ${isDark ? "bg-black/50 border-purple-500/30" : "bg-white/50 border-cyan-500/30"}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
            <Shield className="h-6 w-6" />
            🛡️ Hack Me - CTF Challenges
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              <Trophy className="h-4 w-4 mr-1" />
              {score} pts
            </Badge>
            <Badge variant="outline" className={isDark ? "border-purple-500/50" : "border-cyan-500/50"}>
              {completedCount}/{totalChallenges} Complete
            </Badge>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className={isDark ? "text-purple-200" : "text-cyan-700"}>Progress</span>
            <span className={isDark ? "text-purple-200" : "text-cyan-700"}>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className={`h-2 ${isDark ? "bg-purple-900/50" : "bg-cyan-100"}`} />
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="crypto" className="w-full">
          <TabsList className={`grid w-full grid-cols-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
            {Object.keys(challenges).map((category) => {
              const Icon = getCategoryIcon(category)
              const completed = challenges[category].filter((c) => completedChallenges.has(c.id)).length
              const total = challenges[category].length

              return (
                <TabsTrigger
                  key={category}
                  value={category}
                  className={`flex items-center gap-2 ${getCategoryColor(category)}`}
                >
                  <Icon className="h-4 w-4" />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                  <Badge variant="secondary" className="text-xs">
                    {completed}/{total}
                  </Badge>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {Object.entries(challenges).map(([category, categoryChalls]) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid gap-6">
                {categoryChalls.map((challenge) => {
                  const isCompleted = completedChallenges.has(challenge.id)
                  const attemptCount = attempts[challenge.id] || 0
                  const showHint = showHints[challenge.id]

                  return (
                    <Card
                      key={challenge.id}
                      className={`${
                        isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/50 border-gray-200"
                      } ${isCompleted ? "ring-2 ring-green-500/50" : ""}`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                              {React.createElement(getCategoryIcon(category), {
                                className: `h-5 w-5 ${getCategoryColor(category)}`,
                              })}
                            </div>
                            <div>
                              <h3 className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                                {challenge.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={`${getDifficultyColor(challenge.difficulty)} text-white text-xs`}>
                                  {challenge.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {challenge.points} pts
                                </Badge>
                              </div>
                            </div>
                          </div>
                          {isCompleted && <CheckCircle className="h-6 w-6 text-green-500" />}
                        </div>
                      </CardHeader>

                      <CardContent>
                        <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{challenge.description}</p>

                        <div
                          className={`p-4 rounded-lg mb-4 font-mono text-sm ${
                            isDark ? "bg-gray-900 text-green-400" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {challenge.challenge}
                        </div>

                        {showHint && (
                          <Alert className="mb-4">
                            <Lightbulb className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Hint:</strong> {challenge.hint}
                            </AlertDescription>
                          </Alert>
                        )}

                        {isCompleted && (
                          <Alert className="mb-4 border-green-500/50 bg-green-500/10">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <AlertDescription className="text-green-700 dark:text-green-300">
                              <strong>Solved!</strong> {challenge.explanation}
                            </AlertDescription>
                          </Alert>
                        )}

                        {!isCompleted && (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Enter your answer..."
                                value={currentAnswers[challenge.id] || ""}
                                onChange={(e) =>
                                  setCurrentAnswers((prev) => ({
                                    ...prev,
                                    [challenge.id]: e.target.value,
                                  }))
                                }
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    handleSubmit(challenge.id, category)
                                  }
                                }}
                                className={isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}
                              />
                              <Button
                                onClick={() => handleSubmit(challenge.id, category)}
                                className={
                                  isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-cyan-600 hover:bg-cyan-700"
                                }
                              >
                                <Flag className="h-4 w-4 mr-1" />
                                Submit
                              </Button>
                            </div>

                            <div className="flex justify-between items-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleHint(challenge.id)}
                                className={
                                  isDark ? "text-purple-400 hover:text-purple-300" : "text-cyan-600 hover:text-cyan-700"
                                }
                              >
                                <Lightbulb className="h-4 w-4 mr-1" />
                                {showHint ? "Hide Hint" : "Show Hint"}
                              </Button>

                              {attemptCount > 0 && (
                                <div className="flex items-center gap-1 text-sm text-red-500">
                                  <XCircle className="h-4 w-4" />
                                  {attemptCount} failed attempt{attemptCount > 1 ? "s" : ""}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Achievement Section */}
        {completedCount > 0 && (
          <Card
            className={`mt-6 ${isDark ? "bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30" : "bg-gradient-to-r from-cyan-100/30 to-blue-100/30 border-cyan-500/30"}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Trophy className={`h-6 w-6 ${isDark ? "text-yellow-400" : "text-yellow-600"}`} />
                <div>
                  <h3 className={`font-bold ${isDark ? "text-purple-300" : "text-cyan-600"}`}>🎉 Great Progress!</h3>
                  <p className={`text-sm ${isDark ? "text-purple-200" : "text-cyan-700"}`}>
                    You've completed {completedCount} challenge{completedCount > 1 ? "s" : ""} and earned {score}{" "}
                    points!
                    {completedCount === totalChallenges && " 🏆 Congratulations, you're a CTF Master!"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}

export default CTFGame
