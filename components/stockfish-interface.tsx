"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Brain, Zap } from "lucide-react"

interface StockfishEngine {
  postMessage: (message: string) => void
  onmessage: ((event: { data: string }) => void) | null
  terminate: () => void
}

declare global {
  interface Window {
    Stockfish: () => StockfishEngine
  }
}

export default function StockfishInterface() {
  const [engine, setEngine] = useState<StockfishEngine | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isEngineReady, setIsEngineReady] = useState(false)
  const [fenInput, setFenInput] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  const [bestMove, setBestMove] = useState("")
  const [evaluation, setEvaluation] = useState("")
  const [depth, setDepth] = useState(20)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [engineOutput, setEngineOutput] = useState<string[]>([])
  const engineRef = useRef<StockfishEngine | null>(null)

  // Load Stockfish engine
  useEffect(() => {
    const loadStockfish = async () => {
      setIsLoading(true)
      try {
        // Load Stockfish from CDN
        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/npm/stockfish@16.0.0/src/stockfish.js"
        script.onload = () => {
          if (window.Stockfish) {
            const stockfishEngine = window.Stockfish()
            setEngine(stockfishEngine)
            engineRef.current = stockfishEngine

            // Set up message handler
            stockfishEngine.onmessage = (event) => {
              const message = event.data
              setEngineOutput((prev) => [...prev.slice(-50), message]) // Keep last 50 messages

              if (message.includes("uciok")) {
                setIsEngineReady(true)
              } else if (message.startsWith("bestmove")) {
                const move = message.split(" ")[1]
                setBestMove(move)
                setIsAnalyzing(false)
              } else if (message.includes("score cp")) {
                // Extract evaluation score
                const scoreMatch = message.match(/score cp (-?\d+)/)
                if (scoreMatch) {
                  const centipawns = Number.parseInt(scoreMatch[1])
                  const pawns = (centipawns / 100).toFixed(2)
                  setEvaluation(`${pawns > 0 ? "+" : ""}${pawns}`)
                }
              } else if (message.includes("score mate")) {
                // Extract mate score
                const mateMatch = message.match(/score mate (-?\d+)/)
                if (mateMatch) {
                  const mateIn = mateMatch[1]
                  setEvaluation(`Mate in ${Math.abs(Number.parseInt(mateIn))}`)
                }
              }
            }

            // Initialize engine
            stockfishEngine.postMessage("uci")
            stockfishEngine.postMessage("isready")
          }
        }
        script.onerror = () => {
          console.error("Failed to load Stockfish")
          setIsLoading(false)
        }
        document.head.appendChild(script)
      } catch (error) {
        console.error("Error loading Stockfish:", error)
        setIsLoading(false)
      }
    }

    loadStockfish()

    return () => {
      if (engineRef.current) {
        engineRef.current.terminate()
      }
    }
  }, [])

  useEffect(() => {
    if (isEngineReady) {
      setIsLoading(false)
    }
  }, [isEngineReady])

  const getBestMove = () => {
    if (!engine || !isEngineReady) return

    setIsAnalyzing(true)
    setBestMove("")
    setEvaluation("")

    // Set up position and analyze
    engine.postMessage("ucinewgame")
    engine.postMessage(`position fen ${fenInput}`)
    engine.postMessage(`go depth ${depth}`)
  }

  const stopAnalysis = () => {
    if (engine) {
      engine.postMessage("stop")
      setIsAnalyzing(false)
    }
  }

  const resetToStartPosition = () => {
    setFenInput("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
    setBestMove("")
    setEvaluation("")
  }

  const clearOutput = () => {
    setEngineOutput([])
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Stockfish Chess Engine Interface
          </CardTitle>
          <CardDescription>
            Analyze chess positions using Stockfish 16 - one of the world's strongest chess engines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Engine Status */}
          <div className="flex items-center gap-2">
            <Badge variant={isEngineReady ? "default" : "secondary"}>
              {isLoading ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Loading Engine...
                </>
              ) : isEngineReady ? (
                <>
                  <Zap className="h-3 w-3 mr-1" />
                  Engine Ready
                </>
              ) : (
                "Engine Not Ready"
              )}
            </Badge>
            {evaluation && <Badge variant="outline">Evaluation: {evaluation}</Badge>}
          </div>

          {/* FEN Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">FEN Position:</label>
            <div className="flex gap-2">
              <Input
                value={fenInput}
                onChange={(e) => setFenInput(e.target.value)}
                placeholder="Enter FEN string..."
                className="flex-1"
              />
              <Button onClick={resetToStartPosition} variant="outline" size="sm">
                Reset
              </Button>
            </div>
          </div>

          {/* Depth Setting */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Analysis Depth:</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={depth}
                onChange={(e) => setDepth(Math.max(1, Math.min(30, Number.parseInt(e.target.value) || 20)))}
                min="1"
                max="30"
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">(1-30, higher = stronger but slower)</span>
            </div>
          </div>

          {/* Analysis Controls */}
          <div className="flex gap-2">
            <Button onClick={getBestMove} disabled={!isEngineReady || isAnalyzing} className="flex-1">
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Get Best Move"
              )}
            </Button>
            {isAnalyzing && (
              <Button onClick={stopAnalysis} variant="outline">
                Stop
              </Button>
            )}
          </div>

          {/* Results */}
          {bestMove && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Best Move:</label>
              <div className="p-3 bg-muted rounded-md">
                <code className="text-lg font-mono">{bestMove}</code>
                {evaluation && (
                  <div className="text-sm text-muted-foreground mt-1">Position evaluation: {evaluation}</div>
                )}
              </div>
            </div>
          )}

          {/* Engine Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Engine Output:</label>
              <Button onClick={clearOutput} variant="ghost" size="sm">
                Clear
              </Button>
            </div>
            <Textarea
              value={engineOutput.slice(-10).join("\n")}
              readOnly
              className="h-32 font-mono text-xs"
              placeholder="Engine output will appear here..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>FEN Format:</strong> Forsyth-Edwards Notation describes a chess position
          </p>
          <p>
            <strong>Default Position:</strong> Starting chess position is pre-loaded
          </p>
          <p>
            <strong>Depth:</strong> Higher depth = stronger analysis but takes longer
          </p>
          <p>
            <strong>Move Format:</strong> Returns moves in UCI format (e.g., e2e4, g1f3)
          </p>
          <p>
            <strong>Evaluation:</strong> Positive = advantage for White, Negative = advantage for Black
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
