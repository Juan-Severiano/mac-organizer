"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Calendar } from "lucide-react"
import { AppleLogo } from "@/components/ui/apple-logo"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const today = new Date()

  const formattedDate = format(today, "EEEE, dd 'de' MMMM", { locale: ptBR })
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full">
        <div className="container mx-auto mt-2 px-4 py-4 bg-card/60 backdrop-blur-xl rounded-2xl">
          <div className="flex gap-4 flex-row items-center justify-between">
            <Link href='/' className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <AppleLogo className="h-5 w-5" />
                <span className="text-lg font-medium">Mac Organizer</span>
              </div>
              <p className="text-sm text-muted-foreground">{capitalizedDate}</p>
            </Link>

            {pathname !== "/schedule" && (
              <Button onClick={() => router.push("/schedule")} className="flex items-center gap-2 self-start">
                <Calendar className="h-4 w-4" />
                <span>Agendar</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-1">{children}</div>
      </main>

      <footer className="border-t py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">Mac Organizer &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}
