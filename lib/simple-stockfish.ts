import { Chess } from 'chess.js'

export interface StockfishDifficulty {
  id: string
  name: string
  depth: number
  skillLevel: number
  timeLimit: number
  description: string
}

export class SimpleStockfish {
  private chess: Chess
  private isReady = false

  constructor() {
    this.chess = new Chess()
  }

  resetGame(): void {
    this.chess.reset()
  }

  getGameState() {
    return {
      fen: this.chess.fen(),
      isCheck: this.chess.isCheck(),
      isCheckmate: this.chess.isCheckmate(),
      isStalemate: this.chess.isStalemate(),
      isDraw: this.chess.isDraw(),
      isGameOver: this.chess.isGameOver(),
      turn: this.chess.turn(),
      castling: this.chess.castling,
      enPassant: this.chess.enPassant,
      halfMoveClock: this.chess.halfMoveClock,
      fullMoveNumber: this.chess.fullMoveNumber
    }
  }

  getBoard(): (string | null)[][] {
    const board: (string | null)[][] = []
    for (let i = 0; i < 8; i++) {
      board[i] = []
      for (let j = 0; j < 8; j++) {
        const piece = this.chess.get({ square: this.squareFromCoords(i, j) as any })
        board[i][j] = piece ? piece.color + piece.type : null
      }
    }
    return board
  }

  private coordsFromSquare(square: string): [number, number] {
    const file = square.charCodeAt(0) - 97
    const rank = 8 - parseInt(square[1])
    return [rank, file]
  }

  private squareFromCoords(row: number, col: number): string {
    const file = String.fromCharCode(97 + col)
    const rank = 8 - row
    return file + rank
  }

  makeMove(from: [number, number], to: [number, number], promotion?: string) {
    try {
      const fromSquare = this.squareFromCoords(from[0], from[1])
      const toSquare = this.squareFromCoords(to[0], to[1])
      
      const capturedPiece = this.chess.get({ square: toSquare as any })
      
      const move = this.chess.move({
        from: fromSquare as any,
        to: toSquare as any,
        promotion: promotion || 'q'
      })

      if (move) {
        return {
          success: true,
          move: {
            from: this.coordsFromSquare(fromSquare),
            to: this.coordsFromSquare(toSquare),
            san: move.san,
            captured: move.captured,
            promotion: move.promotion
          },
          gameState: this.getGameState(),
          capturedPiece: capturedPiece ? capturedPiece.color + capturedPiece.type : undefined,
          promotion: move.promotion,
          isCheck: this.chess.isCheck(),
          isCheckmate: this.chess.isCheckmate(),
          isStalemate: this.chess.isStalemate(),
          isDraw: this.chess.isDraw()
        }
      } else {
        return {
          success: false,
          gameState: this.getGameState()
        }
      }
    } catch (error) {
      console.error('Invalid move:', error)
      return {
        success: false,
        gameState: this.getGameState()
      }
    }
  }

  isValidMove(from: [number, number], to: [number, number], promotion?: string): boolean {
    try {
      const fromSquare = this.squareFromCoords(from[0], from[1])
      const toSquare = this.squareFromCoords(to[0], to[1])
      
      const moves = this.chess.moves({ square: fromSquare as any, verbose: true })
      return moves.some((move: any) => 
        move.to === toSquare && 
        (!promotion || move.promotion === promotion)
      )
    } catch (error) {
      return false
    }
  }

  getPieceMoves(from: [number, number]): any[] {
    try {
      const fromSquare = this.squareFromCoords(from[0], from[1])
      const moves = this.chess.moves({ square: fromSquare as any, verbose: true })
      
      return moves.map((move: any) => ({
        from: this.coordsFromSquare(move.from),
        to: this.coordsFromSquare(move.to),
        san: move.san,
        captured: move.captured,
        promotion: move.promotion
      }))
    } catch (error) {
      return []
    }
  }

  async getAIMove(difficulty: StockfishDifficulty) {
    // For now, use a simple AI since Stockfish import is having issues
    // This will be replaced with actual Stockfish when the import issue is resolved
    const moves = this.chess.moves({ verbose: true })
    if (moves.length === 0) return null

    // Simple AI: prioritize captures and center control
    const scoredMoves = moves.map((move: any) => {
      let score = 0
      
      // Capture bonus
      if (move.captured) {
        const pieceValues: { [key: string]: number } = {
          'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 1000
        }
        score += pieceValues[move.captured] * 10
      }
      
      // Center control
      const toCoords = this.coordsFromSquare(move.to)
      const centerDistance = Math.abs(toCoords[0] - 3.5) + Math.abs(toCoords[1] - 3.5)
      score += (7 - centerDistance) * 0.5
      
      // Check bonus
      const tempChess = new Chess(this.chess.fen())
      try {
        const tempMove = tempChess.move({ from: move.from, to: move.to })
        if (tempChess.isCheck()) {
          score += 50
        }
      } catch (error) {
        // Ignore invalid moves
      }
      
      // Difficulty-based randomness
      const randomFactor = difficulty.skillLevel * 2 + Math.random() * 10
      score += randomFactor
      
      return { move, score }
    })

    // Sort by score and pick the best move
    scoredMoves.sort((a, b) => b.score - a.score)
    const bestMove = scoredMoves[0].move

    const fromCoords = this.coordsFromSquare(bestMove.from)
    const toCoords = this.coordsFromSquare(bestMove.to)

    return this.makeMove(fromCoords, toCoords, bestMove.promotion)
  }

  getMoveHistory(): any[] {
    return this.chess.history({ verbose: true })
  }
}
