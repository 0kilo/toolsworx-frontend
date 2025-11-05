"use client"

import { useState } from "react"
import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { evaluate } from "mathjs"
import { Delete } from "lucide-react"

export default function ScientificCalculatorPage() {
  const [display, setDisplay] = useState("0")
  const [expression, setExpression] = useState("")
  const [lastResult, setLastResult] = useState<string | null>(null)

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
    setExpression(expression + func + "(")
    setDisplay(display + func + "(")
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
      const result = evaluate(expression)
      const resultStr = typeof result === "number" ? result.toString() : result
      setDisplay(resultStr)
      setLastResult(resultStr)
      setExpression(resultStr)
    } catch (error) {
      setDisplay("Error")
      setExpression("")
    }
  }

  const buttons = [
    // Row 1
    [
      { label: "sin", action: () => handleFunction("sin"), type: "function" },
      { label: "cos", action: () => handleFunction("cos"), type: "function" },
      { label: "tan", action: () => handleFunction("tan"), type: "function" },
      { label: "π", action: () => handleOperator("pi"), type: "constant" },
    ],
    // Row 2
    [
      { label: "log", action: () => handleFunction("log"), type: "function" },
      { label: "ln", action: () => handleFunction("log"), type: "function" },
      { label: "√", action: () => handleFunction("sqrt"), type: "function" },
      { label: "x²", action: () => handleOperator("^2"), type: "function" },
    ],
    // Row 3
    [
      { label: "7", action: () => handleNumber("7"), type: "number" },
      { label: "8", action: () => handleNumber("8"), type: "number" },
      { label: "9", action: () => handleNumber("9"), type: "number" },
      { label: "÷", action: () => handleOperator("/"), type: "operator" },
    ],
    // Row 4
    [
      { label: "4", action: () => handleNumber("4"), type: "number" },
      { label: "5", action: () => handleNumber("5"), type: "number" },
      { label: "6", action: () => handleNumber("6"), type: "number" },
      { label: "×", action: () => handleOperator("*"), type: "operator" },
    ],
    // Row 5
    [
      { label: "1", action: () => handleNumber("1"), type: "number" },
      { label: "2", action: () => handleNumber("2"), type: "number" },
      { label: "3", action: () => handleNumber("3"), type: "number" },
      { label: "-", action: () => handleOperator("-"), type: "operator" },
    ],
    // Row 6
    [
      { label: "0", action: () => handleNumber("0"), type: "number" },
      { label: ".", action: () => handleOperator("."), type: "number" },
      { label: "=", action: handleEquals, type: "equals" },
      { label: "+", action: () => handleOperator("+"), type: "operator" },
    ],
    // Row 7
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
            <h1 className="text-3xl font-bold mb-2">Scientific Calculator</h1>
            <p className="text-muted-foreground">
              Advanced calculator with trigonometric, logarithmic, and other scientific functions
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Calculator</CardTitle>
              <CardDescription>
                Click buttons or type on your keyboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Display */}
              <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-6 min-h-[80px] flex items-center justify-end border-2 border-slate-200 dark:border-slate-700">
                <div className="text-right w-full">
                  <div className="text-sm text-muted-foreground mb-1 font-mono">
                    {expression || " "}
                  </div>
                  <div className="text-3xl font-bold font-mono break-all">
                    {display}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-2">
                {buttons.map((row, rowIndex) => (
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
                        className={`h-14 text-lg font-semibold ${
                          button.type === "equals" ? "bg-primary hover:bg-primary/90" : ""
                        }`}
                      >
                        {button.label}
                      </Button>
                    ))}
                  </div>
                ))}
              </div>

              {/* Info */}
              <div className="text-xs text-muted-foreground text-center pt-4 border-t">
                <p>
                  Supports: sin, cos, tan, log, ln, √, x², π, and basic arithmetic operations
                </p>
              </div>
            </CardContent>
          </Card>

          <FooterAd />

          {/* SEO Content */}
          <div className="mt-8 prose prose-sm max-w-none">
            <h2>About Scientific Calculator</h2>
            <p>
              A scientific calculator is an essential tool for students, engineers, scientists,
              and anyone working with advanced mathematical calculations. This online calculator
              provides all the functions you need without installing any software.
            </p>

            <h3>Supported Functions</h3>
            <ul>
              <li><strong>Trigonometric:</strong> sin, cos, tan (and their inverses)</li>
              <li><strong>Logarithmic:</strong> log (base 10), ln (natural log)</li>
              <li><strong>Powers & Roots:</strong> x², √x, custom powers</li>
              <li><strong>Constants:</strong> π (pi), e</li>
              <li><strong>Basic Operations:</strong> +, -, ×, ÷</li>
            </ul>

            <h3>How to Use</h3>
            <ol>
              <li>Click buttons to enter numbers and operations</li>
              <li>Use parentheses for complex expressions: (2+3)×4</li>
              <li>Scientific functions automatically add opening parenthesis</li>
              <li>Press = to calculate the result</li>
              <li>Press C to clear everything</li>
            </ol>

            <h3>Example Calculations</h3>
            <ul>
              <li><strong>sin(30):</strong> Sine of 30 degrees (use radians for accurate results)</li>
              <li><strong>log(100):</strong> Logarithm base 10 of 100 = 2</li>
              <li><strong>sqrt(16):</strong> Square root of 16 = 4</li>
              <li><strong>2^8:</strong> 2 to the power of 8 = 256</li>
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
