'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const boardSize = 400
const squareSize = boardSize / 8

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
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameStatus, setGameStatus] = useState("playing")

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

  const handleSquareClick = (row: number, col: number) => {
    if (!isPlayerTurn || gameStatus !== "playing") return

    if (selectedSquare === null) {
      const piece = gameBoard[row][col]
      if (piece && piece === piece.toUpperCase()) {
        setSelectedSquare([row, col])
      }
    } else {
      const [fromRow, fromCol] = selectedSquare
      const newBoard = gameBoard.map(r => [...r])
      newBoard[row][col] = newBoard[fromRow][fromCol]
      newBoard[fromRow][fromCol] = null
      setGameBoard(newBoard)
      setSelectedSquare(null)
      setIsPlayerTurn(false)
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
  }

  return (
    <Card className={`w-full max-w-2xl ${isDark ? "dark" : ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Chess Game</span>
          <Button variant="outline" size="sm" onClick={resetGame}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-center gap-2">
          <Badge variant={isPlayerTurn ? "default" : "secondary"}>
            {isPlayerTurn ? "Your Turn (White)" : "Black's Turn"}
          </Badge>
        </div>

        <div className="flex justify-center">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(8, ${squareSize}px)`,
              gap: "0",
              border: "2px solid #333",
            }}
          >
            {gameBoard.map((row, rowIdx) =>
              row.map((piece, colIdx) => {
                const isLight = (rowIdx + colIdx) % 2 === 0
                const isSelected = selectedSquare?.[0] === rowIdx && selectedSquare?.[1] === colIdx

                return (
                  <button
                    key={`${rowIdx}-${colIdx}`}
                    onClick={() => handleSquareClick(rowIdx, colIdx)}
                    style={{
                      width: `${squareSize}px`,
                      height: `${squareSize}px`,
                      backgroundColor: isSelected
                        ? "#BACA44"
                        : isLight
                          ? "#F0D9B5"
                          : "#B58863",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                    }}
                  >
                    {getPieceSymbol(piece)}
                  </button>
                )
              })
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600 text-center">
          {gameStatus === "playing" ? "Click pieces to move" : gameStatus}
        </div>
      </CardContent>
    </Card>
  )
}
