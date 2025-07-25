"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, RotateCcw, Users, Bot } from "lucide-react"
import Image from "next/image"

// Enhanced chess engine with better AI
class ChessEngine {
  constructor() {
    this.pieceValues = {
      p: 100,
      n: 320,
      b: 330,
      r: 500,
      q: 900,
      k: 20000,
      P: 100,
      N: 320,
      B: 330,
      R: 500,
      Q: 900,
      K: 20000,
    }

    // Position evaluation tables
    this.pawnTable = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [50, 50, 50, 50, 50, 50, 50, 50],
      [10, 10, 20, 30, 30, 20, 10, 10],
      [5, 5, 10, 25, 25, 10, 5, 5],
      [0, 0, 0, 20, 20, 0, 0, 0],
      [5, -5, -10, 0, 0, -10, -5, 5],
      [5, 10, 10, -20, -20, 10, 10, 5],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ]

    this.knightTable = [
      [-50, -40, -30, -30, -30, -30, -40, -50],
      [-40, -20, 0, 0, 0, 0, -20, -40],
      [-30, 0, 10, 15, 15, 10, 0, -30],
      [-30, 5, 15, 20, 20, 15, 5, -30],
      [-30, 0, 15, 20, 20, 15, 0, -30],
      [-30, 5, 10, 15, 15, 10, 5, -30],
      [-40, -20, 0, 5, 5, 0, -20, -40],
      [-50, -40, -30, -30, -30, -30, -40, -50],
    ]
  }

  evaluateBoard(board) {
    let score = 0
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece) {
          const isWhite = piece === piece.toUpperCase()
          const pieceType = piece.toLowerCase()
          let pieceScore = this.pieceValues[piece]

          // Add positional bonuses
          if (pieceType === "p") {
            pieceScore += this.pawnTable[isWhite ? row : 7 - row][col]
          } else if (pieceType === "n") {
            pieceScore += this.knightTable[isWhite ? row : 7 - row][col]
          }

          score += isWhite ? pieceScore : -pieceScore
        }
      }
    }
    return score
  }

  getAllMoves(board, isWhite) {
    const moves = []
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece && ((isWhite && piece === piece.toUpperCase()) || (!isWhite && piece === piece.toLowerCase()))) {
          const pieceMoves = this.getPieceMoves(board, row, col, piece)
          moves.push(
            ...pieceMoves.map((move) => ({
              from: [row, col],
              to: move,
              piece: piece,
              capture: board[move[0]][move[1]],
            })),
          )
        }
      }
    }
    return moves
  }

  getPieceMoves(board, row, col, piece) {
    const pieceType = piece.toLowerCase()
    const isWhite = piece === piece.toUpperCase()

    switch (pieceType) {
      case "p":
        return this.getPawnMoves(board, row, col, isWhite)
      case "r":
        return this.getRookMoves(board, row, col, isWhite)
      case "n":
        return this.getKnightMoves(board, row, col, isWhite)
      case "b":
        return this.getBishopMoves(board, row, col, isWhite)
      case "q":
        return this.getQueenMoves(board, row, col, isWhite)
      case "k":
        return this.getKingMoves(board, row, col, isWhite)
      default:
        return []
    }
  }

  getPawnMoves(board, row, col, isWhite) {
    const moves = []
    const direction = isWhite ? -1 : 1
    const startRow = isWhite ? 6 : 1

    // Forward move
    if (row + direction >= 0 && row + direction < 8 && !board[row + direction][col]) {
      moves.push([row + direction, col])
      // Double move from start
      if (row === startRow && !board[row + 2 * direction][col]) {
        moves.push([row + 2 * direction, col])
      }
    }

    // Captures
    for (const dcol of [-1, 1]) {
      const newRow = row + direction
      const newCol = col + dcol
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const target = board[newRow][newCol]
        if (target && ((isWhite && target === target.toLowerCase()) || (!isWhite && target === target.toUpperCase()))) {
          moves.push([newRow, newCol])
        }
      }
    }

    return moves
  }

  getRookMoves(board, row, col, isWhite) {
    const moves = []
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]

    for (const [drow, dcol] of directions) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + i * drow
        const newCol = col + i * dcol
        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break

        const target = board[newRow][newCol]
        if (!target) {
          moves.push([newRow, newCol])
        } else {
          if ((isWhite && target === target.toLowerCase()) || (!isWhite && target === target.toUpperCase())) {
            moves.push([newRow, newCol])
          }
          break
        }
      }
    }
    return moves
  }

  getKnightMoves(board, row, col, isWhite) {
    const moves = []
    const knightMoves = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ]

    for (const [drow, dcol] of knightMoves) {
      const newRow = row + drow
      const newCol = col + dcol
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const target = board[newRow][newCol]
        if (!target || (isWhite && target === target.toLowerCase()) || (!isWhite && target === target.toUpperCase())) {
          moves.push([newRow, newCol])
        }
      }
    }
    return moves
  }

  getBishopMoves(board, row, col, isWhite) {
    const moves = []
    const directions = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]

    for (const [drow, dcol] of directions) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + i * drow
        const newCol = col + i * dcol
        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break

        const target = board[newRow][newCol]
        if (!target) {
          moves.push([newRow, newCol])
        } else {
          if ((isWhite && target === target.toLowerCase()) || (!isWhite && target === target.toUpperCase())) {
            moves.push([newRow, newCol])
          }
          break
        }
      }
    }
    return moves
  }

  getQueenMoves(board, row, col, isWhite) {
    return [...this.getRookMoves(board, row, col, isWhite), ...this.getBishopMoves(board, row, col, isWhite)]
  }

  getKingMoves(board, row, col, isWhite) {
    const moves = []
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ]

    for (const [drow, dcol] of directions) {
      const newRow = row + drow
      const newCol = col + dcol
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const target = board[newRow][newCol]
        if (!target || (isWhite && target === target.toLowerCase()) || (!isWhite && target === target.toUpperCase())) {
          moves.push([newRow, newCol])
        }
      }
    }
    return moves
  }

  isInCheck(board, isWhite) {
    // Find king position
    let kingPos = null
    const kingSymbol = isWhite ? "K" : "k"

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === kingSymbol) {
          kingPos = [row, col]
          break
        }
      }
      if (kingPos) break
    }

    if (!kingPos) return false

    // Check if any opponent piece can attack the king
    const opponentMoves = this.getAllMoves(board, !isWhite)
    return opponentMoves.some((move) => move.to[0] === kingPos[0] && move.to[1] === kingPos[1])
  }

  isValidMove(board, from, to, isWhite) {
    const [fromRow, fromCol] = from
    const [toRow, toCol] = to
    const piece = board[fromRow][fromCol]

    if (!piece) return false
    if ((isWhite && piece !== piece.toUpperCase()) || (!isWhite && piece !== piece.toLowerCase())) return false

    const validMoves = this.getPieceMoves(board, fromRow, fromCol, piece)
    const moveExists = validMoves.some(([r, c]) => r === toRow && c === toCol)

    if (!moveExists) return false

    // Check if move would leave king in check
    const testBoard = this.makeMove(board, from, to)
    return !this.isInCheck(testBoard, isWhite)
  }

  getBestMove(board, depth = 4) {
    const moves = this.getAllMoves(board, false) // AI plays black
    if (moves.length === 0) return null

    let bestMove = null
    let bestScore = Number.POSITIVE_INFINITY

    // Sort moves by capture value for better pruning
    moves.sort((a, b) => {
      const aValue = a.capture ? this.pieceValues[a.capture] : 0
      const bValue = b.capture ? this.pieceValues[b.capture] : 0
      return bValue - aValue
    })

    for (const move of moves.slice(0, 20)) {
      // Limit search for performance
      const newBoard = this.makeMove(board, move.from, move.to)
      if (!this.isInCheck(newBoard, false)) {
        // Don't make moves that put AI in check
        const score = this.minimax(newBoard, depth - 1, true, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)
        if (score < bestScore) {
          bestScore = score
          bestMove = move
        }
      }
    }

    return bestMove
  }

  minimax(board, depth, isMaximizing, alpha, beta) {
    if (depth === 0) {
      return this.evaluateBoard(board)
    }

    const moves = this.getAllMoves(board, isMaximizing)

    if (moves.length === 0) {
      // Checkmate or stalemate
      if (this.isInCheck(board, isMaximizing)) {
        return isMaximizing ? -10000 + (4 - depth) : 10000 - (4 - depth)
      }
      return 0 // Stalemate
    }

    if (isMaximizing) {
      let maxEval = Number.NEGATIVE_INFINITY
      for (const move of moves.slice(0, 15)) {
        const newBoard = this.makeMove(board, move.from, move.to)
        const score = this.minimax(newBoard, depth - 1, false, alpha, beta)
        maxEval = Math.max(maxEval, score)
        alpha = Math.max(alpha, score)
        if (beta <= alpha) break
      }
      return maxEval
    } else {
      let minEval = Number.POSITIVE_INFINITY
      for (const move of moves.slice(0, 15)) {
        const newBoard = this.makeMove(board, move.from, move.to)
        const score = this.minimax(newBoard, depth - 1, true, alpha, beta)
        minEval = Math.min(minEval, score)
        beta = Math.min(beta, score)
        if (beta <= alpha) break
      }
      return minEval
    }
  }

  makeMove(board, from, to) {
    const newBoard = board.map((row) => [...row])
    const [fromRow, fromCol] = from
    const [toRow, toCol] = to
    newBoard[toRow][toCol] = newBoard[fromRow][fromCol]
    newBoard[fromRow][fromCol] = null
    return newBoard
  }
}

export default function ChessGame({ isDark }) {
  const [gameBoard, setGameBoard] = useState([
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ])

  const [selectedSquare, setSelectedSquare] = useState(null)
  const [legalMoves, setLegalMoves] = useState([])
  const [lastMove, setLastMove] = useState(null)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameStatus, setGameStatus] = useState("playing")
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] })
  const [moveHistory, setMoveHistory] = useState([])
  const [isThinking, setIsThinking] = useState(false)
  const [gameMode, setGameMode] = useState("ai") // "ai" or "human"

  const engine = useRef(new ChessEngine())

  const pieceSymbols = {
    K: "♔",
    Q: "♕",
    R: "♖",
    B: "♗",
    N: "♘",
    P: "♙",
    k: "♚",
    q: "♛",
    r: "♜",
    b: "♝",
    n: "♞",
    p: "♟",
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
    setLegalMoves([])
    setLastMove(null)
    setIsPlayerTurn(true)
    setGameStatus("playing")
    setCapturedPieces({ white: [], black: [] })
    setMoveHistory([])
    setIsThinking(false)
  }

  const handleSquareClick = (row, col) => {
    if (gameStatus !== "playing") return
    if (gameMode === "ai" && !isPlayerTurn) return

    const piece = gameBoard[row][col]

    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare
      const isValidMove = engine.current.isValidMove(
        gameBoard,
        [selectedRow, selectedCol],
        [row, col],
        gameMode === "ai" ? true : isPlayerTurn,
      )

      if (isValidMove) {
        makeMove([selectedRow, selectedCol], [row, col])
      } else {
        // Try to select new piece
        if (
          piece &&
          ((gameMode === "ai" && piece === piece.toUpperCase()) ||
            (gameMode === "human" &&
              ((isPlayerTurn && piece === piece.toUpperCase()) || (!isPlayerTurn && piece === piece.toLowerCase()))))
        ) {
          selectPiece(row, col, piece)
        } else {
          setSelectedSquare(null)
          setLegalMoves([])
        }
      }
    } else if (piece) {
      // Select piece
      const canSelect =
        gameMode === "ai"
          ? piece === piece.toUpperCase()
          : (isPlayerTurn && piece === piece.toUpperCase()) || (!isPlayerTurn && piece === piece.toLowerCase())

      if (canSelect) {
        selectPiece(row, col, piece)
      }
    }
  }

  const selectPiece = (row, col, piece) => {
    setSelectedSquare([row, col])
    const moves = engine.current.getPieceMoves(gameBoard, row, col, piece)
    const validMoves = moves.filter(([toRow, toCol]) =>
      engine.current.isValidMove(gameBoard, [row, col], [toRow, toCol], piece === piece.toUpperCase()),
    )
    setLegalMoves(validMoves)
  }

  const makeMove = (from, to) => {
    const [fromRow, fromCol] = from
    const [toRow, toCol] = to
    const newBoard = [...gameBoard]
    const movingPiece = newBoard[fromRow][fromCol]
    const capturedPiece = newBoard[toRow][toCol]

    // Handle capture
    if (capturedPiece) {
      const captureColor = capturedPiece === capturedPiece.toUpperCase() ? "white" : "black"
      setCapturedPieces((prev) => ({
        ...prev,
        [captureColor]: [...prev[captureColor], capturedPiece],
      }))
    }

    // Make the move
    newBoard[toRow][toCol] = movingPiece
    newBoard[fromRow][fromCol] = null

    // Update game state
    setGameBoard(newBoard)
    setLastMove([from, to])
    setSelectedSquare(null)
    setLegalMoves([])
    setMoveHistory((prev) => [...prev, { from, to, piece: movingPiece, captured: capturedPiece }])

    // Check for game end
    const hasWhiteKing = newBoard.flat().includes("K")
    const hasBlackKing = newBoard.flat().includes("k")

    if (!hasWhiteKing) {
      setGameStatus("black-wins")
    } else if (!hasBlackKing) {
      setGameStatus("white-wins")
    } else {
      // Check for checkmate/stalemate
      const nextPlayer = gameMode === "ai" ? false : !isPlayerTurn
      const possibleMoves = engine.current.getAllMoves(newBoard, nextPlayer)
      const validMoves = possibleMoves.filter((move) =>
        engine.current.isValidMove(newBoard, move.from, move.to, nextPlayer),
      )

      if (validMoves.length === 0) {
        if (engine.current.isInCheck(newBoard, nextPlayer)) {
          setGameStatus(nextPlayer ? "black-wins" : "white-wins")
        } else {
          setGameStatus("stalemate")
        }
      } else {
        setIsPlayerTurn(!isPlayerTurn)
      }
    }
  }

  // AI move logic
  useEffect(() => {
    if (gameMode === "ai" && !isPlayerTurn && gameStatus === "playing") {
      setIsThinking(true)
      const timer = setTimeout(() => {
        const aiMove = engine.current.getBestMove(gameBoard)
        if (aiMove) {
          makeMove(aiMove.from, aiMove.to)
        }
        setIsThinking(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isPlayerTurn, gameBoard, gameStatus, gameMode])

  const isSquareHighlighted = (row, col) => {
    if (selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col) return "selected"
    if (legalMoves.some(([r, c]) => r === row && c === col)) return "legal"
    if (
      lastMove &&
      ((lastMove[0][0] === row && lastMove[0][1] === col) || (lastMove[1][0] === row && lastMove[1][1] === col))
    )
      return "lastMove"
    return null
  }

  const getGameStatusText = () => {
    switch (gameStatus) {
      case "white-wins":
        return "🎉 White Wins!"
      case "black-wins":
        return "🎉 Black Wins!"
      case "stalemate":
        return "🤝 Stalemate!"
      case "playing":
        if (gameMode === "ai") {
          return isThinking ? "🤖 AI is thinking..." : isPlayerTurn ? "Your turn (White)" : "AI's turn (Black)"
        } else {
          return isPlayerTurn ? "White's turn" : "Black's turn"
        }
      default:
        return ""
    }
  }

  return (
    <Card
      className={`max-w-5xl mx-auto ${isDark ? "bg-black/50 border-purple-500/30" : "bg-white/50 border-cyan-500/30"}`}
    >
      <CardHeader>
        <CardTitle className={`flex items-center justify-center gap-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
          <Trophy className="h-6 w-6" />
          Chess Game
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chess Board */}
          <div className="flex-1">
            <div className="relative w-full max-w-[480px] mx-auto aspect-square">
              <Image
                src="/images/chess-board-new.png"
                alt="Chess Board"
                width={480}
                height={480}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                {gameBoard.map((row, rowIndex) =>
                  row.map((piece, colIndex) => {
                    const highlight = isSquareHighlighted(rowIndex, colIndex)
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                        className={`
                          relative flex items-center justify-center cursor-pointer
                          transition-all duration-200 hover:bg-white/20
                          ${highlight === "selected" ? "bg-yellow-400/60 ring-2 ring-yellow-400" : ""}
                          ${highlight === "legal" ? "bg-green-400/40" : ""}
                          ${highlight === "lastMove" ? "bg-blue-400/40" : ""}
                        `}
                      >
                        {piece && (
                          <span
                            className={`
                              text-4xl font-bold select-none
                              transition-transform duration-200 hover:scale-110
                              ${piece === piece.toUpperCase() ? "text-white" : "text-gray-800"}
                            `}
                            style={{
                              textShadow:
                                piece === piece.toUpperCase()
                                  ? "0 0 8px rgba(255,215,0,0.8), 0 2px 4px rgba(0,0,0,0.8)"
                                  : "0 0 8px rgba(0,0,0,0.8), 0 2px 4px rgba(255,255,255,0.5)",
                              filter:
                                piece === piece.toUpperCase()
                                  ? "drop-shadow(0 0 6px rgba(255,215,0,0.6))"
                                  : "drop-shadow(0 0 6px rgba(0,0,0,0.8))",
                            }}
                          >
                            {pieceSymbols[piece]}
                          </span>
                        )}
                        {highlight === "legal" && !piece && (
                          <div
                            className={`w-4 h-4 rounded-full ${isDark ? "bg-green-400" : "bg-green-500"} opacity-70`}
                          />
                        )}
                      </div>
                    )
                  }),
                )}
              </div>
            </div>
          </div>

          {/* Game Info */}
          <div className="w-full lg:w-80 space-y-4">
            {/* Game Mode Selection */}
            <Card
              className={`p-4 ${isDark ? "bg-purple-900/20 border-purple-500/30" : "bg-cyan-900/20 border-cyan-500/30"}`}
            >
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setGameMode("ai")
                    resetGame()
                  }}
                  variant={gameMode === "ai" ? "default" : "outline"}
                  size="sm"
                  className={`flex-1 ${isDark ? "bg-purple-500 hover:bg-purple-600" : "bg-cyan-500 hover:bg-cyan-600"}`}
                >
                  <Bot className="h-4 w-4 mr-1" />
                  vs AI
                </Button>
                <Button
                  onClick={() => {
                    setGameMode("human")
                    resetGame()
                  }}
                  variant={gameMode === "human" ? "default" : "outline"}
                  size="sm"
                  className={`flex-1 ${isDark ? "bg-purple-500 hover:bg-purple-600" : "bg-cyan-500 hover:bg-cyan-600"}`}
                >
                  <Users className="h-4 w-4 mr-1" />2 Players
                </Button>
              </div>
            </Card>

            {/* Game Status */}
            <Card
              className={`p-4 ${isDark ? "bg-purple-900/20 border-purple-500/30" : "bg-cyan-900/20 border-cyan-500/30"}`}
            >
              <div className="text-center">
                <h3 className={`text-lg font-bold ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                  {getGameStatusText()}
                </h3>
                {engine.current.isInCheck(gameBoard, isPlayerTurn) && gameStatus === "playing" && (
                  <p className="text-red-400 text-sm mt-1">Check!</p>
                )}
              </div>
            </Card>

            {/* Captured Pieces */}
            <Card className={`p-4 ${isDark ? "bg-black/30 border-purple-500/20" : "bg-white/30 border-cyan-500/20"}`}>
              <h4 className={`font-bold mb-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>Captured</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-400">White: </span>
                  {capturedPieces.white.map((piece, index) => (
                    <span key={index} className="text-lg mr-1">
                      {pieceSymbols[piece]}
                    </span>
                  ))}
                </div>
                <div>
                  <span className="text-sm text-gray-400">Black: </span>
                  {capturedPieces.black.map((piece, index) => (
                    <span key={index} className="text-lg mr-1">
                      {pieceSymbols[piece]}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Move History */}
            <Card className={`p-4 ${isDark ? "bg-black/30 border-purple-500/20" : "bg-white/30 border-cyan-500/20"}`}>
              <h4 className={`font-bold mb-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                Moves ({moveHistory.length})
              </h4>
              <div className="max-h-32 overflow-y-auto text-sm">
                {moveHistory.slice(-6).map((move, index) => (
                  <div key={index} className="text-gray-400">
                    {moveHistory.length - 5 + index}. {pieceSymbols[move.piece]}
                    {String.fromCharCode(97 + move.from[1])}
                    {8 - move.from[0]} →{String.fromCharCode(97 + move.to[1])}
                    {8 - move.to[0]}
                    {move.captured && ` x${pieceSymbols[move.captured]}`}
                  </div>
                ))}
              </div>
            </Card>

            {/* Controls */}
            <div className="space-y-2">
              <Button
                onClick={resetGame}
                className={`w-full ${isDark ? "bg-purple-500 hover:bg-purple-600" : "bg-cyan-500 hover:bg-cyan-600"}`}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                New Game
              </Button>
            </div>

            {/* Instructions */}
            <Card className={`p-3 ${isDark ? "bg-black/20 border-purple-500/10" : "bg-white/20 border-cyan-500/10"}`}>
              <h5 className={`font-bold text-sm mb-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>How to Play</h5>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Click a piece to select it</li>
                <li>• Green dots show legal moves</li>
                <li>• Click destination to move</li>
                <li>• Yellow square shows selected piece</li>
                <li>• Blue squares show last move</li>
                <li>• Protect your King!</li>
              </ul>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
