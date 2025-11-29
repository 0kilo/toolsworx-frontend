"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AboutDescription } from "@/components/ui/about-description"
import { Orbit } from "lucide-react"

export default function SpaceTimeConverterClient() {
  const [x, setX] = useState("")
  const [t, setT] = useState("")
  const [v, setV] = useState("")
  const [xPrime, setXPrime] = useState("")
  const [tPrime, setTPrime] = useState("")
  const [gamma, setGamma] = useState("")
  const [beta, setBeta] = useState("")

  const c = 299792458 // Speed of light in m/s

  const calculateLorentzTransformation = () => {
    if (!x || !t || !v || isNaN(Number(x)) || isNaN(Number(t)) || isNaN(Number(v))) {
      setXPrime("")
      setTPrime("")
      setGamma("")
      setBeta("")
      return
    }

    const xVal = Number(x)
    const tVal = Number(t)
    const vVal = Number(v)

    // Prevent faster-than-light velocities
    if (Math.abs(vVal) >= c) {
      setXPrime("Invalid: v ≥ c")
      setTPrime("Invalid: v ≥ c")
      setGamma("∞")
      setBeta("≥ 1")
      return
    }

    const betaVal = vVal / c
    const gammaVal = 1 / Math.sqrt(1 - betaVal * betaVal)

    const xPrimeVal = gammaVal * (xVal - vVal * tVal)
    const tPrimeVal = gammaVal * (tVal - (vVal * xVal) / (c * c))

    setXPrime(xPrimeVal.toExponential(6))
    setTPrime(tPrimeVal.toExponential(6))
    setGamma(gammaVal.toFixed(6))
    setBeta(betaVal.toFixed(6))
  }

  useEffect(() => {
    calculateLorentzTransformation()
  }, [x, t, v])

  const clearValues = () => {
    setX("")
    setT("")
    setV("")
    setXPrime("")
    setTPrime("")
    setGamma("")
    setBeta("")
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Lorentz Transformation Calculator</h1>
            <p className="text-muted-foreground">
              Transform space-time coordinates between reference frames using special relativity
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Orbit className="h-5 w-5" />
                Lorentz Transformation
              </CardTitle>
              <CardDescription>
                Convert coordinates from one reference frame to another moving at velocity v
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Frame */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="x">Position x (meters)</Label>
                  <Input
                    id="x"
                    type="number"
                    placeholder="Enter x coordinate"
                    value={x}
                    onChange={(e) => setX(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t">Time t (seconds)</Label>
                  <Input
                    id="t"
                    type="number"
                    placeholder="Enter time"
                    value={t}
                    onChange={(e) => setT(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="v">Velocity v (m/s)</Label>
                  <Input
                    id="v"
                    type="number"
                    placeholder="Enter velocity"
                    value={v}
                    onChange={(e) => setV(e.target.value)}
                  />
                </div>
              </div>

              {/* Output Frame */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Transformed Coordinates (Moving Frame)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Position x' (meters)</Label>
                    <Input value={xPrime} readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Time t' (seconds)</Label>
                    <Input value={tPrime} readOnly className="bg-muted" />
                  </div>
                </div>
              </div>

              {/* Relativistic Factors */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Relativistic Factors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Lorentz Factor (γ)</Label>
                    <Input value={gamma} readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Beta (β = v/c)</Label>
                    <Input value={beta} readOnly className="bg-muted" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={clearValues} className="flex-1">
                  Clear
                </Button>
              </div>

              {/* Lorentz Transformation Graph */}
              <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                <h3 className="text-lg font-semibold mb-4">Lorentz Transformation Visualization</h3>
                <div className="w-full h-64 bg-white border rounded flex items-center justify-center relative overflow-hidden">
                  <svg width="100%" height="100%" viewBox="0 0 400 250" className="absolute inset-0">
                    {/* Grid */}
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* Axes */}
                    <line x1="50" y1="200" x2="350" y2="200" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                    <line x1="50" y1="200" x2="50" y2="50" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                    
                    {/* Arrow markers */}
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
                      </marker>
                    </defs>
                    
                    {/* Labels */}
                    <text x="360" y="205" className="text-sm fill-gray-600">x</text>
                    <text x="25" y="45" className="text-sm fill-gray-600">ct</text>
                    
                    {/* Light cone */}
                    <line x1="50" y1="200" x2="350" y2="50" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3"/>
                    <line x1="50" y1="200" x2="350" y2="350" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" clipPath="url(#clip)"/>
                    
                    {/* Original point (x, ct) */}
                    {x && t && (
                      <>
                        <circle 
                          cx={50 + Math.min(Math.max(Number(x) * 0.1, -250), 250)} 
                          cy={200 - Math.min(Math.max(Number(t) * c * 0.0001, -150), 150)} 
                          r="4" 
                          fill="#3b82f6" 
                        />
                        <text 
                          x={55 + Math.min(Math.max(Number(x) * 0.1, -250), 250)} 
                          y={195 - Math.min(Math.max(Number(t) * c * 0.0001, -150), 150)} 
                          className="text-xs fill-blue-600"
                        >
                          (x,t)
                        </text>
                      </>
                    )}
                    
                    {/* Transformed point (x', ct') */}
                    {xPrime && tPrime && !xPrime.includes('Invalid') && (
                      <>
                        <circle 
                          cx={50 + Math.min(Math.max(Number(xPrime) * 0.1, -250), 250)} 
                          cy={200 - Math.min(Math.max(Number(tPrime) * c * 0.0001, -150), 150)} 
                          r="4" 
                          fill="#ef4444" 
                        />
                        <text 
                          x={55 + Math.min(Math.max(Number(xPrime) * 0.1, -250), 250)} 
                          y={195 - Math.min(Math.max(Number(tPrime) * c * 0.0001, -150), 150)} 
                          className="text-xs fill-red-600"
                        >
                          (x',t')
                        </text>
                      </>
                    )}
                    
                    {/* Velocity line */}
                    {v && Number(v) !== 0 && (
                      <line 
                        x1="50" 
                        y1="200" 
                        x2={50 + 100} 
                        y2={200 - (Number(v) / c) * 100} 
                        stroke="#10b981" 
                        strokeWidth="2" 
                        strokeDasharray="5,5"
                      />
                    )}
                    
                    <defs>
                      <clipPath id="clip">
                        <rect x="0" y="0" width="400" height="250"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>The graph shows your input coordinates and their Lorentz transformation.</p>
                  <p className="mt-1">
                    <span className="text-blue-600">●</span> Original point (x,t) &nbsp;
                    <span className="text-red-600">●</span> Transformed point (x',t') &nbsp;
                    <span className="text-amber-600">■</span> Light cone &nbsp;
                    <span className="text-green-600">■</span> Velocity vector
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>


          <AboutDescription
            title="About Lorentz Transformation"
            description="The Lorentz transformation describes how space and time coordinates change between reference frames moving at constant velocities in special relativity."
            sections={[
              {
                title: "Transformation Equations",
                content: [
                  "x' = γ(x - vt) - Position transformation",
                  "t' = γ(t - vx/c²) - Time transformation",
                  "γ = 1/√(1 - v²/c²) - Lorentz factor",
                  "β = v/c - Velocity ratio to speed of light",
                  "c = 299,792,458 m/s - Speed of light (constant)"
                ]
              },
              {
                title: "Key Concepts",
                content: [
                  "Time Dilation: Moving clocks run slower (t' ≠ t)",
                  "Length Contraction: Moving objects appear shorter",
                  "Simultaneity: Events simultaneous in one frame may not be in another",
                  "Speed Limit: Nothing can travel faster than light (v < c)",
                  "Invariant Interval: s² = c²t² - x² remains constant"
                ]
              },
              {
                title: "Applications",
                content: [
                  "Particle Physics: High-energy particle interactions",
                  "GPS Satellites: Time corrections for accurate positioning",
                  "Astronomy: Understanding relativistic jets and pulsars",
                  "Nuclear Physics: Particle accelerator calculations",
                  "Cosmology: Understanding space-time and black holes"
                ]
              }
            ]}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}