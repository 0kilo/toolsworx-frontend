"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CalendarDays, ArrowRightLeft, Clock, Plus, Trash2 } from "lucide-react"
import {
  getDateInfo,
  addMultipleDurations,
  calculateDateDifference,
  getCalendarData,
  type DurationEntry
} from "@/lib/tools/logic/unit-conversions/date-time"
import { AboutDescription } from "@/components/ui/about-description"
import toolContent from "./date-time.json"

export default function DateTimeCalculatorClient() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"single" | "add" | "difference">("single")

  // Single date state
  const [singleDate, setSingleDate] = useState("")

  // Add duration state
  const [addDate, setAddDate] = useState("")
  const [durations, setDurations] = useState<DurationEntry[]>([])
  const [currentAmount, setCurrentAmount] = useState("")
  const [currentUnit, setCurrentUnit] = useState<"days" | "weeks" | "months" | "years">("days")

  // Date difference state
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Results
  const singleDateResult = singleDate ? getDateInfo(singleDate) : null
  const addDurationResult = addDate && durations.length > 0 ? addMultipleDurations(addDate, durations) : null
  const dateDiffResult = startDate && endDate ? calculateDateDifference(startDate, endDate) : null

  // Calendar for single date
  const calendarData = singleDateResult ? getCalendarData(singleDateResult.date.getFullYear(), singleDateResult.date.getMonth()) : null

  // Calendar for add duration result
  const addCalendarData = addDurationResult ? getCalendarData(addDurationResult.resultDate.getFullYear(), addDurationResult.resultDate.getMonth()) : null

  const addDurationEntry = () => {
    const amount = parseInt(currentAmount, 10)
    if (!currentAmount || isNaN(amount) || amount === 0) return
    
    const newEntry: DurationEntry = {
      id: Date.now().toString(),
      amount,
      unit: currentUnit
    }
    
    setDurations([...durations, newEntry])
    setCurrentAmount("")
  }

  const removeDurationEntry = (id: string) => {
    setDurations(durations.filter(d => d.id !== id))
  }

  const clearDurations = () => {
    setDurations([])
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Date-Time Calculator</h1>
            <p className="text-muted-foreground">
              Calculate dates, add durations, and find time between dates
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="single">Single Date</TabsTrigger>
              <TabsTrigger value="add">Add Duration</TabsTrigger>
              <TabsTrigger value="difference">Date Difference</TabsTrigger>
            </TabsList>

            {/* Single Date Tab */}
            <TabsContent value="single" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Single Date Calculator
                  </CardTitle>
                  <CardDescription>
                    Enter a date to see the day of the week and calendar view
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="single-date">Select Date</Label>
                    <Input
                      id="single-date"
                      type="date"
                      value={singleDate}
                      onChange={(e) => setSingleDate(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>

                  {singleDateResult && (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Day of Week</div>
                        <div className="text-2xl font-bold">{singleDateResult.dayName}</div>
                        <div className="text-muted-foreground">{singleDateResult.formatted}</div>
                      </div>

                      {calendarData && (
                        <div className="border rounded-lg p-4">
                          <div className="text-center font-semibold mb-4">
                            {calendarData.monthName} {calendarData.year}
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-center text-sm">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                              <div key={day} className="font-medium text-muted-foreground p-2">
                                {day}
                              </div>
                            ))}
                            {calendarData.weeks.flat().map((weekDay, idx) => (
                              <div
                                key={idx}
                                className={`p-2 rounded ${
                                  !weekDay
                                    ? ''
                                    : weekDay.isToday
                                    ? 'bg-primary text-primary-foreground font-bold'
                                    : weekDay.isCurrentMonth
                                    ? 'hover:bg-muted'
                                    : 'text-muted-foreground bg-muted/50'
                                } ${
                                  weekDay?.date.toISOString().split('T')[0] === singleDate
                                    ? 'ring-2 ring-primary'
                                    : ''
                                }`}
                              >
                                {weekDay?.day}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Add Duration Tab */}
            <TabsContent value="add" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Add Duration to Date
                  </CardTitle>
                  <CardDescription>
                    Add days, weeks, months, or years to a date. Add multiple durations concurrently.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="add-date">Start Date</Label>
                      <Input
                        id="add-date"
                        type="date"
                        value={addDate}
                        onChange={(e) => setAddDate(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="current-amount">Amount</Label>
                      <Input
                        id="current-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={currentAmount}
                        onChange={(e) => setCurrentAmount(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="current-unit">Unit</Label>
                      <Select value={currentUnit} onValueChange={(v) => setCurrentUnit(v as typeof currentUnit)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="weeks">Weeks</SelectItem>
                          <SelectItem value="months">Months</SelectItem>
                          <SelectItem value="years">Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={addDurationEntry} className="flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Duration
                    </Button>
                    {durations.length > 0 && (
                      <Button variant="outline" onClick={clearDurations}>
                        Clear All
                      </Button>
                    )}
                  </div>

                  {durations.length > 0 && (
                    <div className="space-y-2">
                      <Label>Durations</Label>
                      <div className="space-y-2">
                        {durations.map((entry) => (
                          <div
                            key={entry.id}
                            className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                          >
                            <span className="font-semibold flex-1">
                              {entry.amount} {entry.unit}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeDurationEntry(entry.id)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {addDurationResult && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground mb-1">Start Date</div>
                          <div className="font-semibold">{addDate}</div>
                        </div>
                        <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground mb-1">Result</div>
                          <div className="text-2xl font-bold">{addDurationResult.dayName}</div>
                          <div className="text-muted-foreground">{addDurationResult.formatted}</div>
                        </div>
                      </div>

                      {addCalendarData && (
                        <div className="border rounded-lg p-4">
                          <div className="text-center font-semibold mb-4">
                            {addCalendarData.monthName} {addCalendarData.year}
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-center text-sm">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                              <div key={day} className="font-medium text-muted-foreground p-2">
                                {day}
                              </div>
                            ))}
                            {addCalendarData.weeks.flat().map((weekDay, idx) => (
                              <div
                                key={idx}
                                className={`p-2 rounded ${
                                  !weekDay
                                    ? ''
                                    : weekDay.isToday
                                    ? 'bg-primary text-primary-foreground font-bold'
                                    : weekDay.isCurrentMonth
                                    ? 'hover:bg-muted'
                                    : 'text-muted-foreground bg-muted/50'
                                } ${
                                  weekDay?.date.toISOString().split('T')[0] === addDurationResult.iso
                                    ? 'ring-2 ring-primary'
                                    : ''
                                }`}
                              >
                                {weekDay?.day}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Date Difference Tab */}
            <TabsContent value="difference" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Date Difference Calculator
                  </CardTitle>
                  <CardDescription>
                    Find the time between two dates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {dateDiffResult && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Total Days</div>
                          <div className="text-2xl font-bold">{dateDiffResult.totalDays.toLocaleString()}</div>
                        </div>

                        <div className="p-4 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Weeks + Days</div>
                          <div className="text-xl font-bold">
                            {dateDiffResult.weeksAndDays.weeks}w {dateDiffResult.weeksAndDays.days}d
                          </div>
                        </div>

                        <div className="p-4 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Years + Months + Days</div>
                          <div className="text-lg font-bold">
                            {dateDiffResult.years}y {dateDiffResult.monthsAndDays.months}mo {dateDiffResult.monthsAndDays.days}d
                          </div>
                        </div>

                        <div className="p-4 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Full Breakdown</div>
                          <div className="text-lg font-bold">
                            {dateDiffResult.years}y {dateDiffResult.monthsAndDays.months}mo {dateDiffResult.monthsAndDays.weeks}w {dateDiffResult.monthsAndDays.days}d
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="font-semibold mb-2">Detailed Breakdown</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Years</div>
                            <div className="font-semibold">{dateDiffResult.years}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Months</div>
                            <div className="font-semibold">{dateDiffResult.years * 12 + dateDiffResult.monthsAndDays.months}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Weeks</div>
                            <div className="font-semibold">{dateDiffResult.weeksAndDays.weeks}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Total Hours</div>
                            <div className="font-semibold">{(dateDiffResult.totalDays * 24).toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <AboutDescription
            title="About Date-Time Calculator"
            description={toolContent.description}
            sections={toolContent.sections}
          />
        </div>

        <div className="lg:col-span-1">
          {/* Sidebar - can be used for quick tips or related tools */}
        </div>
      </div>
    </div>
  )
}
