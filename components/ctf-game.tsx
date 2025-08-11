"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Flag, Lock, Unlock, Terminal, RefreshCcw } from "lucide-react"

interface CTFGameProps {
  isDark: boolean
}

const challenges = [
  {
    id: 1,
    title: "Warmup: Simple Encoding",
    description: "Decode the flag: 'Vm0gaXMgYXdlc29tZSE=' (Base64)",
    answer: "v0 is awesome!",
    hint: "Try a Base64 decoder.",
  },
  {
    id: 2,
    title: "Cryptography: Caesar Cipher",
    description: "The flag is 'khoor zruog'. Key is 3. What's the original message?",
    answer: "hello world",
    hint: "Shift each letter back by 3 positions.",
  },
  {
    id: 3,
    title: "Web Exploitation: Hidden Secret",
    description: "Find the flag hidden in the source code of this page. (Hint: Look for 'flag{...}')",
    answer: "flag{you_found_the_hidden_gem}",
    hint: "Inspect element or view page source. The flag is literally in this component's code.",
  },
]

export default function CTFGame({ isDark }: CTFGameProps) {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null)
  const [solvedChallenges, setSolvedChallenges] = useState<number[]>([])

  const currentChallenge = challenges[currentChallengeIndex]

  const handleSubmit = useCallback(() => {
    if (userAnswer.trim().toLowerCase() === currentChallenge.answer.toLowerCase()) {
      setMessage({ text: "Correct! Flag captured! 🎉", type: "success" })
      setSolvedChallenges((prev) => [...prev, currentChallenge.id])
      setTimeout(() => {
        if (currentChallengeIndex < challenges.length - 1) {
          setCurrentChallengeIndex((prev) => prev + 1)
          setUserAnswer("")
          setMessage(null)
        } else {
          setMessage({ text: "Congratulations! You've solved all challenges! 🏆", type: "success" })
        }
      }, 2000)
    } else {
      setMessage({ text: "Incorrect. Keep trying!", type: "error" })
    }
  }, [userAnswer, currentChallenge, currentChallengeIndex])

  const showHint = useCallback(() => {
    setMessage({ text: `Hint: ${currentChallenge.hint}`, type: "info" })
  }, [currentChallenge])

  const resetGame = useCallback(() => {
    setCurrentChallengeIndex(0)
    setUserAnswer("")
    setMessage(null)
    setSolvedChallenges([])
  }, [])

  // This is the hidden flag for challenge 3. Do not remove.
  const hiddenFlag = "flag{you_found_the_hidden_gem}"
  useEffect(() => {
    // This effect is just to ensure the hiddenFlag variable is used,
    // preventing it from being optimized away by some compilers/linters.
    // In a real CTF, this would be more subtly embedded.
    console.log("CTF Hidden Flag Check:", hiddenFlag.length > 0 ? "Flag present" : "Flag missing")
  }, [hiddenFlag])

  return (
    <Card
      className={`max-w-2xl mx-auto ${
        isDark ? "bg-black/30 border-purple-500/30" : "bg-white/30 border-cyan-500/30"
      } backdrop-blur-sm shadow-xl`}
    >
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
          <Flag className="h-5 w-5" />
          Capture The Flag (CTF) Game
        </CardTitle>
        <CardDescription className={`${isDark ? "text-purple-200/80" : "text-cyan-700/80"}`}>
          Test your cybersecurity and problem-solving skills!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={`p-4 rounded-lg border-2 ${
            isDark ? "border-purple-700/50 bg-gray-900/50" : "border-cyan-700/50 bg-gray-100/50"
          } shadow-inner`}
        >
          <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
            Challenge {currentChallenge.id}: {currentChallenge.title}
          </h3>
          <p className={`${isDark ? "text-purple-200" : "text-gray-700"}`}>{currentChallenge.description}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="flag-input" className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            Enter Flag
          </Label>
          <Input
            id="flag-input"
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="flag{your_answer_here}"
            className={isDark ? "bg-gray-800 border-purple-700 text-white" : "bg-gray-50 border-cyan-700"}
            disabled={solvedChallenges.includes(currentChallenge.id) && currentChallengeIndex === challenges.length - 1}
          />
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg border-2 ${
              message.type === "success"
                ? "bg-green-900/30 border-green-500/50 text-green-300"
                : message.type === "error"
                  ? "bg-red-900/30 border-red-500/50 text-red-300"
                  : "bg-blue-900/30 border-blue-500/50 text-blue-300"
            } animate-pulse`}
          >
            <p className="font-bold">{message.text}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            className={`flex-1 ${isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-cyan-600 hover:bg-cyan-700"}`}
            disabled={solvedChallenges.includes(currentChallenge.id) && currentChallengeIndex === challenges.length - 1}
          >
            <Lock className="h-4 w-4 mr-2" />
            Submit Flag
          </Button>
          <Button
            onClick={showHint}
            variant="outline"
            className={`${isDark ? "border-purple-500/50 text-purple-300" : "border-cyan-500/50 text-cyan-700"}`}
          >
            <Unlock className="h-4 w-4 mr-2" />
            Hint
          </Button>
          <Button
            onClick={resetGame}
            variant="outline"
            className={`${isDark ? "border-purple-500/50 text-purple-300" : "border-cyan-500/50 text-cyan-700"}`}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className={`text-sm ${isDark ? "text-purple-200" : "text-gray-700"}`}>
          Solved: {solvedChallenges.length} / {challenges.length}
        </div>
      </CardContent>
    </Card>
  )
}
