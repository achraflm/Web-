import { Chess } from 'chess.js'

export interface StockfishMove {
  from: string
  to: string
  promotion?: string
  san: string
  fen: string
}

export interface StockfishOptions {
  depth?: number
  skillLevel?: number
  timeLimit?: number
}

export class StockfishService {
  private stockfish: any = null
  private isReady = false
  private isThinking = false

  constructor() {
    this.initializeStockfish()
  }

  private async initializeStockfish() {
    try {
      // Import Stockfish dynamically to avoid SSR issues
      const stockfishModule = await import('stockfish')
      const Stockfish = stockfishModule.default || stockfishModule
      this.stockfish = new Stockfish()
      
      this.stockfish.onmessage = (event: any) => {
        // Handle Stockfish responses
        console.log('Stockfish:', event.data || event)
      }

      // Wait for Stockfish to be ready
      this.stockfish.postMessage('uci')
      
      // Set up ready detection
      const checkReady = () => {
        if (this.stockfish && !this.isReady) {
          this.stockfish.postMessage('isready')
          setTimeout(checkReady, 100)
        }
      }
      checkReady()

      // Listen for ready confirmation
      this.stockfish.onmessage = (event: any) => {
        const message = event.data || event
        if (message === 'readyok') {
          this.isReady = true
          console.log('Stockfish is ready!')
        }
      }

    } catch (error) {
      console.error('Failed to initialize Stockfish:', error)
      // Fallback to basic AI if Stockfish fails
      this.isReady = true
    }
  }

  async getBestMove(fen: string, options: StockfishOptions = {}): Promise<StockfishMove | null> {
    if (!this.isReady || this.isThinking) {
      return null
    }

    return new Promise((resolve) => {
      this.isThinking = true
      
      try {
        // Set up the position
        this.stockfish.postMessage(`position fen ${fen}`)
        
        // Configure search parameters
        const depth = options.depth || 15
        const skillLevel = options.skillLevel || 20
        const timeLimit = options.timeLimit || 2000

        // Set skill level (0-20, where 20 is strongest)
        this.stockfish.postMessage(`setoption name Skill Level value ${skillLevel}`)
        
        // Start the search
        this.stockfish.postMessage(`go depth ${depth} movetime ${timeLimit}`)

        // Handle the response
        const originalOnMessage = this.stockfish.onmessage
        this.stockfish.onmessage = (event: any) => {
          const message = event.data || event
          
          if (message.startsWith('bestmove')) {
            const parts = message.split(' ')
            if (parts.length >= 2) {
              const move = parts[1]
              const promotion = parts[3] // If there's a promotion piece
              
              // Convert UCI move to chess.js format
              const from = move.substring(0, 2)
              const to = move.substring(2, 4)
              
              // Create a temporary chess instance to get SAN notation
              const chess = new Chess(fen)
              try {
                const moveObj = chess.move({ from, to, promotion })
                if (moveObj) {
                  resolve({
                    from,
                    to,
                    promotion,
                    san: moveObj.san,
                    fen: chess.fen()
                  })
                } else {
                  resolve(null)
                }
              } catch (error) {
                console.error('Error converting move:', error)
                resolve(null)
              }
            } else {
              resolve(null)
            }
            
            this.isThinking = false
            this.stockfish.onmessage = originalOnMessage
          }
        }

        // Timeout fallback
        setTimeout(() => {
          if (this.isThinking) {
            this.isThinking = false
            this.stockfish.onmessage = originalOnMessage
            resolve(null)
          }
        }, timeLimit + 1000)

      } catch (error) {
        console.error('Error getting best move:', error)
        this.isThinking = false
        resolve(null)
      }
    })
  }

  async getMultipleLines(fen: string, options: StockfishOptions = {}): Promise<StockfishMove[]> {
    if (!this.isReady || this.isThinking) {
      return []
    }

    return new Promise((resolve) => {
      this.isThinking = true
      const moves: StockfishMove[] = []
      
      try {
        this.stockfish.postMessage(`position fen ${fen}`)
        this.stockfish.postMessage(`go depth ${options.depth || 15} multipv 3`)

        const originalOnMessage = this.stockfish.onmessage
        this.stockfish.onmessage = (event: any) => {
          const message = event.data || event
          
          if (message.startsWith('bestmove')) {
            this.isThinking = false
            this.stockfish.onmessage = originalOnMessage
            resolve(moves)
          } else if (message.startsWith('info') && message.includes('pv')) {
            // Parse principal variation
            const parts = message.split(' ')
            const pvIndex = parts.indexOf('pv')
            if (pvIndex !== -1 && pvIndex + 1 < parts.length) {
              const moveString = parts[pvIndex + 1]
              const from = moveString.substring(0, 2)
              const to = moveString.substring(2, 4)
              
              const chess = new Chess(fen)
              try {
                const moveObj = chess.move({ from, to })
                if (moveObj) {
                  moves.push({
                    from,
                    to,
                    san: moveObj.san,
                    fen: chess.fen()
                  })
                }
              } catch (error) {
                console.error('Error parsing move:', error)
              }
            }
          }
        }

        setTimeout(() => {
          if (this.isThinking) {
            this.isThinking = false
            this.stockfish.onmessage = originalOnMessage
            resolve(moves)
          }
        }, 5000)

      } catch (error) {
        console.error('Error getting multiple lines:', error)
        this.isThinking = false
        resolve([])
      }
    })
  }

  isReadyToPlay(): boolean {
    return this.isReady && !this.isThinking
  }

  destroy() {
    if (this.stockfish) {
      this.stockfish.terminate()
      this.stockfish = null
    }
    this.isReady = false
    this.isThinking = false
  }
}

// Singleton instance
let stockfishInstance: StockfishService | null = null

export const getStockfishInstance = (): StockfishService => {
  if (!stockfishInstance) {
    stockfishInstance = new StockfishService()
  }
  return stockfishInstance
}
