"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, SquareIcon as SquareRoot, Sigma, Divide, Plus, Minus, X } from "lucide-react"

interface MathToolsProps {
  isDark: boolean
}

export default function MathTools({ isDark }: MathToolsProps) {
  const [tool, setTool] = useState("calculator")
  const [input1, setInput1] = useState("")
  const [input2, setInput2] = useState("")
  const [result, setResult] = useState<number | string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = useCallback(() => {
    setError(null)
    setResult(null)

    const num1 = Number.parseFloat(input1)
    const num2 = Number.parseFloat(input2)

    if (isNaN(num1) || (tool !== "squareRoot" && isNaN(num2))) {
      setError("Please enter valid numbers.")
      return
    }

    try {
      let calculatedResult: number | string
      switch (tool) {
        case "calculator":
          // This case is handled by the individual operation buttons
          break
        case "squareRoot":
          if (num1 < 0) {
            setError("Cannot calculate square root of a negative number.")
            return
          }
          calculatedResult = Math.sqrt(num1)
          break
        case "summation":
          if (!Number.isInteger(num1) || !Number.isInteger(num2) || num1 > num2) {
            setError("For summation, start and end must be integers, and start <= end.")
            return
          }
          calculatedResult = 0
          for (let i = num1; i <= num2; i++) {
            calculatedResult += i
          }
          break
        default:
          setError("Invalid tool selected.")
          return
      }
      setResult(calculatedResult)
    } catch (e) {
      setError("An unexpected error occurred.")
    }
  }, [input1, input2, tool])

  const handleBasicOperation = useCallback(
    (operation: string) => {
      setError(null)
      setResult(null)

      const num1 = Number.parseFloat(input1)
      const num2 = Number.parseFloat(input2)

      if (isNaN(num1) || isNaN(num2)) {
        setError("Please enter valid numbers for both inputs.")
        return
      }

      let calculatedResult: number
      switch (operation) {
        case "add":
          calculatedResult = num1 + num2
          break
        case "subtract":
          calculatedResult = num1 - num2
          break
        case "multiply":
          calculatedResult = num1 * num2
          break
        case "divide":
          if (num2 === 0) {
            setError("Cannot divide by zero.")
            return
          }
          calculatedResult = num1 / num2
          break
        default:
          setError("Invalid operation.")
          return
      }
      setResult(calculatedResult)
    },
    [input1, input2],
  )

  const renderToolInputs = () => {
    switch (tool) {
      case "calculator":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="input1">Number 1</Label>
              <Input
                id="input1"
                type="number"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
                placeholder="Enter first number"
                className={isDark ? "bg-gray-800 border-purple-700 text-white" : "bg-gray-50 border-cyan-700"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input2">Number 2</Label>
              <Input
                id="input2"
                type="number"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
                placeholder="Enter second number"
                className={isDark ? "bg-gray-800 border-purple-700 text-white" : "bg-gray-50 border-cyan-700"}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleBasicOperation("add")}
                className={isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-cyan-600 hover:bg-cyan-700"}
              >
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
              <Button
                onClick={() => handleBasicOperation("subtract")}
                className={isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-cyan-600 hover:bg-cyan-700"}
              >
                <Minus className="h-4 w-4 mr-2" /> Subtract
              </Button>
              <Button
                onClick={() => handleBasicOperation("multiply")}
                className={isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-cyan-600 hover:bg-cyan-700"}
              >
                <X className="h-4 w-4 mr-2" /> Multiply
              </Button>
              <Button
                onClick={() => handleBasicOperation("divide")}
                className={isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-cyan-600 hover:bg-cyan-700"}
              >
                <Divide className="h-4 w-4 mr-2" /> Divide
              </Button>
            </div>
          </>
        )
      case "squareRoot":
        return (
          <div className="space-y-2">
            <Label htmlFor="input1">Number</Label>
            <Input
              id="input1"
              type="number"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              placeholder="Enter number"
              className={isDark ? "bg-gray-800 border-purple-700 text-white" : "bg-gray-50 border-cyan-700"}
            />
            <Button
              onClick={handleCalculate}
              className={isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-cyan-600 hover:bg-cyan-700"}
            >
              <SquareRoot className="h-4 w-4 mr-2" /> Calculate Square Root
            </Button>
          </div>
        )
      case "summation":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="input1">Start Number</Label>
              <Input
                id="input1"
                type="number"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
                placeholder="Enter start number (integer)"
                className={isDark ? "bg-gray-800 border-purple-700 text-white" : "bg-gray-50 border-cyan-700"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input2">End Number</Label>
              <Input
                id="input2"
                type="number"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
                placeholder="Enter end number (integer)"
                className={isDark ? "bg-gray-800 border-purple-700 text-white" : "bg-gray-50 border-cyan-700"}
              />
            </div>
            <Button
              onClick={handleCalculate}
              className={isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-cyan-600 hover:bg-cyan-700"}
            >
              <Sigma className="h-4 w-4 mr-2" /> Calculate Summation
            </Button>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Card
      className={`max-w-2xl mx-auto ${
        isDark ? "bg-black/30 border-purple-500/30" : "bg-white/30 border-cyan-500/30"
      } backdrop-blur-sm shadow-xl`}
    >
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
          <Calculator className="h-5 w-5" />
          Math Tools
        </CardTitle>
        <CardDescription className={`${isDark ? "text-purple-200/80" : "text-cyan-700/80"}`}>
          Perform various mathematical operations.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="w-full space-y-4">
          <div className="space-y-2">
            <Label htmlFor="math-tool-select" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Select Tool
            </Label>
            <Select
              value={tool}
              onValueChange={(value) => {
                setTool(value)
                setInput1("")
                setInput2("")
                setResult(null)
                setError(null)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a math tool" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calculator">Basic Calculator</SelectItem>
                <SelectItem value="squareRoot">Square Root</SelectItem>
                <SelectItem value="summation">Summation (Σ)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {renderToolInputs()}

          {result !== null && (
            <div
              className={`p-4 rounded-lg border-2 ${
                isDark ? "bg-purple-900/30 border-purple-500/30" : "bg-cyan-100/30 border-cyan-500/30"
              }`}
            >
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>Result:</h3>
              <p className="text-2xl font-bold">{result}</p>
            </div>
          )}

          {error && (
            <div className={`p-4 rounded-lg border-2 bg-red-900/30 border-red-500/50 text-red-300 animate-pulse`}>
              <p className="font-bold">Error: {error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
