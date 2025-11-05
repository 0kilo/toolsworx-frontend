"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { evaluate } from "mathjs"
import { Plus, Trash2, ZoomIn, ZoomOut, Home } from "lucide-react"

interface FunctionData {
  id: string
  expression: string
  color: string
  visible: boolean
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"]

export default function GraphingCalculatorPage() {
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

    // Draw grid
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1

    // Vertical grid lines
    const xStep = Math.pow(10, Math.floor(Math.log10((viewport.xMax - viewport.xMin) / 10)))
    for (let x = Math.ceil(viewport.xMin / xStep) * xStep; x <= viewport.xMax; x += xStep) {
      ctx.beginPath()
      ctx.moveTo(toCanvasX(x), 0)
      ctx.lineTo(toCanvasX(x), height)
      ctx.stroke()
    }

    // Horizontal grid lines
    const yStep = Math.pow(10, Math.floor(Math.log10((viewport.yMax - viewport.yMin) / 10)))
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

    // Draw axis labels
    ctx.fillStyle = "#000000"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"

    // X-axis labels
    for (let x = Math.ceil(viewport.xMin / xStep) * xStep; x <= viewport.xMax; x += xStep) {
      if (Math.abs(x) < xStep / 10) continue // Skip zero
      const canvasX = toCanvasX(x)
      const canvasY = viewport.yMin <= 0 && viewport.yMax >= 0 ? toCanvasY(0) + 15 : height - 5
      ctx.fillText(x.toFixed(1), canvasX, canvasY)
    }

    // Y-axis labels
    ctx.textAlign = "right"
    for (let y = Math.ceil(viewport.yMin / yStep) * yStep; y <= viewport.yMax; y += yStep) {
      if (Math.abs(y) < yStep / 10) continue // Skip zero
      const canvasX = viewport.xMin <= 0 && viewport.xMax >= 0 ? toCanvasX(0) - 5 : 5
      const canvasY = toCanvasY(y) + 4
      ctx.fillText(y.toFixed(1), canvasX, canvasY)
    }

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

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Graphing Calculator</h1>
            <p className="text-muted-foreground">
              Plot mathematical functions with symbolic expressions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Graph Display */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Graph</CardTitle>
                <CardDescription>
                  Viewport: x=[{viewport.xMin.toFixed(1)}, {viewport.xMax.toFixed(1)}], y=[{viewport.yMin.toFixed(1)}, {viewport.yMax.toFixed(1)}]
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={500}
                    className="w-full border rounded-lg bg-white"
                  />
                </div>

                {/* Controls */}
                <div className="flex gap-2 mt-4 justify-center">
                  <Button variant="outline" size="sm" onClick={zoomIn}>
                    <ZoomIn className="h-4 w-4 mr-2" />
                    Zoom In
                  </Button>
                  <Button variant="outline" size="sm" onClick={zoomOut}>
                    <ZoomOut className="h-4 w-4 mr-2" />
                    Zoom Out
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetView}>
                    <Home className="h-4 w-4 mr-2" />
                    Reset View
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Functions Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Functions</CardTitle>
                <CardDescription>Add and manage functions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

                {/* Example Functions */}
                <div className="space-y-2 pt-4 border-t">
                  <Label>Example Functions</Label>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><code>x^2</code> - Quadratic</p>
                    <p><code>sin(x)</code> - Sine wave</p>
                    <p><code>cos(x)</code> - Cosine wave</p>
                    <p><code>tan(x)</code> - Tangent</p>
                    <p><code>sqrt(x)</code> - Square root</p>
                    <p><code>log(x)</code> - Logarithm</p>
                    <p><code>e^x</code> - Exponential</p>
                    <p><code>abs(x)</code> - Absolute value</p>
                    <p><code>x^3 - 2*x^2 + 3</code> - Polynomial</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <FooterAd />

          {/* SEO Content */}
          <div className="mt-8 prose prose-sm max-w-none">
            <h2>About Graphing Calculator</h2>
            <p>
              A graphing calculator is an essential tool for visualizing mathematical functions.
              Plot equations, analyze behavior, and understand mathematical relationships through
              interactive graphs.
            </p>

            <h3>Supported Functions</h3>
            <ul>
              <li><strong>Arithmetic:</strong> +, -, *, /, ^ (power)</li>
              <li><strong>Trigonometric:</strong> sin(x), cos(x), tan(x), asin(x), acos(x), atan(x)</li>
              <li><strong>Exponential & Logarithmic:</strong> exp(x), e^x, log(x), ln(x)</li>
              <li><strong>Other:</strong> sqrt(x), abs(x), ceil(x), floor(x), round(x)</li>
              <li><strong>Constants:</strong> pi, e</li>
            </ul>

            <h3>How to Use</h3>
            <ol>
              <li>Enter a mathematical expression using 'x' as the variable</li>
              <li>Click the '+' button or press Enter to add the function</li>
              <li>The function will be plotted on the graph with a unique color</li>
              <li>Add multiple functions to compare them</li>
              <li>Click the colored square to show/hide a function</li>
              <li>Use zoom controls to adjust the view</li>
              <li>Click the trash icon to remove a function</li>
            </ol>

            <h3>Tips</h3>
            <ul>
              <li>Use parentheses for complex expressions: (x+1)/(x-1)</li>
              <li>Combine functions: sin(x) + cos(2*x)</li>
              <li>Zoom in to see detail, zoom out for the big picture</li>
              <li>Toggle functions on/off to compare subsets</li>
              <li>Try different mathematical operations to explore</li>
            </ul>

            <h3>Example Expressions</h3>
            <ul>
              <li><strong>Parabola:</strong> x^2</li>
              <li><strong>Circle:</strong> sqrt(25 - x^2) and -sqrt(25 - x^2)</li>
              <li><strong>Exponential Growth:</strong> 2^x</li>
              <li><strong>Damped Oscillation:</strong> e^(-x) * sin(5*x)</li>
              <li><strong>Rational Function:</strong> 1/x</li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-1">
          <SidebarAd />
        </div>
      </div>
    </div>
  )
}
