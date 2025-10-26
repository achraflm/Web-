import { Chess, Square } from 'chess.js'
import { getStockfishInstance, StockfishMove, StockfishOptions } from './stockfish-service'

export interface GameState {
  fen: string
  isCheck: boolean
  isCheckmate: boolean
  isStalemate: boolean
  isDraw: boolean
  isGameOver: boolean
  turn: 'w' | 'b'
  castling: {
    w: string
    b: string
  }
  enPassant: string | null
  halfMoveClock: number
  fullMoveNumber: number
}

export interface MoveResult {
  success: boolean
  move?: any
  gameState: GameState
  capturedPiece?: string
  promotion?: string
  isCheck?: boolean
  isCheckmate?: boolean
  isStalemate?: boolean
  isDraw?: boolean
}

export interface AIDifficulty {
  id: string
  name: string
  depth: number
  skillLevel: number
  timeLimit: number
  description: string
}

export class EnhancedChessEngine {
  private chess: Chess
  private stockfish: any
  private gameHistory: any[] = []

  constructor() {
    this.chess = new Chess()
    this.stockfish = getStockfishInstance()
  }

  // Initialize a new game
  resetGame(): void {
    this.chess.reset()
    this.gameHistory = []
  }

  // Get current game state
  getGameState(): GameState {
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

  // Get current board as 2D array (for compatibility with existing UI)
  getBoard(): (string | null)[][] {
    const board: (string | null)[][] = []
    for (let i = 0; i < 8; i++) {
      board[i] = []
      for (let j = 0; j < 8; j++) {
        const piece = this.chess.get({ square: this.squareFromCoords(i, j) as Square })
        board[i][j] = piece ? piece.color + piece.type : null
      }
    }
    return board
  }

  // Convert coordinates to square notation
  private coordsFromSquare(square: Square): [number, number] {
    const file = square.charCodeAt(0) - 97 // a=0, b=1, etc.
    const rank = 8 - parseInt(square[1]) // 8=0, 7=1, etc.
    return [rank, file]
  }

  // Convert square notation to coordinates
  private squareFromCoords(row: number, col: number): string {
    const file = String.fromCharCode(97 + col) // 0=a, 1=b, etc.
    const rank = 8 - row // 0=8, 1=7, etc.
    return file + rank
  }

  // Make a move
  makeMove(from: [number, number], to: [number, number], promotion?: string): MoveResult {
    try {
      const fromSquare = this.squareFromCoords(from[0], from[1]) as Square
      const toSquare = this.squareFromCoords(to[0], to[1]) as Square
      
      // Get piece before move for capture detection
      const capturedPiece = this.chess.get({ square: toSquare })
      
      // Attempt the move
      const move = this.chess.move({
        from: fromSquare,
        to: toSquare,
        promotion: promotion || 'q' // Default to queen promotion
      })

      if (move) {
        this.gameHistory.push(move)
        
        return {
          success: true,
          move,
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

  // Check if a move is valid
  isValidMove(from: [number, number], to: [number, number], promotion?: string): boolean {
    try {
      const fromSquare = this.squareFromCoords(from[0], from[1]) as Square
      const toSquare = this.squareFromCoords(to[0], to[1]) as Square
      
      const moves = this.chess.moves({ square: fromSquare, verbose: true })
      return moves.some(move => 
        move.to === toSquare && 
        (!promotion || move.promotion === promotion)
      )
    } catch (error) {
      return false
    }
  }

  // Get all legal moves for a piece
  getPieceMoves(from: [number, number]): any[] {
    try {
      const fromSquare = this.squareFromCoords(from[0], from[1]) as Square
      const moves = this.chess.moves({ square: fromSquare, verbose: true })
      
      return moves.map(move => ({
        from: this.coordsFromSquare(move.from as Square),
        to: this.coordsFromSquare(move.to as Square),
        san: move.san,
        captured: move.captured,
        promotion: move.promotion
      }))
    } catch (error) {
      return []
    }
  }

  // Get all legal moves for current player
  getAllMoves(): any[] {
    const moves = this.chess.moves({ verbose: true })
    return moves.map(move => ({
      from: this.coordsFromSquare(move.from as Square),
      to: this.coordsFromSquare(move.to as Square),
      san: move.san,
      captured: move.captured,
      promotion: move.promotion
    }))
  }

  // Get AI move using Stockfish
  async getAIMove(difficulty: AIDifficulty): Promise<MoveResult | null> {
    if (!this.stockfish.isReadyToPlay()) {
      console.warn('Stockfish not ready, using fallback AI')
      return this.getFallbackAIMove()
    }

    try {
      const options: StockfishOptions = {
        depth: difficulty.depth,
        skillLevel: difficulty.skillLevel,
        timeLimit: difficulty.timeLimit
      }

      const stockfishMove = await this.stockfish.getBestMove(this.chess.fen(), options)
      
      if (stockfishMove) {
        const from = this.coordsFromSquare(stockfishMove.from as Square)
        const to = this.coordsFromSquare(stockfishMove.to as Square)
        
        return this.makeMove(from, to, stockfishMove.promotion)
      }
      
      return null
    } catch (error) {
      console.error('Error getting AI move:', error)
      return this.getFallbackAIMove()
    }
  }

  // Fallback AI when Stockfish is not available
  private getFallbackAIMove(): MoveResult | null {
    const moves = this.getAllMoves()
    if (moves.length === 0) return null

    // Simple AI: prioritize captures and center control
    const scoredMoves = moves.map(move => {
      let score = 0
      
      // Capture bonus
      if (move.captured) {
        const pieceValues: { [key: string]: number } = {
          'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 1000
        }
        score += pieceValues[move.captured] * 10
      }
      
      // Center control
      const centerDistance = Math.abs(move.to[0] - 3.5) + Math.abs(move.to[1] - 3.5)
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
      
      return { move, score }
    })

    // Sort by score and pick the best move
    scoredMoves.sort((a, b) => b.score - a.score)
    const bestMove = scoredMoves[0].move

    return this.makeMove(bestMove.from, bestMove.to, bestMove.promotion)
  }

  // Get move history
  getMoveHistory(): any[] {
    return this.gameHistory
  }

  // Get PGN representation
  getPGN(): string {
    return this.chess.pgn()
  }

  // Load game from FEN
  loadFEN(fen: string): boolean {
    try {
      this.chess.load(fen)
      return true
    } catch (error) {
      console.error('Invalid FEN:', error)
      return false
    }
  }

  // Get available AI difficulties
  static getAIDifficulties(): AIDifficulty[] {
    return [
      {
        id: 'beginner',
        name: 'Rookie Angel',
        depth: 8,
        skillLevel: 5,
        timeLimit: 1000,
        description: 'Learning the divine art of chess'
      },
      {
        id: 'intermediate',
        name: 'Guardian Spirit',
        depth: 12,
        skillLevel: 10,
        timeLimit: 1500,
        description: 'Balanced celestial strategy'
      },
      {
        id: 'advanced',
        name: 'Archangel',
        depth: 15,
        skillLevel: 15,
        timeLimit: 2000,
        description: 'Strategic heavenly wisdom'
      },
      {
        id: 'expert',
        name: 'Demon Lord',
        depth: 18,
        skillLevel: 18,
        timeLimit: 3000,
        description: 'Ruthless infernal tactics'
      },
      {
        id: 'master',
        name: 'Chess Deity',
        depth: 20,
        skillLevel: 20,
        timeLimit: 5000,
        description: 'Omniscient chess consciousness'
      }
    ]
  }

  // Cleanup
  destroy(): void {
    this.stockfish.destroy()
  }
}



