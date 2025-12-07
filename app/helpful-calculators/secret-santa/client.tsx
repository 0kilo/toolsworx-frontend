"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AboutDescription } from "@/components/ui/about-description"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Gift, Plus, Trash2, Shuffle, Mail, Copy, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { generateSecretSanta, type Participant, type Assignment } from "@/lib/tools/logic/helpful-calculators/helper-secret-santa"
import toolContent from "./secret-santa.json"

export default function SecretsantaClient() {
  const [eventName, setEventName] = useState("")
  const [budget, setBudget] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, name: "", email: "" },
    { id: 2, name: "", email: "" },
    { id: 3, name: "", email: "" }
  ])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [message, setMessage] = useState("")
  const [showAssignments, setShowAssignments] = useState(false)

  const addParticipant = () => {
    const newId = Math.max(...participants.map(p => p.id), 0) + 1
    setParticipants([...participants, { id: newId, name: "", email: "" }])
  }

  const removeParticipant = (id: number) => {
    setParticipants(participants.filter(p => p.id !== id))
  }

  const updateParticipant = (id: number, field: keyof Participant, value: string) => {
    setParticipants(participants.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const handleGenerate = () => {
    try {
      const result = generateSecretSanta({ participants })
      setAssignments(result.assignments)
      setMessage("Assignments generated! You can view them below or send emails to participants.")
    } catch (error: any) {
      alert(error.message)
    }
  }

  const copyAssignment = (assignment: Assignment) => {
    const text = `Secret Santa Assignment\n\nHello ${assignment.giver.name}!\n\nYou are the Secret Santa for: ${assignment.receiver.name}\n\nEvent: ${eventName || "Secret Santa Exchange"}\nBudget: ${budget ? `$${budget}` : "Not specified"}\nDate: ${eventDate || "TBD"}\n\nHappy gifting! 🎁`

    navigator.clipboard.writeText(text)
  }

  const copyAllEmails = () => {
    const emails = participants
      .filter(p => p.email.trim())
      .map(p => p.email)
      .join(", ")

    navigator.clipboard.writeText(emails)
  }

  const getEmailTemplate = (assignment: Assignment) => {
    return `mailto:${assignment.giver.email}?subject=Secret Santa Assignment - ${eventName || "Gift Exchange"}&body=Hello ${assignment.giver.name}!%0D%0A%0D%0AYou are the Secret Santa for: ${assignment.receiver.name}%0D%0A%0D%0AEvent: ${eventName || "Secret Santa Exchange"}%0D%0ABudget: ${budget ? `$${budget}` : "Not specified"}%0D%0ADate: ${eventDate || "TBD"}%0D%0A%0D%0AHappy gifting! 🎁`
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
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Set up your Secret Santa event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input
                  id="eventName"
                  placeholder="Office Secret Santa 2024"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="25"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Exchange Date</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Participants</CardTitle>
              <CardDescription>Add at least 3 participants with names and email addresses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participants.map((participant, index) => (
                  <div key={participant.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5 space-y-2">
                      <Label className="text-xs">Name</Label>
                      <Input
                        placeholder="John Doe"
                        value={participant.name}
                        onChange={(e) => updateParticipant(participant.id, "name", e.target.value)}
                      />
                    </div>
                    <div className="col-span-6 space-y-2">
                      <Label className="text-xs">Email</Label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={participant.email}
                        onChange={(e) => updateParticipant(participant.id, "email", e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeParticipant(participant.id)}
                        disabled={participants.length <= 3}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button variant="outline" onClick={addParticipant} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Participant
                </Button>

                <div className="flex gap-2">
                  <Button onClick={handleGenerate} className="flex-1" size="lg">
                    <Shuffle className="mr-2 h-4 w-4" />
                    Generate Assignments
                  </Button>
                  <Button
                    onClick={copyAllEmails}
                    variant="outline"
                    size="lg"
                    disabled={participants.filter(p => p.email.trim()).length === 0}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Emails
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {message && (
            <Alert className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {assignments.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Secret Santa Assignments</CardTitle>
                <CardDescription>
                  {assignments.length} assignments created. Send emails or copy individual assignments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAssignments(!showAssignments)}
                    className="w-full"
                  >
                    {showAssignments ? "Hide" : "Show"} All Assignments (Organizer View)
                  </Button>
                </div>

                {showAssignments && (
                  <div className="space-y-3 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 font-semibold mb-3">
                      ⚠️ Keep this secret! Only you (the organizer) should see this.
                    </p>
                    {assignments.map((assignment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                        <span className="text-sm">
                          <strong>{assignment.giver.name}</strong> → {assignment.receiver.name}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyAssignment(assignment)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="font-semibold">Send Individual Emails</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Click to open your email client with a pre-filled message for each participant
                  </p>
                  {assignments.map((assignment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{assignment.giver.name}</p>
                        <p className="text-sm text-muted-foreground">{assignment.giver.email}</p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <a href={getEmailTemplate(assignment)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>

                <Alert className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Note:</strong> This opens your default email client. For bulk automated emails,
                    consider using a service like SendGrid or Mailchimp. Never send all assignments in one
                    visible email thread!
                  </AlertDescription>
                </Alert>
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
