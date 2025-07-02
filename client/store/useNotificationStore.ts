import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type Notification = {
  id: string
  title : string
  message: string
  timestamp: string
  is_read: boolean
  type : string
}

type State = {
  notifications: Notification[]
  addNotification: (notif: Notification) => void
  markAsRead: (id: string) => void
  setAll: (list: Notification[]) => void
}

export const useNotificationStore = create<State & { unreadCount: () => number }>()(
  persist(
    (set, get) => ({
      notifications: [],
      addNotification: (notif) =>
        set((state) => ({
          notifications: [notif, ...state.notifications],
        })),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, is_read: true } : n
          ),
        })),
      setAll: (list) =>
        set(() => ({
          notifications: list
        })),
      unreadCount: () => get().notifications.filter(n => !n.is_read).length,
    }),
    {
      name: 'notification-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
