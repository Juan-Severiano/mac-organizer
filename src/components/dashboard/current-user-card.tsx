"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useCurrentUser } from "@/contexts/current-user-context"
import { useUsers } from "@/contexts/user-context"
import { toast } from "sonner"

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
      toast.warning("User updated")
    } catch (error) {
      toast.warning("User not")
    } finally {
      setIsUpdating(false)
      setSelectedUserId("")
    }
  }

  return (
    <Card className="overflow-hidden border-2 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Usuário do Mac atual</CardTitle>
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
              <div className="text-3xl font-semibold">{currentUser?.user.name || "No one"}</div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-sm font-medium">Change current user:</div>
              <div className="flex gap-3">
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="w-full">
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
                <Button onClick={handleUserChange} disabled={!selectedUserId || isUpdating} className="min-w-24">
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
