"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
<<<<<<< HEAD
import { RotateCcw } from "lucide-react"
import { AdvancedChessEngine } from "@/lib/advanced-chess-engine" // Corrected import path
import { Badge } from "@/components/ui/badge"
import { Users, Bot, Crown, Flame } from "lucide-react"
=======
import { Brain, RotateCcw } from "lucide-react"
import { SimpleStockfish, StockfishDifficulty } from "@/lib/simple-stockfish"
import { Badge } from "@/components/ui/badge"
import { Users, Bot, Star, Target, Crown, Flame } from "lucide-react"
>>>>>>> 6a7a7de (Updated the website content and design)
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

<<<<<<< HEAD
const boardSize = 400 // px
const squareSize = boardSize / 8 // px

// Angel vs Demon Chess Piece Component with Custom Images
const AngelDemonChessPiece = ({ piece, isSelected, isCheckmate, isDark }) => {
=======
const boardSize = 600 // px - Made bigger
const squareSize = boardSize / 8 // px

// Angel vs Demon Chess Piece Component with Custom Images
const AngelDemonChessPiece = ({ piece, isSelected, isCheckmate, isDark }: {
  piece: string
  isSelected: boolean
  isCheckmate: boolean
  isDark: boolean
}) => {
>>>>>>> 6a7a7de (Updated the website content and design)
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

<<<<<<< HEAD
const chessBot = [
  {
    id: "grandmaster",
    name: "Chess Grandmaster",
    rating: 2800,
    personality: "grandmaster",
    depth: 6,
    icon: Crown,
    color: "bg-gradient-to-r from-purple-600 via-red-600 to-orange-600",
    description: "Advanced AI with deep tactical analysis",
  },
]

export default function ChessGame({ isDark }) {
  const [gameBoard, setGameBoard] = useState([
=======
const stockfishDifficulties = [
  {
    id: "beginner",
    name: "Stockfish Beginner",
    rating: 1200,
    depth: 10,
    skillLevel: 10,
    timeLimit: 1000,
    icon: Target,
    color: "bg-green-500",
    description: "Stockfish with reduced skill level",
  },
  {
    id: "intermediate",
    name: "Stockfish Intermediate",
    rating: 1800,
    depth: 15,
    skillLevel: 15,
    timeLimit: 2000,
    icon: Brain,
    color: "bg-blue-500",
    description: "Stockfish with moderate settings",
  },
  {
    id: "advanced",
    name: "Stockfish Advanced",
    rating: 2400,
    depth: 18,
    skillLevel: 18,
    timeLimit: 3000,
    icon: Star,
    color: "bg-purple-500",
    description: "Stockfish with high settings",
  },
  {
    id: "expert",
    name: "Stockfish Expert",
    rating: 2800,
    depth: 20,
    skillLevel: 20,
    timeLimit: 4000,
    icon: Flame,
    color: "bg-red-500",
    description: "Stockfish near maximum strength",
  },
  {
    id: "master",
    name: "Stockfish Master",
    rating: 3200,
    depth: 22,
    skillLevel: 20,
    timeLimit: 5000,
    icon: Crown,
    color: "bg-gradient-to-r from-yellow-400 to-orange-500",
    description: "Stockfish at maximum strength",
  },
]

export default function ChessGame({ isDark }: { isDark: boolean }) {
  const [gameBoard, setGameBoard] = useState<(string | null)[][]>([
>>>>>>> 6a7a7de (Updated the website content and design)
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ])

<<<<<<< HEAD
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

  const [showPromotionDialog, setShowPromotionDialog] = useState(false)
  const [promotionMove, setPromotionMove] = useState(null)

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
=======
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null)
  const [legalMoves, setLegalMoves] = useState<[number, number][]>([])
  const [lastMove, setLastMove] = useState<[number, number][] | null>(null)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true) // true for White, false for Black
  const [gameStatus, setGameStatus] = useState("playing")
  const [capturedPieces, setCapturedPieces] = useState<{ white: string[], black: string[] }>({ white: [], black: [] })
  const [moveHistory, setMoveHistory] = useState<any[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [showBotSelection, setShowBotSelection] = useState(true)
  const [showDifficultySelector, setShowDifficultySelector] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<any>(null)
  const [gameMode, setGameMode] = useState("ai")
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white")
  const [checkmateAnimation, setCheckmateAnimation] = useState(false)
  const [gameState, setGameState] = useState({
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    isDraw: false,
    isGameOver: false,
    turn: 'w' as 'w' | 'b',
    castling: { w: 'KQkq', b: 'KQkq' },
    enPassant: null as string | null,
    halfMoveClock: 0,
    fullMoveNumber: 1,
  })
  const [promotionDialog, setPromotionDialog] = useState<{
    show: boolean
    from: [number, number] | null
    to: [number, number] | null
  }>({ show: false, from: null, to: null })

  const engine = useRef(new SimpleStockfish())

  const resetGame = useCallback(() => {
    engine.current.resetGame()
    const newBoard = engine.current.getBoard()
    const newGameState = engine.current.getGameState()
    
    setGameBoard(newBoard)
    setSelectedSquare(null)
    setLegalMoves([])
    setLastMove(null)
    setIsPlayerTurn(playerColor === "white") // Player moves first if white
>>>>>>> 6a7a7de (Updated the website content and design)
    setGameStatus("playing")
    setCapturedPieces({ white: [], black: [] })
    setMoveHistory([])
    setIsThinking(false)
    setCheckmateAnimation(false)
<<<<<<< HEAD
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
=======
    setGameState(newGameState)
    setPromotionDialog({ show: false, from: null, to: null })
  }, [playerColor])

  const startGame = useCallback(
    (difficulty: any) => {
      setSelectedDifficulty(difficulty)
>>>>>>> 6a7a7de (Updated the website content and design)
      setShowBotSelection(false)
      resetGame()
    },
    [resetGame],
  )

<<<<<<< HEAD
  const makeMove = useCallback(
    (from, to, promotionPiece = null) => {
      const [fromRow, fromCol] = from
      const [toRow, toCol] = to
      const movingPiece = gameBoard[fromRow][fromCol]
      const capturedPiece = gameBoard[toRow][toCol]

      // Check for pawn promotion
      if (movingPiece && movingPiece.toLowerCase() === "p") {
        const isWhitePawn = movingPiece === "P"
        const promotionRow = isWhitePawn ? 0 : 7

        if (toRow === promotionRow && !promotionPiece) {
          // Show promotion dialog
          setPromotionMove({ from, to })
          setShowPromotionDialog(true)
          return
        }
      }

      const result = engine.current.makeMove(gameBoard, from, to, gameState, promotionPiece)
      const newBoard = result.board
      const newGameState = result.gameState

      if (capturedPiece) {
        const captureColor = capturedPiece === capturedPiece.toUpperCase() ? "white" : "black"
        setCapturedPieces((prev) => ({
          ...prev,
          [captureColor]: [...prev[captureColor], capturedPiece],
=======
  const changeDifficulty = useCallback(
    (difficulty: any) => {
      setSelectedDifficulty(difficulty)
      // Don't reset the game, just change the AI difficulty
    },
    [],
  )

  const makeMove = useCallback(
    (from: [number, number], to: [number, number], promotion?: string) => {
      const result = engine.current.makeMove(from, to, promotion)
      
      if (result.success) {
        const newBoard = engine.current.getBoard()
        const newGameState = engine.current.getGameState()
        
        // Update captured pieces
        if (result.capturedPiece) {
          const captureColor = result.capturedPiece === result.capturedPiece.toUpperCase() ? "white" : "black"
        setCapturedPieces((prev) => ({
          ...prev,
            [captureColor]: [...prev[captureColor], result.capturedPiece],
>>>>>>> 6a7a7de (Updated the website content and design)
        }))
      }

      setGameBoard(newBoard)
      setGameState(newGameState)
<<<<<<< HEAD
      engine.current.gameState = newGameState
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
        const nextPlayerTurn = gameMode === "ai" ? false : !isPlayerTurn
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
=======
      setLastMove([from, to])
      setSelectedSquare(null)
      setLegalMoves([])
        setMoveHistory(engine.current.getMoveHistory())

      // Check game end conditions
        if (newGameState.isCheckmate) {
          // Determine winner based on player color
          if (playerColor === "white") {
            setGameStatus(isPlayerTurn ? "black-wins" : "white-wins")
      } else {
            setGameStatus(isPlayerTurn ? "white-wins" : "black-wins")
          }
            setCheckmateAnimation(true)
        } else if (newGameState.isStalemate || newGameState.isDraw) {
            setGameStatus("stalemate")
>>>>>>> 6a7a7de (Updated the website content and design)
        } else {
          setIsPlayerTurn(!isPlayerTurn)
        }
      }
    },
<<<<<<< HEAD
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
=======
    [isPlayerTurn, playerColor],
  )

  const selectPiece = useCallback(
    (row: number, col: number, piece: string) => {
      setSelectedSquare([row, col])
      const moves = engine.current.getPieceMoves([row, col])
      setLegalMoves(moves.map((move: any) => move.to))
    },
    [],
  )

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      if (gameStatus !== "playing") return
      if (gameMode === "ai" && !isPlayerTurn) return // Player can only click on their turn in AI mode
>>>>>>> 6a7a7de (Updated the website content and design)

      const piece = gameBoard[row][col]

      if (selectedSquare) {
        const [selectedRow, selectedCol] = selectedSquare
<<<<<<< HEAD
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
=======
        const isValidMoveAttempt = engine.current.isValidMove([selectedRow, selectedCol], [row, col])

        if (isValidMoveAttempt) {
          // Check for pawn promotion
          const movingPiece = gameBoard[selectedRow][selectedCol]
          if (movingPiece?.toLowerCase() === 'p' && (row === 0 || row === 7)) {
            setPromotionDialog({ show: true, from: [selectedRow, selectedCol], to: [row, col] })
          } else {
          makeMove([selectedRow, selectedCol], [row, col])
          }
        } else {
          // If invalid move, but clicked on own piece, select new piece
          const isPlayerPiece = playerColor === "white" ? piece === piece?.toUpperCase() : piece === piece?.toLowerCase()
          if (piece && isPlayerPiece) {
>>>>>>> 6a7a7de (Updated the website content and design)
            selectPiece(row, col, piece)
          } else {
            setSelectedSquare(null)
            setLegalMoves([])
          }
        }
      } else if (piece) {
<<<<<<< HEAD
        // Select a piece if it's the current player's piece
        const canSelect =
          (isPlayerTurn && piece === piece.toUpperCase()) || (!isPlayerTurn && piece === piece.toLowerCase())

        if (canSelect) {
=======
        // Select a piece if it's the player's piece
        const isPlayerPiece = playerColor === "white" ? piece === piece.toUpperCase() : piece === piece.toLowerCase()
        if (isPlayerPiece) {
>>>>>>> 6a7a7de (Updated the website content and design)
          selectPiece(row, col, piece)
        }
      }
    },
<<<<<<< HEAD
    [gameStatus, gameMode, isPlayerTurn, gameBoard, selectedSquare, gameState, makeMove, selectPiece],
  )

  const handlePromotionSelection = (piece) => {
    if (promotionMove) {
      const { from, to } = promotionMove
      const movingPiece = gameBoard[from[0]][from[1]]
      const isWhite = movingPiece === "P"
      const promotionPiece = isWhite ? piece.toUpperCase() : piece.toLowerCase()

      setShowPromotionDialog(false)
      setPromotionMove(null)
      makeMove(from, to, promotionPiece)
    }
  }

  const makeAIMove = useCallback(async () => {
    if (gameStatus !== "playing" || isPlayerTurn || !selectedBot) return

    setIsThinking(true)

    try {
      // Call Python chess bot
      const response = await fetch("/api/chess-bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          board: gameBoard,
          depth: selectedBot.depth,
          gameState: gameState,
        }),
      })

      const aiMove = await response.json()

      if (aiMove && aiMove.from && aiMove.to) {
        setTimeout(() => {
          makeMove(aiMove.from, aiMove.to)
          setIsThinking(false)
        }, 1000)
      } else {
        setIsThinking(false)
      }
    } catch (error) {
      console.error("AI move error:", error)
      // Fallback to existing engine
      const aiMove = engine.current.getBestMove(gameBoard, selectedBot.depth, selectedBot.personality, gameState)
      if (aiMove) {
        setTimeout(() => {
          makeMove(aiMove.from, aiMove.to)
          setIsThinking(false)
        }, 1000)
      } else {
        setIsThinking(false)
      }
    }
  }, [gameBoard, isPlayerTurn, gameStatus, gameMode, selectedBot, gameState, makeMove])

  // Effect to trigger AI move when it's AI's turn
  useEffect(() => {
    if (gameMode === "ai" && !isPlayerTurn && gameStatus === "playing" && selectedBot) {
      makeAIMove()
    }
  }, [isPlayerTurn, gameBoard, gameStatus, gameMode, selectedBot, makeAIMove])

  const isSquareHighlighted = (row, col) => {
=======
    [gameStatus, gameMode, isPlayerTurn, gameBoard, selectedSquare, makeMove, selectPiece, playerColor],
  )

  const makeAIMove = useCallback(async () => {
    if (gameStatus !== "playing" || isPlayerTurn || !selectedDifficulty) return // AI moves only if not player turn and difficulty selected

    setIsThinking(true)
    
    try {
      const difficulty: StockfishDifficulty = {
        id: selectedDifficulty.id,
        name: selectedDifficulty.name,
        depth: selectedDifficulty.depth,
        skillLevel: selectedDifficulty.skillLevel,
        timeLimit: selectedDifficulty.timeLimit,
        description: selectedDifficulty.description
      }
      
      const result = await engine.current.getAIMove(difficulty)
      if (result && result.success) {
        const newBoard = engine.current.getBoard()
        const newGameState = engine.current.getGameState()
        
        // Update captured pieces
        if (result.capturedPiece) {
          const captureColor = result.capturedPiece === result.capturedPiece.toUpperCase() ? "white" : "black"
          setCapturedPieces((prev) => ({
            ...prev,
            [captureColor]: [...prev[captureColor], result.capturedPiece],
          }))
        }

        setGameBoard(newBoard)
        setGameState(newGameState)
        if (result.move) {
          setLastMove([result.move.from, result.move.to])
        }
        setMoveHistory(engine.current.getMoveHistory())

        // Check game end conditions
        if (newGameState.isCheckmate) {
          // Determine winner based on player color
          if (playerColor === "white") {
            setGameStatus(isPlayerTurn ? "black-wins" : "white-wins")
          } else {
            setGameStatus(isPlayerTurn ? "white-wins" : "black-wins")
          }
          setCheckmateAnimation(true)
        } else if (newGameState.isStalemate || newGameState.isDraw) {
          setGameStatus("stalemate")
        } else {
          setIsPlayerTurn(!isPlayerTurn)
        }
      }
    } catch (error) {
      console.error('AI move error:', error)
    } finally {
      setIsThinking(false)
    }
  }, [isPlayerTurn, gameStatus, selectedDifficulty, makeMove])

  // Effect to trigger AI move when it's AI's turn
  useEffect(() => {
    if (gameMode === "ai" && !isPlayerTurn && gameStatus === "playing" && selectedDifficulty) {
      makeAIMove()
    }
  }, [isPlayerTurn, gameBoard, gameStatus, gameMode, selectedDifficulty, makeAIMove])

  // Effect to trigger AI first move when player is black
  useEffect(() => {
    if (gameMode === "ai" && playerColor === "black" && gameStatus === "playing" && selectedDifficulty && moveHistory.length === 0) {
      // AI makes first move when player is black
      setTimeout(() => {
        makeAIMove()
      }, 500)
    }
  }, [gameMode, playerColor, gameStatus, selectedDifficulty, moveHistory.length, makeAIMove])

  // Function to get display coordinates based on player color
  const getDisplayCoords = (row: number, col: number): [number, number] => {
    if (playerColor === "black") {
      return [7 - row, 7 - col] // Flip the board for black player
    }
    return [row, col]
  }

  const isSquareHighlighted = (row: number, col: number) => {
>>>>>>> 6a7a7de (Updated the website content and design)
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
<<<<<<< HEAD
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
=======
        return playerColor === "white" ? "🎉 You Win!" : `👹 ${selectedDifficulty?.name || "Stockfish"} Wins!`
      case "black-wins":
        return playerColor === "black" ? "🎉 You Win!" : `👹 ${selectedDifficulty?.name || "Stockfish"} Wins!`
      case "stalemate":
        return "⚖️ Stalemate!"
      case "playing":
        if (gameMode === "ai") {
          return isThinking
            ? `🤖 ${selectedDifficulty?.name || "Stockfish"} contemplating...`
            : isPlayerTurn
              ? `⚡ Your turn (${playerColor === "white" ? "White" : "Black"})`
              : `🔥 ${selectedDifficulty?.name || "Stockfish"}'s turn`
        } else {
          return isPlayerTurn ? `⚡ ${playerColor === "white" ? "White" : "Black"}'s turn` : `🔥 ${playerColor === "white" ? "Black" : "White"}'s turn`
>>>>>>> 6a7a7de (Updated the website content and design)
        }
      default:
        return ""
    }
  }

<<<<<<< HEAD
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
=======
  const handlePromotion = (piece: string) => {
    if (promotionDialog.from && promotionDialog.to) {
      makeMove(promotionDialog.from, promotionDialog.to, piece)
      setPromotionDialog({ show: false, from: null, to: null })
    }
  }

  return (
    <>
>>>>>>> 6a7a7de (Updated the website content and design)
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
<<<<<<< HEAD
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
=======
                  🤖 Choose Stockfish Difficulty 🤖
                </DialogTitle>
                <p className={`text-center ${isDark ? "text-purple-200" : "text-cyan-700"}`}>
                  Play against the world's strongest chess engine!
                </p>
                
                {/* Color Selection */}
                <div className="flex justify-center gap-4 mt-4">
                  <Button
                    onClick={() => setPlayerColor("white")}
                    variant={playerColor === "white" ? "default" : "outline"}
                    className={`px-6 ${playerColor === "white" ? "bg-white text-black" : ""}`}
                  >
                    ⚪ Play as White
                  </Button>
                  <Button
                    onClick={() => setPlayerColor("black")}
                    variant={playerColor === "black" ? "default" : "outline"}
                    className={`px-6 ${playerColor === "black" ? "bg-black text-white" : ""}`}
                  >
                    ⚫ Play as Black
                  </Button>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {stockfishDifficulties.map((difficulty) => {
                  const IconComponent = difficulty.icon
                  return (
                    <Card
                      key={difficulty.id}
>>>>>>> 6a7a7de (Updated the website content and design)
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                        isDark
                          ? "bg-gray-800/50 border-purple-500/20 hover:border-purple-500/50 hover:shadow-purple-500/20"
                          : "bg-white/50 border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-cyan-500/20"
                      }`}
<<<<<<< HEAD
                      onClick={() => startGame(bot)}
                    >
                      <CardContent className="p-6 text-center">
                        <div
                          className={`w-16 h-16 rounded-full ${bot.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
=======
                      onClick={() => startGame(difficulty)}
                    >
                      <CardContent className="p-6 text-center">
                        <div
                          className={`w-16 h-16 rounded-full ${difficulty.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
>>>>>>> 6a7a7de (Updated the website content and design)
                        >
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <h3 className={`font-bold text-lg mb-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
<<<<<<< HEAD
                          {bot.name}
                        </h3>
                        <Badge variant="secondary" className="mb-2">
                          {bot.rating} ELO
                        </Badge>
                        <p className={`text-sm ${isDark ? "text-purple-200" : "text-cyan-700"}`}>{bot.description}</p>
=======
                          {difficulty.name}
                        </h3>
                        <Badge variant="secondary" className="mb-2">
                          {difficulty.rating} ELO
                        </Badge>
                        <p className={`text-sm ${isDark ? "text-purple-200" : "text-cyan-700"}`}>{difficulty.description}</p>
>>>>>>> 6a7a7de (Updated the website content and design)
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
<<<<<<< HEAD
            <div className="flex-1">
              <div
                className={`relative w-full max-w-[500px] mx-auto aspect-square ${
=======
            <div className="flex-1 flex justify-center">
              <div
                className={`relative w-full max-w-[700px] mx-auto aspect-square ${
>>>>>>> 6a7a7de (Updated the website content and design)
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
<<<<<<< HEAD
                  {gameBoard &&
                    gameBoard.map(
                      (row, rowIndex) =>
                        row &&
                        row.map((piece, colIndex) => {
                          const highlight = isSquareHighlighted(rowIndex, colIndex)
                          const isSelected =
                            selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex

                          return (
                            <div
                              key={`${rowIndex}-${colIndex}`}
                              onClick={() => handleSquareClick(rowIndex, colIndex)}
                              className={`
=======
                  {gameBoard.map((row, rowIndex) =>
                    row.map((piece, colIndex) => {
                      const [displayRow, displayCol] = getDisplayCoords(rowIndex, colIndex)
                      const highlight = isSquareHighlighted(rowIndex, colIndex)
                      const isSelected = Boolean(
                        selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex
                      )

                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          onClick={() => handleSquareClick(rowIndex, colIndex)}
                          className={`
>>>>>>> 6a7a7de (Updated the website content and design)
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
<<<<<<< HEAD
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
=======
                        >
                          {piece && (
                            <div className="w-full h-full p-0.5">
                              <AngelDemonChessPiece
                                piece={piece || ""}
                                isSelected={isSelected}
                                isCheckmate={checkmateAnimation && piece?.toLowerCase() === "k"}
                                isDark={isDark}
                              />
                            </div>
                          )}

                          {/* Legal move indicators */}
                          {highlight === "legal" && !piece && (
                            <div
                              className={`w-12 h-12 rounded-full border-4 shadow-xl animate-pulse ${
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
>>>>>>> 6a7a7de (Updated the website content and design)
                </div>

                {/* Board coordinates */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* File labels (a-h) */}
                  <div className="absolute bottom-2 left-0 right-0 flex px-2">
<<<<<<< HEAD
                    {["a", "b", "c", "d", "e", "f", "g", "h"].map((file, index) => (
=======
                    {(playerColor === "black" ? ["h", "g", "f", "e", "d", "c", "b", "a"] : ["a", "b", "c", "d", "e", "f", "g", "h"]).map((file, index) => (
>>>>>>> 6a7a7de (Updated the website content and design)
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
<<<<<<< HEAD
                    {[8, 7, 6, 5, 4, 3, 2, 1].map((rank) => (
=======
                    {(playerColor === "black" ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1]).map((rank) => (
>>>>>>> 6a7a7de (Updated the website content and design)
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
<<<<<<< HEAD
              {selectedBot && (
=======
              {selectedDifficulty && (
>>>>>>> 6a7a7de (Updated the website content and design)
                <Card
                  className={`p-4 ${
                    isDark
                      ? "bg-gradient-to-r from-purple-900/30 to-red-900/30 border-purple-500/30"
                      : "bg-gradient-to-r from-cyan-100/30 to-blue-100/30 border-cyan-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
<<<<<<< HEAD
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
=======
                      className={`w-12 h-12 rounded-full ${selectedDifficulty.color} flex items-center justify-center shadow-lg`}
                    >
                      <selectedDifficulty.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`font-bold ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                        {selectedDifficulty.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {selectedDifficulty.rating} ELO
>>>>>>> 6a7a7de (Updated the website content and design)
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
<<<<<<< HEAD
                  {engine.current.isInCheck(gameBoard, isPlayerTurn) && gameStatus === "playing" && (
=======
                  {gameState.isCheck && gameStatus === "playing" && (
>>>>>>> 6a7a7de (Updated the website content and design)
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
<<<<<<< HEAD
                      {capturedPieces?.white?.map((piece, index) => (
=======
                      {capturedPieces.white.map((piece, index) => (
>>>>>>> 6a7a7de (Updated the website content and design)
                        <div key={index} className="w-6 h-6">
                          <AngelDemonChessPiece piece={piece} isSelected={false} isCheckmate={false} isDark={isDark} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Demons: </span>
                    <div className="flex gap-1">
<<<<<<< HEAD
                      {capturedPieces?.black?.map((piece, index) => (
=======
                      {capturedPieces.black.map((piece, index) => (
>>>>>>> 6a7a7de (Updated the website content and design)
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
<<<<<<< HEAD
                  {moveHistory &&
                    moveHistory.slice(-6).map((move, index) => (
                      <div key={index} className="text-gray-400">
                        {moveHistory.length - 5 + index}. {move.piece}
                        {String.fromCharCode(97 + move.from[1])}
                        {8 - move.from[0]} →{String.fromCharCode(97 + move.to[1])}
                        {8 - move.to[0]}
                        {move.captured && ` ⚔️${move.captured}`}
                      </div>
                    ))}
=======
                  {moveHistory.slice(-6).map((move, index) => (
                    <div key={index} className="text-gray-400">
                      {moveHistory.length - 5 + index}. {move.san || move.piece}
                      {move.captured && ` ⚔️${move.captured}`}
                    </div>
                  ))}
>>>>>>> 6a7a7de (Updated the website content and design)
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
<<<<<<< HEAD
=======
              <div className="space-y-2">
>>>>>>> 6a7a7de (Updated the website content and design)
                <Button
                  onClick={() => setShowBotSelection(true)}
                  className={`w-full ${
                    isDark
                      ? "bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600"
                      : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  } text-white font-bold shadow-lg`}
                >
                  <Bot className="h-4 w-4 mr-2" />
<<<<<<< HEAD
                  Change Opponent
                </Button>
                <Button
                  onClick={resetGame}
=======
                    New Game
                </Button>
                <Button
                    onClick={() => setShowDifficultySelector(true)}
>>>>>>> 6a7a7de (Updated the website content and design)
                  variant="outline"
                  className={`w-full ${
                    isDark
                      ? "border-purple-500/50 hover:bg-purple-500/20 text-purple-300"
                      : "border-cyan-500/50 hover:bg-cyan-500/20 text-cyan-700"
                  }`}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
<<<<<<< HEAD
                  New Battle
                </Button>
=======
                    Change Difficulty
                </Button>
                </div>
>>>>>>> 6a7a7de (Updated the website content and design)
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

      {/* Pawn Promotion Dialog */}
<<<<<<< HEAD
      <Dialog open={showPromotionDialog} onOpenChange={setShowPromotionDialog}>
        <DialogContent className={`${isDark ? "bg-gray-900 border-purple-500/20" : "bg-white border-cyan-500/20"}`}>
          <DialogHeader>
            <DialogTitle className={`${isDark ? "text-purple-300" : "text-cyan-600"}`}>
              Choose Promotion Piece
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center space-x-4 p-4">
            {["q", "r", "b", "n"].map((piece) => {
              const isWhite = promotionMove && gameBoard[promotionMove.from[0]][promotionMove.from[1]] === "P"
              const pieceKey = (isWhite ? piece.toUpperCase() : piece) + (isWhite ? "w" : "b")
              const imagePath = isWhite
                ? `/images/chess-pieces/angel-${piece === "q" ? "queen" : piece === "r" ? "rook" : piece === "b" ? "bishop" : "knight"}.png`
                : `/images/chess-pieces/demon-${piece === "q" ? "queen" : piece === "r" ? "rook" : piece === "b" ? "bishop" : "knight"}.png`

              return (
                <Button
                  key={piece}
                  onClick={() => handlePromotionSelection(piece)}
                  className={`p-4 ${isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-cyan-600 hover:bg-cyan-700"}`}
                >
                  <Image
                    src={imagePath || "/placeholder.svg"}
                    alt={`${piece} promotion`}
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                </Button>
=======
      <Dialog open={promotionDialog.show} onOpenChange={(open) => setPromotionDialog({ show: open, from: null, to: null })}>
        <DialogContent className={`max-w-md ${isDark ? "bg-gray-900 border-purple-500/30" : "bg-white border-cyan-500/30"}`}>
          <DialogHeader>
            <DialogTitle className={`text-center text-xl ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
              Choose Promotion Piece
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-4 p-4">
            {['q', 'r', 'b', 'n'].map((piece) => (
              <Button
                key={piece}
                onClick={() => handlePromotion(piece)}
                className={`h-16 w-16 p-0 ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 border-purple-500/50"
                    : "bg-gray-100 hover:bg-gray-200 border-cyan-500/50"
                }`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <AngelDemonChessPiece
                    piece={isPlayerTurn ? piece.toUpperCase() : piece}
                    isSelected={false}
                    isCheckmate={false}
                    isDark={isDark}
                  />
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Difficulty Selection Dialog */}
      <Dialog open={showDifficultySelector} onOpenChange={setShowDifficultySelector}>
        <DialogContent className={`max-w-2xl ${isDark ? "bg-gray-900 border-purple-500/30" : "bg-white border-cyan-500/30"}`}>
          <DialogHeader>
            <DialogTitle className={`text-center text-2xl ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
              🤖 Change AI Difficulty 🤖
            </DialogTitle>
            <p className={`text-center ${isDark ? "text-purple-200" : "text-cyan-700"}`}>
              Select a new difficulty level without resetting the game
            </p>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {stockfishDifficulties.map((difficulty) => {
              const IconComponent = difficulty.icon
              const isSelected = selectedDifficulty?.id === difficulty.id
              return (
                <Card
                  key={difficulty.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    isSelected
                      ? isDark
                        ? "bg-purple-600/50 border-purple-400 shadow-purple-400/50"
                        : "bg-cyan-600/50 border-cyan-400 shadow-cyan-400/50"
                      : isDark
                        ? "bg-gray-800/50 border-purple-500/20 hover:border-purple-500/50 hover:shadow-purple-500/20"
                        : "bg-white/50 border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-cyan-500/20"
                  }`}
                  onClick={() => {
                    changeDifficulty(difficulty)
                    setShowDifficultySelector(false)
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 rounded-full ${difficulty.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className={`font-bold text-lg mb-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                      {difficulty.name}
                    </h3>
                    <Badge variant="secondary" className="mb-2">
                      {difficulty.rating} ELO
                    </Badge>
                    <p className={`text-sm ${isDark ? "text-purple-200" : "text-cyan-700"}`}>{difficulty.description}</p>
                  </CardContent>
                </Card>
>>>>>>> 6a7a7de (Updated the website content and design)
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
<<<<<<< HEAD
    </div>
=======
    </>
>>>>>>> 6a7a7de (Updated the website content and design)
  )
}
