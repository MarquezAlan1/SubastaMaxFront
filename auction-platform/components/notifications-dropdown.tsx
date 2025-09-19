"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Gavel, DollarSign, AlertTriangle, Trophy, Clock, X } from "lucide-react"
import { useNotificationsStore, type Notification } from "@/lib/notifications-store"
import { cn } from "@/lib/utils"

export function NotificationsDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationsStore()
  const [open, setOpen] = useState(false)

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "bid_placed":
        return <Gavel className="h-4 w-4 text-blue-600" />
      case "bid_outbid":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "auction_paused":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "payment_credited":
        return <DollarSign className="h-4 w-4 text-green-600" />
      case "auction_won":
        return <Trophy className="h-4 w-4 text-purple-600" />
      case "auction_ending":
        return <Clock className="h-4 w-4 text-red-600" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Ahora"
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    setOpen(false)
  }

  const recentNotifications = notifications.slice(0, 5)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificaciones</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto p-1 text-xs">
              Marcar todas como leídas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {recentNotifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No tienes notificaciones</p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="space-y-1">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors group",
                    !notification.read && "bg-muted/30",
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</span>
                          {notification.amount && (
                            <span className="text-xs font-medium text-green-600">
                              ${notification.amount.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeNotification(notification.id)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    {!notification.read && <div className="w-2 h-2 bg-primary rounded-full absolute right-2 top-4" />}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/notificaciones" className="w-full text-center">
            Ver todas las notificaciones
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
