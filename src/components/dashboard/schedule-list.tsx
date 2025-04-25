"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Calendar, Clock, Loader2, Trash2, User } from "lucide-react"
import { format, parseISO, isToday, isTomorrow, isAfter } from "date-fns"
import { useSchedule } from "@/contexts/schedule-context"
import { useUsers } from "@/contexts/user-context"
import { toast } from "sonner"

export function ScheduleList() {
  const { schedules, isLoading, deleteSchedule } = useSchedule()
  const { users } = useUsers()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const getUserName = (userId: number) => {
    return users.find((user) => user.id === userId)?.name || "Unknown"
  }

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr)
    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    return format(date, "MMM d, yyyy")
  }

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      const success = await deleteSchedule(id)
      if (success) {
        toast.warning("deletado")
      } else {
        throw new Error("Failed to delete schedule")
      }
    } catch (error) {
      toast.warning("nao")
    } finally {
      setDeletingId(null)
    }
  }

  // Filter and sort schedules: today's first, then future dates
  const sortedSchedules = [...schedules]
    .filter(
      (schedule) =>
        isAfter(parseISO(schedule.date), new Date()) ||
        (isToday(parseISO(schedule.date)) && parseISO(`${schedule.date}T${schedule.endTime}`) > new Date()),
    )
    .sort((a, b) => {
      const dateA = parseISO(a.date)
      const dateB = parseISO(b.date)
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime()
      }
      return a.startTime.localeCompare(b.startTime)
    })

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (sortedSchedules.length === 0) {
    return (
      <Card className="flex h-32 items-center justify-center border-dashed">
        <CardContent className="text-center text-muted-foreground">No upcoming schedules found</CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {sortedSchedules.map((schedule) => (
        <Card key={schedule.id} className="overflow-hidden">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="font-medium">{getUserName(schedule.userId)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(schedule.date)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {format(parseISO(`2000-01-01T${schedule.startTime}`), "h:mm a")} -
                  {format(parseISO(`2000-01-01T${schedule.endTime}`), "h:mm a")}
                </span>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this schedule? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(schedule.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deletingId === schedule.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
