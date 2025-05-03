"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, LogOut, User } from "lucide-react"
import { useUser } from "@auth0/nextjs-auth0"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading, error } = useUser()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Профиль</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        {/* <TabsList>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Профиль
          </TabsTrigger>
        </TabsList> */}

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Профиль пользователя</CardTitle>
              <CardDescription>Личные данные и настройки</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Avatar className="h-20 w-20">
                  {/* <AvatarImage src="/placeholder.svg" alt={user.name} /> */}
                  <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-medium text-lg">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input id="name" value={user.name} readOnly />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Сохранить изменения</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Аккаунт</CardTitle>
              <CardDescription>Управление аккаунтом и безопасностью</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Пароль</Label>
                <Input id="password" type="password" value="********" readOnly />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline">Изменить пароль</Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Удалить аккаунт</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Удаление аккаунта</DialogTitle>
                    <DialogDescription>
                      Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо и приведет к потере всех
                      ваших данных.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Отмена</Button>
                    <Button variant="destructive">Удалить аккаунт</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="sm:ml-auto">
                <LogOut className="mr-2 h-4 w-4" />
                Выйти
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
              <CardDescription>Настройте, какие уведомления вы хотите получать</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Уведомления</Label>
                  <p className="text-sm text-muted-foreground">Включить или отключить все уведомления</p>
                </div>
                <Switch
                  id="notifications"
                  checked={user.notificationsEnabled}
                  onCheckedChange={(checked) => setUser({ ...user, notificationsEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-episodes">Новые серии</Label>
                  <p className="text-sm text-muted-foreground">
                    Уведомления о выходе новых серий в отслеживаемых сериалах
                  </p>
                </div>
                <Switch id="new-episodes" disabled={!user.notificationsEnabled} defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-movies">Новые фильмы</Label>
                  <p className="text-sm text-muted-foreground">Уведомления о выходе новых фильмов в кинотеатрах</p>
                </div>
                <Switch id="new-movies" disabled={!user.notificationsEnabled} defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="recommendations">Рекомендации</Label>
                  <p className="text-sm text-muted-foreground">
                    Персональные рекомендации на основе ваших предпочтений
                  </p>
                </div>
                <Switch id="recommendations" disabled={!user.notificationsEnabled} defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Сохранить настройки</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

