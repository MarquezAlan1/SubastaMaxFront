"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Gavel, DollarSign, AlertTriangle, Trophy, Clock, Trash2, CheckCircle } from "lucide-react"
import { useNotificationsStore, type Notification } from "@/lib/notifications-store"
import { cn } from "@/lib/utils"

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } =
    useNotificationsStore()
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "bid_placed":
        return <Gavel className="h-5 w-5 text-blue-600" />
      case "bid_outbid":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case "auction_paused":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "payment_credited":
        return <DollarSign className="h-5 w-5 text-green-600" />
      case "auction_won":
        return <Trophy className="h-5 w-5 text-purple-600" />
      case "auction_ending":
        return <Clock className="h-5 w-5 text-red-600" />
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />
    }
  }

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.read) : notifications

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Notificaciones</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} notificaciones sin leer` : "Todas las notificaciones están al día"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar todas como leídas
              </Button>
            )}
            <Button variant="outline" onClick={clearAll} className="text-red-600 hover:text-red-700 bg-transparent">
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar todo
            </Button>
          </div>
        </div>

        <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "unread")} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Todas ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Sin leer ({unreadCount})</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {filter === "unread" ? "No hay notificaciones sin leer" : "No hay notificaciones"}
                  </h3>
                  <p className="text-muted-foreground text-center">
                    {filter === "unread"
                      ? "¡Excelente! Estás al día con todas tus notificaciones."
                      : "Las notificaciones aparecerán aquí cuando tengas actividad en tus subastas."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={cn(
                      "transition-colors hover:bg-muted/50 cursor-pointer group",
                      !notification.read && "border-primary/50 bg-primary/5",
                    )}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className={cn("font-medium mb-1", !notification.read && "font-semibold")}>
                                {notification.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{formatTime(notification.timestamp)}</span>
                                {notification.amount && (
                                  <Badge variant="outline" className="text-green-600">
                                    ${notification.amount.toLocaleString()}
                                  </Badge>
                                )}
                                {notification.auctionId && <Badge variant="outline">{notification.auctionId}</Badge>}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeNotification(notification.id)
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
