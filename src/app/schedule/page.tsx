import { ScheduleForm } from "@/components/schedule/schedule-form"

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Schedule Mac Usage</h1>
        <p className="text-muted-foreground">Reserve time slots for using the shared Mac</p>
      </div>

      <ScheduleForm />
    </div>
  )
}
