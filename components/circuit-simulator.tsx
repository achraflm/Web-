"use client"

import { useEffect } from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Lightbulb, Zap, InfinityIcon as Ohm, CircuitBoard, Play, Pause, RotateCcw } from "lucide-react"

interface CircuitSimulatorProps {
  isDark: boolean
}

export default function CircuitSimulator({ isDark }: CircuitSimulatorProps) {
  const [voltage, setVoltage] = useState(12) // Volts
  const [resistance, setResistance] = useState(100) // Ohms
  const [current, setCurrent] = useState(0) // Amperes
  const [power, setPower] = useState(0) // Watts
  const [circuitState, setCircuitState] = useState("off") // 'on', 'off', 'overload'
  const [componentType, setComponentType] = useState("resistor") // 'resistor', 'led', 'motor'

  const calculateCircuit = useCallback(() => {
    if (resistance === 0) {
      setCurrent(Number.POSITIVE_INFINITY)
      setPower(Number.POSITIVE_INFINITY)
      setCircuitState("overload")
      return
    }

    const calculatedCurrent = voltage / resistance
    const calculatedPower = voltage * calculatedCurrent

    setCurrent(calculatedCurrent)
    setPower(calculatedPower)

    if (calculatedCurrent > 0.5) {
      setCircuitState("overload")
    } else if (calculatedCurrent > 0) {
      setCircuitState("on")
    } else {
      setCircuitState("off")
    }
  }, [voltage, resistance])

  const resetCircuit = useCallback(() => {
    setVoltage(12)
    setResistance(100)
    setCurrent(0)
    setPower(0)
    setCircuitState("off")
    setComponentType("resistor")
  }, [])

  useEffect(() => {
    calculateCircuit()
  }, [voltage, resistance, calculateCircuit])

  const getCircuitStatusMessage = () => {
    switch (circuitState) {
      case "on":
        return "Circuit ON: Flowing smoothly!"
      case "off":
        return "Circuit OFF: No current."
      case "overload":
        return "DANGER: Circuit Overload! 🔥"
      default:
        return "Circuit Status Unknown"
    }
  }

  const getComponentIcon = () => {
    switch (componentType) {
      case "resistor":
        return <Ohm className="h-6 w-6" />
      case "led":
        return <Lightbulb className="h-6 w-6" />
      case "motor":
        return <Zap className="h-6 w-6" />
      default:
        return <CircuitBoard className="h-6 w-6" />
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
          <CircuitBoard className="h-5 w-5" />
          Circuit Simulator
        </CardTitle>
        <CardDescription className={`${isDark ? "text-purple-200/80" : "text-cyan-700/80"}`}>
          Explore Ohm's Law and basic circuit behavior.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        {/* Circuit Diagram / Visualization */}
        <div
          className={`relative w-full h-48 rounded-lg border-2 p-4 flex items-center justify-center overflow-hidden ${
            isDark ? "border-purple-700/50 bg-gray-900/50" : "border-cyan-700/50 bg-gray-100/50"
          } shadow-inner`}
        >
          {/* Background grid */}
          <div
            className={`absolute inset-0 grid grid-cols-8 grid-rows-4 opacity-20 ${
              isDark ? "bg-purple-900/[0.05]" : "bg-cyan-100/[0.05]"
            }`}
          >
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className={`border ${isDark ? "border-purple-800/20" : "border-cyan-800/20"}`}></div>
            ))}
          </div>

          {/* Wires */}
          <div
            className={`absolute w-full h-2 ${
              circuitState === "on"
                ? isDark
                  ? "bg-gradient-to-r from-purple-400 to-cyan-400 animate-pulse"
                  : "bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse"
                : "bg-gray-500"
            } rounded-full`}
            style={{ top: "20%", left: "0%", width: "100%" }}
          />
          <div
            className={`absolute w-2 h-full ${
              circuitState === "on"
                ? isDark
                  ? "bg-gradient-to-b from-purple-400 to-cyan-400 animate-pulse"
                  : "bg-gradient-to-b from-cyan-400 to-blue-400 animate-pulse"
                : "bg-gray-500"
            } rounded-full`}
            style={{ top: "0%", left: "20%", height: "100%" }}
          />
          <div
            className={`absolute w-full h-2 ${
              circuitState === "on"
                ? isDark
                  ? "bg-gradient-to-l from-purple-400 to-cyan-400 animate-pulse"
                  : "bg-gradient-to-l from-cyan-400 to-blue-400 animate-pulse"
                : "bg-gray-500"
            } rounded-full`}
            style={{ bottom: "20%", left: "0%", width: "100%" }}
          />
          <div
            className={`absolute w-2 h-full ${
              circuitState === "on"
                ? isDark
                  ? "bg-gradient-to-t from-purple-400 to-cyan-400 animate-pulse"
                  : "bg-gradient-to-t from-cyan-400 to-blue-400 animate-pulse"
                : "bg-gray-500"
            } rounded-full`}
            style={{ top: "0%", right: "20%", height: "100%" }}
          />

          {/* Power Source */}
          <div
            className={`absolute w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
              isDark ? "bg-purple-600" : "bg-cyan-600"
            }`}
            style={{ top: "10%", left: "10%" }}
          >
            <Zap className="h-6 w-6 text-white" />
          </div>

          {/* Component */}
          <div
            className={`absolute w-16 h-16 rounded-lg flex items-center justify-center shadow-md ${
              circuitState === "on"
                ? isDark
                  ? "bg-cyan-500/80 animate-pulse"
                  : "bg-blue-500/80 animate-pulse"
                : circuitState === "overload"
                  ? "bg-red-500 animate-shake"
                  : "bg-gray-700"
            }`}
            style={{ bottom: "10%", right: "10%" }}
          >
            {getComponentIcon()}
          </div>

          {/* Current Flow Indicator */}
          {circuitState === "on" && (
            <div
              className={`absolute w-4 h-4 rounded-full ${isDark ? "bg-cyan-300" : "bg-blue-300"} animate-ping-slow`}
              style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
            />
          )}
          {circuitState === "overload" && (
            <div
              className={`absolute w-6 h-6 rounded-full bg-red-500 animate-pulse-fast`}
              style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
            />
          )}
        </div>

        {/* Controls */}
        <div className="w-full space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="voltage-slider" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Voltage (V): {voltage}V
              </Label>
              <Slider
                id="voltage-slider"
                min={0}
                max={24}
                step={1}
                value={[voltage]}
                onValueChange={(val) => setVoltage(val[0])}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resistance-slider" className="flex items-center gap-2">
                <Ohm className="h-4 w-4" />
                Resistance (Ω): {resistance}Ω
              </Label>
              <Slider
                id="resistance-slider"
                min={1}
                max={1000}
                step={10}
                value={[resistance]}
                onValueChange={(val) => setResistance(val[0])}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="component-type" className="flex items-center gap-2">
              <CircuitBoard className="h-4 w-4" />
              Component Type
            </Label>
            <Select value={componentType} onValueChange={setComponentType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a component" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resistor">Resistor</SelectItem>
                <SelectItem value="led">LED</SelectItem>
                <SelectItem value="motor">Motor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          <div
            className={`p-4 rounded-lg border-2 ${
              circuitState === "overload"
                ? "bg-red-900/30 border-red-500/50 text-red-300 animate-pulse"
                : isDark
                  ? "bg-purple-900/30 border-purple-500/30 text-purple-200"
                  : "bg-cyan-100/30 border-cyan-500/30 text-cyan-700"
            }`}
          >
            <h3 className="text-lg font-semibold mb-2">Circuit Metrics:</h3>
            <p>
              Current (I):{" "}
              <span className="font-bold">{current === Number.POSITIVE_INFINITY ? "∞" : current.toFixed(3)} A</span>
            </p>
            <p>
              Power (P):{" "}
              <span className="font-bold">{power === Number.POSITIVE_INFINITY ? "∞" : power.toFixed(3)} W</span>
            </p>
            <p className="mt-2 font-bold">{getCircuitStatusMessage()}</p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setCircuitState("on")}
              disabled={circuitState === "on" || circuitState === "overload"}
              className={`flex-1 ${isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-cyan-600 hover:bg-cyan-700"}`}
            >
              <Play className="h-4 w-4 mr-2" />
              Run Circuit
            </Button>
            <Button
              onClick={() => setCircuitState("off")}
              disabled={circuitState === "off"}
              className={`flex-1 ${isDark ? "bg-purple-800 hover:bg-purple-900" : "bg-cyan-800 hover:bg-cyan-900"}`}
            >
              <Pause className="h-4 w-4 mr-2" />
              Stop Circuit
            </Button>
            <Button
              onClick={resetCircuit}
              variant="outline"
              className={`${isDark ? "border-purple-500/50 text-purple-300" : "border-cyan-500/50 text-cyan-700"}`}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
