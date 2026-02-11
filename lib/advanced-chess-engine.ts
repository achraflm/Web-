interface Move {
  from: [number, number]
  to: [number, number]
}

interface GameState {
  castlingRights: {
    whiteKing: boolean
    whiteQueen: boolean
    blackKing: boolean
    blackQueen: boolean
  }
  enPassantTarget: [number, number] | null
  halfMoveClock: number
  fullMoveNumber: number
}

interface ChessAI {
  id: string
  name: string
  rating: number
  personality: string
}

class AdvancedChessEngine {
  gameState: GameState

  constructor() {
    this.gameState = {
      castlingRights: {
        whiteKing: true,
        whiteQueen: true,
        blackKing: true,
        blackQueen: true,
      },
      enPassantTarget: null,
      halfMoveClock: 0,
      fullMoveNumber: 1,
    }
  }

  getPieceMoves(
    board: (string | null)[][],
    row: number,
    col: number,
    piece: string,
    gameState: GameState
  ): [number, number][] {
    const moves: [number, number][] = []
    const isWhite = piece === piece.toUpperCase()

    switch (piece.toLowerCase()) {
      case "p":
        this.getPawnMoves(board, row, col, isWhite, gameState, moves)
        break
      case "r":
        this.getRookMoves(board, row, col, isWhite, moves)
        break
      case "n":
        this.getKnightMoves(board, row, col, isWhite, moves)
        break
      case "b":
        this.getBishopMoves(board, row, col, isWhite, moves)
        break
      case "q":
        this.getQueenMoves(board, row, col, isWhite, moves)
        break
      case "k":
        this.getKingMoves(board, row, col, isWhite, gameState, moves)
        break
    }

    return moves
  }

  private getPawnMoves(
    board: (string | null)[][],
    row: number,
    col: number,
    isWhite: boolean,
    gameState: GameState,
    moves: [number, number][]
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
    for (const colOffset of [-1, 1]) {
      const newCol = col + colOffset
      if (newCol >= 0 && newCol < 8 && row + direction >= 0 && row + direction < 8) {
        const targetPiece = board[row + direction][newCol]
        if (
          targetPiece &&
          ((isWhite && targetPiece === targetPiece.toLowerCase()) ||
            (!isWhite && targetPiece === targetPiece.toUpperCase()))
        ) {
          moves.push([row + direction, newCol])
        }
      }
    }
  }

  private getRookMoves(
    board: (string | null)[][],
    row: number,
    col: number,
    isWhite: boolean,
    moves: [number, number][]
  ): void {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]

    for (const [dRow, dCol] of directions) {
      let newRow = row + dRow
      let newCol = col + dCol

      while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const targetPiece = board[newRow][newCol]
        if (!targetPiece) {
          moves.push([newRow, newCol])
        } else {
          if (
            (isWhite && targetPiece === targetPiece.toLowerCase()) ||
            (!isWhite && targetPiece === targetPiece.toUpperCase())
          ) {
            moves.push([newRow, newCol])
          }
          break
        }
        newRow += dRow
        newCol += dCol
      }
    }
  }

  private getKnightMoves(
    board: (string | null)[][],
    row: number,
    col: number,
    isWhite: boolean,
    moves: [number, number][]
  ): void {
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1],
    ]

    for (const [dRow, dCol] of knightMoves) {
      const newRow = row + dRow
      const newCol = col + dCol

      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const targetPiece = board[newRow][newCol]
        if (
          !targetPiece ||
          ((isWhite && targetPiece === targetPiece.toLowerCase()) ||
            (!isWhite && targetPiece === targetPiece.toUpperCase()))
        ) {
          moves.push([newRow, newCol])
        }
      }
    }
  }

  private getBishopMoves(
    board: (string | null)[][],
    row: number,
    col: number,
    isWhite: boolean,
    moves: [number, number][]
  ): void {
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]]

    for (const [dRow, dCol] of directions) {
      let newRow = row + dRow
      let newCol = col + dCol

      while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const targetPiece = board[newRow][newCol]
        if (!targetPiece) {
          moves.push([newRow, newCol])
        } else {
          if (
            (isWhite && targetPiece === targetPiece.toLowerCase()) ||
            (!isWhite && targetPiece === targetPiece.toUpperCase())
          ) {
            moves.push([newRow, newCol])
          }
          break
        }
        newRow += dRow
        newCol += dCol
      }
    }
  }

  private getQueenMoves(
    board: (string | null)[][],
    row: number,
    col: number,
    isWhite: boolean,
    moves: [number, number][]
  ): void {
    this.getRookMoves(board, row, col, isWhite, moves)
    this.getBishopMoves(board, row, col, isWhite, moves)
  }

  private getKingMoves(
    board: (string | null)[][],
    row: number,
    col: number,
    isWhite: boolean,
    gameState: GameState,
    moves: [number, number][]
  ): void {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1],
    ]

    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow
      const newCol = col + dCol

      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const targetPiece = board[newRow][newCol]
        if (
          !targetPiece ||
          ((isWhite && targetPiece === targetPiece.toLowerCase()) ||
            (!isWhite && targetPiece === targetPiece.toUpperCase()))
        ) {
          moves.push([newRow, newCol])
        }
      }
    }
  }

  isInCheck(board: (string | null)[][], isWhite: boolean): boolean {
    let kingRow = -1
    let kingCol = -1
    const kingPiece = isWhite ? "K" : "k"

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === kingPiece) {
          kingRow = row
          kingCol = col
          break
        }
      }
      if (kingRow !== -1) break
    }

    if (kingRow === -1) return false

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (
          piece &&
          ((isWhite && piece === piece.toLowerCase()) ||
            (!isWhite && piece === piece.toUpperCase()))
        ) {
          const moves = this.getPieceMoves(board, row, col, piece, this.gameState)
          if (moves.some((move) => move[0] === kingRow && move[1] === kingCol)) {
            return true
          }
        }
      }
    }

    return false
  }

  getBestMove(
    board: (string | null)[][],
    isWhite: boolean
  ): Move | null {
    const moves: Move[] = []

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (
          piece &&
          ((isWhite && piece === piece.toUpperCase()) ||
            (!isWhite && piece === piece.toLowerCase()))
        ) {
          const pieceMoves = this.getPieceMoves(board, row, col, piece, this.gameState)
          for (const move of pieceMoves) {
            moves.push({ from: [row, col], to: move })
          }
        }
      }
    }

    if (moves.length === 0) return null

    let bestMove = moves[0]
    let bestScore = -Infinity

    for (const move of moves) {
      const newBoard = board.map((r) => [...r])
      newBoard[move.to[0]][move.to[1]] = newBoard[move.from[0]][move.from[1]]
      newBoard[move.from[0]][move.from[1]] = null

      let score = 0

      // Capture value
      if (board[move.to[0]][move.to[1]]) {
        const pieceValues: { [key: string]: number } = {
          p: 1, n: 3, b: 3, r: 5, q: 9, k: 1000,
        }
        const targetPiece = board[move.to[0]][move.to[1]]!.toLowerCase()
        score += (pieceValues[targetPiece] || 0) * 10
      }

      // Center control
      const centerDistance =
        Math.abs(move.to[0] - 3.5) + Math.abs(move.to[1] - 3.5)
      score += (7 - centerDistance) * 0.1

      // Check bonus
      if (this.isInCheck(newBoard, !isWhite)) {
        score += 50
      }

      score += Math.random() * 10

      if (score > bestScore) {
        bestScore = score
        bestMove = move
      }
    }

    return bestMove
  }
}

export { AdvancedChessEngine }
export type { ChessAI, Move, GameState }
