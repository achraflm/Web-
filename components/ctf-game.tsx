"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, Flag, Eye, EyeOff } from "lucide-react"

export default function CTFGame({ isDark }) {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [completedChallenges, setCompletedChallenges] = useState([])
  const [gameComplete, setGameComplete] = useState(false)

  const challenges = [
    {
      id: 1,
      title: "Base64 Decoder",
      description: "Decode this message: TjFjaHQgaXMgYXdlc29tZQ==",
      answer: "n1cht is awesome",
      hint: "This looks like Base64 encoding. Try decoding it!",
      points: 100,
    },
    {
      id: 2,
      title: "Caesar Cipher",
      description: "Shift this message by 13: NPUUG JBEYQ",
      answer: "achraf lemrani",
      hint: "ROT13 cipher - each letter is shifted by 13 positions in the alphabet.",
      points: 150,
    },
    {
      id: 3,
      title: "Hidden in Plain Sight",
      description: "Find the flag in this text: 'The N1cht{h4ck3r_m1nd} portfolio is amazing!'",
      answer: "N1cht{h4ck3r_m1nd}",
      hint: "Look for text between curly braces with the N1cht prefix.",
      points: 200,
    },
    {
      id: 4,
      title: "Binary Message",
      description: "Convert from binary: 01001000 01100001 01100011 01101011",
      answer: "hack",
      hint: "Each group of 8 bits represents one ASCII character.",
      points: 250,
    },
    {
      id: 5,
      title: "Final Challenge",
      description: "What's the admin password for this portfolio? (Hint: It's in German)",
      answer: "nacht faust",
      hint: "Think about N1cht's alias and what it means in German...",
      points: 300,
    },
  ]

  const handleSubmit = () => {
    const challenge = challenges[currentChallenge]
    if (userInput.toLowerCase().trim() === challenge.answer.toLowerCase()) {
      setCompletedChallenges((prev) => [...prev, challenge.id])

      if (currentChallenge === challenges.length - 1) {
        setGameComplete(true)
      } else {
        setCurrentChallenge((prev) => prev + 1)
      }

      setUserInput("")
      setShowHint(false)
    } else {
      alert("Incorrect! Try again or check the hint.")
    }
  }

  const resetGame = () => {
    setCurrentChallenge(0)
    setUserInput("")
    setShowHint(false)
    setCompletedChallenges([])
    setGameComplete(false)
  }

  const totalPoints = completedChallenges.reduce((sum, id) => {
    const challenge = challenges.find((c) => c.id === id)
    return sum + (challenge?.points || 0)
  }, 0)

  if (gameComplete) {
    return (
      <Card
        className={`max-w-2xl mx-auto ${isDark ? "bg-black/50 border-purple-500/30" : "bg-white/50 border-cyan-500/30"}`}
      >
        <CardHeader>
          <CardTitle className={`text-center ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
            🎉 Congratulations, Hacker! 🎉
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className={`text-6xl mb-4 ${isDark ? "text-purple-400" : "text-cyan-500"}`}>
            <Flag className="h-16 w-16 mx-auto" />
          </div>
          <h3 className={`text-2xl font-bold ${isDark ? "text-purple-300" : "text-cyan-600"}`}>Mission Complete!</h3>
          <p className="text-lg">
            You've successfully completed all challenges and earned{" "}
            <span className="font-bold text-green-400">{totalPoints} points</span>!
          </p>
          <p className="text-sm text-gray-400">
            You've proven your hacking skills worthy of N1cht's respect. Welcome to the elite circle! 🔥
          </p>
          <Button
            onClick={resetGame}
            className={`${isDark ? "bg-purple-500 hover:bg-purple-600" : "bg-cyan-500 hover:bg-cyan-600"}`}
          >
            Play Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  const challenge = challenges[currentChallenge]

  return (
    <Card
      className={`max-w-2xl mx-auto ${isDark ? "bg-black/50 border-purple-500/30" : "bg-white/50 border-cyan-500/30"}`}
    >
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
          <Shield className="h-6 w-6" />
          Hack Me - Mini CTF Challenge
        </CardTitle>
        <div className="flex justify-between text-sm text-gray-400">
          <span>
            Challenge {currentChallenge + 1} of {challenges.length}
          </span>
          <span>Points: {totalPoints}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className={`w-full bg-gray-700 rounded-full h-2 ${isDark ? "bg-purple-900/30" : "bg-cyan-900/30"}`}>
          <div
            className={`h-2 rounded-full transition-all duration-300 ${isDark ? "bg-purple-500" : "bg-cyan-500"}`}
            style={{ width: `${((currentChallenge + 1) / challenges.length) * 100}%` }}
          />
        </div>

        {/* Challenge */}
        <div className={`p-4 rounded-lg ${isDark ? "bg-purple-900/20" : "bg-cyan-900/20"}`}>
          <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
            {challenge.title}
          </h3>
          <p className="text-gray-300 mb-4">{challenge.description}</p>
          <div className="flex gap-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter your answer..."
              className={`flex-1 ${isDark ? "border-purple-500/50" : "border-cyan-500/50"}`}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            />
            <Button
              onClick={handleSubmit}
              className={`${isDark ? "bg-purple-500 hover:bg-purple-600" : "bg-cyan-500 hover:bg-cyan-600"}`}
            >
              Submit
            </Button>
          </div>
        </div>

        {/* Hint */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowHint(!showHint)}
            variant="outline"
            size="sm"
            className={`${isDark ? "border-purple-500/50 hover:bg-purple-500/20" : "border-cyan-500/50 hover:bg-cyan-500/20"}`}
          >
            {showHint ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showHint ? "Hide Hint" : "Show Hint"}
          </Button>
          <span className="text-sm text-gray-400">Worth {challenge.points} points</span>
        </div>

        {showHint && (
          <div
            className={`p-3 rounded-lg border-l-4 ${isDark ? "bg-yellow-900/20 border-yellow-500" : "bg-yellow-100/20 border-yellow-600"}`}
          >
            <p className="text-sm text-yellow-300">{challenge.hint}</p>
          </div>
        )}

        {/* Completed Challenges */}
        {completedChallenges.length > 0 && (
          <div className={`p-3 rounded-lg ${isDark ? "bg-green-900/20" : "bg-green-100/20"}`}>
            <h4 className="text-sm font-bold text-green-400 mb-2">Completed Challenges:</h4>
            <div className="flex flex-wrap gap-2">
              {completedChallenges.map((id) => {
                const completedChallenge = challenges.find((c) => c.id === id)
                return (
                  <span key={id} className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                    {completedChallenge?.title} (+{completedChallenge?.points}pts)
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
