// Advanced Chess Engine with Full Rules
export class AdvancedChessEngine {
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

    this.gameState = {
      castlingRights: { whiteKing: true, whiteQueen: true, blackKing: true, blackQueen: true },
      enPassantTarget: null,
      halfMoveClock: 0,
      fullMoveNumber: 1,
    }
  }

  evaluateBoard(board, personality = "balanced") {
    let score = 0
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece) {
          const isWhite = piece === piece.toUpperCase()
          const pieceType = piece.toLowerCase()
          let pieceScore = this.pieceValues[piece]

          // Personality adjustments
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

          // Position tables
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

  getAllMoves(board, isWhite, gameState = this.gameState) {
    const moves = []
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece && ((isWhite && piece === piece.toUpperCase()) || (!isWhite && piece === piece.toLowerCase()))) {
          const pieceMoves = this.getPieceMoves(board, row, col, piece, gameState)
          moves.push(
            ...pieceMoves.map((move) => ({
              from: [row, col],
              to: move.to || move,
              piece: piece,
              capture: board[move.to ? move.to[0] : move[0]][move.to ? move.to[1] : move[1]],
              special: move.special || null,
            })),
          )
        }
      }
    }
    return moves
  }

  getPieceMoves(board, row, col, piece, gameState = this.gameState) {
    const pieceType = piece.toLowerCase()
    const isWhite = piece === piece.toUpperCase()

    switch (pieceType) {
      case "p":
        return this.getPawnMoves(board, row, col, isWhite, gameState)
      case "r":
        return this.getRookMoves(board, row, col, isWhite)
      case "n":
        return this.getKnightMoves(board, row, col, isWhite)
      case "b":
        return this.getBishopMoves(board, row, col, isWhite)
      case "q":
        return this.getQueenMoves(board, row, col, isWhite)
      case "k":
        return this.getKingMoves(board, row, col, isWhite, gameState)
      default:
        return []
    }
  }

  getPawnMoves(board, row, col, isWhite, gameState) {
    const moves = []
    const direction = isWhite ? -1 : 1
    const startRow = isWhite ? 6 : 1
    const promotionRow = isWhite ? 0 : 7

    // Forward moves
    if (row + direction >= 0 && row + direction < 8 && !board[row + direction][col]) {
      const newRow = row + direction
      if (newRow === promotionRow) {
        // Pawn promotion
        for (const promoteTo of ["q", "r", "b", "n"]) {
          moves.push({
            to: [newRow, col],
            special: { type: "promotion", promoteTo: isWhite ? promoteTo.toUpperCase() : promoteTo },
          })
        }
      } else {
        moves.push([newRow, col])
        // Double move from starting position
        if (row === startRow && !board[row + 2 * direction][col]) {
          moves.push({
            to: [row + 2 * direction, col],
            special: { type: "enPassantTarget", target: [row + direction, col] },
          })
        }
      }
    }

    // Captures
    for (const dcol of [-1, 1]) {
      const newRow = row + direction
      const newCol = col + dcol
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const target = board[newRow][newCol]
        if (target && ((isWhite && target === target.toLowerCase()) || (!isWhite && target === target.toUpperCase()))) {
          if (newRow === promotionRow) {
            // Capture with promotion
            for (const promoteTo of ["q", "r", "b", "n"]) {
              moves.push({
                to: [newRow, newCol],
                special: { type: "promotion", promoteTo: isWhite ? promoteTo.toUpperCase() : promoteTo },
              })
            }
          } else {
            moves.push([newRow, newCol])
          }
        }
        // En passant
        else if (
          gameState.enPassantTarget &&
          gameState.enPassantTarget[0] === newRow &&
          gameState.enPassantTarget[1] === newCol
        ) {
          moves.push({
            to: [newRow, newCol],
            special: { type: "enPassant", captureSquare: [row, newCol] },
          })
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

  getKingMoves(board, row, col, isWhite, gameState) {
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

    // Normal king moves
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

    // Castling
    if (!this.isInCheck(board, isWhite)) {
      if (isWhite) {
        // White kingside castling
        if (gameState.castlingRights.whiteKing && !board[7][5] && !board[7][6] && board[7][7] === "R") {
          if (!this.isSquareAttacked(board, [7, 5], false) && !this.isSquareAttacked(board, [7, 6], false)) {
            moves.push({
              to: [7, 6],
              special: { type: "castle", rookFrom: [7, 7], rookTo: [7, 5] },
            })
          }
        }
        // White queenside castling
        if (
          gameState.castlingRights.whiteQueen &&
          !board[7][1] &&
          !board[7][2] &&
          !board[7][3] &&
          board[7][0] === "R"
        ) {
          if (!this.isSquareAttacked(board, [7, 2], false) && !this.isSquareAttacked(board, [7, 3], false)) {
            moves.push({
              to: [7, 2],
              special: { type: "castle", rookFrom: [7, 0], rookTo: [7, 3] },
            })
          }
        }
      } else {
        // Black kingside castling
        if (gameState.castlingRights.blackKing && !board[0][5] && !board[0][6] && board[0][7] === "r") {
          if (!this.isSquareAttacked(board, [0, 5], true) && !this.isSquareAttacked(board, [0, 6], true)) {
            moves.push({
              to: [0, 6],
              special: { type: "castle", rookFrom: [0, 7], rookTo: [0, 5] },
            })
          }
        }
        // Black queenside castling
        if (
          gameState.castlingRights.blackQueen &&
          !board[0][1] &&
          !board[0][2] &&
          !board[0][3] &&
          board[0][0] === "r"
        ) {
          if (!this.isSquareAttacked(board, [0, 2], true) && !this.isSquareAttacked(board, [0, 3], true)) {
            moves.push({
              to: [0, 2],
              special: { type: "castle", rookFrom: [0, 0], rookTo: [0, 3] },
            })
          }
        }
      }
    }

    return moves
  }

  isSquareAttacked(board, square, byWhite) {
    const [targetRow, targetCol] = square

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece && ((byWhite && piece === piece.toUpperCase()) || (!byWhite && piece === piece.toLowerCase()))) {
          const pieceType = piece.toLowerCase()

          // For king, only check basic moves (no castling) to avoid recursion
          if (pieceType === "k") {
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
              if (newRow === targetRow && newCol === targetCol) {
                return true
              }
            }
          } else {
            // For other pieces, use normal move generation
            const moves = this.getPieceMovesBasic(board, row, col, piece)
            if (
              moves.some((move) => {
                const moveSquare = move.to || move
                return moveSquare[0] === targetRow && moveSquare[1] === targetCol
              })
            ) {
              return true
            }
          }
        }
      }
    }
    return false
  }

  getPieceMovesBasic(board, row, col, piece) {
    const pieceType = piece.toLowerCase()
    const isWhite = piece === piece.toUpperCase()

    switch (pieceType) {
      case "p":
        return this.getPawnMovesBasic(board, row, col, isWhite)
      case "r":
        return this.getRookMoves(board, row, col, isWhite)
      case "n":
        return this.getKnightMoves(board, row, col, isWhite)
      case "b":
        return this.getBishopMoves(board, row, col, isWhite)
      case "q":
        return this.getQueenMoves(board, row, col, isWhite)
      case "k":
        return this.getKingMovesBasic(board, row, col, isWhite)
      default:
        return []
    }
  }

  getPawnMovesBasic(board, row, col, isWhite) {
    const moves = []
    const direction = isWhite ? -1 : 1
    const startRow = isWhite ? 6 : 1

    // Forward moves
    if (row + direction >= 0 && row + direction < 8 && !board[row + direction][col]) {
      moves.push([row + direction, col])
      // Double move from starting position
      if (row === startRow && !board[row + 2 * direction][col]) {
        moves.push([row + 2 * direction, col])
      }
    }

    // Captures (no en passant)
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

  getKingMovesBasic(board, row, col, isWhite) {
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

    // Only basic king moves, no castling
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
    return this.isSquareAttacked(board, kingPos, !isWhite)
  }

  isValidMove(board, from, to, isWhite, gameState = this.gameState) {
    const [fromRow, fromCol] = from
    const [toRow, toCol] = to
    const piece = board[fromRow][fromCol]

    if (!piece) return false
    if ((isWhite && piece !== piece.toUpperCase()) || (!isWhite && piece !== piece.toLowerCase())) return false

    const validMoves = this.getPieceMoves(board, fromRow, fromCol, piece, gameState)
    const moveExists = validMoves.some((move) => {
      const moveSquare = move.to || move
      return moveSquare[0] === toRow && moveSquare[1] === toCol
    })

    if (!moveExists) return false

    const testBoard = this.makeMove(board, from, to, gameState).board
    return !this.isInCheck(testBoard, isWhite)
  }

  getBestMove(board, depth = 4, personality = "balanced", gameState = this.gameState) {
    const moves = this.getAllMoves(board, false, gameState)
    if (moves.length === 0) return null

    let bestMove = null
    let bestScore = Number.POSITIVE_INFINITY

    // Move ordering for better performance
    if (personality === "aggressive") {
      moves.sort((a, b) => {
        const aValue = a.capture ? this.pieceValues[a.capture] : 0
        const bValue = b.capture ? this.pieceValues[b.capture] : 0
        return bValue - aValue
      })
    } else if (personality === "positional") {
      moves.sort((a, b) => {
        const aCenter = Math.abs(a.to[0] - 3.5) + Math.abs(a.to[1] - 3.5)
        const bCenter = Math.abs(b.to[0] - 3.5) + Math.abs(b.to[1] - 3.5)
        return aCenter - bCenter
      })
    }

    const searchLimit = personality === "hikaru" ? 25 : 20
    for (const move of moves.slice(0, searchLimit)) {
      const result = this.makeMove(board, move.from, move.to, gameState)
      if (!this.isInCheck(result.board, false)) {
        const score = this.minimax(
          result.board,
          depth - 1,
          true,
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
          personality,
          result.gameState,
        )
        if (score < bestScore) {
          bestScore = score
          bestMove = move
        }
      }
    }

    return bestMove
  }

  minimax(board, depth, isMaximizing, alpha, beta, personality, gameState) {
    if (depth === 0) {
      return this.evaluateBoard(board, personality)
    }

    const moves = this.getAllMoves(board, isMaximizing, gameState)

    if (moves.length === 0) {
      if (this.isInCheck(board, isMaximizing)) {
        return isMaximizing ? -10000 + (4 - depth) : 10000 - (4 - depth)
      }
      return 0 // Stalemate
    }

    if (isMaximizing) {
      let maxEval = Number.NEGATIVE_INFINITY
      for (const move of moves.slice(0, 15)) {
        const result = this.makeMove(board, move.from, move.to, gameState)
        const score = this.minimax(result.board, depth - 1, false, alpha, beta, personality, result.gameState)
        maxEval = Math.max(maxEval, score)
        alpha = Math.max(alpha, score)
        if (beta <= alpha) break
      }
      return maxEval
    } else {
      let minEval = Number.POSITIVE_INFINITY
      for (const move of moves.slice(0, 15)) {
        const result = this.makeMove(board, move.from, move.to, gameState)
        const score = this.minimax(result.board, depth - 1, true, alpha, beta, personality, result.gameState)
        minEval = Math.min(minEval, score)
        beta = Math.min(beta, score)
        if (beta <= alpha) break
      }
      return minEval
    }
  }

  makeMove(board, from, to, gameState = this.gameState) {
    const newBoard = board.map((row) => [...row])
    const newGameState = { ...gameState }
    const [fromRow, fromCol] = from
    const [toRow, toCol] = to
    const piece = newBoard[fromRow][fromCol]
    const capturedPiece = newBoard[toRow][toCol]

    // Find the move details for special moves
    const moves = this.getPieceMoves(board, fromRow, fromCol, piece, gameState)
    const moveDetail = moves.find((move) => {
      const moveSquare = move.to || move
      return moveSquare[0] === toRow && moveSquare[1] === toCol
    })

    // Handle special moves
    if (moveDetail && moveDetail.special) {
      const special = moveDetail.special

      if (special.type === "castle") {
        // Move rook for castling
        const [rookFromRow, rookFromCol] = special.rookFrom
        const [rookToRow, rookToCol] = special.rookTo
        newBoard[rookToRow][rookToCol] = newBoard[rookFromRow][rookFromCol]
        newBoard[rookFromRow][rookFromCol] = null

        // Update castling rights
        if (piece === "K") {
          newGameState.castlingRights.whiteKing = false
          newGameState.castlingRights.whiteQueen = false
        } else {
          newGameState.castlingRights.blackKing = false
          newGameState.castlingRights.blackQueen = false
        }
      } else if (special.type === "enPassant") {
        // Remove captured pawn
        const [captureRow, captureCol] = special.captureSquare
        newBoard[captureRow][captureCol] = null
      } else if (special.type === "promotion") {
        // Promote pawn
        newBoard[toRow][toCol] = special.promoteTo
        newBoard[fromRow][fromCol] = null
        newGameState.enPassantTarget = null
        return { board: newBoard, gameState: newGameState }
      } else if (special.type === "enPassantTarget") {
        newGameState.enPassantTarget = special.target
      }
    } else {
      newGameState.enPassantTarget = null
    }

    // Make the move
    newBoard[toRow][toCol] = piece
    newBoard[fromRow][fromCol] = null

    // Update castling rights
    if (piece === "K") {
      newGameState.castlingRights.whiteKing = false
      newGameState.castlingRights.whiteQueen = false
    } else if (piece === "k") {
      newGameState.castlingRights.blackKing = false
      newGameState.castlingRights.blackQueen = false
    } else if (piece === "R") {
      if (fromRow === 7 && fromCol === 0) newGameState.castlingRights.whiteQueen = false
      if (fromRow === 7 && fromCol === 7) newGameState.castlingRights.whiteKing = false
    } else if (piece === "r") {
      if (fromRow === 0 && fromCol === 0) newGameState.castlingRights.blackQueen = false
      if (fromRow === 0 && fromCol === 7) newGameState.castlingRights.blackKing = false
    }

    return { board: newBoard, gameState: newGameState }
  }
}
