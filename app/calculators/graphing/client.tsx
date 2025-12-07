"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AboutDescription } from "@/components/ui/about-description"
import { evaluate } from "mathjs"
import { Plus, Trash2, ZoomIn, ZoomOut, Home, Maximize, Minimize, Camera } from "lucide-react"
import toolContent from "./graphing.json"

interface FunctionData {
  id: string
  expression: string
  color: string
  visible: boolean
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"]

export default function GraphingCalculatorClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [functions, setFunctions] = useState<FunctionData[]>([
    { id: "1", expression: "sin(x)", color: COLORS[0], visible: true },
  ])
  const [newExpression, setNewExpression] = useState("")
  const [viewport, setViewport] = useState({
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
  })
  const [error, setError] = useState("")
  const [panelCollapsed, setPanelCollapsed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState("examples")

  // Mouse wheel and touch zoom
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const mouseX = (e.clientX - rect.left) / rect.width
      const mouseY = (e.clientY - rect.top) / rect.height
      
      const worldX = viewport.xMin + mouseX * (viewport.xMax - viewport.xMin)
      const worldY = viewport.yMax - mouseY * (viewport.yMax - viewport.yMin)
      
      const zoomFactor = e.deltaY > 0 ? 1.2 : 0.8
      const xRange = (viewport.xMax - viewport.xMin) * zoomFactor
      const yRange = (viewport.yMax - viewport.yMin) * zoomFactor
      
      setViewport({
        xMin: worldX - mouseX * xRange,
        xMax: worldX + (1 - mouseX) * xRange,
        yMin: worldY - (1 - mouseY) * yRange,
        yMax: worldY + mouseY * yRange,
      })
    }

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault()
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        )
        
        if (!canvas.dataset.lastDistance) {
          canvas.dataset.lastDistance = distance.toString()
          return
        }
        
        const lastDistance = parseFloat(canvas.dataset.lastDistance)
        const zoomFactor = distance > lastDistance ? 0.95 : 1.05
        
        const rect = canvas.getBoundingClientRect()
        const centerX = ((touch1.clientX + touch2.clientX) / 2 - rect.left) / rect.width
        const centerY = ((touch1.clientY + touch2.clientY) / 2 - rect.top) / rect.height
        
        const worldX = viewport.xMin + centerX * (viewport.xMax - viewport.xMin)
        const worldY = viewport.yMax - centerY * (viewport.yMax - viewport.yMin)
        
        const xRange = (viewport.xMax - viewport.xMin) * zoomFactor
        const yRange = (viewport.yMax - viewport.yMin) * zoomFactor
        
        setViewport({
          xMin: worldX - centerX * xRange,
          xMax: worldX + (1 - centerX) * xRange,
          yMin: worldY - (1 - centerY) * yRange,
          yMax: worldY + centerY * yRange,
        })
        
        canvas.dataset.lastDistance = distance.toString()
      }
    }

    const handleTouchEnd = () => {
      delete canvas.dataset.lastDistance
    }

    canvas.addEventListener('wheel', handleWheel, { passive: false })
    canvas.addEventListener('touchmove', handleTouch, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd)

    return () => {
      canvas.removeEventListener('wheel', handleWheel)
      canvas.removeEventListener('touchmove', handleTouch)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [viewport])

  // Draw the graph
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)

    // Calculate scales
    const xScale = width / (viewport.xMax - viewport.xMin)
    const yScale = height / (viewport.yMax - viewport.yMin)

    // Helper functions
    const toCanvasX = (x: number) => (x - viewport.xMin) * xScale
    const toCanvasY = (y: number) => height - (y - viewport.yMin) * yScale

    // Calculate optimal step sizes to prevent overcrowding
    const getOptimalStep = (range: number, targetTicks: number = 8) => {
      const rawStep = range / targetTicks
      const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)))
      const normalized = rawStep / magnitude
      
      let step
      if (normalized <= 1) step = magnitude
      else if (normalized <= 2) step = 2 * magnitude
      else if (normalized <= 5) step = 5 * magnitude
      else step = 10 * magnitude
      
      return step
    }

    // Get decimal places for formatting
    const getDecimalPlaces = (step: number) => {
      if (step >= 1) return 0
      return Math.max(0, -Math.floor(Math.log10(step)))
    }

    // Draw grid
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1

    // Vertical grid lines
    const xStep = getOptimalStep(viewport.xMax - viewport.xMin)
    const xDecimals = getDecimalPlaces(xStep)
    for (let x = Math.ceil(viewport.xMin / xStep) * xStep; x <= viewport.xMax; x += xStep) {
      ctx.beginPath()
      ctx.moveTo(toCanvasX(x), 0)
      ctx.lineTo(toCanvasX(x), height)
      ctx.stroke()
    }

    // Horizontal grid lines
    const yStep = getOptimalStep(viewport.yMax - viewport.yMin)
    const yDecimals = getDecimalPlaces(yStep)
    for (let y = Math.ceil(viewport.yMin / yStep) * yStep; y <= viewport.yMax; y += yStep) {
      ctx.beginPath()
      ctx.moveTo(0, toCanvasY(y))
      ctx.lineTo(width, toCanvasY(y))
      ctx.stroke()
    }

    // Draw axes
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2

    // X-axis
    if (viewport.yMin <= 0 && viewport.yMax >= 0) {
      ctx.beginPath()
      ctx.moveTo(0, toCanvasY(0))
      ctx.lineTo(width, toCanvasY(0))
      ctx.stroke()
    }

    // Y-axis
    if (viewport.xMin <= 0 && viewport.xMax >= 0) {
      ctx.beginPath()
      ctx.moveTo(toCanvasX(0), 0)
      ctx.lineTo(toCanvasX(0), height)
      ctx.stroke()
    }

    // Draw axis labels with proper spacing and precision
    ctx.fillStyle = "#000000"
    ctx.font = "11px sans-serif"
    
    // X-axis labels
    ctx.textAlign = "center"
    const xLabels: number[] = []
    for (let x = Math.ceil(viewport.xMin / xStep) * xStep; x <= viewport.xMax; x += xStep) {
      if (Math.abs(x) < xStep / 100) continue // Skip zero
      xLabels.push(x)
    }
    
    // Only draw labels if they won't overlap
    const minLabelSpacing = 40 // pixels
    const filteredXLabels = xLabels.filter((x, i) => {
      if (i === 0) return true
      const prevX = xLabels[i - 1]
      return Math.abs(toCanvasX(x) - toCanvasX(prevX)) >= minLabelSpacing
    })
    
    filteredXLabels.forEach(x => {
      const canvasX = toCanvasX(x)
      const canvasY = viewport.yMin <= 0 && viewport.yMax >= 0 ? toCanvasY(0) + 15 : height - 5
      ctx.fillText(x.toFixed(xDecimals), canvasX, canvasY)
    })

    // Y-axis labels
    ctx.textAlign = "right"
    const yLabels: number[] = []
    for (let y = Math.ceil(viewport.yMin / yStep) * yStep; y <= viewport.yMax; y += yStep) {
      if (Math.abs(y) < yStep / 100) continue // Skip zero
      yLabels.push(y)
    }
    
    // Only draw labels if they won't overlap
    const filteredYLabels = yLabels.filter((y, i) => {
      if (i === 0) return true
      const prevY = yLabels[i - 1]
      return Math.abs(toCanvasY(y) - toCanvasY(prevY)) >= 20
    })
    
    filteredYLabels.forEach(y => {
      const canvasX = viewport.xMin <= 0 && viewport.xMax >= 0 ? toCanvasX(0) - 5 : 15
      const canvasY = toCanvasY(y) + 4
      ctx.fillText(y.toFixed(yDecimals), canvasX, canvasY)
    })

    // Plot functions
    functions.forEach((func) => {
      if (!func.visible || !func.expression) return

      ctx.strokeStyle = func.color
      ctx.lineWidth = 2
      ctx.beginPath()

      let started = false
      const step = (viewport.xMax - viewport.xMin) / width

      for (let x = viewport.xMin; x <= viewport.xMax; x += step) {
        try {
          const y = evaluate(func.expression, { x })

          if (typeof y === "number" && isFinite(y)) {
            const canvasX = toCanvasX(x)
            const canvasY = toCanvasY(y)

            if (canvasY >= 0 && canvasY <= height) {
              if (!started) {
                ctx.moveTo(canvasX, canvasY)
                started = true
              } else {
                ctx.lineTo(canvasX, canvasY)
              }
            } else {
              started = false
            }
          } else {
            started = false
          }
        } catch (e) {
          started = false
        }
      }

      ctx.stroke()
    })
  }, [functions, viewport])

  const addFunction = () => {
    if (!newExpression.trim()) return

    // Test the expression
    try {
      evaluate(newExpression, { x: 0 })
      const colorIndex = functions.length % COLORS.length
      setFunctions([
        ...functions,
        {
          id: Date.now().toString(),
          expression: newExpression,
          color: COLORS[colorIndex],
          visible: true,
        },
      ])
      setNewExpression("")
      setError("")
    } catch (e: any) {
      setError(`Invalid expression: ${e.message}`)
    }
  }

  const removeFunction = (id: string) => {
    setFunctions(functions.filter((f) => f.id !== id))
  }

  const toggleFunction = (id: string) => {
    setFunctions(
      functions.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f))
    )
  }

  const zoomIn = () => {
    const xRange = viewport.xMax - viewport.xMin
    const yRange = viewport.yMax - viewport.yMin
    setViewport({
      xMin: viewport.xMin + xRange * 0.25,
      xMax: viewport.xMax - xRange * 0.25,
      yMin: viewport.yMin + yRange * 0.25,
      yMax: viewport.yMax - yRange * 0.25,
    })
  }

  const zoomOut = () => {
    const xRange = viewport.xMax - viewport.xMin
    const yRange = viewport.yMax - viewport.yMin
    setViewport({
      xMin: viewport.xMin - xRange * 0.25,
      xMax: viewport.xMax + xRange * 0.25,
      yMin: viewport.yMin - yRange * 0.25,
      yMax: viewport.yMax + yRange * 0.25,
    })
  }

  const resetView = () => {
    setViewport({
      xMin: -10,
      xMax: 10,
      yMin: -10,
      yMax: 10,
    })
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const takeSnapshot = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const link = document.createElement('a')
    link.download = `graph-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const insertFunction = (expr: string) => {
    setNewExpression(prev => prev + expr)
  }

  return (
    <div className={isFullscreen ? "fixed inset-0 z-50 bg-white" : "container py-8"}>
      {!isFullscreen && (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Graphing Calculator</h1>
          <p className="text-muted-foreground">
            Plot mathematical functions with symbolic expressions
          </p>
        </div>
      )}

      <div className="relative">
        {/* Full-width Graph */}
        <div className="w-full">
          <canvas
            ref={canvasRef}
            width={isFullscreen ? 1400 : 1000}
            height={isFullscreen ? 800 : 600}
            className="w-full border rounded-lg bg-white"
          />
        </div>

        {/* Floating Zoom Controls */}
        <TooltipProvider>
          <div className="absolute top-4 left-4 flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={zoomIn} className="bg-white/90 backdrop-blur">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={zoomOut} className="bg-white/90 backdrop-blur">
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={resetView} className="bg-white/90 backdrop-blur">
                  <Home className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset View</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={toggleFullscreen} className="bg-white/90 backdrop-blur">
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={takeSnapshot} className="bg-white/90 backdrop-blur">
                  <Camera className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Take Screenshot</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        {/* Floating Functions Panel */}
        <Card className={`absolute top-4 right-4 transition-all duration-300 bg-white/95 backdrop-blur ${
          panelCollapsed ? 'w-12' : 'w-80'
        }`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              {!panelCollapsed && <CardTitle className="text-sm">Functions</CardTitle>}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setPanelCollapsed(!panelCollapsed)}
                className="h-8 w-8 p-0"
              >
                {panelCollapsed ? <Plus className="h-4 w-4" /> : '−'}
              </Button>
            </div>
          </CardHeader>
          {!panelCollapsed && (
            <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
                {/* Add Function */}
                <div className="space-y-2">
                  <Label htmlFor="expression">New Function</Label>
                  <div className="flex gap-2">
                    <Input
                      id="expression"
                      placeholder="e.g., x^2, sin(x)"
                      value={newExpression}
                      onChange={(e) => setNewExpression(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addFunction()}
                    />
                    <Button size="icon" onClick={addFunction}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {error && (
                    <p className="text-xs text-destructive">{error}</p>
                  )}
                </div>

                {/* Function List */}
                <div className="space-y-2">
                  <Label>Active Functions</Label>
                  {functions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No functions yet</p>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {functions.map((func) => (
                        <div
                          key={func.id}
                          className="flex items-center gap-2 p-2 border rounded-lg"
                        >
                          <div
                            className="w-4 h-4 rounded cursor-pointer"
                            style={{
                              backgroundColor: func.visible ? func.color : "#d1d5db",
                            }}
                            onClick={() => toggleFunction(func.id)}
                          />
                          <code className="flex-1 text-sm font-mono truncate">
                            {func.expression}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeFunction(func.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tabbed Control Center */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex border-b">
                    <button 
                      className={`px-3 py-1 text-xs ${activeTab === 'examples' ? 'border-b-2 border-blue-500' : ''}`}
                      onClick={() => setActiveTab('examples')}
                    >
                      Examples
                    </button>
                    <button 
                      className={`px-3 py-1 text-xs ${activeTab === 'basic' ? 'border-b-2 border-blue-500' : ''}`}
                      onClick={() => setActiveTab('basic')}
                    >
                      Basic
                    </button>
                    <button 
                      className={`px-3 py-1 text-xs ${activeTab === 'advanced' ? 'border-b-2 border-blue-500' : ''}`}
                      onClick={() => setActiveTab('advanced')}
                    >
                      Advanced
                    </button>
                  </div>
                  
                  {activeTab === 'examples' && (
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p><code>x^2</code> - Quadratic</p>
                      <p><code>sin(x)</code> - Sine wave</p>
                      <p><code>cos(x)</code> - Cosine wave</p>
                      <p><code>tan(x)</code> - Tangent</p>
                      <p><code>sqrt(x)</code> - Square root</p>
                      <p><code>log(x)</code> - Logarithm</p>
                      <p><code>e^x</code> - Exponential</p>
                      <p><code>abs(x)</code> - Absolute value</p>
                    </div>
                  )}
                  
                  {activeTab === 'basic' && (
                    <div className="grid grid-cols-4 gap-1">
                      {['7','8','9','+','4','5','6','-','1','2','3','*','0','.','=','/'].map(key => (
                        <Button key={key} variant="outline" size="sm" className="h-8 text-xs" 
                          onClick={() => insertFunction(key === '=' ? '' : key)}>
                          {key}
                        </Button>
                      ))}
                      <Button variant="outline" size="sm" className="h-8 text-xs col-span-2" 
                        onClick={() => insertFunction('x')}>x</Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs" 
                        onClick={() => insertFunction('(')}>(</Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs" 
                        onClick={() => insertFunction(')')}>)</Button>
                    </div>
                  )}
                  
                  {activeTab === 'advanced' && (
                    <div className="grid grid-cols-2 gap-1">
                      {['sin(','cos(','tan(','asin(','acos(','atan(','log(','ln(','sqrt(','abs(','exp(','pi','e','^'].map(func => (
                        <Button key={func} variant="outline" size="sm" className="h-8 text-xs" 
                          onClick={() => insertFunction(func)}>
                          {func}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
            </CardContent>
          )}
        </Card>
      </div>


      <AboutDescription
        title={`About ${toolContent.title}`}
        description={toolContent.description}
        sections={toolContent.sections.map(section => ({
          title: section.title,
          content: section.content,
          type: section.type as 'list' | 'subsections' | undefined
        }))}
      />
      <div className="mt-8">
      </div>
    </div>
  )
}
