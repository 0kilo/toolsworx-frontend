"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AboutDescription } from "@/components/ui/about-description"
import { Clock, Copy, Check } from "lucide-react"
import { timestampToDate, dateToTimestamp, getCurrentTimestamp } from "@/lib/tools/logic/dev-tools/tool-timestamp"
import toolContent from "./timestamp.json"

export default function TimestampClient() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [inputTimestamp, setInputTimestamp] = useState("")
  const [inputDate, setInputDate] = useState("")
  const [convertedDate, setConvertedDate] = useState("")
  const [convertedTimestamp, setConvertedTimestamp] = useState("")
  const [copied, setCopied] = useState("")

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleTimestampToDate = () => {
    try {
      const result = timestampToDate({ timestamp: parseInt(inputTimestamp) })
      setConvertedDate(result.date)
    } catch (error) {
      setConvertedDate("Invalid timestamp")
    }
  }

  const handleDateToTimestamp = () => {
    try {
      const result = dateToTimestamp({ date: inputDate })
      setConvertedTimestamp(result.timestamp.toString())
    } catch (error) {
      setConvertedTimestamp("Invalid date")
    }
  }

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(""), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const currentTimestamp = getCurrentTimestamp()

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

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Current Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Timestamp</Label>
                  <div className="flex gap-2">
                    <Input value={currentTimestamp} readOnly />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopy(currentTimestamp.toString(), "current-timestamp")}
                    >
                      {copied === "current-timestamp" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Current Date</Label>
                  <div className="flex gap-2">
                    <Input value={currentTime.toISOString()} readOnly />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopy(currentTime.toISOString(), "current-date")}
                    >
                      {copied === "current-date" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timestamp Conversion</CardTitle>
              <CardDescription>
                Convert between Unix timestamps and ISO dates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Timestamp to Date</h3>
                  <div className="space-y-2">
                    <Label htmlFor="timestamp-input">Unix Timestamp</Label>
                    <Input
                      id="timestamp-input"
                      placeholder="1640995200"
                      value={inputTimestamp}
                      onChange={(e) => setInputTimestamp(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleTimestampToDate} className="w-full">
                    Convert to Date
                  </Button>
                  {convertedDate && (
                    <div className="space-y-2">
                      <Label>Result</Label>
                      <div className="flex gap-2">
                        <Input value={convertedDate} readOnly />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopy(convertedDate, "converted-date")}
                        >
                          {copied === "converted-date" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Date to Timestamp</h3>
                  <div className="space-y-2">
                    <Label htmlFor="date-input">ISO Date</Label>
                    <Input
                      id="date-input"
                      type="datetime-local"
                      value={inputDate}
                      onChange={(e) => setInputDate(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleDateToTimestamp} className="w-full">
                    Convert to Timestamp
                  </Button>
                  {convertedTimestamp && (
                    <div className="space-y-2">
                      <Label>Result</Label>
                      <div className="flex gap-2">
                        <Input value={convertedTimestamp} readOnly />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopy(convertedTimestamp, "converted-timestamp")}
                        >
                          {copied === "converted-timestamp" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>


          <AboutDescription
            title={toolContent.aboutTitle}
            description={toolContent.aboutDescription}
            sections={toolContent.sections as any}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}