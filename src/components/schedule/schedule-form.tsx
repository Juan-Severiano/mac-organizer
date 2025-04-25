"use client"

import type React from "react"

import { useState } from "react"
import { useSchedule } from "@/contexts/schedule-context"
import { useUsers } from "@/contexts/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type TimeOption = {
  value: string
  label: string
}

const generateTimeOptions = (): TimeOption[] => {
  const options: TimeOption[] = []
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const h = hour.toString().padStart(2, "0")
      const m = minute.toString().padStart(2, "0")
      const value = `${h}:${m}:00`

      const label = `${h}:${minute.toString().padStart(2, "0")}`

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

    if (!userId || !date || !startTime || !endTime) {
      setError("Por favor, preencha todos os campos")
      return
    }

    if (startTime >= endTime) {
      setError("O horário de término deve ser posterior ao horário de início")
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
        toast.success("Agendamento criado com sucesso")

        setUserId("")
        setDate(undefined)
        setStartTime("")
        setEndTime("")
      } else {
        setError(result.error || "Falha ao criar agendamento")
      }
    } catch (error) {
      setError("Ocorreu um erro inesperado")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl border-2 bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Criar Novo Agendamento</CardTitle>
        <CardDescription>Reserve um horário no Mac compartilhado</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="user">Usuário</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger id="user" className="w-full">
                <SelectValue placeholder="Selecione um usuário" />
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
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={ptBR}
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
              <Label htmlFor="startTime">Horário de Início</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger id="startTime" className="w-full">
                  <SelectValue placeholder="Selecione o horário">
                    {startTime ? (
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {timeOptions.find((t) => t.value === startTime)?.label}
                      </div>
                    ) : (
                      "Selecione o horário"
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
              <Label htmlFor="endTime">Horário de Término</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger id="endTime" className="w-full">
                  <SelectValue placeholder="Selecione o horário">
                    {endTime ? (
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {timeOptions.find((t) => t.value === endTime)?.label}
                      </div>
                    ) : (
                      "Selecione o horário"
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
                Criando Agendamento...
              </>
            ) : (
              "Criar Agendamento"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
