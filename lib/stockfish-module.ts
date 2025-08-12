interface StockfishEngine {
  postMessage: (message: string) => void
  onmessage: ((event: { data: string }) => void) | null
  terminate: () => void
}

declare global {
  interface Window {
    Stockfish: () => StockfishEngine
  }
}

export class StockfishModule {
  private engine: StockfishEngine | null = null
  private isReady = false
  private callbacks: Map<string, (result: any) => void> = new Map()

  async initialize(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Load Stockfish from CDN
      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/npm/stockfish@16.0.0/src/stockfish.js"

      script.onload = () => {
        if (window.Stockfish) {
          this.engine = window.Stockfish()

          this.engine.onmessage = (event) => {
            const message = event.data
            this.handleMessage(message)
          }

          this.engine.postMessage("uci")
          this.engine.postMessage("isready")

          // Wait for engine to be ready
          const checkReady = () => {
            if (this.isReady) {
              resolve(true)
            } else {
              setTimeout(checkReady, 100)
            }
          }
          checkReady()
        } else {
          reject(new Error("Stockfish not available"))
        }
      }

      script.onerror = () => {
        reject(new Error("Failed to load Stockfish"))
      }

      document.head.appendChild(script)
    })
  }

  private handleMessage(message: string) {
    if (message.includes("uciok")) {
      this.isReady = true
    } else if (message.startsWith("bestmove")) {
      const callback = this.callbacks.get("bestmove")
      if (callback) {
        const move = message.split(" ")[1]
        callback(move)
        this.callbacks.delete("bestmove")
      }
    }
  }

  async getBestMove(fen: string, depth = 20): Promise<string> {
    if (!this.engine || !this.isReady) {
      throw new Error("Engine not ready")
    }

    return new Promise((resolve) => {
      this.callbacks.set("bestmove", resolve)

      this.engine!.postMessage("ucinewgame")
      this.engine!.postMessage(`position fen ${fen}`)
      this.engine!.postMessage(`go depth ${depth}`)
    })
  }

  async evaluatePosition(fen: string, depth = 15): Promise<{ move: string; evaluation: number }> {
    if (!this.engine || !this.isReady) {
      throw new Error("Engine not ready")
    }

    return new Promise((resolve) => {
      let bestMove = ""
      let evaluation = 0

      const originalHandler = this.engine!.onmessage

      this.engine!.onmessage = (event) => {
        const message = event.data

        if (message.startsWith("bestmove")) {
          bestMove = message.split(" ")[1]
        } else if (message.includes("score cp")) {
          const scoreMatch = message.match(/score cp (-?\d+)/)
          if (scoreMatch) {
            evaluation = Number.parseInt(scoreMatch[1]) / 100
          }
        }

        if (bestMove && message.startsWith("bestmove")) {
          this.engine!.onmessage = originalHandler
          resolve({ move: bestMove, evaluation })
        }
      }

      this.engine.postMessage("ucinewgame")
      this.engine.postMessage(`position fen ${fen}`)
      this.engine.postMessage(`go depth ${depth}`)
    })
  }

  terminate() {
    if (this.engine) {
      this.engine.terminate()
      this.engine = null
      this.isReady = false
    }
  }
}

// Singleton instance
let stockfishInstance: StockfishModule | null = null

export async function getStockfishEngine(): Promise<StockfishModule> {
  if (!stockfishInstance) {
    stockfishInstance = new StockfishModule()
    await stockfishInstance.initialize()
  }
  return stockfishInstance
}

// Utility function for quick analysis
export async function analyzePosition(fen: string, depth = 20): Promise<string> {
  const engine = await getStockfishEngine()
  return engine.getBestMove(fen, depth)
}
