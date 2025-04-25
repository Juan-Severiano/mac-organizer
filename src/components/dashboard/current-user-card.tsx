"use client"

import { useState } from "react"
import { useCurrentUser } from "@/contexts/current-user-context"
import { useUsers } from "@/contexts/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

export function CurrentUserCard() {
  const { currentUser, isLoading, setCurrentUser } = useCurrentUser()
  const { users } = useUsers()
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUserChange = async () => {
    if (!selectedUserId) return

    setIsUpdating(true)
    try {
      await setCurrentUser(Number.parseInt(selectedUserId))
      toast.success("Usuário atualizado com sucesso")
    } catch (error) {
      toast.error("Falha ao atualizar o usuário")
    } finally {
      setIsUpdating(false)
      setSelectedUserId("")
    }
  }

  const formatSince = (dateStr: string | undefined) => {
    if (!dateStr) return ""

    try {
      const date = parseISO(dateStr)
      return format(date, "'desde' d 'de' MMMM 'às' HH:mm", { locale: ptBR })
    } catch (error) {
      return ""
    }
  }

  return (
    <Card className="overflow-hidden border-2 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Usuário Atual do Mac</CardTitle>
        <CardDescription>Quem está usando o Mac compartilhado no momento</CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium text-muted-foreground">Atualmente usando o Mac:</div>
              <div className="text-3xl font-semibold">{currentUser?.user.name || "Ninguém"}</div>
              
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-sm font-medium">Alterar usuário atual:</div>
              <div className="flex gap-3">
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="w-full">
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
                <Button onClick={handleUserChange} disabled={!selectedUserId || isUpdating} className="min-w-24">
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Atualizar"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
