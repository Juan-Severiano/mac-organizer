import { ScheduleForm } from "@/components/schedule/schedule-form"

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Agendar Uso do Mac</h1>
        <p className="text-muted-foreground">Reserve horários para usar o Mac compartilhado</p>
      </div>

      <ScheduleForm />
    </div>
  )
}
