"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChefHat, Plus, Trash2, Copy } from "lucide-react"

interface Ingredient {
  id: number
  amount: string
  unit: string
  name: string
}

export default function RecipeScalerPage() {
  const [recipeName, setRecipeName] = useState("")
  const [originalServings, setOriginalServings] = useState("4")
  const [targetServings, setTargetServings] = useState("8")
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, amount: "", unit: "", name: "" }
  ])
  const [scaledIngredients, setScaledIngredients] = useState<Ingredient[]>([])

  const addIngredient = () => {
    const newId = Math.max(...ingredients.map(i => i.id), 0) + 1
    setIngredients([...ingredients, { id: newId, amount: "", unit: "", name: "" }])
  }

  const removeIngredient = (id: number) => {
    setIngredients(ingredients.filter(i => i.id !== id))
  }

  const updateIngredient = (id: number, field: keyof Ingredient, value: string) => {
    setIngredients(ingredients.map(i =>
      i.id === id ? { ...i, [field]: value } : i
    ))
  }

  const parseAmount = (amount: string): number => {
    // Handle fractions like "1/2", "1 1/2", decimals, and whole numbers
    const trimmed = amount.trim()

    // Match patterns like "1 1/2" or "1/2"
    const mixedMatch = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/)
    if (mixedMatch) {
      const whole = parseInt(mixedMatch[1])
      const numerator = parseInt(mixedMatch[2])
      const denominator = parseInt(mixedMatch[3])
      return whole + (numerator / denominator)
    }

    // Match simple fraction like "1/2"
    const fractionMatch = trimmed.match(/^(\d+)\/(\d+)$/)
    if (fractionMatch) {
      const numerator = parseInt(fractionMatch[1])
      const denominator = parseInt(fractionMatch[2])
      return numerator / denominator
    }

    // Handle decimal or whole number
    return parseFloat(trimmed) || 0
  }

  const formatAmount = (num: number): string => {
    if (num === 0) return "0"

    // If it's a whole number, return it as is
    if (num % 1 === 0) return num.toString()

    // Common fractions
    const fractions: { [key: number]: string } = {
      0.25: "1/4",
      0.33: "1/3",
      0.5: "1/2",
      0.66: "2/3",
      0.75: "3/4"
    }

    const whole = Math.floor(num)
    const decimal = num - whole

    // Check if decimal part matches a common fraction (with tolerance)
    for (const [value, fraction] of Object.entries(fractions)) {
      if (Math.abs(decimal - parseFloat(value)) < 0.01) {
        return whole > 0 ? `${whole} ${fraction}` : fraction
      }
    }

    // Otherwise return as decimal rounded to 2 places
    return num.toFixed(2).replace(/\.?0+$/, '')
  }

  const scaleRecipe = () => {
    const original = parseFloat(originalServings) || 1
    const target = parseFloat(targetServings) || 1
    const multiplier = target / original

    const scaled = ingredients.map(ingredient => {
      const amount = parseAmount(ingredient.amount)
      const scaledAmount = amount * multiplier
      return {
        ...ingredient,
        amount: formatAmount(scaledAmount)
      }
    })

    setScaledIngredients(scaled)
  }

  const copyToClipboard = () => {
    const text = [
      `${recipeName} (${targetServings} servings)`,
      "",
      ...scaledIngredients.map(i =>
        `${i.amount} ${i.unit} ${i.name}`.trim()
      )
    ].join("\n")

    navigator.clipboard.writeText(text)
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Recipe Scaler</h1>
            <p className="text-muted-foreground">
              Scale recipe ingredients for any number of servings
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recipe Information</CardTitle>
              <CardDescription>Enter your recipe details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipeName">Recipe Name</Label>
                <Input
                  id="recipeName"
                  placeholder="Chocolate Chip Cookies"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originalServings">Original Servings</Label>
                  <Input
                    id="originalServings"
                    type="number"
                    placeholder="4"
                    value={originalServings}
                    onChange={(e) => setOriginalServings(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetServings">Target Servings</Label>
                  <Input
                    id="targetServings"
                    type="number"
                    placeholder="8"
                    value={targetServings}
                    onChange={(e) => setTargetServings(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
              <CardDescription>Enter amounts as numbers, fractions (1/2), or mixed (1 1/2)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-3 space-y-2">
                      <Label className="text-xs">Amount</Label>
                      <Input
                        placeholder="1 1/2"
                        value={ingredient.amount}
                        onChange={(e) => updateIngredient(ingredient.id, "amount", e.target.value)}
                      />
                    </div>
                    <div className="col-span-3 space-y-2">
                      <Label className="text-xs">Unit</Label>
                      <Input
                        placeholder="cups"
                        value={ingredient.unit}
                        onChange={(e) => updateIngredient(ingredient.id, "unit", e.target.value)}
                      />
                    </div>
                    <div className="col-span-5 space-y-2">
                      <Label className="text-xs">Ingredient</Label>
                      <Input
                        placeholder="flour"
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(ingredient.id)}
                        disabled={ingredients.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button variant="outline" onClick={addIngredient} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Ingredient
                </Button>

                <Button onClick={scaleRecipe} className="w-full" size="lg">
                  <ChefHat className="mr-2 h-4 w-4" />
                  Scale Recipe
                </Button>
              </div>
            </CardContent>
          </Card>

          {scaledIngredients.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Scaled Recipe</CardTitle>
                <CardDescription>
                  {recipeName || "Recipe"} - {targetServings} servings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scaledIngredients.map((ingredient) => (
                    <div key={ingredient.id} className="flex items-center p-3 bg-muted rounded-lg">
                      <span className="font-semibold min-w-[80px]">{ingredient.amount}</span>
                      <span className="min-w-[100px] text-muted-foreground">{ingredient.unit}</span>
                      <span>{ingredient.name}</span>
                    </div>
                  ))}
                </div>
                <Button onClick={copyToClipboard} className="w-full mt-4" variant="outline">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </Button>
              </CardContent>
            </Card>
          )}

          <FooterAd />

          <AboutDescription
            title="About Recipe Scaler"
            description="Easily scale recipe ingredients for any number of servings. Perfect for holiday cooking, meal prep, or adjusting recipes for different group sizes."
            sections={[
              {
                title: "How to Use",
                content: "Enter your recipe name and the original number of servings. Add each ingredient with its amount, unit, and name. You can use whole numbers (2), decimals (1.5), fractions (1/2), or mixed numbers (1 1/2). Then enter your target number of servings and click 'Scale Recipe' to automatically calculate the adjusted ingredient amounts."
              },
              {
                title: "Entering Amounts",
                content: "The calculator accepts multiple formats: whole numbers (2), decimals (1.5), simple fractions (1/2), and mixed numbers (1 1/2). Common fractions like 1/4, 1/3, 1/2, 2/3, and 3/4 are preserved in the output when possible for easier measuring."
              },
              {
                title: "Holiday Cooking Tips",
                content: "When cooking for holiday gatherings, remember that some recipes scale linearly while others (especially baked goods) may need adjustments. Baking times often don't scale proportionally - a doubled recipe may need only 50% more time. Always check for doneness using temperature or visual cues rather than relying solely on time."
              },
              {
                title: "Measurement Tips",
                content: "For best results, use measuring cups for dry ingredients and measuring spoons for small amounts. When scaling down recipes significantly (halving or quartering), be aware that spices and seasonings often don't scale linearly - start with the scaled amount and adjust to taste."
              },
              {
                title: "Common Conversions",
                content: "Keep in mind: 3 teaspoons = 1 tablespoon, 16 tablespoons = 1 cup, 2 cups = 1 pint, 2 pints = 1 quart, 4 quarts = 1 gallon. These conversions can help when scaling results in awkward measurements."
              },
            ]}
          />
        </div>

        <div className="lg:col-span-1">
          <SidebarAd />
        </div>
      </div>
    </div>
  )
}
