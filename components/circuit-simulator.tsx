"use client"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CircuitBoard, Play, Pause, Trash2 } from "lucide-react"

interface Component {
  id: string
  type: string
  symbol: string
  name: string
  x: number
  y: number
  rotation: number
  properties: Record<string, any>
}

interface Wire {
  id: string
  startX: number
  startY: number
  endX: number
  endY: number
}

interface CircuitSimulatorProps {
  isDark: boolean
}

const componentLibrary = {
  basic: [
    { type: "resistor", symbol: "⟲", name: "Resistor", icon: "🔧" },
    { type: "capacitor", symbol: "⫸", name: "Capacitor", icon: "⚡" },
    { type: "inductor", symbol: "∿", name: "Inductor", icon: "🌀" },
    { type: "battery", symbol: "⊞", name: "Battery", icon: "🔋" },
    { type: "ground", symbol: "⏚", name: "Ground", icon: "🌍" },
    { type: "switch", symbol: "⧄", name: "Switch", icon: "🔘" },
  ],
  semiconductors: [
    { type: "diode", symbol: "▷|", name: "Diode", icon: "💎" },
    { type: "led", symbol: "▷|*", name: "LED", icon: "💡" },
    { type: "transistor", symbol: "⟨|⟩", name: "Transistor", icon: "🔺" },
    { type: "mosfet", symbol: "⟨||⟩", name: "MOSFET", icon: "🔲" },
  ],
  sources: [
    { type: "dc_voltage", symbol: "⊕", name: "DC Voltage", icon: "⚡" },
    { type: "ac_voltage", symbol: "∿", name: "AC Voltage", icon: "〰️" },
    { type: "current_source", symbol: "⊙", name: "Current Source", icon: "🔄" },
    { type: "signal_gen", symbol: "⟨∿⟩", name: "Signal Generator", icon: "📡" },
  ],
  measurement: [
    { type: "voltmeter", symbol: "V", name: "Voltmeter", icon: "📊" },
    { type: "ammeter", symbol: "A", name: "Ammeter", icon: "📈" },
    { type: "oscilloscope", symbol: "〰", name: "Oscilloscope", icon: "📺" },
    { type: "multimeter", symbol: "⚡V", name: "Multimeter", icon: "🔍" },
  ],
  logic: [
    { type: "and_gate", symbol: "∧", name: "AND Gate", icon: "🚪" },
    { type: "or_gate", symbol: "∨", name: "OR Gate", icon: "🔀" },
    { type: "not_gate", symbol: "¬", name: "NOT Gate", icon: "🚫" },
    { type: "xor_gate", symbol: "⊕", name: "XOR Gate", icon: "⚡" },
  ],
}

export default function CircuitSimulator({ isDark }: CircuitSimulatorProps) {
  const [components, setComponents] = useState<Component[]>([])
  const [wires, setWires] = useState<Wire[]>([])
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const addComponent = useCallback((type: string, symbol: string, name: string) => {
    const newComponent: Component = {
      id: `${type}_${Date.now()}`,
      type,
      symbol,
      name,
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50,
      rotation: 0,
      properties: {},
    }
    setComponents((prev) => [...prev, newComponent])
  }, [])

  const deleteComponent = useCallback((id: string) => {
    setComponents((prev) => prev.filter((comp) => comp.id !== id))
    setWires((prev) => prev.filter((wire) => !wire.id.includes(id)))
  }, [])

  const clearCircuit = useCallback(() => {
    setComponents([])
    setWires([])
    setSelectedComponent(null)
    setIsSimulating(false)
  }, [])

  const toggleSimulation = useCallback(() => {
    setIsSimulating((prev) => !prev)
  }, [])

  const handleComponentDrag = useCallback((id: string, newX: number, newY: number) => {
    setComponents((prev) => prev.map((comp) => (comp.id === id ? { ...comp, x: newX, y: newY } : comp)))
  }, [])

  const ComponentLibraryTab = ({
    category,
    components: categoryComponents,
  }: {
    category: string
    components: typeof componentLibrary.basic
  }) => (
    <ScrollArea className="h-48">
      <div className="grid grid-cols-2 gap-2 p-2">
        {categoryComponents.map((comp) => (
          <Button
            key={comp.type}
            variant="outline"
            className={`h-16 flex flex-col items-center justify-center text-xs ${
              isDark ? "hover:bg-purple-800/30" : "hover:bg-cyan-100/30"
            }`}
            onClick={() => addComponent(comp.type, comp.symbol, comp.name)}
          >
            <span className="text-lg mb-1">{comp.symbol}</span>
            <span className="text-xs">{comp.name}</span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  )

  return (
    <Card
      className={`max-w-6xl mx-auto ${
        isDark ? "bg-black/30 border-purple-500/30" : "bg-white/30 border-cyan-500/30"
      } backdrop-blur-sm shadow-xl`}
    >
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isDark ? "text-purple-300" : "text-cyan-600"}`}>
          <CircuitBoard className="h-5 w-5" />
          Advanced Circuit Simulator
        </CardTitle>
        <CardDescription className={`${isDark ? "text-purple-200/80" : "text-cyan-700/80"}`}>
          Drag and drop electrical components to build and simulate circuits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          {/* Component Library */}
          <div className="w-80">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic" className="text-xs">
                  Basic
                </TabsTrigger>
                <TabsTrigger value="semiconductors" className="text-xs">
                  Semi
                </TabsTrigger>
                <TabsTrigger value="sources" className="text-xs">
                  Sources
                </TabsTrigger>
              </TabsList>
              <TabsContent value="basic">
                <ComponentLibraryTab category="basic" components={componentLibrary.basic} />
              </TabsContent>
              <TabsContent value="semiconductors">
                <ComponentLibraryTab category="semiconductors" components={componentLibrary.semiconductors} />
              </TabsContent>
              <TabsContent value="sources">
                <ComponentLibraryTab category="sources" components={componentLibrary.sources} />
              </TabsContent>
            </Tabs>

            <Tabs defaultValue="measurement" className="w-full mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="measurement" className="text-xs">
                  Measure
                </TabsTrigger>
                <TabsTrigger value="logic" className="text-xs">
                  Logic
                </TabsTrigger>
              </TabsList>
              <TabsContent value="measurement">
                <ComponentLibraryTab category="measurement" components={componentLibrary.measurement} />
              </TabsContent>
              <TabsContent value="logic">
                <ComponentLibraryTab category="logic" components={componentLibrary.logic} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Circuit Canvas */}
          <div className="flex-1">
            <div
              ref={canvasRef}
              className={`relative w-full h-96 rounded-lg border-2 overflow-hidden ${
                isDark ? "border-purple-700/50 bg-gray-900/50" : "border-cyan-700/50 bg-gray-100/50"
              } shadow-inner`}
              style={{
                backgroundImage: `radial-gradient(circle, ${isDark ? "#4c1d95" : "#0891b2"} 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            >
              {/* Render Components */}
              {components.map((component) => (
                <div
                  key={component.id}
                  className={`absolute cursor-move select-none p-2 rounded border-2 text-center font-mono text-lg ${
                    selectedComponent === component.id
                      ? isDark
                        ? "border-purple-400 bg-purple-900/50"
                        : "border-cyan-400 bg-cyan-100/50"
                      : isDark
                        ? "border-purple-600/50 bg-gray-800/80"
                        : "border-cyan-600/50 bg-white/80"
                  } ${isSimulating && component.type === "led" ? "animate-pulse" : ""}`}
                  style={{
                    left: component.x,
                    top: component.y,
                    transform: `rotate(${component.rotation}deg)`,
                    minWidth: "60px",
                    minHeight: "40px",
                  }}
                  onClick={() => setSelectedComponent(component.id)}
                  onDoubleClick={() => deleteComponent(component.id)}
                  draggable
                  onDragEnd={(e) => {
                    const rect = canvasRef.current?.getBoundingClientRect()
                    if (rect) {
                      const newX = e.clientX - rect.left - 30
                      const newY = e.clientY - rect.top - 20
                      handleComponentDrag(component.id, newX, newY)
                    }
                  }}
                >
                  <div className="text-2xl">{component.symbol}</div>
                  <div className="text-xs mt-1">{component.name}</div>
                </div>
              ))}

              {/* Render Wires */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {wires.map((wire) => (
                  <line
                    key={wire.id}
                    x1={wire.startX}
                    y1={wire.startY}
                    x2={wire.endX}
                    y2={wire.endY}
                    stroke={isSimulating ? (isDark ? "#a855f7" : "#0891b2") : "#6b7280"}
                    strokeWidth="3"
                    className={isSimulating ? "animate-pulse" : ""}
                  />
                ))}
              </svg>

              {/* Circuit Status Indicator */}
              {isSimulating && (
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                    isDark ? "bg-purple-600 text-white" : "bg-cyan-600 text-white"
                  } animate-pulse`}
                >
                  ⚡ Simulating
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-2 mt-4">
              <Button
                onClick={toggleSimulation}
                className={`${isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-cyan-600 hover:bg-cyan-700"}`}
              >
                {isSimulating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isSimulating ? "Stop" : "Simulate"}
              </Button>
              <Button onClick={clearCircuit} variant="outline">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
              {selectedComponent && (
                <Button onClick={() => deleteComponent(selectedComponent)} variant="destructive">
                  Delete Selected
                </Button>
              )}
            </div>

            {/* Component Properties */}
            {selectedComponent && (
              <div
                className={`mt-4 p-4 rounded-lg border ${
                  isDark ? "border-purple-500/30 bg-purple-900/20" : "border-cyan-500/30 bg-cyan-100/20"
                }`}
              >
                <h3 className="font-semibold mb-2">Component Properties</h3>
                <p className="text-sm">Selected: {components.find((c) => c.id === selectedComponent)?.name}</p>
                <p className="text-xs text-gray-500 mt-1">Double-click component to delete, drag to move</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
