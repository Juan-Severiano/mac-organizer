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
import { format, parseISO, isToday, isTomorrow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useSchedule } from "@/contexts/schedule-context"
import { useUsers } from "@/contexts/user-context"
import { toast } from "sonner"

export function ScheduleList() {
  const { schedules, isLoading, deleteSchedule } = useSchedule()
  const { users } = useUsers()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const getUserName = (userId: number) => {
    return users.find((user) => user.id === userId)?.name || "Desconhecido"
  }

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr)
    if (isToday(date)) return "Hoje"
    if (isTomorrow(date)) return "Amanhã"

    // Formatar data em português: "24 de abril de 2025"
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  const formatTime = (timeStr: string) => {
    // Converter string de tempo (HH:MM:SS) para objeto Date para formatação
    const [hours, minutes] = timeStr.split(":").map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0)

    // Formatar hora em português (formato 24h): "14:30"
    return format(date, "HH:mm", { locale: ptBR })
  }

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      const success = await deleteSchedule(id)
      if (success) {
        toast.success("Agendamento excluído com sucesso")
      } else {
        throw new Error("Falha ao excluir agendamento")
      }
    } catch (error) {
      toast.error("Não foi possível excluir o agendamento")
    } finally {
      setDeletingId(null)
    }
  }

  const now = new Date()

  const sortedSchedules = [...schedules]
    .filter((schedule) => {
      const [year, month, day] = schedule.date.split("T")[0].split("-").map(Number)
      const [endHour, endMinute] = schedule.endTime.split(":").map(Number)

      const endDateTime = new Date(year, month - 1, day, endHour, endMinute)

      return endDateTime > now
    })
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
        <CardContent className="text-center text-muted-foreground">Nenhum agendamento encontrado</CardContent>
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
                  {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
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
                  <AlertDialogTitle>Excluir Agendamento</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(schedule.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deletingId === schedule.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Excluir"}
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
