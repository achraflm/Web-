"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CTFGameProps {
  isDark: boolean
}

interface Challenge {
  id: number
  title: string
  description: string
  hint: string
  flag: string
  points: number
  solved: boolean
}

export default function CTFGame({ isDark }: CTFGameProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<number>(1)
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState("")

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 1,
      title: "Base64 Decoder",
      description: "Decode this Base64 string: TjFjaHRfSXNfQXdlc29tZQ==",
      hint: "Use any Base64 decoder or command line tool",
      flag: "N1cht_Is_Awesome",
      points: 100,
      solved: false,
    },
    {
      id: 2,
      title: "Caesar Cipher",
      description: "Decrypt this Caesar cipher (shift 13): Npugs_Vf_Gur_Orfg",
      hint: "ROT13 is a common Caesar cipher variant",
      flag: "Achraf_Is_The_Best",
      points: 150,
      solved: false,
    },
    {
      id: 3,
      title: "Hidden Message",
      description: "Find the hidden flag in this HTML comment: <!-- ZmxhZ3tIaWRkZW5fSW5fUGxhaW5fU2lnaHR9 -->",
      hint: "The comment contains Base64 encoded text",
      flag: "flag{Hidden_In_Plain_Sight}",
      points: 200,
      solved: false,
    },
    {
      id: 4,
      title: "Binary Challenge",
      description: "Convert this binary to text: 01001000 01100001 01100011 01101011 01100101 01110010",
      hint: "Each group of 8 bits represents one ASCII character",
      flag: "Hacker",
      points: 250,
      solved: false,
    },
    {
      id: 5,
      title: "Reverse Engineering",
      description: "What does this JavaScript code output? btoa('N1cht_Portfolio')",
      hint: "btoa() is a JavaScript function for encoding",
      flag: "TjFjaHRfUG9ydGZvbGlv",
      points: 300,
      solved: false,
    },
  ])

  const handleSubmit = () => {
    const challenge = challenges.find((c) => c.id === selectedChallenge)
    if (!challenge) return

    if (userInput.trim().toLowerCase() === challenge.flag.toLowerCase()) {
      if (!challenge.solved) {
        const updatedChallenges = challenges.map((c) => (c.id === selectedChallenge ? { ...c, solved: true } : c))
        setChallenges(updatedChallenges)
        setScore(score + challenge.points)
        setMessage(`🎉 Correct! You earned ${challenge.points} points!`)
      } else {
        setMessage("✅ Already solved!")
      }
    } else {
      setMessage("❌ Incorrect flag. Try again!")
    }
    setUserInput("")
  }

  const currentChallenge = challenges.find((c) => c.id === selectedChallenge)
  const totalSolved = challenges.filter((c) => c.solved).length

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Score Board */}
      <Card className={`${isDark ? "bg-black/50 border-purple-500/30" : "bg-white/50 border-cyan-500/30"}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className={`font-rajdhani text-lg ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
              Score: {score} points
            </div>
            <div className={`font-rajdhani text-lg ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
              Solved: {totalSolved}/{challenges.length}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Challenge List */}
        <Card className={`${isDark ? "bg-black/50 border-purple-500/30" : "bg-white/50 border-cyan-500/30"}`}>
          <CardHeader>
            <CardTitle className={`font-rajdhani ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
              Challenges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {challenges.map((challenge) => (
              <Button
                key={challenge.id}
                onClick={() => setSelectedChallenge(challenge.id)}
                variant={selectedChallenge === challenge.id ? "default" : "outline"}
                className={`w-full justify-between ${
                  selectedChallenge === challenge.id
                    ? isDark
                      ? "bg-purple-500 hover:bg-purple-600"
                      : "bg-cyan-500 hover:bg-cyan-600"
                    : isDark
                      ? "border-purple-500/50 hover:bg-purple-500/20"
                      : "border-cyan-500/50 hover:bg-cyan-500/20"
                }`}
              >
                <span className={`${challenge.solved ? "line-through" : ""}`}>{challenge.title}</span>
                <div className="flex items-center gap-2">
                  {challenge.solved && <span>✅</span>}
                  <span className="text-sm">{challenge.points}pts</span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Challenge Details */}
        <Card className={`${isDark ? "bg-black/50 border-purple-500/30" : "bg-white/50 border-cyan-500/30"}`}>
          <CardHeader>
            <CardTitle className={`font-rajdhani ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
              {currentChallenge?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="font-exo font-semibold">Description:</Label>
              <p className="font-exo text-sm mt-1 p-3 rounded bg-gray-100 dark:bg-gray-800">
                {currentChallenge?.description}
              </p>
            </div>

            <div>
              <Label className="font-exo font-semibold">Hint:</Label>
              <p
                className={`font-exo text-sm mt-1 p-3 rounded ${isDark ? "bg-purple-900/20 text-purple-200" : "bg-cyan-900/20 text-cyan-700"}`}
              >
                💡 {currentChallenge?.hint}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="flag-input" className="font-exo font-semibold">
                Enter Flag:
              </Label>
              <div className="flex gap-2">
                <Input
                  id="flag-input"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter your answer here..."
                  className={`${isDark ? "border-purple-500/50" : "border-cyan-500/50"}`}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit()
                    }
                  }}
                />
                <Button
                  onClick={handleSubmit}
                  className={`${isDark ? "bg-purple-500 hover:bg-purple-600" : "bg-cyan-500 hover:bg-cyan-600"}`}
                >
                  Submit
                </Button>
              </div>
            </div>

            {message && (
              <div
                className={`p-3 rounded font-exo text-sm ${
                  message.includes("Correct") || message.includes("solved")
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                }`}
              >
                {message}
              </div>
            )}

            <div className={`text-right font-exo text-sm ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
              Points: {currentChallenge?.points}
              {currentChallenge?.solved && " ✅ Solved"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      {totalSolved === challenges.length && (
        <Card className={`${isDark ? "bg-green-900/20 border-green-500/30" : "bg-green-100 border-green-500/30"}`}>
          <CardContent className="p-6 text-center">
            <h3 className="text-2xl font-bold font-rajdhani text-green-600 mb-2">🎉 Congratulations! 🎉</h3>
            <p className="font-exo text-green-700 dark:text-green-300">
              You've completed all challenges with a total score of {score} points!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
