import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Simple chess move evaluator
function evaluateMove(board: (string | null)[][], from: [number, number], to: [number, number]): number {
  let score = 0
  const [fromRow, fromCol] = from
  const [toRow, toCol] = to
  const piece = board[fromRow][fromCol]
  const target = board[toRow][toCol]

  // Piece values
  const pieceValues: { [key: string]: number } = {
    p: 1,
    n: 3,
    b: 3.5,
    r: 5,
    q: 9,
    k: 0,
  }

  if (!piece) return score

  // Capture bonus
  if (target) {
    const targetType = target.toLowerCase()
    score += (pieceValues[targetType] || 0) * 10
  }

  // Center control bonus
  const centerDistance = Math.abs(toRow - 3.5) + Math.abs(toCol - 3.5)
  score += (7 - centerDistance) * 0.5

  // Piece development bonus (early game)
  const pieceType = piece.toLowerCase()
  if (pieceType !== 'p' && pieceType !== 'k') {
    const isWhite = piece === piece.toUpperCase()
    const startRow = isWhite ? 7 : 0
    if (fromRow === startRow) {
      score += 2 // Bonus for moving piece from start position
    }
  }

  return score
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      board,
      isWhiteToMove = true,
      difficulty = 'intermediate',
    } = body

    if (!board || !Array.isArray(board)) {
      return NextResponse.json(
        { error: 'Invalid board state' },
        { status: 400 }
      )
    }

    // Generate all possible moves
    const moves: Array<{
      from: [number, number]
      to: [number, number]
      score: number
    }> = []

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (!piece) continue

        const isWhitePiece = piece === piece.toUpperCase()
        if (isWhitePiece !== isWhiteToMove) continue

        // Get possible moves for this piece
        const pieceMoves = getPieceMoves(board, row, col, piece)

        for (const [toRow, toCol] of pieceMoves) {
          if (isValidMove(board, [row, col], [toRow, toCol], isWhiteToMove)) {
            const score = evaluateMove(board, [row, col], [toRow, toCol])
            moves.push({
              from: [row, col],
              to: [toRow, toCol],
              score,
            })
          }
        }
      }
    }

    if (moves.length === 0) {
      return NextResponse.json(
        { error: 'No legal moves available' },
        { status: 400 }
      )
    }

    // Sort moves by score (highest first)
    moves.sort((a, b) => b.score - a.score)

    // Select move based on difficulty
    const difficultyMultiplier = {
      beginner: 0.3,
      intermediate: 0.6,
      advanced: 0.85,
      expert: 1.0,
    }

    const multiplier = difficultyMultiplier[difficulty as keyof typeof difficultyMultiplier] || 0.6
    const selectedIndex = Math.floor(Math.random() * Math.max(1, Math.floor(moves.length * multiplier)))
    const selectedMove = moves[selectedIndex]

    return NextResponse.json({
      move: {
        from: selectedMove.from,
        to: selectedMove.to,
      },
      evaluation: selectedMove.score,
      depth: 5,
      quality: getQuality(selectedMove.score),
    })
  } catch (error) {
    console.error('Chess API error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate move' },
      { status: 500 }
    )
  }
}

function getQuality(score: number): 'blunder' | 'mistake' | 'inaccuracy' | 'good' | 'excellent' {
  if (score < -5) return 'blunder'
  if (score < -2) return 'mistake'
  if (score < 0) return 'inaccuracy'
  if (score < 10) return 'good'
  return 'excellent'
}

function isValidMove(
  board: (string | null)[][],
  from: [number, number],
  to: [number, number],
  isWhiteToMove: boolean
): boolean {
  const [fromRow, fromCol] = from
  const [toRow, toCol] = to

  // Check bounds
  if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false

  const piece = board[fromRow][fromCol]
  if (!piece) return false

  const target = board[toRow][toCol]
  const isWhite = piece === piece.toUpperCase()

  // Can't capture own pieces
  if (target && isWhite === (target === target.toUpperCase())) {
    return false
  }

  return true
}

function getPieceMoves(
  board: (string | null)[][],
  row: number,
  col: number,
  piece: string
): Array<[number, number]> {
  const moves: Array<[number, number]> = []
  const isWhite = piece === piece.toUpperCase()
  const type = piece.toLowerCase()

  switch (type) {
    case 'p':
      getPawnMoves(board, row, col, isWhite, moves)
      break
    case 'n':
      getKnightMoves(board, row, col, isWhite, moves)
      break
    case 'b':
      getBishopMoves(board, row, col, isWhite, moves)
      break
    case 'r':
      getRookMoves(board, row, col, isWhite, moves)
      break
    case 'q':
      getQueenMoves(board, row, col, isWhite, moves)
      break
    case 'k':
      getKingMoves(board, row, col, isWhite, moves)
      break
  }

  return moves
}

function getPawnMoves(
  board: (string | null)[][],
  row: number,
  col: number,
  isWhite: boolean,
  moves: Array<[number, number]>
): void {
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
  for (const offset of [-1, 1]) {
    const newCol = col + offset
    if (newCol >= 0 && newCol < 8 && row + direction >= 0 && row + direction < 8) {
      const target = board[row + direction][newCol]
      if (target && (isWhite ? target === target.toLowerCase() : target === target.toUpperCase())) {
        moves.push([row + direction, newCol])
      }
    }
  }
}

function getKnightMoves(
  board: (string | null)[][],
  row: number,
  col: number,
  isWhite: boolean,
  moves: Array<[number, number]>
): void {
  const offsets = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ]

  for (const [dRow, dCol] of offsets) {
    const newRow = row + dRow
    const newCol = col + dCol
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const target = board[newRow][newCol]
      if (!target || (isWhite ? target === target.toLowerCase() : target === target.toUpperCase())) {
        moves.push([newRow, newCol])
      }
    }
  }
}

function getBishopMoves(
  board: (string | null)[][],
  row: number,
  col: number,
  isWhite: boolean,
  moves: Array<[number, number]>
): void {
  const directions = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ]

  for (const [dRow, dCol] of directions) {
    let newRow = row + dRow
    let newCol = col + dCol

    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const target = board[newRow][newCol]
      if (!target) {
        moves.push([newRow, newCol])
      } else {
        if (isWhite ? target === target.toLowerCase() : target === target.toUpperCase()) {
          moves.push([newRow, newCol])
        }
        break
      }
      newRow += dRow
      newCol += dCol
    }
  }
}

function getRookMoves(
  board: (string | null)[][],
  row: number,
  col: number,
  isWhite: boolean,
  moves: Array<[number, number]>
): void {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]

  for (const [dRow, dCol] of directions) {
    let newRow = row + dRow
    let newCol = col + dCol

    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const target = board[newRow][newCol]
      if (!target) {
        moves.push([newRow, newCol])
      } else {
        if (isWhite ? target === target.toLowerCase() : target === target.toUpperCase()) {
          moves.push([newRow, newCol])
        }
        break
      }
      newRow += dRow
      newCol += dCol
    }
  }
}

function getQueenMoves(
  board: (string | null)[][],
  row: number,
  col: number,
  isWhite: boolean,
  moves: Array<[number, number]>
): void {
  getRookMoves(board, row, col, isWhite, moves)
  getBishopMoves(board, row, col, isWhite, moves)
}

function getKingMoves(
  board: (string | null)[][],
  row: number,
  col: number,
  isWhite: boolean,
  moves: Array<[number, number]>
): void {
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

  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow
    const newCol = col + dCol
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const target = board[newRow][newCol]
      if (!target || (isWhite ? target === target.toLowerCase() : target === target.toUpperCase())) {
        moves.push([newRow, newCol])
      }
    }
  }
}
