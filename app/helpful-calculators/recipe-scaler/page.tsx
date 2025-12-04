"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AboutDescription } from "@/components/ui/about-description"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChefHat, Plus, Trash2, Copy } from "lucide-react"
import { scaleRecipe, type Ingredient } from "@/lib/tools/logic/helpful-calculators/helper-recipe"
import toolContent from "./recipe-scaler.json"

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

  const handleScale = () => {
    const result = scaleRecipe({
      ingredients,
      originalServings: parseFloat(originalServings) || 1,
      targetServings: parseFloat(targetServings) || 1
    })
    setScaledIngredients(result.scaledIngredients)
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
            <h1 className="text-3xl font-bold mb-2">{toolContent.pageTitle}</h1>
            <p className="text-muted-foreground">
              {toolContent.pageDescription}
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

                <Button onClick={handleScale} className="w-full" size="lg">
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


          <AboutDescription
            title={toolContent.aboutTitle}
            description={toolContent.aboutDescription}
            sections={toolContent.sections}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}
