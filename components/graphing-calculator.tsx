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

<<<<<<< HEAD
  const evaluateExpression = (x: number, expr: string): number => {
    try {
      // Replace common math functions and operators
      const processedExpr = expr
        .replace(/\^/g, "**")
=======
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
>>>>>>> 6a7a7de (Updated the website content and design)
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/log/g, "Math.log10")
        .replace(/ln/g, "Math.log")
<<<<<<< HEAD
        .replace(/sqrt/g, "Math.sqrt")
        .replace(/pi/g, "Math.PI")
        .replace(/e/g, "Math.E")
        .replace(/x/g, x.toString())
=======
        .replace(/abs/g, "Math.abs")
        .replace(/pi|π/g, "Math.PI")
        .replace(/\be\b/g, "Math.E")
        .replace(/x/g, `(${x})`)
>>>>>>> 6a7a7de (Updated the website content and design)

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

<<<<<<< HEAD
    // Draw grid
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1

    const xStep = (xMax - xMin) / 20
    const yStep = (yMax - yMin) / 20

    // Vertical grid lines
=======
    // Colors
    const gridColor = "#888"
    const axisColor = "#aaa" // light gray axis

    // Draw grid
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1

>>>>>>> 6a7a7de (Updated the website content and design)
    for (let i = 0; i <= 20; i++) {
      const x = (i / 20) * width
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
<<<<<<< HEAD

    // Horizontal grid lines
=======
>>>>>>> 6a7a7de (Updated the website content and design)
    for (let i = 0; i <= 20; i++) {
      const y = (i / 20) * height
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

<<<<<<< HEAD
    // Draw axes
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 2

    // X-axis
=======
    // Axes
    ctx.strokeStyle = axisColor
    ctx.fillStyle = axisColor
    ctx.lineWidth = 2

>>>>>>> 6a7a7de (Updated the website content and design)
    const yZero = height - ((0 - yMin) / (yMax - yMin)) * height
    if (yZero >= 0 && yZero <= height) {
      ctx.beginPath()
      ctx.moveTo(0, yZero)
      ctx.lineTo(width, yZero)
      ctx.stroke()
    }

<<<<<<< HEAD
    // Y-axis
=======
>>>>>>> 6a7a7de (Updated the website content and design)
    const xZero = ((0 - xMin) / (xMax - xMin)) * width
    if (xZero >= 0 && xZero <= width) {
      ctx.beginPath()
      ctx.moveTo(xZero, 0)
      ctx.lineTo(xZero, height)
      ctx.stroke()
    }

<<<<<<< HEAD
    // Draw function
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 3
    ctx.beginPath()

    let firstPoint = true
    const step = (xMax - xMin) / width

=======
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
>>>>>>> 6a7a7de (Updated the website content and design)
    for (let pixelX = 0; pixelX < width; pixelX++) {
      const x = xMin + (pixelX / width) * (xMax - xMin)
      const y = evaluateExpression(x, equation)

      if (!isNaN(y) && isFinite(y)) {
        const pixelY = height - ((y - yMin) / (yMax - yMin)) * height
<<<<<<< HEAD

=======
>>>>>>> 6a7a7de (Updated the website content and design)
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
<<<<<<< HEAD

    ctx.stroke()

    // Draw axis labels
    ctx.fillStyle = "#374151"
    ctx.font = "12px monospace"
    ctx.textAlign = "center"

    // X-axis labels
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width
      const value = xMin + (i / 10) * (xMax - xMin)
      if (Math.abs(value) < 0.001) {
        ctx.fillText("0", x, yZero + 15)
      } else {
        ctx.fillText(value.toFixed(1), x, yZero + 15)
      }
    }

    // Y-axis labels
    ctx.textAlign = "right"
    for (let i = 0; i <= 10; i++) {
      const y = height - (i / 10) * height
      const value = yMin + (i / 10) * (yMax - yMin)
      if (Math.abs(value) > 0.001) {
        ctx.fillText(value.toFixed(1), xZero - 5, y + 4)
      }
    }
=======
    ctx.stroke()
>>>>>>> 6a7a7de (Updated the website content and design)
  }

  useEffect(() => {
    drawGraph()
  }, [equation, xMin, xMax, yMin, yMax])

<<<<<<< HEAD
  const presetFunctions = [
    { name: "x²", equation: "x^2" },
    { name: "x³", equation: "x^3" },
    { name: "sin(x)", equation: "sin(x)" },
    { name: "cos(x)", equation: "cos(x)" },
    { name: "1/x", equation: "1/x" },
    { name: "sqrt(x)", equation: "sqrt(x)" },
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Graphing Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
=======
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
        <CardTitle className="text-2xl font-bold text-center">
          Graphing Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Equation input with X clear button */}
        <div className="flex items-center gap-2">
>>>>>>> 6a7a7de (Updated the website content and design)
          <label className="font-semibold">f(x) =</label>
          <Input
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            placeholder="Enter equation (e.g., x^2, sin(x))"
<<<<<<< HEAD
            className="flex-1 min-w-48"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {presetFunctions.map((func) => (
            <Button key={func.name} onClick={() => setEquation(func.equation)} variant="outline" size="sm">
              {func.name}
=======
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
              className={btn === "=" ? "col-span-2 bg-green-500 text-white" : ""}
              onClick={() => handleKeyClick(btn)}
            >
              {btn}
>>>>>>> 6a7a7de (Updated the website content and design)
            </Button>
          ))}
        </div>

<<<<<<< HEAD
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div>
            <label className="text-sm font-medium">X Min:</label>
            <Input type="number" value={xMin} onChange={(e) => setXMin(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium">X Max:</label>
            <Input type="number" value={xMax} onChange={(e) => setXMax(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium">Y Min:</label>
            <Input type="number" value={yMin} onChange={(e) => setYMin(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium">Y Max:</label>
            <Input type="number" value={yMax} onChange={(e) => setYMax(Number(e.target.value))} />
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={800} height={600} className="w-full bg-white dark:bg-gray-900" />
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong>Supported functions:</strong> sin, cos, tan, log, ln, sqrt, pi, e
          </p>
          <p>
            <strong>Operators:</strong> +, -, *, /, ^ (power)
          </p>
          <p>
            <strong>Example equations:</strong> x^2, sin(x), x^3 + 2*x - 1
          </p>
=======
        {/* Zoom controls */}
        <div className="flex gap-2 justify-center my-2">
          <Button onClick={() => zoom(0.8)}>🔍 Zoom In</Button>
          <Button onClick={() => zoom(1.25)}>🔎 Zoom Out</Button>
        </div>

        {/* Graph */}
        <div className="border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full bg-white dark:bg-gray-900"
          />
>>>>>>> 6a7a7de (Updated the website content and design)
        </div>
      </CardContent>
    </Card>
  )
}
