"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useUser } from "@auth0/nextjs-auth0"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  const { user, isLoading, error } = useUser()

  if (isLoading || !user) {
    return (
      <div className="container py-6 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Профиль</h1>
      </div>
          <Card>
            <CardHeader>
              <CardTitle>Профиль пользователя</CardTitle>
              <CardDescription>Личные данные и настройки</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-medium text-lg">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <a href="/auth/logout">
                <Button variant="outline">
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
                </Button>
              </a>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Удалить аккаунт</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Удаление аккаунта</DialogTitle>
                    <DialogDescription>
                      Данный функционал пока не реализован
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Отмена</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
    </div>
  )
}
