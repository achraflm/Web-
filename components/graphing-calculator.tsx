"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function GraphingCalculator() {
  const [equation, setEquation] = useState("x^2")
  const [xMin, setXMin] = useState(-10)
  const [xMax, setXMax] = useState(10)
  const [yMin, setYMin] = useState(-10)
  const [yMax, setYMax] = useState(10)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Virtual keyboard layout
  const keyboardLayout = [
    ["7", "8", "9", "/", "sin(", "cos(", "tan("],
    ["4", "5", "6", "*", "log(", "√(", "^"],
    ["1", "2", "3", "-", "π", "e", "abs("],
    ["0", ".", "x", "+", "(", ")", "="],
  ]

  // Expression evaluator
  const evaluateExpression = (x: number, expr: string): number => {
    try {
      const processedExpr = expr
        .replace(/\^/g, "**")
        .replace(/√/g, "Math.sqrt")
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/log/g, "Math.log10")
        .replace(/ln/g, "Math.log")
        .replace(/abs/g, "Math.abs")
        .replace(/pi|π/g, "Math.PI")
        .replace(/\be\b/g, "Math.E")
        .replace(/x/g, `(${x})`)

      return eval(processedExpr)
    } catch {
      return Number.NaN
    }
  }

  const drawGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Colors
    const gridColor = "#888"
    const axisColor = "#aaa"

    // Draw grid
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1

    for (let i = 0; i <= 20; i++) {
      const x = (i / 20) * width
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    for (let i = 0; i <= 20; i++) {
      const y = (i / 20) * height
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Axes
    ctx.strokeStyle = axisColor
    ctx.fillStyle = axisColor
    ctx.lineWidth = 2

    const yZero = height - ((0 - yMin) / (yMax - yMin)) * height
    if (yZero >= 0 && yZero <= height) {
      ctx.beginPath()
      ctx.moveTo(0, yZero)
      ctx.lineTo(width, yZero)
      ctx.stroke()
    }

    const xZero = ((0 - xMin) / (xMax - xMin)) * width
    if (xZero >= 0 && xZero <= width) {
      ctx.beginPath()
      ctx.moveTo(xZero, 0)
      ctx.lineTo(xZero, height)
      ctx.stroke()
    }

    // Tick marks & labels
    ctx.font = "12px monospace"
    ctx.textAlign = "center"

    const xTickStep = (xMax - xMin) / 10
    for (let i = 0; i <= 10; i++) {
      const value = xMin + i * xTickStep
      const pixelX = ((value - xMin) / (xMax - xMin)) * width
      ctx.fillText(value.toFixed(1), pixelX, yZero + 14)
    }

    const yTickStep = (yMax - yMin) / 10
    ctx.textAlign = "right"
    for (let i = 0; i <= 10; i++) {
      const value = yMin + i * yTickStep
      const pixelY = height - ((value - yMin) / (yMax - yMin)) * height
      ctx.fillText(value.toFixed(1), xZero - 6, pixelY + 4)
    }

    // Draw function
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.beginPath()

    let firstPoint = true
    for (let pixelX = 0; pixelX < width; pixelX++) {
      const x = xMin + (pixelX / width) * (xMax - xMin)
      const y = evaluateExpression(x, equation)

      if (!isNaN(y) && isFinite(y)) {
        const pixelY = height - ((y - yMin) / (yMax - yMin)) * height

        if (pixelY >= 0 && pixelY <= height) {
          if (firstPoint) {
            ctx.moveTo(pixelX, pixelY)
            firstPoint = false
          } else {
            ctx.lineTo(pixelX, pixelY)
          }
        } else {
          firstPoint = true
        }
      } else {
        firstPoint = true
      }
    }
    ctx.stroke()
  }

  useEffect(() => {
    drawGraph()
  }, [equation, xMin, xMax, yMin, yMax])

  // Handle keyboard clicks
  const handleKeyClick = (key: string) => {
    if (key === "=") {
      drawGraph()
    } else {
      setEquation((prev) => prev + key)
    }
  }

  // Zoom controls
  const zoom = (factor: number) => {
    setXMin(xMin * factor)
    setXMax(xMax * factor)
    setYMin(yMin * factor)
    setYMax(yMax * factor)
  }

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Graphing Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Equation input with clear button */}
        <div className="flex items-center gap-2">
          <label className="font-semibold">f(x) =</label>
          <Input
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            placeholder="Enter equation (e.g., x^2, sin(x))"
            className="flex-1"
          />
          <Button variant="destructive" onClick={() => setEquation("")}>
            X
          </Button>
        </div>

        {/* Virtual Keyboard */}
        <div className="grid grid-cols-7 gap-2">
          {keyboardLayout.flat().map((btn) => (
            <Button
              key={btn}
              className={btn === "=" ? "col-span-2 bg-green-500 text-white hover:bg-green-600" : ""}
              onClick={() => handleKeyClick(btn)}
            >
              {btn}
            </Button>
          ))}
        </div>

        {/* Zoom controls */}
        <div className="flex gap-2 justify-center my-2">
          <Button onClick={() => zoom(0.8)}>🔍 Zoom In</Button>
          <Button onClick={() => zoom(1.25)}>🔎 Zoom Out</Button>
        </div>

        {/* Graph */}
        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={800} height={600} className="w-full bg-white dark:bg-gray-900" />
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong>Supported functions:</strong> sin, cos, tan, log, ln, √, abs, π, e
          </p>
          <p>
            <strong>Operators:</strong> +, -, *, /, ^ (power)
          </p>
          <p>
            <strong>Example equations:</strong> x^2, sin(x), x^3 + 2*x - 1
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
