"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useSchedule } from "@/contexts/schedule-context"
import { useUsers } from "@/contexts/user-context"
import { toast } from "sonner"

type TimeOption = {
  value: string
  label: string
}

// Generate time options in 30-minute intervals
const generateTimeOptions = (): TimeOption[] => {
  const options: TimeOption[] = []
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const h = hour.toString().padStart(2, "0")
      const m = minute.toString().padStart(2, "0")
      const value = `${h}:${m}:00`

      // Format for display (12-hour clock)
      const displayHour = hour % 12 || 12
      const period = hour < 12 ? "AM" : "PM"
      const label = `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`

      options.push({ value, label })
    }
  }
  return options
}

const timeOptions = generateTimeOptions()

export function ScheduleForm() {
  const { createSchedule } = useSchedule()
  const { users } = useUsers()

  const [userId, setUserId] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!userId || !date || !startTime || !endTime) {
      setError("Please fill in all fields")
      return
    }

    if (startTime >= endTime) {
      setError("End time must be after start time")
      return
    }

    setIsSubmitting(true)

    try {
      const formattedDate = format(date, "yyyy-MM-dd")
      const result = await createSchedule({
        userId: Number.parseInt(userId),
        date: formattedDate,
        startTime,
        endTime,
      })

      if (result.success) {
        toast.success('criou porra')

        // Reset form
        setUserId("")
        setDate(undefined)
        setStartTime("")
        setEndTime("")
      } else {
        setError(result.error || "Failed to create schedule")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl border-2 bg-card shadow-sm">
      <CardHeader className="bg-primary/5">
        <CardTitle>Create New Schedule</CardTitle>
        <CardDescription>Reserve time on the shared Mac</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="user">User</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger id="user" className="w-full">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    return date < today
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger id="startTime" className="w-full">
                  <SelectValue placeholder="Select time">
                    {startTime ? (
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {timeOptions.find((t) => t.value === startTime)?.label}
                      </div>
                    ) : (
                      "Select time"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger id="endTime" className="w-full">
                  <SelectValue placeholder="Select time">
                    {endTime ? (
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {timeOptions.find((t) => t.value === endTime)?.label}
                      </div>
                    ) : (
                      "Select time"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time.value} value={time.value} disabled={Boolean(startTime && time.value <= startTime)}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Schedule...
              </>
            ) : (
              "Create Schedule"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
