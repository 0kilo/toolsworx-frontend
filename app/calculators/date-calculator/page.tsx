"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Plus } from "lucide-react"

export default function DateCalculatorPage() {
  const [startDate, setStartDate] = useState("")
  const [days, setDays] = useState("")
  const [endDateResult, setEndDateResult] = useState("")

  const [date1, setDate1] = useState("")
  const [date2, setDate2] = useState("")
  const [daysDifference, setDaysDifference] = useState("")

  const calculateEndDate = () => {
    if (!startDate || !days) return

    const start = new Date(startDate)
    const numDays = parseInt(days)
    
    if (isNaN(numDays)) return

    const result = new Date(start)
    result.setDate(start.getDate() + numDays)
    
    setEndDateResult(result.toISOString().split('T')[0])
  }

  const calculateDaysDifference = () => {
    if (!date1 || !date2) return

    const d1 = new Date(date1)
    const d2 = new Date(date2)
    
    const timeDiff = Math.abs(d2.getTime() - d1.getTime())
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    
    setDaysDifference(daysDiff.toString())
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Date Calculator</h1>
        <p className="text-muted-foreground">Calculate dates and time differences</p>
      </div>

      <Tabs defaultValue="add-days" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add-days">Add Days to Date</TabsTrigger>
          <TabsTrigger value="date-difference">Date Difference</TabsTrigger>
        </TabsList>

        <TabsContent value="add-days">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Days to Date
              </CardTitle>
              <CardDescription>
                Enter a start date and number of days to calculate the end date
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="days">Number of Days</Label>
                  <Input
                    id="days"
                    type="number"
                    placeholder="Enter days (can be negative)"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                  />
                </div>
              </div>
              
              <Button onClick={calculateEndDate} className="w-full">
                Calculate End Date
              </Button>

              {endDateResult && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <Label className="text-sm font-medium">Result:</Label>
                  <p className="text-lg font-semibold text-blue-700">
                    {new Date(endDateResult + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-blue-600">{endDateResult}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="date-difference">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calculate Date Difference
              </CardTitle>
              <CardDescription>
                Enter two dates to calculate the number of days between them
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date1">First Date</Label>
                  <Input
                    id="date1"
                    type="date"
                    value={date1}
                    onChange={(e) => setDate1(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="date2">Second Date</Label>
                  <Input
                    id="date2"
                    type="date"
                    value={date2}
                    onChange={(e) => setDate2(e.target.value)}
                  />
                </div>
              </div>
              
              <Button onClick={calculateDaysDifference} className="w-full">
                Calculate Difference
              </Button>

              {daysDifference && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <Label className="text-sm font-medium">Result:</Label>
                  <p className="text-lg font-semibold text-green-700">
                    {daysDifference} days
                  </p>
                  <p className="text-sm text-green-600">
                    Between {new Date(date1).toLocaleDateString()} and {new Date(date2).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Add Days to Date:</h3>
            <p className="text-sm text-muted-foreground">
              Enter a start date and the number of days to add (use negative numbers to subtract days). 
              The calculator will show you the resulting date.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Date Difference:</h3>
            <p className="text-sm text-muted-foreground">
              Enter two dates to calculate the absolute number of days between them. 
              The order doesn&apos;t matter - the result is always positive.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}