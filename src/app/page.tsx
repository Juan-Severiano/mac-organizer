import { CurrentUserCard } from "@/components/dashboard/current-user-card"
import { ScheduleList } from "@/components/dashboard/schedule-list"

export default function Home() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Visualize o uso atual do Mac e os próximos agendamentos</p>
      </div>

      <CurrentUserCard />

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-medium tracking-tight">Próximos Agendamentos</h2>
        <ScheduleList />
      </div>
    </div>
  )
}
