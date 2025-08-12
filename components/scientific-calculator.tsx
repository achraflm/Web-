"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [memory, setMemory] = useState(0)
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("deg")
  const [expression, setExpression] = useState("")

  // Statistical data
  const [statData, setStatData] = useState<number[]>([])
  const [statInput, setStatInput] = useState("")

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
    setExpression("")
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
      setExpression(`${inputValue} ${nextOperation}`)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)

      if (nextOperation === "=") {
        setExpression(`${expression} ${inputValue}`)
      } else {
        setExpression(`${newValue} ${nextOperation}`)
      }
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return firstValue / secondValue
      case "^":
        return Math.pow(firstValue, secondValue)
      case "=":
        return secondValue
      default:
        return secondValue
    }
  }

  const performScientificOperation = (func: string) => {
    const inputValue = Number.parseFloat(display)
    let result: number

    switch (func) {
      case "sin":
        result = Math.sin(angleMode === "deg" ? (inputValue * Math.PI) / 180 : inputValue)
        break
      case "cos":
        result = Math.cos(angleMode === "deg" ? (inputValue * Math.PI) / 180 : inputValue)
        break
      case "tan":
        result = Math.tan(angleMode === "deg" ? (inputValue * Math.PI) / 180 : inputValue)
        break
      case "asin":
        result = Math.asin(inputValue) * (angleMode === "deg" ? 180 / Math.PI : 1)
        break
      case "acos":
        result = Math.acos(inputValue) * (angleMode === "deg" ? 180 / Math.PI : 1)
        break
      case "atan":
        result = Math.atan(inputValue) * (angleMode === "deg" ? 180 / Math.PI : 1)
        break
      case "log":
        result = Math.log10(inputValue)
        break
      case "ln":
        result = Math.log(inputValue)
        break
      case "sqrt":
        result = Math.sqrt(inputValue)
        break
      case "cbrt":
        result = Math.cbrt(inputValue)
        break
      case "x²":
        result = inputValue * inputValue
        break
      case "x³":
        result = inputValue * inputValue * inputValue
        break
      case "1/x":
        result = 1 / inputValue
        break
      case "π":
        result = Math.PI
        break
      case "e":
        result = Math.E
        break
      case "!":
        result = factorial(inputValue)
        break
      case "exp":
        result = Math.exp(inputValue)
        break
      case "abs":
        result = Math.abs(inputValue)
        break
      default:
        return
    }

    setDisplay(String(result))
    setWaitingForOperand(true)
  }

  const factorial = (n: number): number => {
    if (n < 0 || n !== Math.floor(n)) return Number.NaN
    if (n === 0 || n === 1) return 1
    return n * factorial(n - 1)
  }

  const addToStatData = () => {
    const values = statInput
      .split(/[,\s]+/)
      .map((v) => Number.parseFloat(v.trim()))
      .filter((v) => !isNaN(v))
    setStatData((prev) => [...prev, ...values])
    setStatInput("")
  }

  const clearStatData = () => {
    setStatData([])
  }

  const calculateMean = () => {
    if (statData.length === 0) return 0
    return statData.reduce((sum, val) => sum + val, 0) / statData.length
  }

  const calculateMedian = () => {
    if (statData.length === 0) return 0
    const sorted = [...statData].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
  }

  const calculateMode = () => {
    if (statData.length === 0) return 0
    const frequency: { [key: number]: number } = {}
    statData.forEach((val) => (frequency[val] = (frequency[val] || 0) + 1))
    const maxFreq = Math.max(...Object.values(frequency))
    const modes = Object.keys(frequency).filter((key) => frequency[Number(key)] === maxFreq)
    return Number(modes[0])
  }

  const calculateStdDev = (population = false) => {
    if (statData.length === 0) return 0
    const mean = calculateMean()
    const divisor = population ? statData.length : statData.length - 1
    const variance = statData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / divisor
    return Math.sqrt(variance)
  }

  const calculateVariance = (population = false) => {
    if (statData.length === 0) return 0
    const mean = calculateMean()
    const divisor = population ? statData.length : statData.length - 1
    return statData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / divisor
  }

  const calculateRange = () => {
    if (statData.length === 0) return 0
    return Math.max(...statData) - Math.min(...statData)
  }

  const calculateQuartiles = () => {
    if (statData.length === 0) return { q1: 0, q2: 0, q3: 0 }
    const sorted = [...statData].sort((a, b) => a - b)
    const q2 = calculateMedian()
    const mid = Math.floor(sorted.length / 2)
    const lowerHalf = sorted.slice(0, mid)
    const upperHalf = sorted.slice(sorted.length % 2 === 0 ? mid : mid + 1)

    const q1 =
      lowerHalf.length > 0
        ? lowerHalf.length % 2 === 0
          ? (lowerHalf[Math.floor(lowerHalf.length / 2) - 1] + lowerHalf[Math.floor(lowerHalf.length / 2)]) / 2
          : lowerHalf[Math.floor(lowerHalf.length / 2)]
        : 0

    const q3 =
      upperHalf.length > 0
        ? upperHalf.length % 2 === 0
          ? (upperHalf[Math.floor(upperHalf.length / 2) - 1] + upperHalf[Math.floor(upperHalf.length / 2)]) / 2
          : upperHalf[Math.floor(upperHalf.length / 2)]
        : 0

    return { q1, q2, q3 }
  }

  const performStatOperation = (func: string) => {
    let result: number
    switch (func) {
      case "mean":
        result = calculateMean()
        break
      case "median":
        result = calculateMedian()
        break
      case "mode":
        result = calculateMode()
        break
      case "stddev":
        result = calculateStdDev(false)
        break
      case "stddevp":
        result = calculateStdDev(true)
        break
      case "variance":
        result = calculateVariance(false)
        break
      case "variancep":
        result = calculateVariance(true)
        break
      case "range":
        result = calculateRange()
        break
      case "sum":
        result = statData.reduce((sum, val) => sum + val, 0)
        break
      case "count":
        result = statData.length
        break
      case "min":
        result = Math.min(...statData)
        break
      case "max":
        result = Math.max(...statData)
        break
      case "q1":
        result = calculateQuartiles().q1
        break
      case "q3":
        result = calculateQuartiles().q3
        break
      default:
        return
    }
    setDisplay(String(result))
    setWaitingForOperand(true)
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-3xl overflow-hidden">
      <CardContent className="p-6 space-y-6">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 min-h-[180px] flex flex-col justify-end border border-gray-200 dark:border-gray-700 shadow-inner">
          {expression && (
            <div className="text-base text-gray-600 dark:text-gray-300 mb-3 font-mono tracking-wide opacity-80">
              {expression}
            </div>
          )}
          <div className="text-right text-5xl font-light text-gray-900 dark:text-white font-mono overflow-hidden leading-tight">
            {Number(display).toLocaleString()}
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="basic" className="text-xs">
              Basic
            </TabsTrigger>
            <TabsTrigger value="scientific" className="text-xs">
              Scientific
            </TabsTrigger>
            <TabsTrigger value="statistics" className="text-xs">
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-3">
            <div className="grid grid-cols-4 gap-3">
              <Button
                onClick={clear}
                className="h-14 text-lg font-medium bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl"
              >
                AC
              </Button>
              <Button
                onClick={() => setDisplay(display.slice(0, -1) || "0")}
                className="h-14 text-lg font-medium bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl"
              >
                ⌫
              </Button>
              <Button
                onClick={() => performOperation("%")}
                className="h-14 text-lg font-medium bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl"
              >
                %
              </Button>
              <Button
                onClick={() => performOperation("÷")}
                className="h-14 text-lg font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-2xl"
              >
                ÷
              </Button>

              <Button
                onClick={() => inputNumber("7")}
                className="h-14 text-xl font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-2xl"
              >
                7
              </Button>
              <Button
                onClick={() => inputNumber("8")}
                className="h-14 text-xl font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-2xl"
              >
                8
              </Button>
              <Button
                onClick={() => inputNumber("9")}
                className="h-14 text-xl font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-2xl"
              >
                9
              </Button>
              <Button
                onClick={() => performOperation("×")}
                className="h-14 text-lg font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-2xl"
              >
                ×
              </Button>

              <Button
                onClick={() => inputNumber("4")}
                className="h-14 text-xl font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-2xl"
              >
                4
              </Button>
              <Button
                onClick={() => inputNumber("5")}
                className="h-14 text-xl font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-2xl"
              >
                5
              </Button>
              <Button
                onClick={() => inputNumber("6")}
                className="h-14 text-xl font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-2xl"
              >
                6
              </Button>
              <Button
                onClick={() => performOperation("-")}
                className="h-14 text-lg font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-2xl"
              >
                −
              </Button>

              <Button
                onClick={() => inputNumber("1")}
                className="h-14 text-xl font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-2xl"
              >
                1
              </Button>
              <Button
                onClick={() => inputNumber("2")}
                className="h-14 text-xl font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-2xl"
              >
                2
              </Button>
              <Button
                onClick={() => inputNumber("3")}
                className="h-14 text-xl font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-2xl"
              >
                3
              </Button>
              <Button
                onClick={() => performOperation("+")}
                className="h-14 text-lg font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-2xl"
              >
                +
              </Button>

              <Button
                onClick={() => inputNumber("0")}
                className="h-14 text-xl font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-2xl col-span-2"
              >
                0
              </Button>
              <Button
                onClick={inputDecimal}
                className="h-14 text-xl font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-2xl"
              >
                .
              </Button>
              <Button
                onClick={() => performOperation("=")}
                className="h-14 text-lg font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-2xl"
              >
                =
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="scientific" className="space-y-3">
            <div className="flex justify-between mb-3">
              <Button
                onClick={() => setAngleMode(angleMode === "deg" ? "rad" : "deg")}
                variant="outline"
                className="text-sm rounded-xl"
              >
                {angleMode.toUpperCase()}
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Button
                onClick={() => performScientificOperation("sin")}
                className="h-12 text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
              >
                sin
              </Button>
              <Button
                onClick={() => performScientificOperation("cos")}
                className="h-12 text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
              >
                cos
              </Button>
              <Button
                onClick={() => performScientificOperation("tan")}
                className="h-12 text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
              >
                tan
              </Button>
              <Button
                onClick={() => performScientificOperation("log")}
                className="h-12 text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
              >
                log
              </Button>

              <Button
                onClick={() => performScientificOperation("asin")}
                className="h-12 text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
              >
                asin
              </Button>
              <Button
                onClick={() => performScientificOperation("acos")}
                className="h-12 text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
              >
                acos
              </Button>
              <Button
                onClick={() => performScientificOperation("atan")}
                className="h-12 text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
              >
                atan
              </Button>
              <Button
                onClick={() => performScientificOperation("ln")}
                className="h-12 text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
              >
                ln
              </Button>

              <Button
                onClick={() => performScientificOperation("sqrt")}
                className="h-12 text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
              >
                √
              </Button>
              <Button
                onClick={() => performScientificOperation("x²")}
                className="h-12 text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
              >
                x²
              </Button>
              <Button
                onClick={() => performOperation("^")}
                className="h-12 text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
              >
                x^y
              </Button>
              <Button
                onClick={() => performScientificOperation("!")}
                className="h-12 text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
              >
                x!
              </Button>

              <Button
                onClick={() => performScientificOperation("π")}
                className="h-12 text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
              >
                π
              </Button>
              <Button
                onClick={() => performScientificOperation("e")}
                className="h-12 text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
              >
                e
              </Button>
              <Button
                onClick={() => performScientificOperation("1/x")}
                className="h-12 text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
              >
                1/x
              </Button>
              <Button
                onClick={() => performScientificOperation("abs")}
                className="h-12 text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
              >
                |x|
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="stat-input" className="text-sm font-medium">
                Enter data (space or comma separated):
              </Label>
              <div className="flex gap-2">
                <Input
                  id="stat-input"
                  value={statInput}
                  onChange={(e) => setStatInput(e.target.value)}
                  placeholder="1 2 3 4 5"
                  className="rounded-xl"
                />
                <Button onClick={addToStatData} className="bg-green-600 hover:bg-green-700 rounded-xl px-4">
                  Add
                </Button>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded-xl">
                <div>Count: {statData.length}</div>
                <div>
                  Data: [{statData.slice(0, 8).join(", ")}
                  {statData.length > 8 ? "..." : ""}]
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => performStatOperation("mean")}
                className="h-10 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-xl"
              >
                Mean
              </Button>
              <Button
                onClick={() => performStatOperation("median")}
                className="h-10 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-xl"
              >
                Median
              </Button>
              <Button
                onClick={() => performStatOperation("mode")}
                className="h-10 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-xl"
              >
                Mode
              </Button>
              <Button
                onClick={() => performStatOperation("stddev")}
                className="h-10 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-xl"
              >
                Std Dev
              </Button>
              <Button
                onClick={() => performStatOperation("variance")}
                className="h-10 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-xl"
              >
                Variance
              </Button>
              <Button
                onClick={() => performStatOperation("range")}
                className="h-10 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-xl"
              >
                Range
              </Button>
              <Button
                onClick={() => performStatOperation("min")}
                className="h-10 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-xl"
              >
                Min
              </Button>
              <Button
                onClick={() => performStatOperation("max")}
                className="h-10 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-xl"
              >
                Max
              </Button>
              <Button
                onClick={() => performStatOperation("sum")}
                className="h-10 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-xl"
              >
                Sum
              </Button>
              <Button
                onClick={() => performStatOperation("q1")}
                className="h-10 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-xl"
              >
                Q1
              </Button>
              <Button
                onClick={() => performStatOperation("q3")}
                className="h-10 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-xl"
              >
                Q3
              </Button>
              <Button
                onClick={clearStatData}
                className="h-10 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-xl"
              >
                Clear
              </Button>
            </div>

            {statData.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-xs space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>Mean: {calculateMean().toFixed(3)}</div>
                  <div>Median: {calculateMedian().toFixed(3)}</div>
                  <div>Std Dev: {calculateStdDev(false).toFixed(3)}</div>
                  <div>Range: {calculateRange().toFixed(3)}</div>
                </div>
                <div className="border-t pt-2">
                  <div className="text-center font-medium mb-1">Quartiles</div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>Q1: {calculateQuartiles().q1.toFixed(2)}</div>
                    <div>Q2: {calculateQuartiles().q2.toFixed(2)}</div>
                    <div>Q3: {calculateQuartiles().q3.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
