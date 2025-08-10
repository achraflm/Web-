"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Trophy, RotateCcw, Users, Bot, Star, Zap, Brain, Target } from "lucide-react"

type PieceChar = "p" | "r" | "n" | "b" | "q" | "k" | "P" | "R" | "N" | "B" | "Q" | "K"
type Board = (PieceChar | null)[][]
type Square = [number, number]
type Move = { from: Square; to: Square; piece: PieceChar; capture: PieceChar | null }
type Personality = "balanced" | "aggressive" | "positional" | "defensive" | "hikaru" | "random"

// Enhanced chess engine with multiple AI personalities
class ChessEngine {
  pieceValues: Record<PieceChar, number>
  pawnTable: number[][]
  knightTable: number[][]
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

  evaluateBoard(board: Board, personality: Personality = "balanced") {
    let score = 0
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece) {
          const isWhite = piece === piece.toUpperCase()
          const pieceType = piece.toLowerCase()
          let pieceScore = this.pieceValues[piece]

          if (personality === "aggressive") {
            if (pieceType === "q") pieceScore *= 1.2
            if (pieceType === "r") pieceScore *= 1.1
          } else if (personality === "positional") {
            if (pieceType === "b") pieceScore *= 1.1
            if (pieceType === "n") pieceScore *= 1.1
          } else if (personality === "defensive") {
            if (pieceType === "k") pieceScore *= 1.1
            if (pieceType === "p") pieceScore *= 1.1
          }

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

  getAllMoves(board: Board, isWhite: boolean): Move[] {
    const moves: Move[] = []
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece && ((isWhite && piece === piece.toUpperCase()) || (!isWhite && piece === piece.toLowerCase()))) {
          const pieceMoves = this.getPieceMoves(board, row, col, piece as PieceChar)
          const fromSq: Square = [row, col]
          moves.push(
            ...pieceMoves.map((move: Square): Move => ({
              from: fromSq,
              to: move,
              piece: piece as PieceChar,
              capture: board[move[0]][move[1]] as PieceChar | null,
            })),
          )
        }
      }
    }
    return moves
  }

  getPieceMoves(board: Board, row: number, col: number, piece: PieceChar): Square[] {
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

  getPawnMoves(board: Board, row: number, col: number, isWhite: boolean) {
    const moves: Square[] = []
    const direction = isWhite ? -1 : 1
    const startRow = isWhite ? 6 : 1

    if (row + direction >= 0 && row + direction < 8 && !board[row + direction][col]) {
      moves.push([row + direction, col])
      if (row === startRow && !board[row + 2 * direction][col]) {
        moves.push([row + 2 * direction, col])
      }
    }

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

  getRookMoves(board: Board, row: number, col: number, isWhite: boolean) {
    const moves: Square[] = []
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

  getKnightMoves(board: Board, row: number, col: number, isWhite: boolean) {
    const moves: Square[] = []
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

  getBishopMoves(board: Board, row: number, col: number, isWhite: boolean) {
    const moves: Square[] = []
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

  getQueenMoves(board: Board, row: number, col: number, isWhite: boolean) {
    return [...this.getRookMoves(board, row, col, isWhite), ...this.getBishopMoves(board, row, col, isWhite)]
  }

  getKingMoves(board: Board, row: number, col: number, isWhite: boolean) {
    const moves: Square[] = []
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

    // Simplified castling rules: allow if king and rook are on initial squares, path clear, and not in check through path
    const startRow = isWhite ? 7 : 0
    const kingSymbol: PieceChar = isWhite ? "K" : "k"
    const rookSymbol: PieceChar = isWhite ? "R" : "r"
    if (row === startRow && col === 4 && board[startRow][4] === kingSymbol) {
      // King side
      if (
        board[startRow][5] === null &&
        board[startRow][6] === null &&
        board[startRow][7] === rookSymbol
      ) {
        // ensure squares not in check while passing
        const boardStep = this.makeMove(board, [row, col], [startRow, 5])
        if (!this.isInCheck(boardStep, isWhite)) {
          const boardStep2 = this.makeMove(boardStep, [startRow, 5], [startRow, 6])
          if (!this.isInCheck(boardStep2, isWhite)) {
            moves.push([startRow, 6])
          }
        }
      }
      // Queen side
      if (
        board[startRow][3] === null &&
        board[startRow][2] === null &&
        board[startRow][1] === null &&
        board[startRow][0] === rookSymbol
      ) {
        const boardStep = this.makeMove(board, [row, col], [startRow, 3])
        if (!this.isInCheck(boardStep, isWhite)) {
          const boardStep2 = this.makeMove(boardStep, [startRow, 3], [startRow, 2])
          if (!this.isInCheck(boardStep2, isWhite)) {
            moves.push([startRow, 2])
          }
        }
      }
    }
    return moves
  }

  isInCheck(board: Board, isWhite: boolean) {
    let kingPos: Square | null = null
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

    const opponentMoves = this.getAllMoves(board, !isWhite)
    return opponentMoves.some((move) => move.to[0] === kingPos[0] && move.to[1] === kingPos[1])
  }

  isValidMove(board: Board, from: Square, to: Square, isWhite: boolean) {
    const [fromRow, fromCol] = from
    const [toRow, toCol] = to
    const piece = board[fromRow][fromCol]

    if (!piece) return false
    if ((isWhite && piece !== piece.toUpperCase()) || (!isWhite && piece !== piece.toLowerCase())) return false

    const validMoves = this.getPieceMoves(board, fromRow, fromCol, piece)
    const moveExists = validMoves.some(([r, c]) => r === toRow && c === toCol)

    if (!moveExists) return false

    const testBoard = this.makeMove(board, from, to)
    return !this.isInCheck(testBoard, isWhite)
  }

  getBestMove(board: Board, depth = 4, personality: Personality = "balanced") {
    const moves = this.getAllMoves(board, false)
    if (moves.length === 0) return null

    let bestMove: Move | null = null
    let bestScore = Number.POSITIVE_INFINITY

    if (personality === "aggressive") {
      moves.sort((a, b) => {
        const aValue = a.capture ? this.pieceValues[a.capture] * 1.5 : 0
        const bValue = b.capture ? this.pieceValues[b.capture] * 1.5 : 0
        return bValue - aValue
      })
    } else if (personality === "positional") {
      moves.sort((a, b) => {
        const aCenter = Math.abs(a.to[0] - 3.5) + Math.abs(a.to[1] - 3.5)
        const bCenter = Math.abs(b.to[0] - 3.5) + Math.abs(b.to[1] - 3.5)
        return aCenter - bCenter
      })
    } else {
      moves.sort((a, b) => {
        const aValue = a.capture ? this.pieceValues[a.capture] : 0
        const bValue = b.capture ? this.pieceValues[b.capture] : 0
        return bValue - aValue
      })
    }

    const searchLimit = personality === "hikaru" ? 25 : 20
    for (const move of moves.slice(0, searchLimit)) {
      const newBoard = this.makeMove(board, move.from, move.to)
      if (!this.isInCheck(newBoard, false)) {
        const score = this.minimax(
          newBoard,
          depth - 1,
          true,
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
          personality,
        )
        if (score < bestScore) {
          bestScore = score
          bestMove = move
        }
      }
    }

    return bestMove
  }

  minimax(
    board: Board,
    depth: number,
    isMaximizing: boolean,
    alpha: number,
    beta: number,
    personality: Personality,
  ) {
    if (depth === 0) {
      return this.evaluateBoard(board, personality)
    }

    const moves = this.getAllMoves(board, isMaximizing)

    if (moves.length === 0) {
      if (this.isInCheck(board, isMaximizing)) {
        return isMaximizing ? -10000 + (4 - depth) : 10000 - (4 - depth)
      }
      return 0
    }

    if (isMaximizing) {
      let maxEval = Number.NEGATIVE_INFINITY
      for (const move of moves.slice(0, 15)) {
        const newBoard = this.makeMove(board, move.from, move.to)
        const score = this.minimax(newBoard, depth - 1, false, alpha, beta, personality)
        maxEval = Math.max(maxEval, score)
        alpha = Math.max(alpha, score)
        if (beta <= alpha) break
      }
      return maxEval
    } else {
      let minEval = Number.POSITIVE_INFINITY
      for (const move of moves.slice(0, 15)) {
        const newBoard = this.makeMove(board, move.from, move.to)
        const score = this.minimax(newBoard, depth - 1, true, alpha, beta, personality)
        minEval = Math.min(minEval, score)
        beta = Math.min(beta, score)
        if (beta <= alpha) break
      }
      return minEval
    }
  }

  makeMove(board: Board, from: Square, to: Square) {
    const newBoard: Board = board.map((row) => [...row])
    const [fromRow, fromCol] = from
    const [toRow, toCol] = to
    newBoard[toRow][toCol] = newBoard[fromRow][fromCol]
    newBoard[fromRow][fromCol] = null

    // Handle castling rook move
    const moving = newBoard[toRow][toCol]
    if (moving === 'K' && fromRow === 7 && fromCol === 4) {
      // white
      if (toCol === 6) {
        // king side
        newBoard[7][5] = newBoard[7][7]
        newBoard[7][7] = null
      } else if (toCol === 2) {
        // queen side
        newBoard[7][3] = newBoard[7][0]
        newBoard[7][0] = null
      }
    } else if (moving === 'k' && fromRow === 0 && fromCol === 4) {
      // black
      if (toCol === 6) {
        newBoard[0][5] = newBoard[0][7]
        newBoard[0][7] = null
      } else if (toCol === 2) {
        newBoard[0][3] = newBoard[0][0]
        newBoard[0][0] = null
      }
    }

    // Handle pawn promotion (auto to queen)
    if (moving === 'P' && toRow === 0) {
      newBoard[toRow][toCol] = 'Q'
    } else if (moving === 'p' && toRow === 7) {
      newBoard[toRow][toCol] = 'q'
    }
    return newBoard
  }
}

// Custom Purple vs Cyan glowing SVG piece set
const ChessPiece: React.FC<{ piece: PieceChar; isSelected: boolean; isCheckmate: boolean }> = ({
  piece,
  isSelected,
  isCheckmate,
}) => {
  if (!piece) return null

  const isWhite = piece === piece.toUpperCase()
  const pieceType = piece.toLowerCase()
  const fill = isWhite ? "#06b6d4" : "#7c3aed"
  const stroke = isWhite ? "#0891b2" : "#6d28d9"
  const accent = isWhite ? "#22d3ee" : "#a78bfa"

  const Base = () => (
    <g>
      <rect x="16" y="48" width="32" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="2" />
      <rect x="12" y="42" width="40" height="6" rx="3" fill={fill} stroke={stroke} strokeWidth="2" />
    </g>
  )

  const AngelBody = () => (
    <g>
      {/* Wings */}
      <path d="M8,40 C10,28 18,22 24,22 C18,28 18,36 16,40 Z" fill={fill} stroke={stroke} strokeWidth="2" opacity="0.9" />
      <path d="M56,40 C54,28 46,22 40,22 C46,28 46,36 48,40 Z" fill={fill} stroke={stroke} strokeWidth="2" opacity="0.9" />
      {/* Halo */}
      <ellipse cx="32" cy="12" rx="9" ry="3" fill={accent} stroke={stroke} strokeWidth="2" />
      {/* Head */}
      <circle cx="32" cy="20" r="6" fill={fill} stroke={stroke} strokeWidth="2" />
      {/* Robe */}
      <path d="M24,26 L40,26 L46,44 L18,44 Z" fill={fill} stroke={stroke} strokeWidth="2" />
    </g>
  )

  const DemonBody = () => (
    <g>
      {/* Horns */}
      <path d="M24,16 C22,12 22,10 24,8 C26,10 26,12 25,16 Z" fill={fill} stroke={stroke} strokeWidth="2" />
      <path d="M40,16 C42,12 42,10 40,8 C38,10 38,12 39,16 Z" fill={fill} stroke={stroke} strokeWidth="2" />
      {/* Head */}
      <circle cx="32" cy="20" r="6" fill={fill} stroke={stroke} strokeWidth="2" />
      {/* Bat wings */}
      <path d="M8,36 C14,26 22,24 24,28 C18,30 14,34 12,40 Z" fill={fill} stroke={stroke} strokeWidth="2" />
      <path d="M56,36 C50,26 42,24 40,28 C46,30 50,34 52,40 Z" fill={fill} stroke={stroke} strokeWidth="2" />
      {/* Torso */}
      <path d="M24,26 L40,26 L44,44 L20,44 Z" fill={fill} stroke={stroke} strokeWidth="2" />
    </g>
  )

  const renderByType = () => {
    switch (pieceType) {
      case "k":
        return (
          <g>
            {isWhite ? <AngelBody /> : <DemonBody />}
            {/* Crown / Spikes */}
            {isWhite ? (
              <path d="M24,26 L28,18 L32,24 L36,18 L40,26 Z" fill={accent} stroke={stroke} strokeWidth="2" />
            ) : (
              <path d="M24,26 L28,18 L32,22 L36,18 L40,26 Z" fill={accent} stroke={stroke} strokeWidth="2" />
            )}
          </g>
        )
      case "q":
        return (
          <g>
            {isWhite ? <AngelBody /> : <DemonBody />}
            <circle cx="32" cy="16" r="3" fill={accent} stroke={stroke} strokeWidth="2" />
            <circle cx="26" cy="18" r="2" fill={accent} stroke={stroke} strokeWidth="2" />
            <circle cx="38" cy="18" r="2" fill={accent} stroke={stroke} strokeWidth="2" />
          </g>
        )
      case "r":
        return (
          <g>
            {isWhite ? <AngelBody /> : <DemonBody />}
            {/* Rook fortified wings and battlements */}
            <rect x="22" y="22" width="20" height="8" fill={accent} stroke={stroke} strokeWidth="2" />
            <rect x="24" y="20" width="4" height="4" fill={stroke} />
            <rect x="30" y="20" width="4" height="4" fill={stroke} />
            <rect x="36" y="20" width="4" height="4" fill={stroke} />
          </g>
        )
      case "b":
        return (
          <g>
            {isWhite ? <AngelBody /> : <DemonBody />}
            {/* Curved crosier (angel) or inverted wand (demon) */}
            {isWhite ? (
              <path d="M32,18 C38,18 38,26 32,26" fill="none" stroke={accent} strokeWidth="3" />
            ) : (
              <path d="M32,18 C26,18 26,26 32,26" fill="none" stroke={accent} strokeWidth="3" />
            )}
            <line x1="32" y1="26" x2="32" y2="38" stroke={accent} strokeWidth="3" />
          </g>
        )
      case "n":
        return (
          <g>
            {isWhite ? <AngelBody /> : <DemonBody />}
            {/* Knight stylized winged steed / drake */}
            <path d="M24,20 C28,14 40,14 40,24 C36,22 30,24 28,28 C28,24 26,22 24,20 Z" fill={accent} stroke={stroke} strokeWidth="2" />
          </g>
        )
      case "p":
        return (
          <g>
            {/* Simple pawn with halo/horns */}
            {isWhite ? (
              <ellipse cx="32" cy="12" rx="7" ry="2.5" fill={accent} stroke={stroke} strokeWidth="2" />
            ) : (
              <g>
                <path d="M28,12 C26,10 26,8 28,8" stroke={stroke} strokeWidth="2" />
                <path d="M36,12 C38,10 38,8 36,8" stroke={stroke} strokeWidth="2" />
              </g>
            )}
            <circle cx="32" cy="20" r="6" fill={fill} stroke={stroke} strokeWidth="2" />
            <path d="M24,26 L40,26 L38,40 L26,40 Z" fill={fill} stroke={stroke} strokeWidth="2" />
          </g>
        )
      default:
        return null
    }
  }

  return (
    <div
      className="select-none"
      style={{
        width: "85%",
        height: "85%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: isSelected ? "scale(1.08)" : "scale(1)",
        transition: "transform 0.15s ease",
        animation: isCheckmate ? "shake 0.5s ease-in-out infinite" : "none",
        filter: isWhite
          ? "drop-shadow(0 0 8px rgba(6, 182, 212, 0.8)) drop-shadow(0 0 16px rgba(6, 182, 212, 0.4)) brightness(1.1)"
          : "drop-shadow(0 0 8px rgba(124, 58, 237, 0.8)) drop-shadow(0 0 16px rgba(124, 58, 237, 0.4)) brightness(1.1)",
        animation: isWhite ? "cyanGlow 2s ease-in-out infinite" : "purpleGlow 2s ease-in-out infinite",
      }}
    >
      <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden>
        <defs>
          {isWhite ? (
            <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          ) : (
            <filter id="purpleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          )}
        </defs>
        <g filter={isWhite ? "url(#cyanGlow)" : "url(#purpleGlow)"}>
          {renderByType()}
          <Base />
        </g>
      </svg>
    </div>
  )
}

type ChessBot = {
  id: "beginner" | "intermediate" | "advanced" | "expert" | "hikaru"
  name: string
  rating: number
  personality: Personality
  depth: number
  // lucide icons are React components
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  color: string
  description: string
}

const chessBot: ChessBot[] = [
  {
    id: "beginner",
    name: "Rookie Bot",
    rating: 400,
    personality: "random",
    depth: 2,
    icon: Target,
    color: "bg-green-500",
    description: "Perfect for learning the basics",
  },
  {
    id: "intermediate",
    name: "Club Player",
    rating: 1200,
    personality: "balanced",
    depth: 3,
    icon: Brain,
    color: "bg-blue-500",
    description: "Solid fundamental play",
  },
  {
    id: "advanced",
    name: "Master Bot",
    rating: 1800,
    personality: "positional",
    depth: 4,
    icon: Star,
    color: "bg-purple-500",
    description: "Strategic and calculating",
  },
  {
    id: "expert",
    name: "Grandmaster",
    rating: 2400,
    personality: "aggressive",
    depth: 5,
    icon: Zap,
    color: "bg-red-500",
    description: "Ruthless and tactical",
  },
  {
    id: "hikaru",
    name: "Hikaru Bot",
    rating: 3200,
    personality: "hikaru",
    depth: 6,
    icon: Trophy,
    color: "bg-gradient-to-r from-yellow-400 to-orange-500",
    description: "Chat is this winning?",
  },
]

export default function ChessGame({ isDark }: { isDark?: boolean }) {
  const [gameBoard, setGameBoard] = useState<Board>([
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ])

  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [legalMoves, setLegalMoves] = useState<Square[]>([])
  const [lastMove, setLastMove] = useState<[Square, Square] | null>(null)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameStatus, setGameStatus] = useState<
    "playing" | "white-wins" | "black-wins" | "stalemate"
  >("playing")
  const [capturedPieces, setCapturedPieces] = useState<{ white: PieceChar[]; black: PieceChar[] }>({
    white: [],
    black: [],
  })
  const [moveHistory, setMoveHistory] = useState<
    Array<{ from: Square; to: Square; piece: PieceChar; captured: PieceChar | null }>
  >([])
  const [isThinking, setIsThinking] = useState(false)
  const [showBotSelection, setShowBotSelection] = useState(true)
  const [selectedBot, setSelectedBot] = useState<ChessBot | null>(null)
  const [gameMode, setGameMode] = useState<"ai" | "human">("ai")
  const [checkmateAnimation, setCheckmateAnimation] = useState(false)

  const engine = useRef(new ChessEngine())

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
    setCheckmateAnimation(false)
  }

  const startGame = (bot: ChessBot) => {
    setSelectedBot(bot)
    setShowBotSelection(false)
    resetGame()
  }

  const handleSquareClick = (row: number, col: number) => {
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
      const canSelect =
        gameMode === "ai"
          ? piece === piece.toUpperCase()
          : (isPlayerTurn && piece === piece.toUpperCase()) || (!isPlayerTurn && piece === piece.toLowerCase())

      if (canSelect) {
        selectPiece(row, col, piece)
      }
    }
  }

  const selectPiece = (row: number, col: number, piece: PieceChar) => {
    setSelectedSquare([row, col])
    const moves = engine.current.getPieceMoves(gameBoard, row, col, piece)
    const validMoves = moves.filter(([toRow, toCol]) =>
      engine.current.isValidMove(gameBoard, [row, col], [toRow, toCol], piece === piece.toUpperCase()),
    )
    setLegalMoves(validMoves)
  }

  const makeMove = (from: Square, to: Square) => {
    const [fromRow, fromCol] = from
    const [toRow, toCol] = to
    const newBoard = [...gameBoard]
    const movingPiece = newBoard[fromRow][fromCol] as PieceChar
    const capturedPiece = newBoard[toRow][toCol] as PieceChar | null

    if (capturedPiece) {
      const captureColor = capturedPiece === capturedPiece.toUpperCase() ? "white" : "black"
      setCapturedPieces((prev) => ({
        ...prev,
        [captureColor]: [...prev[captureColor], capturedPiece],
      }))
    }

    newBoard[toRow][toCol] = movingPiece
    newBoard[fromRow][fromCol] = null

    setGameBoard(newBoard)
    setLastMove([from, to])
    setSelectedSquare(null)
    setLegalMoves([])
    setMoveHistory((prev) => [...prev, { from, to, piece: movingPiece, captured: capturedPiece }])

    const hasWhiteKing = newBoard.flat().includes("K")
    const hasBlackKing = newBoard.flat().includes("k")

    if (!hasWhiteKing) {
      setGameStatus("black-wins")
      setCheckmateAnimation(true)
    } else if (!hasBlackKing) {
      setGameStatus("white-wins")
      setCheckmateAnimation(true)
    } else {
      const nextPlayer = gameMode === "ai" ? false : !isPlayerTurn
      const possibleMoves = engine.current.getAllMoves(newBoard, nextPlayer)
      const validMoves = possibleMoves.filter((move) =>
        engine.current.isValidMove(newBoard, move.from, move.to, nextPlayer),
      )

      if (validMoves.length === 0) {
        if (engine.current.isInCheck(newBoard, nextPlayer)) {
          setGameStatus(nextPlayer ? "black-wins" : "white-wins")
          setCheckmateAnimation(true)
        } else {
          setGameStatus("stalemate")
        }
      } else {
        setIsPlayerTurn(!isPlayerTurn)
      }
    }
  }

  useEffect(() => {
    if (gameMode === "ai" && !isPlayerTurn && gameStatus === "playing" && selectedBot) {
      setIsThinking(true)
      const timer = setTimeout(
        () => {
          const aiMove = engine.current.getBestMove(gameBoard, selectedBot.depth, selectedBot.personality)
          if (aiMove) {
            makeMove(aiMove.from, aiMove.to)
          }
          setIsThinking(false)
        },
        selectedBot.id === "hikaru" ? 500 : 1000,
      )

      return () => clearTimeout(timer)
    }
  }, [isPlayerTurn, gameBoard, gameStatus, gameMode, selectedBot])

  const isSquareHighlighted = (row: number, col: number) => {
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
        return "🎉 You Win!"
      case "black-wins":
        return `🤖 ${selectedBot?.name || "Bot"} Wins!`
      case "stalemate":
        return "🤝 Stalemate!"
      case "playing":
        if (gameMode === "ai") {
          return isThinking
            ? `🤖 ${selectedBot?.name || "Bot"} is thinking...`
            : isPlayerTurn
              ? "Your turn (White)"
              : `${selectedBot?.name || "Bot"}'s turn`
        } else {
          return isPlayerTurn ? "White's turn" : "Black's turn"
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

        @keyframes cyanGlow {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(6, 182, 212, 0.8)) drop-shadow(0 0 16px rgba(6, 182, 212, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 12px rgba(6, 182, 212, 1)) drop-shadow(0 0 24px rgba(6, 182, 212, 0.6));
          }
        }

        @keyframes purpleGlow {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(124, 58, 237, 0.8)) drop-shadow(0 0 16px rgba(124, 58, 237, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 12px rgba(124, 58, 237, 1)) drop-shadow(0 0 24px rgba(124, 58, 237, 0.6));
          }
        }

        .checkmate-board {
          animation: checkmate-flash 1s ease-in-out 3;
        }

        .chess-piece-3d {
          background: linear-gradient(145deg, #f0f0f0, #d0d0d0);
          border-radius: 50%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.8);
        }

        .chess-piece-3d.black {
          background: linear-gradient(145deg, #4a4a4a, #2a2a2a);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <Card
        className={`max-w-6xl mx-auto ${isDark ? "bg-black/50 border-purple-500/30" : "bg-white/50 border-cyan-500/30"}`}
      >
        <CardHeader>
          <CardTitle
            className={`flex items-center justify-center gap-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}
          >
            <Trophy className="h-6 w-6" />
            Chess.com Style Chess
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Bot Selection Dialog */}
          <Dialog open={showBotSelection} onOpenChange={setShowBotSelection}>
            <DialogContent
              className={`max-w-4xl ${isDark ? "bg-gray-900 border-purple-500/30" : "bg-white border-cyan-500/30"}`}
            >
              <DialogHeader>
                <DialogTitle className={`text-center text-2xl ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                  🤖 Play the Bots
                </DialogTitle>
                <p className={`text-center ${isDark ? "text-purple-200" : "text-cyan-700"}`}>
                  Challenge a bot to a chess game. Choose from beginner to master.
                </p>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {chessBot.map((bot) => {
                  const IconComponent = bot.icon
                  return (
                    <Card
                      key={bot.id}
                      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                        isDark
                          ? "bg-gray-800/50 border-purple-500/20 hover:border-purple-500/50"
                          : "bg-white/50 border-cyan-500/20 hover:border-cyan-500/50"
                      }`}
                      onClick={() => startGame(bot)}
                    >
                      <CardContent className="p-6 text-center">
                        <div
                          className={`w-16 h-16 rounded-full ${bot.color} flex items-center justify-center mx-auto mb-4`}
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
                  className={`${isDark ? "border-purple-500/50 hover:bg-purple-500/20" : "border-cyan-500/50 hover:bg-cyan-500/20"}`}
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
                className={`relative w-full max-w-[480px] mx-auto aspect-square ${checkmateAnimation ? "checkmate-board" : ""}`}
              >
                {/* Chess.com style board background */}
                <div className="absolute inset-0 rounded-lg overflow-hidden border-4 border-amber-900/30">
                  <div className="w-full h-full grid grid-cols-8 grid-rows-8">
                    {Array.from({ length: 64 }).map((_, index) => {
                      const row = Math.floor(index / 8)
                      const col = index % 8
                      const isLight = (row + col) % 2 === 0
                      return (
                        <div
                          key={index}
                          className={`${isLight ? "bg-amber-50" : "bg-green-600"} transition-colors duration-200`}
                        />
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
                            transition-all duration-200 hover:bg-black/10 rounded-sm
                            ${highlight === "selected" ? "bg-yellow-400/70 ring-2 ring-yellow-500" : ""}
                            ${highlight === "legal" ? "bg-green-400/50" : ""}
                            ${highlight === "lastMove" ? "bg-yellow-300/60" : ""}
                          `}
                        >
                          {piece && (
                            <ChessPiece
                              piece={piece}
                              isSelected={isSelected}
                              isCheckmate={checkmateAnimation && piece.toLowerCase() === "k"}
                            />
                          )}

                          {/* Legal move indicators - Chess.com style */}
                          {highlight === "legal" && !piece && (
                            <div className="w-6 h-6 rounded-full bg-green-600/70 border-2 border-green-500 shadow-lg" />
                          )}

                          {/* Capture indicators */}
                          {highlight === "legal" && piece && (
                            <div className="absolute inset-1 rounded-full border-4 border-green-500/70 bg-green-400/20" />
                          )}
                        </div>
                      )
                    }),
                  )}
                </div>

                {/* Board coordinates - Chess.com style */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* File labels (a-h) */}
                  <div className="absolute bottom-1 left-0 right-0 flex px-1">
                    {["a", "b", "c", "d", "e", "f", "g", "h"].map((file, index) => (
                      <div key={file} className="flex-1 text-center">
                        <span className="text-xs font-bold text-amber-900 opacity-70">{file}</span>
                      </div>
                    ))}
                  </div>

                  {/* Rank labels (1-8) */}
                  <div className="absolute top-0 bottom-0 left-1 flex flex-col py-1">
                    {[8, 7, 6, 5, 4, 3, 2, 1].map((rank) => (
                      <div key={rank} className="flex-1 flex items-center">
                        <span className="text-xs font-bold text-amber-900 opacity-70">{rank}</span>
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
                  className={`p-4 ${isDark ? "bg-purple-900/20 border-purple-500/30" : "bg-cyan-900/20 border-cyan-500/30"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${selectedBot.color} flex items-center justify-center`}>
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
                className={`p-4 ${isDark ? "bg-purple-900/20 border-purple-500/30" : "bg-cyan-900/20 border-cyan-500/30"}`}
              >
                <div className="text-center">
                  <h3 className={`text-lg font-bold ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                    {getGameStatusText()}
                  </h3>
                  {engine.current.isInCheck(gameBoard, isPlayerTurn) && gameStatus === "playing" && (
                    <p className="text-red-400 text-sm mt-1 animate-pulse">Check!</p>
                  )}
                  {checkmateAnimation && <p className="text-red-500 text-sm mt-1 animate-bounce">Checkmate!</p>}
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
                        <ChessPiece piece={piece} isSelected={false} isCheckmate={false} />
                      </span>
                    ))}
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Black: </span>
                    {capturedPieces.black.map((piece, index) => (
                      <span key={index} className="text-lg mr-1">
                        <ChessPiece piece={piece} isSelected={false} isCheckmate={false} />
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
                      {moveHistory.length - 5 + index}. {move.piece}
                      {String.fromCharCode(97 + move.from[1])}
                      {8 - move.from[0]} →{String.fromCharCode(97 + move.to[1])}
                      {8 - move.to[0]}
                      {move.captured && ` x${move.captured}`}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Controls */}
              <div className="space-y-2">
                <Button
                  onClick={() => setShowBotSelection(true)}
                  className={`w-full ${isDark ? "bg-purple-500 hover:bg-purple-600" : "bg-cyan-500 hover:bg-cyan-600"}`}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  Change Opponent
                </Button>
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className={`w-full ${isDark ? "border-purple-500/50 hover:bg-purple-500/20" : "border-cyan-500/50 hover:bg-cyan-500/20"}`}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Game
                </Button>
              </div>

              {/* Instructions */}
              <Card className={`p-3 ${isDark ? "bg-black/20 border-purple-500/10" : "bg-white/20 border-cyan-500/10"}`}>
                <h5 className={`font-bold text-sm mb-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
                  How to Play
                </h5>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Click a piece to select it</li>
                  <li>• Green circles show legal moves</li>
                  <li>• Click destination to move</li>
                  <li>• Yellow highlight shows selection</li>
                  <li>• Board coordinates like Chess.com</li>
                  <li>• Protect your King!</li>
                </ul>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
