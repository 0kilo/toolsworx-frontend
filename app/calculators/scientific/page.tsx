"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AboutDescription } from "@/components/ui/about-description"
import { evaluate, derivative, simplify, parse, matrix, det, inv, transpose, multiply, add, subtract } from "mathjs"
import { Calculator, TrendingUp } from "lucide-react"

export default function ScientificCalculatorPage() {
  const [display, setDisplay] = useState("0")
  const [expression, setExpression] = useState("")
  const [lastResult, setLastResult] = useState<string | null>(null)
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg')
  const [history, setHistory] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'basic' | 'calculus' | 'matrix' | 'utilities'>('basic')
  
  // Format matrix for display
  const formatMatrix = (matrix: any): string => {
    if (typeof matrix === 'number') return matrix.toString()
    
    // Handle mathjs DenseMatrix objects
    let data = matrix
    if (matrix && matrix.mathjs === 'DenseMatrix' && matrix.data) {
      data = matrix.data
    }
    
    if (!Array.isArray(data)) return matrix.toString()
    
    const formatNumber = (num: number) => {
      if (Number.isInteger(num)) return num.toString()
      return parseFloat(num.toFixed(4)).toString()
    }
    
    if (Array.isArray(data[0])) {
      // 2D matrix
      const rows = data.map((row: number[]) => 
        '│ ' + row.map((val: number) => formatNumber(val).padStart(8)).join('  ') + ' │'
      )
      const width = rows[0].length
      const topBorder = '┌' + '─'.repeat(width - 2) + '┐'
      const bottomBorder = '└' + '─'.repeat(width - 2) + '┘'
      return [topBorder, ...rows, bottomBorder].join('\n')
    } else {
      // 1D array (vector)
      return '[ ' + data.map((val: number) => formatNumber(val)).join(', ') + ' ]'
    }
  }
  
  // Calculus states
  const [calcExpression, setCalcExpression] = useState("x^2 + 2*x + 1")
  const [calcVariable, setCalcVariable] = useState("x")
  const [calcResult, setCalcResult] = useState("")
  
  // Matrix states
  const [matrixA, setMatrixA] = useState("[[1, 2], [3, 4]]")
  const [matrixB, setMatrixB] = useState("[[5, 6], [7, 8]]")
  const [matrixResult, setMatrixResult] = useState("")
  
  // Utilities states
  const [recipeServings, setRecipeServings] = useState(4)
  const [targetServings, setTargetServings] = useState(6)
  const [santaNames, setSantaNames] = useState("Alice\nBob\nCharlie\nDiana")
  const [santaResult, setSantaResult] = useState("")
  const [holidayDate, setHolidayDate] = useState("2024-12-25")
  const [countdown, setCountdown] = useState("")

  const handleNumber = (num: string) => {
    if (display === "0" || lastResult !== null) {
      setDisplay(num)
      setExpression(num)
      setLastResult(null)
    } else {
      setDisplay(display + num)
      setExpression(expression + num)
    }
  }

  const handleOperator = (op: string) => {
    setExpression(expression + op)
    setDisplay(display + op)
    setLastResult(null)
  }

  const handleFunction = (func: string) => {
    const funcStr = angleMode === 'deg' && ['sin', 'cos', 'tan'].includes(func) 
      ? `${func}(` 
      : `${func}(`
    setExpression(expression + funcStr)
    setDisplay(display + funcStr)
    setLastResult(null)
  }

  const handleClear = () => {
    setDisplay("0")
    setExpression("")
    setLastResult(null)
  }

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
      setExpression(expression.slice(0, -1))
    } else {
      setDisplay("0")
      setExpression("")
    }
  }

  const handleEquals = () => {
    try {
      let expr = expression
      if (angleMode === 'deg') {
        expr = expr.replace(/sin\(/g, 'sin(pi/180*')
                  .replace(/cos\(/g, 'cos(pi/180*')
                  .replace(/tan\(/g, 'tan(pi/180*')
      }
      const result = evaluate(expr)
      const resultStr = typeof result === "number" ? result.toString() : result.toString()
      setDisplay(resultStr)
      setLastResult(resultStr)
      setHistory(prev => [...prev, `${expression} = ${resultStr}`].slice(-10))
      setExpression(resultStr)
    } catch (error) {
      setDisplay("Error")
      setExpression("")
    }
  }

  // Calculus functions
  const handleDerivative = () => {
    try {
      const expr = parse(calcExpression)
      const deriv = derivative(expr, calcVariable)
      const resultStr = deriv.toString()
      setDisplay(resultStr)
      setExpression(`d/d${calcVariable}(${calcExpression})`)
      setHistory(prev => [...prev, `d/d${calcVariable}(${calcExpression}) = ${resultStr}`].slice(-10))
      setCalcResult(`d/d${calcVariable}(${calcExpression}) = ${resultStr}`)
    } catch (error) {
      const errorMsg = "Error in derivative calculation"
      setDisplay(errorMsg)
      setExpression('')
      setCalcResult(errorMsg)
    }
  }

  const handleIntegral = () => {
    try {
      // Note: mathjs doesn't have built-in integration, this is a placeholder
      setCalcResult(`∫(${calcExpression})d${calcVariable} - Integration requires symbolic math library`)
    } catch (error) {
      setCalcResult("Error in integral calculation")
    }
  }

  const handleSimplify = () => {
    try {
      const expr = parse(calcExpression)
      const simplified = simplify(expr)
      const resultStr = simplified.toString()
      setDisplay(resultStr)
      setExpression(`simplify(${calcExpression})`)
      setHistory(prev => [...prev, `simplify(${calcExpression}) = ${resultStr}`].slice(-10))
      setCalcResult(`Simplified: ${resultStr}`)
    } catch (error) {
      const errorMsg = "Error in simplification"
      setDisplay(errorMsg)
      setExpression('')
      setCalcResult(errorMsg)
    }
  }

  // Utility functions
  const handleRecipeScale = () => {
    const scale = targetServings / recipeServings
    setDisplay(`Scale factor: ${scale.toFixed(2)}x`)
    setExpression(`Recipe scale: ${recipeServings} → ${targetServings} servings`)
    setHistory(prev => [...prev, `Recipe scale: ${scale.toFixed(2)}x (${recipeServings} → ${targetServings})`].slice(-10))
  }

  const handleSecretSanta = () => {
    const names = santaNames.split('\n').filter(name => name.trim())
    if (names.length < 2) {
      setSantaResult("Need at least 2 names")
      return
    }
    const shuffled = [...names].sort(() => Math.random() - 0.5)
    const pairs = names.map((giver, i) => `${giver} → ${shuffled[(i + 1) % shuffled.length]}`)
    const result = pairs.join('\n')
    setDisplay(result)
    setExpression('Secret Santa assignments')
    setSantaResult(result)
    setHistory(prev => [...prev, 'Secret Santa generated'].slice(-10))
  }

  const handleHolidayCountdown = () => {
    const target = new Date(holidayDate)
    const now = new Date()
    const diff = target.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    const result = days > 0 ? `${days} days until ${target.toDateString()}` : `${target.toDateString()} has passed`
    setDisplay(result)
    setExpression('Holiday countdown')
    setCountdown(result)
    setHistory(prev => [...prev, result].slice(-10))
  }

  // Matrix functions
  const handleMatrixOperation = (operation: string) => {
    try {
      const mA = evaluate(matrixA)
      const mB = evaluate(matrixB)
      
      let result
      let operationName = ''
      switch (operation) {
        case 'add':
          result = add(mA, mB)
          operationName = 'A + B'
          break
        case 'subtract':
          result = subtract(mA, mB)
          operationName = 'A - B'
          break
        case 'multiply':
          result = multiply(mA, mB)
          operationName = 'A × B'
          break
        case 'det_a':
          result = det(mA)
          operationName = 'det(A)'
          break
        case 'det_b':
          result = det(mB)
          operationName = 'det(B)'
          break
        case 'inv_a':
          result = inv(mA)
          operationName = 'A⁻¹'
          break
        case 'inv_b':
          result = inv(mB)
          operationName = 'B⁻¹'
          break
        case 'transpose_a':
          result = transpose(mA)
          operationName = 'Aᵀ'
          break
        case 'transpose_b':
          result = transpose(mB)
          operationName = 'Bᵀ'
          break
        default:
          result = "Unknown operation"
          operationName = 'Error'
      }
      
      const resultStr = typeof result === 'object' ? formatMatrix(result) : result.toString()
      setDisplay(resultStr)
      setExpression(operationName)
      setHistory(prev => [...prev, `${operationName} = ${resultStr.replace(/\n/g, ' ')}`].slice(-10))
      setMatrixResult(resultStr)
    } catch (error) {
      const errorMsg = `Error: ${error}`
      setDisplay(errorMsg)
      setExpression('')
      setMatrixResult(errorMsg)
    }
  }

  const basicButtons = [
    [
      { label: "sin", action: () => handleFunction("sin"), type: "function" },
      { label: "cos", action: () => handleFunction("cos"), type: "function" },
      { label: "tan", action: () => handleFunction("tan"), type: "function" },
      { label: "π", action: () => handleOperator("pi"), type: "constant" },
    ],
    [
      { label: "asin", action: () => handleFunction("asin"), type: "function" },
      { label: "acos", action: () => handleFunction("acos"), type: "function" },
      { label: "atan", action: () => handleFunction("atan"), type: "function" },
      { label: "e", action: () => handleOperator("e"), type: "constant" },
    ],
    [
      { label: "log", action: () => handleFunction("log10"), type: "function" },
      { label: "ln", action: () => handleFunction("log"), type: "function" },
      { label: "√", action: () => handleFunction("sqrt"), type: "function" },
      { label: "x²", action: () => handleOperator("^2"), type: "function" },
    ],
    [
      { label: "x^y", action: () => handleOperator("^"), type: "function" },
      { label: "!", action: () => handleFunction("factorial"), type: "function" },
      { label: "abs", action: () => handleFunction("abs"), type: "function" },
      { label: "mod", action: () => handleOperator(" mod "), type: "function" },
    ],
    [
      { label: "7", action: () => handleNumber("7"), type: "number" },
      { label: "8", action: () => handleNumber("8"), type: "number" },
      { label: "9", action: () => handleNumber("9"), type: "number" },
      { label: "÷", action: () => handleOperator("/"), type: "operator" },
    ],
    [
      { label: "4", action: () => handleNumber("4"), type: "number" },
      { label: "5", action: () => handleNumber("5"), type: "number" },
      { label: "6", action: () => handleNumber("6"), type: "number" },
      { label: "×", action: () => handleOperator("*"), type: "operator" },
    ],
    [
      { label: "1", action: () => handleNumber("1"), type: "number" },
      { label: "2", action: () => handleNumber("2"), type: "number" },
      { label: "3", action: () => handleNumber("3"), type: "number" },
      { label: "-", action: () => handleOperator("-"), type: "operator" },
    ],
    [
      { label: "0", action: () => handleNumber("0"), type: "number" },
      { label: ".", action: () => handleOperator("."), type: "number" },
      { label: "=", action: handleEquals, type: "equals" },
      { label: "+", action: () => handleOperator("+"), type: "operator" },
    ],
    [
      { label: "(", action: () => handleOperator("("), type: "operator" },
      { label: ")", action: () => handleOperator(")"), type: "operator" },
      { label: "C", action: handleClear, type: "clear" },
      { label: "⌫", action: handleBackspace, type: "backspace" },
    ],
  ]

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Advanced Scientific Calculator</h1>
            <p className="text-muted-foreground">
              Professional calculator with calculus, matrix operations, and advanced mathematical functions
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Advanced Scientific Calculator
              </CardTitle>
              <CardDescription>
                Professional calculator with calculus, matrix operations, and advanced mathematical functions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Control Bar */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <Button
                    variant={activeTab === 'basic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('basic')}
                  >
                    Basic
                  </Button>
                  <Button
                    variant={activeTab === 'calculus' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('calculus')}
                  >
                    Calculus
                  </Button>
                  <Button
                    variant={activeTab === 'matrix' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('matrix')}
                  >
                    Matrix
                  </Button>
                  <Button
                    variant={activeTab === 'utilities' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('utilities')}
                  >
                    Utilities
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={angleMode === 'deg' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAngleMode('deg')}
                  >
                    DEG
                  </Button>
                  <Button
                    variant={angleMode === 'rad' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAngleMode('rad')}
                  >
                    RAD
                  </Button>
                </div>
              </div>

              {/* Display - Always visible - Enlarged for matrix/calculus */}
              <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-6 min-h-[160px] border-2 border-slate-200 dark:border-slate-700 mb-4">
                <div className="w-full h-full flex flex-col">
                  <div className="text-sm text-muted-foreground mb-2 font-mono break-all">
                    {expression || " "}
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <pre className="text-lg font-bold font-mono whitespace-pre-wrap break-words leading-relaxed">
                      {display}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Dynamic Button Panel */}
              {activeTab === 'basic' && (
                <div className="space-y-2">
                  {basicButtons.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-4 gap-2">
                      {row.map((button, btnIndex) => (
                        <Button
                          key={btnIndex}
                          onClick={button.action}
                          variant={
                            button.type === "number"
                              ? "outline"
                              : button.type === "equals"
                              ? "default"
                              : button.type === "clear"
                              ? "destructive"
                              : button.type === "function"
                              ? "secondary"
                              : "outline"
                          }
                          className={`h-12 text-sm font-semibold ${
                            button.type === "equals" ? "bg-primary hover:bg-primary/90" : 
                            button.type === "memory" ? "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800" : ""
                          }`}
                        >
                          {button.label}
                        </Button>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'calculus' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">Calculus Operations</h3>
                    <p className="text-sm text-muted-foreground">Derivatives, integrals, limits, and symbolic mathematics</p>
                  </div>
                  
                  {/* Expression Input */}
                  <div className="space-y-2">
                    <Label htmlFor="calc-expression">Expression</Label>
                    <Input
                      id="calc-expression"
                      value={calcExpression}
                      onChange={(e) => setCalcExpression(e.target.value)}
                      placeholder="e.g., x^2 + 2*x + 1"
                      className="font-mono"
                    />
                  </div>

                  {/* Calculus Function Buttons */}
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground">Calculus Operations</div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={handleDerivative} variant="outline" size="sm" className="text-xs">
                        d/dx
                      </Button>
                      <Button onClick={handleIntegral} variant="outline" size="sm" className="text-xs">
                        ∫ dx
                      </Button>
                      <Button onClick={handleSimplify} variant="outline" size="sm" className="text-xs">
                        Simplify
                      </Button>
                      <Button onClick={() => setCalcExpression('expand(' + calcExpression + ')')} variant="outline" size="sm" className="text-xs">
                        Expand
                      </Button>
                    </div>
                  </div>

                  {/* Quick Insert Buttons */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Quick Insert</div>
                    <div className="grid grid-cols-4 gap-1">
                      {['sin(', 'cos(', 'tan(', 'ln('].map(func => (
                        <Button key={func} variant="outline" size="sm" className="h-8 text-xs" 
                          onClick={() => setCalcExpression(calcExpression + func)}>
                          {func.replace('(', '')}
                        </Button>
                      ))}
                      {['exp(', 'sqrt(', '^', 'pi'].map(func => (
                        <Button key={func} variant="outline" size="sm" className="h-8 text-xs" 
                          onClick={() => setCalcExpression(calcExpression + func)}>
                          {func.replace('(', '')}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p><strong>Examples:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>x^3 - 2*x^2 + x - 1 (polynomial)</li>
                      <li>sin(x)*cos(x) (trigonometric)</li>
                      <li>e^x * ln(x) (exponential/logarithmic)</li>
                      <li>sqrt(x^2 + 1) (radical expressions)</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'matrix' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">Matrix Operations</h3>
                    <p className="text-sm text-muted-foreground">Linear algebra operations on matrices</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="matrix-a">Matrix A</Label>
                      <Textarea
                        id="matrix-a"
                        value={matrixA}
                        onChange={(e) => setMatrixA(e.target.value)}
                        placeholder="[[1, 2], [3, 4]]"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="matrix-b">Matrix B</Label>
                      <Textarea
                        id="matrix-b"
                        value={matrixB}
                        onChange={(e) => setMatrixB(e.target.value)}
                        placeholder="[[5, 6], [7, 8]]"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <Button onClick={() => handleMatrixOperation('add')} variant="outline" size="sm">
                      A + B
                    </Button>
                    <Button onClick={() => handleMatrixOperation('subtract')} variant="outline" size="sm">
                      A - B
                    </Button>
                    <Button onClick={() => handleMatrixOperation('multiply')} variant="outline" size="sm">
                      A × B
                    </Button>
                    <Button onClick={() => handleMatrixOperation('det_a')} variant="outline" size="sm">
                      det(A)
                    </Button>
                    <Button onClick={() => handleMatrixOperation('det_b')} variant="outline" size="sm">
                      det(B)
                    </Button>
                    <Button onClick={() => handleMatrixOperation('inv_a')} variant="outline" size="sm">
                      A⁻¹
                    </Button>
                    <Button onClick={() => handleMatrixOperation('inv_b')} variant="outline" size="sm">
                      B⁻¹
                    </Button>
                    <Button onClick={() => handleMatrixOperation('transpose_a')} variant="outline" size="sm">
                      Aᵀ
                    </Button>
                    <Button onClick={() => handleMatrixOperation('transpose_b')} variant="outline" size="sm">
                      Bᵀ
                    </Button>
                  </div>



                  <div className="text-xs text-muted-foreground">
                    <p><strong>Matrix Format:</strong> Use JSON array notation like [[1, 2], [3, 4]] for a 2×2 matrix</p>
                    <p><strong>Operations:</strong> Addition, subtraction, multiplication, determinant, inverse, transpose</p>
                  </div>
                </div>
              )}

              {activeTab === 'utilities' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">Utility Tools</h3>
                    <p className="text-sm text-muted-foreground">Recipe scaler, Secret Santa generator, and holiday countdown</p>
                  </div>
                  
                  {/* Recipe Scaler */}
                  <div className="space-y-3 p-4 border rounded-lg">
                    <h4 className="font-medium">Recipe Scaler</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipe-servings">Original Servings</Label>
                        <Input
                          id="recipe-servings"
                          type="number"
                          value={recipeServings}
                          onChange={(e) => setRecipeServings(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="target-servings">Target Servings</Label>
                        <Input
                          id="target-servings"
                          type="number"
                          value={targetServings}
                          onChange={(e) => setTargetServings(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <Button onClick={handleRecipeScale} variant="outline" className="w-full">
                      Calculate Scale Factor
                    </Button>
                  </div>

                  {/* Secret Santa Generator */}
                  <div className="space-y-3 p-4 border rounded-lg">
                    <h4 className="font-medium">Secret Santa Generator</h4>
                    <div className="space-y-2">
                      <Label htmlFor="santa-names">Names (one per line)</Label>
                      <Textarea
                        id="santa-names"
                        value={santaNames}
                        onChange={(e) => setSantaNames(e.target.value)}
                        placeholder="Alice\nBob\nCharlie\nDiana"
                        rows={4}
                      />
                    </div>
                    <Button onClick={handleSecretSanta} variant="outline" className="w-full">
                      Generate Assignments
                    </Button>
                  </div>

                  {/* Holiday Countdown */}
                  <div className="space-y-3 p-4 border rounded-lg">
                    <h4 className="font-medium">Holiday Countdown</h4>
                    <div className="space-y-2">
                      <Label htmlFor="holiday-date">Holiday Date</Label>
                      <Input
                        id="holiday-date"
                        type="date"
                        value={holidayDate}
                        onChange={(e) => setHolidayDate(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleHolidayCountdown} variant="outline" className="w-full">
                      Calculate Countdown
                    </Button>
                  </div>
                </div>
              )}

              {/* History */}
              {history.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">History</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {history.slice(-5).map((item, index) => (
                      <div key={index} className="text-xs font-mono text-muted-foreground">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>


          <AboutDescription
            title="About Advanced Scientific Calculator"
            description="This professional-grade scientific calculator provides comprehensive mathematical capabilities including basic arithmetic, advanced functions, calculus operations, and matrix algebra."
            sections={[
              {
                title: "Calculator Functions",
                content: [
                  "<strong>Trigonometric:</strong> sin, cos, tan, asin, acos, atan with degree/radian modes",
                  "<strong>Logarithmic:</strong> log₁₀, ln (natural log), exponential functions",
                  "<strong>Powers & Roots:</strong> x², x^y, √x, factorial, absolute value",
                  "<strong>Constants:</strong> π (pi), e (Euler's number)",
                  "<strong>Advanced:</strong> Modulo operations, complex expressions"
                ]
              },
              {
                title: "Calculus Operations",
                content: [
                  "<strong>Derivatives:</strong> Symbolic differentiation of mathematical expressions",
                  "<strong>Simplification:</strong> Algebraic simplification and expression manipulation",
                  "<strong>Expression Parsing:</strong> Support for complex mathematical notation"
                ]
              },
              {
                title: "Matrix Operations",
                content: [
                  "<strong>Basic Operations:</strong> Addition, subtraction, multiplication",
                  "<strong>Linear Algebra:</strong> Determinant, inverse, transpose",
                  "<strong>Matrix Format:</strong> JSON array notation for easy input"
                ]
              },
              {
                title: "Professional Applications",
                content: [
                  "<strong>Engineering:</strong> Complex calculations and matrix operations",
                  "<strong>Physics:</strong> Trigonometric and calculus computations",
                  "<strong>Mathematics:</strong> Symbolic math and algebraic manipulation",
                  "<strong>Computer Science:</strong> Linear algebra and numerical methods"
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
