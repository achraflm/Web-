"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [memory, setMemory] = useState(0)
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("deg")

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
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
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
      case "log":
        result = Math.log10(inputValue)
        break
      case "ln":
        result = Math.log(inputValue)
        break
      case "sqrt":
        result = Math.sqrt(inputValue)
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
      default:
        return
    }

    setDisplay(String(result))
    setWaitingForOperand(true)
  }

  const buttonClass = "h-12 text-lg font-semibold"
  const operatorClass = "h-12 text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white"
  const scientificClass = "h-12 text-sm font-semibold bg-purple-500 hover:bg-purple-600 text-white"

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Scientific Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <div className="text-right text-3xl font-mono overflow-hidden">{display}</div>
        </div>

        <div className="flex justify-between mb-2">
          <Button
            onClick={() => setAngleMode(angleMode === "deg" ? "rad" : "deg")}
            variant="outline"
            className="text-sm"
          >
            {angleMode.toUpperCase()}
          </Button>
          <Button onClick={clear} variant="destructive" className="text-sm">
            Clear
          </Button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {/* Scientific functions row 1 */}
          <Button onClick={() => performScientificOperation("sin")} className={scientificClass}>
            sin
          </Button>
          <Button onClick={() => performScientificOperation("cos")} className={scientificClass}>
            cos
          </Button>
          <Button onClick={() => performScientificOperation("tan")} className={scientificClass}>
            tan
          </Button>
          <Button onClick={() => performScientificOperation("log")} className={scientificClass}>
            log
          </Button>
          <Button onClick={() => performScientificOperation("ln")} className={scientificClass}>
            ln
          </Button>

          {/* Scientific functions row 2 */}
          <Button onClick={() => performScientificOperation("sqrt")} className={scientificClass}>
            √
          </Button>
          <Button onClick={() => performScientificOperation("x²")} className={scientificClass}>
            x²
          </Button>
          <Button onClick={() => performScientificOperation("x³")} className={scientificClass}>
            x³
          </Button>
          <Button onClick={() => performScientificOperation("1/x")} className={scientificClass}>
            1/x
          </Button>
          <Button onClick={() => performOperation("÷")} className={operatorClass}>
            ÷
          </Button>

          {/* Numbers and operations */}
          <Button onClick={() => inputNumber("7")} className={buttonClass}>
            7
          </Button>
          <Button onClick={() => inputNumber("8")} className={buttonClass}>
            8
          </Button>
          <Button onClick={() => inputNumber("9")} className={buttonClass}>
            9
          </Button>
          <Button onClick={() => performOperation("×")} className={operatorClass}>
            ×
          </Button>
          <Button onClick={() => performScientificOperation("π")} className={scientificClass}>
            π
          </Button>

          <Button onClick={() => inputNumber("4")} className={buttonClass}>
            4
          </Button>
          <Button onClick={() => inputNumber("5")} className={buttonClass}>
            5
          </Button>
          <Button onClick={() => inputNumber("6")} className={buttonClass}>
            6
          </Button>
          <Button onClick={() => performOperation("-")} className={operatorClass}>
            -
          </Button>
          <Button onClick={() => performScientificOperation("e")} className={scientificClass}>
            e
          </Button>

          <Button onClick={() => inputNumber("1")} className={buttonClass}>
            1
          </Button>
          <Button onClick={() => inputNumber("2")} className={buttonClass}>
            2
          </Button>
          <Button onClick={() => inputNumber("3")} className={buttonClass}>
            3
          </Button>
          <Button onClick={() => performOperation("+")} className={operatorClass}>
            +
          </Button>
          <Button onClick={() => performOperation("=")} className={`${operatorClass} row-span-2`}>
            =
          </Button>

          <Button onClick={() => inputNumber("0")} className={`${buttonClass} col-span-2`}>
            0
          </Button>
          <Button onClick={inputDecimal} className={buttonClass}>
            .
          </Button>
          <Button onClick={() => setDisplay(display.slice(0, -1) || "0")} className={buttonClass}>
            ⌫
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
