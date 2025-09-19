import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Notification {
  id: string
  type: "bid_placed" | "bid_outbid" | "auction_paused" | "payment_credited" | "auction_won" | "auction_ending"
  title: string
  message: string
  timestamp: Date
  read: boolean
  auctionId?: string
  amount?: number
}

interface NotificationsStore {
  notifications: Notification[]
  unreadCount: number

  // Actions
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export const useNotificationsStore = create<NotificationsStore>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: "1",
          type: "bid_outbid",
          title: "Has sido superado",
          message: "Tu puja de $25,000 en 'Pintura Abstracta' ha sido superada",
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          read: false,
          auctionId: "AUC-001",
          amount: 25000,
        },
        {
          id: "2",
          type: "payment_credited",
          title: "Pago acreditado",
          message: "Se ha acreditado $2,500 a tu wallet",
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          read: false,
          amount: 2500,
        },
        {
          id: "3",
          type: "auction_ending",
          title: "Subasta terminando",
          message: "La subasta 'Reloj Vintage' termina en 5 minutos",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: true,
          auctionId: "AUC-002",
        },
      ],
      unreadCount: 2,

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date(),
          read: false,
        }

        set((state) => ({
          notifications: [newNotification, ...state.notifications.slice(0, 49)], // Keep last 50
          unreadCount: state.unreadCount + 1,
        }))
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification,
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }))
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
          unreadCount: 0,
        }))
      },

      removeNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id)
          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: notification && !notification.read ? state.unreadCount - 1 : state.unreadCount,
          }
        })
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 })
      },
    }),
    {
      name: "notifications-store",
    },
  ),
)
