"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { mockNotifications } from "@/lib/mock-data"
import { Bell, Check, Trash } from "lucide-react"
import type { Notification } from "@/lib/types"
import Link from "next/link"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const deleteAllNotifications = () => {
    setNotifications([])
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Уведомления</h1>
          <p className="text-muted-foreground">
            {notifications.filter((n) => !n.read).length} непрочитанных уведомлений
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Отметить все как прочитанные
          </Button>
          <Button variant="outline" onClick={deleteAllNotifications}>
            <Trash className="mr-2 h-4 w-4" />
            Удалить все
          </Button>
        </div>
      </div>

      {notifications.length > 0 ? (
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={notification.read ? "opacity-70" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    <CardTitle className="text-lg">{notification.title}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{new Date(notification.date).toLocaleDateString()}</p>
                </div>
                <CardDescription>{notification.message}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-2">
                <div className="flex gap-2">
                  {notification.mediaId && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/media/${notification.mediaId}`}>Перейти</Link>
                    </Button>
                  )}
                  {!notification.read && (
                    <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
                      <Check className="mr-2 h-3 w-3" />
                      Отметить как прочитанное
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => deleteNotification(notification.id)}>
                    <Trash className="mr-2 h-3 w-3" />
                    Удалить
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Нет уведомлений</h3>
            <p className="text-sm text-muted-foreground">
              У вас пока нет уведомлений. Они появятся, когда выйдут новые серии или фильмы.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

