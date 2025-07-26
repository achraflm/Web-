"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface ChessGameProps {
  isDark: boolean
}

interface Position {
  row: number
  col: number
}

interface Piece {
  type: string
  color: "white" | "black"
  position: Position
  hasMoved?: boolean
}

export default function ChessGame({ isDark }: ChessGameProps) {
  const [board, setBoard] = useState<(Piece | null)[][]>([])
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">("white")
  const [gameStatus, setGameStatus] = useState<string>("White to move")
  const [validMoves, setValidMoves] = useState<Position[]>([])

  // Initialize chess board
  useEffect(() => {
    initializeBoard()
  }, [])

  const initializeBoard = () => {
    const newBoard: (Piece | null)[][] = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))

    // Place pawns
    for (let col = 0; col < 8; col++) {
      newBoard[1][col] = { type: "pawn", color: "black", position: { row: 1, col } }
      newBoard[6][col] = { type: "pawn", color: "white", position: { row: 6, col } }
    }

    // Place other pieces
    const pieceOrder = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]
    for (let col = 0; col < 8; col++) {
      newBoard[0][col] = { type: pieceOrder[col], color: "black", position: { row: 0, col } }
      newBoard[7][col] = { type: pieceOrder[col], color: "white", position: { row: 7, col } }
    }

    setBoard(newBoard)
  }

  const getPieceSymbol = (piece: Piece | null): string => {
    if (!piece) return ""

    const symbols = {
      white: {
        king: "♔",
        queen: "♕",
        rook: "♖",
        bishop: "♗",
        knight: "♘",
        pawn: "♙",
      },
      black: {
        king: "♚",
        queen: "♛",
        rook: "♜",
        bishop: "♝",
        knight: "♞",
        pawn: "♟",
      },
    }

    return symbols[piece.color][piece.type] || ""
  }

  const isValidMove = (from: Position, to: Position): boolean => {
    const piece = board[from.row][from.col]
    if (!piece || piece.color !== currentPlayer) return false

    const targetPiece = board[to.row][to.col]
    if (targetPiece && targetPiece.color === piece.color) return false

    // Basic move validation (simplified)
    switch (piece.type) {
      case "pawn":
        const direction = piece.color === "white" ? -1 : 1
        const startRow = piece.color === "white" ? 6 : 1

        if (to.col === from.col && !targetPiece) {
          if (to.row === from.row + direction) return true
          if (from.row === startRow && to.row === from.row + 2 * direction) return true
        }
        if (Math.abs(to.col - from.col) === 1 && to.row === from.row + direction && targetPiece) {
          return true
        }
        return false

      case "rook":
        return (from.row === to.row || from.col === to.col) && isPathClear(from, to)

      case "bishop":
        return Math.abs(from.row - to.row) === Math.abs(from.col - to.col) && isPathClear(from, to)

      case "queen":
        return (
          (from.row === to.row || from.col === to.col || Math.abs(from.row - to.row) === Math.abs(from.col - to.col)) &&
          isPathClear(from, to)
        )

      case "king":
        return Math.abs(from.row - to.row) <= 1 && Math.abs(from.col - to.col) <= 1

      case "knight":
        const rowDiff = Math.abs(from.row - to.row)
        const colDiff = Math.abs(from.col - to.col)
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)

      default:
        return false
    }
  }

  const isPathClear = (from: Position, to: Position): boolean => {
    const rowStep = to.row > from.row ? 1 : to.row < from.row ? -1 : 0
    const colStep = to.col > from.col ? 1 : to.col < from.col ? -1 : 0

    let currentRow = from.row + rowStep
    let currentCol = from.col + colStep

    while (currentRow !== to.row || currentCol !== to.col) {
      if (board[currentRow][currentCol]) return false
      currentRow += rowStep
      currentCol += colStep
    }

    return true
  }

  const getValidMoves = (position: Position): Position[] => {
    const moves: Position[] = []

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (isValidMove(position, { row, col })) {
          moves.push({ row, col })
        }
      }
    }

    return moves
  }

  const handleSquareClick = (row: number, col: number) => {
    const clickedPosition = { row, col }

    if (selectedSquare) {
      if (selectedSquare.row === row && selectedSquare.col === col) {
        // Deselect
        setSelectedSquare(null)
        setValidMoves([])
      } else if (isValidMove(selectedSquare, clickedPosition)) {
        // Make move
        const newBoard = board.map((row) => [...row])
        const piece = newBoard[selectedSquare.row][selectedSquare.col]

        newBoard[row][col] = piece
        newBoard[selectedSquare.row][selectedSquare.col] = null

        if (piece) {
          piece.position = clickedPosition
          piece.hasMoved = true
        }

        setBoard(newBoard)
        setCurrentPlayer(currentPlayer === "white" ? "black" : "white")
        setGameStatus(currentPlayer === "white" ? "Black to move" : "White to move")
        setSelectedSquare(null)
        setValidMoves([])

        // Simple AI move for black
        if (currentPlayer === "white") {
          setTimeout(() => makeAIMove(newBoard), 1000)
        }
      } else {
        // Select new piece
        const piece = board[row][col]
        if (piece && piece.color === currentPlayer) {
          setSelectedSquare(clickedPosition)
          setValidMoves(getValidMoves(clickedPosition))
        }
      }
    } else {
      // Select piece
      const piece = board[row][col]
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare(clickedPosition)
        setValidMoves(getValidMoves(clickedPosition))
      }
    }
  }

  const makeAIMove = (currentBoard: (Piece | null)[][]) => {
    const blackPieces: { piece: Piece; position: Position }[] = []

    // Find all black pieces
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = currentBoard[row][col]
        if (piece && piece.color === "black") {
          blackPieces.push({ piece, position: { row, col } })
        }
      }
    }

    // Find all possible moves
    const possibleMoves: { from: Position; to: Position }[] = []
    blackPieces.forEach(({ position }) => {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (isValidMove(position, { row, col })) {
            possibleMoves.push({ from: position, to: { row, col } })
          }
        }
      }
    })

    if (possibleMoves.length > 0) {
      // Make random move
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
      const newBoard = currentBoard.map((row) => [...row])
      const piece = newBoard[randomMove.from.row][randomMove.from.col]

      newBoard[randomMove.to.row][randomMove.to.col] = piece
      newBoard[randomMove.from.row][randomMove.from.col] = null

      if (piece) {
        piece.position = randomMove.to
        piece.hasMoved = true
      }

      setBoard(newBoard)
      setCurrentPlayer("white")
      setGameStatus("White to move")
    }
  }

  const resetGame = () => {
    initializeBoard()
    setSelectedSquare(null)
    setCurrentPlayer("white")
    setGameStatus("White to move")
    setValidMoves([])
  }

  const isSquareSelected = (row: number, col: number): boolean => {
    return selectedSquare?.row === row && selectedSquare?.col === col
  }

  const isValidMoveSquare = (row: number, col: number): boolean => {
    return validMoves.some((move) => move.row === row && move.col === col)
  }

  return (
    <Card
      className={`w-full max-w-2xl mx-auto ${isDark ? "bg-black/50 border-purple-500/30" : "bg-white/50 border-cyan-500/30"}`}
    >
      <CardHeader>
        <CardTitle className={`text-center font-rajdhani ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
          Chess Battle vs AI
        </CardTitle>
        <p className={`text-center font-exo ${isDark ? "text-purple-200" : "text-cyan-700"}`}>{gameStatus}</p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Chess Board Background */}
          <div className="relative w-full aspect-square mb-4">
            <Image
              src="/images/chess-board-new.png"
              alt="Chess Board"
              fill
              className="object-cover rounded-lg"
              crossOrigin="anonymous"
            />

            {/* Chess Pieces Overlay */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
              {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`flex items-center justify-center cursor-pointer transition-all duration-200 ${
                      isSquareSelected(rowIndex, colIndex)
                        ? isDark
                          ? "bg-purple-500/50"
                          : "bg-cyan-500/50"
                        : isValidMoveSquare(rowIndex, colIndex)
                          ? isDark
                            ? "bg-purple-300/30"
                            : "bg-cyan-300/30"
                          : "hover:bg-black/10"
                    }`}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                  >
                    <span className="text-3xl md:text-4xl select-none drop-shadow-lg">{getPieceSymbol(piece)}</span>
                  </div>
                )),
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={resetGame}
            variant="outline"
            className={`${isDark ? "border-purple-500/50 hover:bg-purple-500/20" : "border-cyan-500/50 hover:bg-cyan-500/20"}`}
          >
            New Game
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
