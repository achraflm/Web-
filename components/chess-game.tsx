'use client'

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const boardSize = 500
const squareSize = boardSize / 8

type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export default function ChessGame({ isDark }: { isDark?: boolean }) {
  const [gameBoard, setGameBoard] = useState<(string | null)[][]>([
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ])

  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null)
  const [legalMoves, setLegalMoves] = useState<Array<[number, number]>>([])
  const [lastMove, setLastMove] = useState<{ from: [number, number]; to: [number, number] } | null>(null)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameStatus, setGameStatus] = useState("playing")
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate')
  const [isThinking, setIsThinking] = useState(false)
  const [moveHistory, setMoveHistory] = useState<Array<{ from: [number, number]; to: [number, number] }>>([])
  const [highlightedSquares, setHighlightedSquares] = useState<Array<[number, number]>>([])
  const boardRef = useRef<HTMLDivElement>(null)

  // AI move handler
  useEffect(() => {
    if (!isPlayerTurn && !isThinking && gameStatus === "playing") {
      const timer = setTimeout(() => {
        makeAIMove()
      }, 500) // Add slight delay for better UX
      return () => clearTimeout(timer)
    }
  }, [isPlayerTurn, gameStatus, gameBoard])

  const makeAIMove = async () => {
    setIsThinking(true)
    try {
      const response = await fetch('/api/chess/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board: gameBoard,
          isWhiteToMove: false,
          difficulty,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      if (!data.move) {
        throw new Error('No move returned from API')
      }

      const { move } = data
      const newBoard = gameBoard.map(r => [...r])
      const [fromRow, fromCol] = move.from
      const [toRow, toCol] = move.to
      
      if (newBoard[fromRow][fromCol]) {
        newBoard[toRow][toCol] = newBoard[fromRow][fromCol]
        newBoard[fromRow][fromCol] = null
        setGameBoard(newBoard)
        setLastMove({ from: move.from, to: move.to })
        setMoveHistory([...moveHistory, { from: move.from, to: move.to }])
        setIsPlayerTurn(true)
      }
    } catch (error) {
      console.error('[v0] AI move error:', error)
      setIsPlayerTurn(true)
    } finally {
      setIsThinking(false)
    }
  }

  const getPieceSymbol = (piece: string | null) => {
    if (!piece) return ""
    const symbols: { [key: string]: string } = {
      p: "♟", P: "♙",
      r: "♜", R: "♖",
      n: "♞", N: "♘",
      b: "♝", B: "♗",
      q: "♛", Q: "♕",
      k: "♚", K: "♔",
    }
    return symbols[piece] || ""
  }

  const getPossibleMoves = (row: number, col: number): Array<[number, number]> => {
    const piece = gameBoard[row][col]
    if (!piece) return []

    const moves: Array<[number, number]> = []
    const isWhite = piece === piece.toUpperCase()
    const type = piece.toLowerCase()

    // Pawn moves
    if (type === 'p') {
      const direction = isWhite ? -1 : 1
      const startRow = isWhite ? 6 : 1
      if (gameBoard[row + direction]?.[col] === null) {
        moves.push([row + direction, col])
        if (row === startRow && gameBoard[row + 2 * direction]?.[col] === null) {
          moves.push([row + 2 * direction, col])
        }
      }
      for (const offset of [-1, 1]) {
        const target = gameBoard[row + direction]?.[col + offset]
        if (target && isWhite !== (target === target.toLowerCase())) {
          moves.push([row + direction, col + offset])
        }
      }
    }
    // Knight moves
    else if (type === 'n') {
      const offsets = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]
      for (const [dr, dc] of offsets) {
        const nr = row + dr, nc = col + dc
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const target = gameBoard[nr][nc]
          if (!target || isWhite !== (target === target.toLowerCase())) {
            moves.push([nr, nc])
          }
        }
      }
    }
    // Rook/Bishop/Queen moves
    else if (['r', 'b', 'q'].includes(type)) {
      const directions = type === 'r' ? [[-1, 0], [1, 0], [0, -1], [0, 1]] : type === 'b' ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
      for (const [dr, dc] of directions) {
        let nr = row + dr, nc = col + dc
        while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const target = gameBoard[nr][nc]
          if (!target) {
            moves.push([nr, nc])
          } else {
            if (isWhite !== (target === target.toLowerCase())) {
              moves.push([nr, nc])
            }
            break
          }
          nr += dr
          nc += dc
        }
      }
    }
    // King moves
    else if (type === 'k') {
      const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
      for (const [dr, dc] of directions) {
        const nr = row + dr, nc = col + dc
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const target = gameBoard[nr][nc]
          if (!target || isWhite !== (target === target.toLowerCase())) {
            moves.push([nr, nc])
          }
        }
      }
    }

    return moves
  }

  const handleSquareClick = (row: number, col: number) => {
    if (!isPlayerTurn || gameStatus !== "playing" || isThinking) return

    if (selectedSquare === null) {
      const piece = gameBoard[row][col]
      if (piece && piece === piece.toUpperCase()) {
        setSelectedSquare([row, col])
        setHighlightedSquares([[row, col]])
        setLegalMoves(getPossibleMoves(row, col))
      }
    } else {
      const [fromRow, fromCol] = selectedSquare
      const moves = getPossibleMoves(fromRow, fromCol)
      const isLegalMove = moves.some(m => m[0] === row && m[1] === col)

      if (isLegalMove) {
        const newBoard = gameBoard.map(r => [...r])
        newBoard[row][col] = newBoard[fromRow][fromCol]
        newBoard[fromRow][fromCol] = null
        setGameBoard(newBoard)
        setLastMove({ from: [fromRow, fromCol], to: [row, col] })
        setMoveHistory([...moveHistory, { from: [fromRow, fromCol], to: [row, col] }])
        setSelectedSquare(null)
        setLegalMoves([])
        setIsPlayerTurn(false)
      } else {
        setSelectedSquare([row, col])
        setHighlightedSquares([[row, col]])
        setLegalMoves(getPossibleMoves(row, col))
      }
    }
  }

  const resetGame = () => {
    setGameBoard([
      ["r", "n", "b", "q", "k", "b", "n", "r"],
      ["p", "p", "p", "p", "p", "p", "p", "p"],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ["P", "P", "P", "P", "P", "P", "P", "P"],
      ["R", "N", "B", "Q", "K", "B", "N", "R"],
    ])
    setSelectedSquare(null)
    setIsPlayerTurn(true)
    setGameStatus("playing")
    setMoveHistory([])
    setLastMove(null)
    setLegalMoves([])
    setHighlightedSquares([])
  }

  return (
    <Card className={`w-full max-w-3xl animate-fade-in ${isDark ? "bg-black/50 border-purple-500/30" : "bg-white"}`}>
      <CardHeader className="animate-slide-in-down">
        <CardTitle className="flex items-center justify-between">
          <span className={isDark ? "text-purple-400" : "text-cyan-600"}>Chess vs AI</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetGame}
              className="hover:scale-110 transition-transform"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 animate-fade-in">
        <div className="flex justify-between items-center gap-4">
          <div className="flex flex-col gap-2">
            <Badge variant={isPlayerTurn ? "default" : "secondary"} className="animate-pulse">
              {isPlayerTurn ? "Your Turn (White)" : isThinking ? "AI Thinking..." : "Black's Turn"}
            </Badge>
            <div className="flex gap-2">
              {(['beginner', 'intermediate', 'advanced', 'expert'] as Difficulty[]).map(level => (
                <Button
                  key={level}
                  variant={difficulty === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDifficulty(level)}
                  disabled={moveHistory.length > 0}
                  className="text-xs capitalize"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">Moves: {moveHistory.length}</p>
            {isThinking && <div className="flex items-center gap-1 mt-2"><Zap className="w-4 h-4 animate-pulse" /> Thinking...</div>}
          </div>
        </div>

        <div className="flex justify-center" ref={boardRef}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(8, ${squareSize}px)`,
              gap: "0",
              border: "3px solid #333",
              borderRadius: "8px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              overflow: "hidden",
            }}
          >
            {gameBoard.map((row, rowIdx) =>
              row.map((piece, colIdx) => {
                const isLight = (rowIdx + colIdx) % 2 === 0
                const isSelected = selectedSquare?.[0] === rowIdx && selectedSquare?.[1] === colIdx
                const isLegal = legalMoves.some(m => m[0] === rowIdx && m[1] === colIdx)
                const isLastMove = lastMove && ((lastMove.from[0] === rowIdx && lastMove.from[1] === colIdx) || (lastMove.to[0] === rowIdx && lastMove.to[1] === colIdx))

                return (
                  <button
                    key={`${rowIdx}-${colIdx}`}
                    onClick={() => handleSquareClick(rowIdx, colIdx)}
                    className={`transition-all duration-200 hover:brightness-110 ${isLegal ? 'ring-2 ring-yellow-400 ring-inset' : ''} ${isSelected ? 'animate-scale-in' : ''}`}
                    style={{
                      width: `${squareSize}px`,
                      height: `${squareSize}px`,
                      backgroundColor: isSelected
                        ? "#BACA44"
                        : isLastMove
                          ? "rgba(186, 202, 68, 0.5)"
                          : isLight
                            ? "#F0D9B5"
                            : "#B58863",
                      border: "none",
                      cursor: isPlayerTurn ? "pointer" : "not-allowed",
                      fontSize: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                    }}
                  >
                    {piece && <span className="animate-bounce-in">{getPieceSymbol(piece)}</span>}
                    {isLegal && <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>}
                  </button>
                )
              })
            )}
          </div>
        </div>

        <div className="text-sm text-center">
          {isThinking && "AI is thinking..."}
          {!isThinking && gameStatus === "playing" && isPlayerTurn && "Select a white piece to move"}
          {!isThinking && gameStatus === "playing" && !isPlayerTurn && "Waiting for Black's move..."}
        </div>

        {moveHistory.length > 0 && (
          <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg animate-slide-in-up">
            <p className="text-xs font-semibold mb-2">Move History:</p>
            <div className="flex flex-wrap gap-1">
              {moveHistory.map((move, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {idx + 1}. {String.fromCharCode(97 + move.from[1])}{8 - move.from[0]} → {String.fromCharCode(97 + move.to[1])}{8 - move.to[0]}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
