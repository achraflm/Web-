// Advanced Chess Engine with Stockfish Integration
import { Chess } from "chess.js"

// Stockfish integration (will be loaded dynamically)
let stockfishEngine: any = null

// Initialize Stockfish engine
const initializeStockfish = async () => {
  if (typeof window !== "undefined" && !stockfishEngine) {
    try {
      // Load Stockfish from CDN
      const Stockfish = await import("stockfish")
      stockfishEngine = Stockfish.default()

      stockfishEngine.onmessage = (message: string) => {
        console.log("Stockfish:", message)
      }

      stockfishEngine.postMessage("uci")
      stockfishEngine.postMessage("isready")
    } catch (error) {
      console.warn("Stockfish not available, using fallback AI")
    }
  }
}

// Chess piece values for evaluation
const PIECE_VALUES = {
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
const PAWN_TABLE = [
  0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30, 20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0,
  0, 0, 20, 20, 0, 0, 0, 5, -5, -10, 0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0,
]

const KNIGHT_TABLE = [
  -50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30, 0, 10, 15, 15, 10, 0, -30, -30, 5, 15,
  20, 20, 15, 5, -30, -30, 0, 15, 20, 20, 15, 0, -20, -40, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20, -40,
  -50, -40, -30, -30, -30, -30, -40, -50,
]

const BISHOP_TABLE = [
  -20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 10, 10, 5, 0, -10, -10, 5, 5, 10, 10,
  5, 5, -10, -10, 0, 10, 10, 10, 10, 0, -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10, -20, -10,
  -10, -10, -10, -10, -10, -20,
]

const ROOK_TABLE = [
  0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0,
  0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0,
]

const QUEEN_TABLE = [
  -20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0,
  -5, 0, 0, 5, 5, 5, 5, 0, -5, -10, 5, 5, 5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5, -10, -10,
  -20,
]

const KING_TABLE = [
  -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40,
  -30, -30, -40, -40, -50, -50, -40, -40, -30, -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20, -20, -20,
  -20, -10, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0, 0, 10, 30, 20,
]

interface GameState {
  castlingRights: {
    whiteKingSide: boolean
    whiteQueenSide: boolean
    blackKingSide: boolean
    blackQueenSide: boolean
  }
  enPassantTarget: [number, number] | null
  halfMoveClock: number
  fullMoveNumber: number
  lastMove: { from: [number, number]; to: [number, number] } | null
}

interface Move {
  from: string | [number, number]
  to: string | [number, number]
  promotion?: string
}

interface ChessAI {
  name: string
  description: string
  difficulty: number
  makeMove(game: Chess): Promise<Move | null>
}

class AdvancedChessEngine {
  private game: Chess
  private transpositionTable: Map<string, any>
  public gameState: GameState

  constructor() {
    this.game = new Chess()
    this.transpositionTable = new Map()
    this.gameState = this.getInitialGameState()
    initializeStockfish()
  }

  private getInitialGameState(): GameState {
    return {
      castlingRights: {
        whiteKingSide: true,
        whiteQueenSide: true,
        blackKingSide: true,
        blackQueenSide: true,
      },
      enPassantTarget: null,
      halfMoveClock: 0,
      fullMoveNumber: 1,
      lastMove: null,
    }
  }

  private coordToSquare(coord: [number, number]): string {
    const [row, col] = coord
    return String.fromCharCode(97 + col) + (8 - row).toString()
  }

  private squareToCoord(square: string): [number, number] {
    const col = square.charCodeAt(0) - 97
    const row = 8 - Number.parseInt(square[1])
    return [row, col]
  }

  private boardToFen(board: (string | null)[][]): string {
    let fen = ""
    for (let row = 0; row < 8; row++) {
      let emptyCount = 0
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece === null) {
          emptyCount++
        } else {
          if (emptyCount > 0) {
            fen += emptyCount.toString()
            emptyCount = 0
          }
          fen += piece
        }
      }
      if (emptyCount > 0) {
        fen += emptyCount.toString()
      }
      if (row < 7) fen += "/"
    }

    // Add game state info
    const turn = this.game.turn()
    const castling = this.getCastlingString()
    const enPassant = this.gameState.enPassantTarget ? this.coordToSquare(this.gameState.enPassantTarget) : "-"

    return `${fen} ${turn} ${castling} ${enPassant} ${this.gameState.halfMoveClock} ${this.gameState.fullMoveNumber}`
  }

  private getCastlingString(): string {
    let castling = ""
    if (this.gameState.castlingRights.whiteKingSide) castling += "K"
    if (this.gameState.castlingRights.whiteQueenSide) castling += "Q"
    if (this.gameState.castlingRights.blackKingSide) castling += "k"
    if (this.gameState.castlingRights.blackQueenSide) castling += "q"
    return castling || "-"
  }

  // Get current game state
  getGame(): Chess {
    return this.game
  }

  // Reset the game
  reset(): void {
    this.game.reset()
    this.transpositionTable.clear()
    this.gameState = this.getInitialGameState()
  }

  // Make a move
  makeMove(move: string | Move): boolean {
    try {
      const result = this.game.move(move)
      return result !== null
    } catch {
      return false
    }
  }

  // Get legal moves
  getLegalMoves(): string[] {
    return this.game.moves()
  }

  // Check if game is over
  isGameOver(): boolean {
    return this.game.isGameOver()
  }

  // Get game status
  getGameStatus(): string {
    if (this.game.isCheckmate()) {
      return this.game.turn() === "w" ? "Black wins by checkmate" : "White wins by checkmate"
    }
    if (this.game.isStalemate()) return "Draw by stalemate"
    if (this.game.isThreefoldRepetition()) return "Draw by repetition"
    if (this.game.isInsufficientMaterial()) return "Draw by insufficient material"
    if (this.game.isDraw()) return "Draw"
    if (this.game.isCheck()) return "Check"
    return "Game in progress"
  }

  // Evaluate position
  private evaluatePosition(): number {
    if (this.game.isCheckmate()) {
      return this.game.turn() === "w" ? -9999 : 9999
    }
    if (this.game.isDraw()) return 0

    let score = 0
    const board = this.game.board()

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j]
        if (piece) {
          const isWhite = piece.color === "w"
          const pieceValue = PIECE_VALUES[piece.type.toUpperCase() as keyof typeof PIECE_VALUES]
          let positionValue = 0

          // Get position value from tables
          const squareIndex = i * 8 + j
          const flippedIndex = isWhite ? squareIndex : 63 - squareIndex

          switch (piece.type) {
            case "p":
              positionValue = PAWN_TABLE[flippedIndex]
              break
            case "n":
              positionValue = KNIGHT_TABLE[flippedIndex]
              break
            case "b":
              positionValue = BISHOP_TABLE[flippedIndex]
              break
            case "r":
              positionValue = ROOK_TABLE[flippedIndex]
              break
            case "q":
              positionValue = QUEEN_TABLE[flippedIndex]
              break
            case "k":
              positionValue = KING_TABLE[flippedIndex]
              break
          }

          const totalValue = pieceValue + positionValue
          score += isWhite ? totalValue : -totalValue
        }
      }
    }

    return this.game.turn() === "w" ? score : -score
  }

  // Minimax with alpha-beta pruning
  private minimax(depth: number, alpha: number, beta: number, maximizing: boolean): number {
    const key = this.game.fen() + depth + maximizing
    if (this.transpositionTable.has(key)) {
      return this.transpositionTable.get(key)
    }

    if (depth === 0 || this.game.isGameOver()) {
      const evaluation = this.evaluatePosition()
      this.transpositionTable.set(key, evaluation)
      return evaluation
    }

    const moves = this.game.moves()

    if (maximizing) {
      let maxEval = Number.NEGATIVE_INFINITY
      for (const move of moves) {
        this.game.move(move)
        // renamed 'eval' to 'evalScore' to avoid reserved keyword
        const evalScore = this.minimax(depth - 1, alpha, beta, false)
        this.game.undo()
        maxEval = Math.max(maxEval, evalScore)
        alpha = Math.max(alpha, evalScore)
        if (beta <= alpha) break
      }
      this.transpositionTable.set(key, maxEval)
      return maxEval
    } else {
      let minEval = Number.POSITIVE_INFINITY
      for (const move of moves) {
        this.game.move(move)
        // renamed 'eval' to 'evalScore' to avoid reserved keyword
        const evalScore = this.minimax(depth - 1, alpha, beta, true)
        this.game.undo()
        minEval = Math.min(minEval, evalScore)
        beta = Math.min(beta, evalScore)
        if (beta <= alpha) break
      }
      this.transpositionTable.set(key, minEval)
      return minEval
    }
  }

  // Get best move using minimax
  private getBestMoveMinimal(depth = 3): Move | null {
    const moves = this.game.moves({ verbose: true })
    if (moves.length === 0) return null

    let bestMove = moves[0]
    let bestValue = Number.NEGATIVE_INFINITY

    for (const move of moves) {
      this.game.move(move)
      const value = this.minimax(depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false)
      this.game.undo()

      if (value > bestValue) {
        bestValue = value
        bestMove = move
      }
    }

    return {
      from: bestMove.from,
      to: bestMove.to,
      promotion: bestMove.promotion,
    }
  }

  // Stockfish integration
  private async getBestMoveStockfish(depth = 15): Promise<Move | null> {
    if (!stockfishEngine) {
      return this.getBestMoveMinimal(Math.min(depth, 4))
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Stockfish timeout"))
      }, 30000)

      stockfishEngine.onmessage = (message: string) => {
        if (typeof message === "string" && message.startsWith("bestmove")) {
          clearTimeout(timeout)
          const moveStr = message.split(" ")[1]
          if (moveStr && moveStr !== "(none)") {
            const move = this.parseUCIMove(moveStr)
            resolve(move)
          } else {
            resolve(null)
          }
        }
      }

      stockfishEngine.postMessage(`position fen ${this.game.fen()}`)
      stockfishEngine.postMessage(`go depth ${depth}`)
    }).catch(() => {
      // Fallback to minimax if Stockfish fails
      return this.getBestMoveMinimal(Math.min(depth, 4))
    })
  }

  // Parse UCI move format
  private parseUCIMove(uciMove: string): Move | null {
    if (!uciMove || uciMove.length < 4) return null

    const from = uciMove.substring(0, 2)
    const to = uciMove.substring(2, 4)
    const promotion = uciMove.length > 4 ? uciMove[4] : undefined

    return { from, to, promotion }
  }

  isInCheck(board: (string | null)[][], isWhite: boolean): boolean {
    try {
      const fen = this.boardToFen(board)
      const tempGame = new Chess(fen)
      return tempGame.isCheck()
    } catch {
      return false
    }
  }

  makeMove(
    board: (string | null)[][],
    from: [number, number],
    to: [number, number],
    gameState: GameState,
    promotionPiece?: string,
  ): {
    success: boolean
    newBoard: (string | null)[][]
    capturedPiece: string | null
    gameState: GameState
  } {
    try {
      const fromSquare = this.coordToSquare(from)
      const toSquare = this.coordToSquare(to)

      const fen = this.boardToFen(board)
      const tempGame = new Chess(fen)

      const moveObj: any = { from: fromSquare, to: toSquare }
      if (promotionPiece) {
        moveObj.promotion = promotionPiece.toLowerCase()
      }

      const result = tempGame.move(moveObj)
      if (!result) {
        return { success: false, newBoard: board, capturedPiece: null, gameState }
      }

      // Convert back to board array
      const newBoard = this.fenToBoard(tempGame.fen())

      // Update game state
      const newGameState = { ...gameState }
      newGameState.lastMove = { from, to }
      newGameState.fullMoveNumber = tempGame.moveNumber()

      return {
        success: true,
        newBoard,
        capturedPiece: result.captured || null,
        gameState: newGameState,
      }
    } catch {
      return { success: false, newBoard: board, capturedPiece: null, gameState }
    }
  }

  private fenToBoard(fen: string): (string | null)[][] {
    const board: (string | null)[][] = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))
    const boardPart = fen.split(" ")[0]
    const rows = boardPart.split("/")

    for (let row = 0; row < 8; row++) {
      let col = 0
      for (const char of rows[row]) {
        if (char >= "1" && char <= "8") {
          col += Number.parseInt(char)
        } else {
          board[row][col] = char
          col++
        }
      }
    }

    return board
  }

  getAllMoves(board: (string | null)[][], isWhite: boolean, gameState: GameState): Move[] {
    try {
      const fen = this.boardToFen(board)
      const tempGame = new Chess(fen)
      const moves = tempGame.moves({ verbose: true })

      return moves.map((move) => ({
        from: this.squareToCoord(move.from),
        to: this.squareToCoord(move.to),
        promotion: move.promotion,
      }))
    } catch {
      return []
    }
  }

  isValidMove(
    board: (string | null)[][],
    from: [number, number],
    to: [number, number],
    isWhite: boolean,
    gameState: GameState,
  ): boolean {
    try {
      const fromSquare = this.coordToSquare(from)
      const toSquare = this.coordToSquare(to)

      const fen = this.boardToFen(board)
      const tempGame = new Chess(fen)

      const moves = tempGame.moves({ verbose: true })
      return moves.some((move) => move.from === fromSquare && move.to === toSquare)
    } catch {
      return false
    }
  }

  getPieceMoves(
    board: (string | null)[][],
    row: number,
    col: number,
    piece: string,
    gameState: GameState,
  ): [number, number][] {
    try {
      const fromSquare = this.coordToSquare([row, col])
      const fen = this.boardToFen(board)
      const tempGame = new Chess(fen)

      const moves = tempGame.moves({ verbose: true, square: fromSquare })
      return moves.map((move) => this.squareToCoord(move.to))
    } catch {
      return []
    }
  }

  async getBestMove(
    board: (string | null)[][],
    depth: number,
    personality: string,
    gameState: GameState,
  ): Promise<{ from: [number, number]; to: [number, number]; promotion?: string } | null> {
    try {
      const fen = this.boardToFen(board)
      this.game = new Chess(fen)

      let move: Move | null = null

      if (personality === "stockfish" || depth >= 5) {
        move = await this.getBestMoveStockfish(depth)
      } else {
        move = this.getBestMoveMinimal(depth)
      }

      if (!move) return null

      // Convert to coordinate format
      const fromCoord = typeof move.from === "string" ? this.squareToCoord(move.from) : move.from
      const toCoord = typeof move.to === "string" ? this.squareToCoord(move.to) : move.to

      return {
        from: fromCoord,
        to: toCoord,
        promotion: move.promotion,
      }
    } catch {
      return null
    }
  }

  // AI opponents
  getAIOpponents(): ChessAI[] {
    return [
      {
        name: "Stockfish Grandmaster",
        description: "World's strongest chess engine - Grandmaster level",
        difficulty: 5,
        makeMove: async (game: Chess): Promise<Move | null> => {
          this.game = game
          return await this.getBestMoveStockfish(15)
        },
      },
      {
        name: "Advanced AI",
        description: "Strong tactical player with deep calculation",
        difficulty: 4,
        makeMove: async (game: Chess): Promise<Move | null> => {
          this.game = game
          return this.getBestMoveMinimal(5)
        },
      },
      {
        name: "Intermediate AI",
        description: "Solid positional player",
        difficulty: 3,
        makeMove: async (game: Chess): Promise<Move | null> => {
          this.game = game
          return this.getBestMoveMinimal(3)
        },
      },
      {
        name: "Beginner AI",
        description: "Learning the basics",
        difficulty: 2,
        makeMove: async (game: Chess): Promise<Move | null> => {
          this.game = game
          const moves = game.moves({ verbose: true })
          if (moves.length === 0) return null

          // Add some randomness for beginner level
          const randomMove = moves[Math.floor(Math.random() * moves.length)]
          return {
            from: randomMove.from,
            to: randomMove.to,
            promotion: randomMove.promotion,
          }
        },
      },
    ]
  }
}

export { AdvancedChessEngine }
export type { ChessAI, Move, GameState }
