"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, RotateCcw } from "lucide-react"
import { AdvancedChessEngine } from "@/lib/advanced-chess-engine" // Corrected import path
import { Badge } from "@/components/ui/badge"
import { Users, Bot, Star, Target, Crown, Flame } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ChessGameProps {
  isDark: boolean
}

const pieceImages: { [key: string]: string } = {
  wp: "/images/chess-pieces/angel-pawn.png",
  wr: "/images/chess-pieces/angel-rook.png",
  wn: "/images/chess-pieces/angel-knight.png",
  wb: "/images/chess-pieces/angel-bishop.png",
  wq: "/images/chess-pieces/angel-queen.png",
  wk: "/images/chess-pieces/angel-king.png",
  bp: "/images/chess-pieces/demon-pawn.png",
  br: "/images/chess-pieces/demon-rook.png",
  bn: "/images/chess-pieces/demon-knight.png",
  bb: "/images/chess-pieces/demon-bishop.png",
  bq: "/images/chess-pieces/demon-queen.png",
  bk: "/images/chess-pieces/demon-king.png",
}

const boardSize = 400 // px
const squareSize = boardSize / 8 // px

// Angel vs Demon Chess Piece Component with Custom Images
const AngelDemonChessPiece = ({ piece, isSelected, isCheckmate, isDark }) => {
  if (!piece) return null

  const isWhite = piece === piece.toUpperCase()
  const pieceType = piece.toLowerCase()

  const getPieceImage = () => {
    if (isWhite) {
      switch (pieceType) {
        case "k":
          return "/images/chess-pieces/angel-king.png"
        case "q":
          return "/images/chess-pieces/angel-queen.png"
        case "r":
          return "/images/chess-pieces/angel-rook.png"
        case "b":
          return "/images/chess-pieces/angel-bishop.png"
        case "n":
          return "/images/chess-pieces/angel-knight.png"
        case "p":
          return "/images/chess-pieces/angel-pawn.png"
        default:
          return "/placeholder.svg"
      }
    } else {
      switch (pieceType) {
        case "k":
          return "/images/chess-pieces/demon-king.png"
        case "q":
          return "/images/chess-pieces/demon-queen.png"
        case "r":
          return "/images/chess-pieces/demon-rook.png"
        case "b":
          return "/images/chess-pieces/demon-bishop.png"
        case "n":
          return "/images/chess-pieces/demon-knight.png" // Corrected path
        case "p":
          return "/images/chess-pieces/demon-pawn.png"
        default:
          return "/placeholder.svg"
      }
    }
  }

  const getGlowEffect = () => {
    if (isWhite) {
      return isDark
        ? "drop-shadow-[0_0_20px_rgba(6,182,212,1)] drop-shadow-[0_0_40px_rgba(6,182,212,0.6)]"
        : "drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]"
    } else {
      return isDark
        ? "drop-shadow-[0_0_20px_rgba(147,51,234,1)] drop-shadow-[0_0_40px_rgba(147,51,234,0.6)]"
        : "drop-shadow-[0_0_15px_rgba(147,51,234,0.8)] drop-shadow-[0_0_30px_rgba(147,51,234,0.4)]"
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Heaven Sparkles for White Pieces */}
      {isWhite && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-pulse opacity-60"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Hell Embers for Black Pieces */}
      {!isWhite && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-red-500 rounded-full animate-bounce opacity-70"
              style={{
                bottom: `${Math.random() * 50}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1.5}s`,
                animationDuration: `${1 + Math.random() * 1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Chess Piece Image */}
      <div
        className={`
        relative z-10 w-full h-full transition-all duration-300
        ${getGlowEffect()}
        ${isSelected ? "scale-125 animate-pulse" : "scale-100"}
        ${isCheckmate ? "animate-bounce" : ""}
      `}
        style={{
          filter: isSelected ? "brightness(1.4)" : "brightness(1)",
        }}
      >
        <Image
          src={getPieceImage() || "/placeholder.svg"}
          alt={`${isWhite ? "Angel" : "Demon"} ${pieceType.toUpperCase()}`}
          fill
          className="object-contain"
        />
      </div>

      {/* Selection Ring */}
      {isSelected && (
        <div
          className={`
          absolute inset-0 rounded-full animate-ping
          ${isWhite ? "bg-cyan-400/30 border-4 border-cyan-400/60" : "bg-purple-400/30 border-4 border-purple-400/60"}
        `}
        />
      )}

      {/* Power Aura */}
      {(pieceType === "k" || pieceType === "q") && (
        <div
          className={`
          absolute inset-0 rounded-full animate-pulse
          ${
            isWhite
              ? "bg-gradient-radial from-cyan-400/20 to-transparent"
              : "bg-gradient-radial from-purple-400/20 to-transparent"
          }
        `}
          style={{ animationDuration: "3s" }}
        />
      )}
    </div>
  )
}

const chessBot = [
  {
    id: "beginner",
    name: "Rookie Angel",
    rating: 400,
    personality: "random",
    depth: 2,
    icon: Target,
    color: "bg-green-500",
    description: "Learning the divine art of chess",
  },
  {
    id: "intermediate",
    name: "Guardian Spirit",
    rating: 1200,
    personality: "balanced",
    depth: 3,
    icon: Brain,
    color: "bg-blue-500",
    description: "Balanced celestial strategy",
  },
  {
    id: "advanced",
    name: "Archangel",
    rating: 1800,
    personality: "positional",
    depth: 4,
    icon: Star,
    color: "bg-purple-500",
    description: "Strategic heavenly wisdom",
  },
  {
    id: "expert",
    name: "Demon Lord",
    rating: 2400,
    personality: "aggressive",
    depth: 5,
    icon: Flame,
    color: "bg-red-500",
    description: "Ruthless infernal tactics",
  },
  {
    id: "hikaru",
    name: "Chess Deity",
    rating: 3200,
    personality: "hikaru",
    depth: 6,
    icon: Crown,
    color: "bg-gradient-to-r from-yellow-400 to-orange-500",
    description: "Omniscient chess consciousness",
  },
]

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
  const [isPlayerTurn, setIsPlayerTurn] = useState(true) // true for White, false for Black
  const [gameStatus, setGameStatus] = useState("playing")
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] })
  const [moveHistory, setMoveHistory] = useState([])
  const [isThinking, setIsThinking] = useState(false)
  const [showBotSelection, setShowBotSelection] = useState(true)
  const [selectedBot, setSelectedBot] = useState(null)
  const [gameMode, setGameMode] = useState("ai")
  const [checkmateAnimation, setCheckmateAnimation] = useState(false)
  const [gameState, setGameState] = useState({
    castlingRights: { whiteKing: true, whiteQueen: true, blackKing: true, blackQueen: true },
    enPassantTarget: null,
    halfMoveClock: 0,
    fullMoveNumber: 1,
  })

  const engine = useRef(new AdvancedChessEngine())

  const resetGame = useCallback(() => {
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
    setCheckmateAnimation(false)
    const initialGameState = {
      castlingRights: { whiteKing: true, whiteQueen: true, blackKing: true, blackQueen: true },
      enPassantTarget: null,
      halfMoveClock: 0,
      fullMoveNumber: 1,
    }
    setGameState(initialGameState)
    engine.current.gameState = initialGameState // Reset engine's internal state
  }, [])

  const startGame = useCallback(
    (bot) => {
      setSelectedBot(bot)
      setShowBotSelection(false)
      resetGame()
    },
    [resetGame],
  )

  const makeMove = useCallback(
    (from, to) => {
      const [fromRow, fromCol] = from
      const [toRow, toCol] = to
      const movingPiece = gameBoard[fromRow][fromCol]
      const capturedPiece = gameBoard[toRow][toCol]

      const result = engine.current.makeMove(gameBoard, from, to, gameState)
      const newBoard = result.board
      const newGameState = result.gameState

      if (capturedPiece) {
        const captureColor = capturedPiece === capturedPiece.toUpperCase() ? "white" : "black"
        setCapturedPieces((prev) => ({
          ...prev,
          [captureColor]: [...prev[captureColor], capturedPiece],
        }))
      }

      setGameBoard(newBoard)
      setGameState(newGameState)
      engine.current.gameState = newGameState // Keep engine's internal state in sync
      setLastMove([from, to])
      setSelectedSquare(null)
      setLegalMoves([])
      setMoveHistory((prev) => [...prev, { from, to, piece: movingPiece, captured: capturedPiece }])

      // Check game end conditions
      const hasWhiteKing = newBoard.flat().includes("K")
      const hasBlackKing = newBoard.flat().includes("k")

      if (!hasWhiteKing) {
        setGameStatus("black-wins")
        setCheckmateAnimation(true)
      } else if (!hasBlackKing) {
        setGameStatus("white-wins")
        setCheckmateAnimation(true)
      } else {
        const nextPlayerTurn = gameMode === "ai" ? false : !isPlayerTurn // Determine next player for status check
        const possibleMovesForNextPlayer = engine.current.getAllMoves(newBoard, nextPlayerTurn, newGameState)
        const validMovesForNextPlayer = possibleMovesForNextPlayer.filter((move) =>
          engine.current.isValidMove(newBoard, move.from, move.to, nextPlayerTurn, newGameState),
        )

        if (validMovesForNextPlayer.length === 0) {
          if (engine.current.isInCheck(newBoard, nextPlayerTurn)) {
            setGameStatus(nextPlayerTurn ? "black-wins" : "white-wins")
            setCheckmateAnimation(true)
          } else {
            setGameStatus("stalemate")
          }
        } else {
          setIsPlayerTurn(!isPlayerTurn) // Switch turn only if game is still playing
        }
      }
    },
    [gameBoard, gameState, isPlayerTurn, gameMode],
  )

  const selectPiece = useCallback(
    (row, col, piece) => {
      setSelectedSquare([row, col])
      const moves = engine.current.getPieceMoves(gameBoard, row, col, piece, gameState)
      const validMoves = moves.filter((move) => {
        const moveSquare = move.to || move
        return engine.current.isValidMove(gameBoard, [row, col], moveSquare, piece === piece.toUpperCase(), gameState)
      })
      setLegalMoves(validMoves.map((move) => move.to || move))
    },
    [gameBoard, gameState],
  )

  const handleSquareClick = useCallback(
    (row, col) => {
      if (gameStatus !== "playing") return
      if (gameMode === "ai" && !isPlayerTurn) return // Player (White) can only click on their turn in AI mode

      const piece = gameBoard[row][col]

      if (selectedSquare) {
        const [selectedRow, selectedCol] = selectedSquare
        const isValidMoveAttempt = engine.current.isValidMove(
          gameBoard,
          [selectedRow, selectedCol],
          [row, col],
          isPlayerTurn, // Check validity for the current player's turn
          gameState,
        )

        if (isValidMoveAttempt) {
          makeMove([selectedRow, selectedCol], [row, col])
        } else {
          // If invalid move, but clicked on own piece, select new piece
          if (
            piece &&
            ((isPlayerTurn && piece === piece.toUpperCase()) || (!isPlayerTurn && piece === piece.toLowerCase()))
          ) {
            selectPiece(row, col, piece)
          } else {
            setSelectedSquare(null)
            setLegalMoves([])
          }
        }
      } else if (piece) {
        // Select a piece if it's the current player's piece
        const canSelect =
          (isPlayerTurn && piece === piece.toUpperCase()) || (!isPlayerTurn && piece === piece.toLowerCase())

        if (canSelect) {
          selectPiece(row, col, piece)
        }
      }
    },
    [gameStatus, gameMode, isPlayerTurn, gameBoard, selectedSquare, gameState, makeMove, selectPiece],
  )

  const makeAIMove = useCallback(() => {
    if (gameStatus !== "playing" || isPlayerTurn || !selectedBot) return // AI moves only if not player turn and bot selected

    setIsThinking(true)
    const timer = setTimeout(
      () => {
        // AI is always black, so isWhite is false
        const aiMove = engine.current.getBestMove(gameBoard, selectedBot.depth, selectedBot.personality, gameState)
        if (aiMove) {
          makeMove(aiMove.from, aiMove.to)
        }
        setIsThinking(false)
      },
      selectedBot.id === "hikaru" ? 500 : 1000,
    )

    return () => clearTimeout(timer)
  }, [gameBoard, isPlayerTurn, gameStatus, selectedBot, gameState, makeMove])

  // Effect to trigger AI move when it's AI's turn
  useEffect(() => {
    if (gameMode === "ai" && !isPlayerTurn && gameStatus === "playing" && selectedBot) {
      makeAIMove()
    }
  }, [isPlayerTurn, gameBoard, gameStatus, gameMode, selectedBot, makeAIMove])

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
        return "🎉 Angels Triumph!"
      case "black-wins":
        return `👹 ${selectedBot?.name || "Demons"} Victory!`
      case "stalemate":
        return "⚖️ Divine Stalemate!"
      case "playing":
        if (gameMode === "ai") {
          return isThinking
            ? `🤖 ${selectedBot?.name || "Bot"} contemplating...`
            : isPlayerTurn
              ? "⚡ Your turn (Angels)"
              : `🔥 ${selectedBot?.name || "Bot"}'s turn`
        } else {
          return isPlayerTurn ? "⚡ Angels' turn" : "🔥 Demons' turn"
        }
      default:
        return ""
    }
  }

  return (
    <>
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-2px);
          }
          75% {
            transform: translateX(2px);
          }
        }

        @keyframes checkmate-flash {
          0%,
          100% {
            background-color: transparent;
          }
          50% {
            background-color: rgba(239, 68, 68, 0.3);
          }
        }

        .checkmate-board {
          animation: checkmate-flash 1s ease-in-out 3;
        }

        @keyframes heaven-sparkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes hell-ember {
          0% {
            opacity: 0.7;
            transform: translateY(0px);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
      `}</style>

      <Card
        className={`max-w-6xl mx-auto ${
          isDark
            ? "bg-gradient-to-br from-black/80 to-purple-900/50 border-purple-500/30 shadow-[0_0_50px_rgba(147,51,234,0.3)]"
            : "bg-gradient-to-br from-white/80 to-cyan-100/50 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
        }`}
      >
        <CardHeader>
          <CardTitle
            className={`flex items-center justify-center gap-3 text-2xl ${
              isDark ? "text-purple-300" : "text-cyan-600"
            }`}
          >
            <Crown className="h-8 w-8" />⚡ Angel vs Demon Chess 🔥
            <Flame className="h-8 w-8" />
          </CardTitle>
          <p className={`text-center text-sm ${isDark ? "text-purple-200/80" : "text-cyan-700/80"}`}>
            The Ultimate Battle Between Light and Darkness
          </p>
        </CardHeader>
        <CardContent>
          {/* Bot Selection Dialog */}
          <Dialog open={showBotSelection} onOpenChange={setShowBotSelection}>
            <DialogContent
              className={`max-w-4xl ${
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-purple-900/50 border-purple-500/30"
                  : "bg-gradient-to-br from-white to-cyan-50 border-cyan-500/30"
              }`}
            >
              <DialogHeader>
                <DialogTitle className={`text-center text-3xl ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                  ⚔️ Choose Your Opponent ⚔️
                </DialogTitle>
                <p className={`text-center ${isDark ? "text-purple-200" : "text-cyan-700"}`}>
                  Face the forces of darkness in an epic chess battle!
                </p>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {chessBot.map((bot) => {
                  const IconComponent = bot.icon
                  return (
                    <Card
                      key={bot.id}
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                        isDark
                          ? "bg-gray-800/50 border-purple-500/20 hover:border-purple-500/50 hover:shadow-purple-500/20"
                          : "bg-white/50 border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-cyan-500/20"
                      }`}
                      onClick={() => startGame(bot)}
                    >
                      <CardContent className="p-6 text-center">
                        <div
                          className={`w-16 h-16 rounded-full ${bot.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                        >
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <h3 className={`font-bold text-lg mb-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                          {bot.name}
                        </h3>
                        <Badge variant="secondary" className="mb-2">
                          {bot.rating} ELO
                        </Badge>
                        <p className={`text-sm ${isDark ? "text-purple-200" : "text-cyan-700"}`}>{bot.description}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="flex justify-center gap-4 p-4">
                <Button
                  onClick={() => {
                    setGameMode("human")
                    setShowBotSelection(false)
                    resetGame()
                  }}
                  variant="outline"
                  className={`${
                    isDark
                      ? "border-purple-500/50 hover:bg-purple-500/20 text-purple-300"
                      : "border-cyan-500/50 hover:bg-cyan-500/20 text-cyan-700"
                  }`}
                >
                  <Users className="h-4 w-4 mr-2" />2 Players
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Chess Board */}
            <div className="flex-1">
              <div
                className={`relative w-full max-w-[500px] mx-auto aspect-square ${
                  checkmateAnimation ? "checkmate-board" : ""
                }`}
              >
                {/* Epic chess board background */}
                <div
                  className={`absolute inset-0 rounded-xl overflow-hidden border-4 shadow-2xl ${
                    isDark ? "border-purple-500/40 shadow-purple-500/30" : "border-cyan-500/40 shadow-cyan-500/30"
                  }`}
                >
                  <div className="w-full h-full grid grid-cols-8 grid-rows-8">
                    {Array.from({ length: 64 }).map((_, index) => {
                      const row = Math.floor(index / 8)
                      const col = index % 8
                      const isLight = (row + col) % 2 === 0
                      return (
                        <div
                          key={index}
                          className={`${isLight ? "bg-white" : "bg-black"} transition-colors duration-200 relative`}
                        >
                          {/* Subtle texture overlay */}
                          <div
                            className={`absolute inset-0 opacity-5 ${
                              isLight
                                ? "bg-gradient-to-br from-white to-gray-100"
                                : "bg-gradient-to-br from-gray-800 to-black"
                            }`}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Chess pieces overlay */}
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 p-1">
                  {gameBoard.map((row, rowIndex) =>
                    row.map((piece, colIndex) => {
                      const highlight = isSquareHighlighted(rowIndex, colIndex)
                      const isSelected =
                        selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex

                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          onClick={() => handleSquareClick(rowIndex, colIndex)}
                          className={`
                          relative flex items-center justify-center cursor-pointer
                          transition-all duration-300 hover:bg-yellow-400/20 rounded-lg
                          ${
                            highlight === "selected"
                              ? "bg-yellow-400/80 ring-4 ring-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.6)]"
                              : ""
                          }
                          ${
                            highlight === "legal"
                              ? isDark
                                ? "bg-green-400/60 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                                : "bg-green-300/60 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                              : ""
                          }
                          ${
                            highlight === "lastMove"
                              ? isDark
                                ? "bg-blue-400/70 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                                : "bg-blue-300/70 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                              : ""
                          }
                        `}
                        >
                          {piece && (
                            <div className="w-full h-full p-1">
                              <AngelDemonChessPiece
                                piece={piece}
                                isSelected={isSelected}
                                isCheckmate={checkmateAnimation && piece.toLowerCase() === "k"}
                                isDark={isDark}
                              />
                            </div>
                          )}

                          {/* Legal move indicators */}
                          {highlight === "legal" && !piece && (
                            <div
                              className={`w-8 h-8 rounded-full border-4 shadow-xl animate-pulse ${
                                isDark
                                  ? "bg-green-500/80 border-green-400 shadow-green-400/60"
                                  : "bg-green-600/80 border-green-500 shadow-green-500/60"
                              }`}
                            />
                          )}

                          {/* Capture indicators */}
                          {highlight === "legal" && piece && (
                            <div
                              className={`absolute inset-2 rounded-full border-4 animate-pulse ${
                                isDark
                                  ? "border-red-500/80 bg-red-400/30 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                                  : "border-red-600/80 bg-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                              }`}
                            />
                          )}
                        </div>
                      )
                    }),
                  )}
                </div>

                {/* Board coordinates */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* File labels (a-h) */}
                  <div className="absolute bottom-2 left-0 right-0 flex px-2">
                    {["a", "b", "c", "d", "e", "f", "g", "h"].map((file, index) => (
                      <div key={file} className="flex-1 text-center">
                        <span
                          className={`text-sm font-bold opacity-80 ${isDark ? "text-purple-300" : "text-cyan-700"}`}
                        >
                          {file}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Rank labels (1-8) */}
                  <div className="absolute top-0 bottom-0 left-2 flex flex-col py-2">
                    {[8, 7, 6, 5, 4, 3, 2, 1].map((rank) => (
                      <div key={rank} className="flex-1 flex items-center">
                        <span
                          className={`text-sm font-bold opacity-80 ${isDark ? "text-purple-300" : "text-cyan-700"}`}
                        >
                          {rank}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Game Info */}
            <div className="w-full lg:w-80 space-y-4">
              {/* Current Opponent */}
              {selectedBot && (
                <Card
                  className={`p-4 ${
                    isDark
                      ? "bg-gradient-to-r from-purple-900/30 to-red-900/30 border-purple-500/30"
                      : "bg-gradient-to-r from-cyan-100/30 to-blue-100/30 border-cyan-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full ${selectedBot.color} flex items-center justify-center shadow-lg`}
                    >
                      <selectedBot.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`font-bold ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                        {selectedBot.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {selectedBot.rating} ELO
                      </Badge>
                    </div>
                  </div>
                </Card>
              )}

              {/* Game Status */}
              <Card
                className={`p-4 ${
                  isDark
                    ? "bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-500/30"
                    : "bg-gradient-to-r from-cyan-100/30 to-indigo-100/30 border-cyan-500/30"
                }`}
              >
                <div className="text-center">
                  <h3 className={`text-lg font-bold ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                    {getGameStatusText()}
                  </h3>
                  {engine.current.isInCheck(gameBoard, isPlayerTurn) && gameStatus === "playing" && (
                    <p className="text-red-400 text-sm mt-1 animate-pulse">⚠️ CHECK! ⚠️</p>
                  )}
                  {checkmateAnimation && <p className="text-red-500 text-sm mt-1 animate-bounce">💀 CHECKMATE! 💀</p>}
                </div>
              </Card>

              {/* Captured Pieces */}
              <Card className={`p-4 ${isDark ? "bg-black/30 border-purple-500/20" : "bg-white/30 border-cyan-500/20"}`}>
                <h4 className={`font-bold mb-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>Fallen Warriors</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Angels: </span>
                    <div className="flex gap-1">
                      {capturedPieces.white.map((piece, index) => (
                        <div key={index} className="w-6 h-6">
                          <AngelDemonChessPiece piece={piece} isSelected={false} isCheckmate={false} isDark={isDark} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Demons: </span>
                    <div className="flex gap-1">
                      {capturedPieces.black.map((piece, index) => (
                        <div key={index} className="w-6 h-6">
                          <AngelDemonChessPiece piece={piece} isSelected={false} isCheckmate={false} isDark={isDark} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Move History */}
              <Card className={`p-4 ${isDark ? "bg-black/30 border-purple-500/20" : "bg-white/30 border-cyan-500/20"}`}>
                <h4 className={`font-bold mb-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                  Battle Chronicle ({moveHistory.length})
                </h4>
                <div className="max-h-32 overflow-y-auto text-sm">
                  {moveHistory.slice(-6).map((move, index) => (
                    <div key={index} className="text-gray-400">
                      {moveHistory.length - 5 + index}. {move.piece}
                      {String.fromCharCode(97 + move.from[1])}
                      {8 - move.from[0]} →{String.fromCharCode(97 + move.to[1])}
                      {8 - move.to[0]}
                      {move.captured && ` ⚔️${move.captured}`}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Game Features */}
              <Card className={`p-4 ${isDark ? "bg-black/20 border-purple-500/10" : "bg-white/20 border-cyan-500/10"}`}>
                <h5 className={`font-bold text-sm mb-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                  ⚔️ Advanced Features
                </h5>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>✅ Castling (O-O & O-O-O)</li>
                  <li>✅ En Passant captures</li>
                  <li>✅ Pawn promotion</li>
                  <li>✅ Check & Checkmate detection</li>
                  <li>✅ Stalemate recognition</li>
                  <li>✨ Heaven sparkles & Hell embers</li>
                </ul>
              </Card>

              {/* Controls */}
              <div className="space-y-2">
                <Button
                  onClick={() => setShowBotSelection(true)}
                  className={`w-full ${
                    isDark
                      ? "bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600"
                      : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  } text-white font-bold shadow-lg`}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  Change Opponent
                </Button>
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className={`w-full ${
                    isDark
                      ? "border-purple-500/50 hover:bg-purple-500/20 text-purple-300"
                      : "border-cyan-500/50 hover:bg-cyan-500/20 text-cyan-700"
                  }`}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Battle
                </Button>
              </div>

              {/* Battle Guide */}
              <Card className={`p-3 ${isDark ? "bg-black/20 border-purple-500/10" : "bg-white/20 border-cyan-500/10"}`}>
                <h5 className={`font-bold text-sm mb-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                  🏆 Battle Guide
                </h5>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>⚡ Angels (White) glow with cyan light</li>
                  <li>🔥 Demons (Black) radiate purple energy</li>
                  <li>✨ Heaven sparkles around Angels</li>
                  <li>🔥 Hell embers rise from Demons</li>
                  <li>👑 Protect your King at all costs!</li>
                  <li>⚔️ Capture enemy pieces to win!</li>
                </ul>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
