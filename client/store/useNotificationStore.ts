import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type Notification = {
  id: string
  title : string
  message: string
  timestamp: string
  read: boolean
  type : string
}

type State = {
  notifications: Notification[]
  addNotification: (notif: Notification) => void
  markAsRead: (id: string) => void
  setAll: (list: Notification[]) => void
}

export const useNotificationStore = create<State>()(
  persist(
    (set) => ({
      notifications: [],
      addNotification: (notif) =>
        set((state) => ({
          notifications: [notif, ...state.notifications],
        })),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      setAll: (list) =>
        set((state) => {
          const existingIds = new Set(state.notifications.map((n) => n.id))
          const merged = [
            ...list.filter((n) => !existingIds.has(n.id)),
            ...state.notifications,
          ]
          return { notifications: merged }
        }),
    }),
    {
      name: 'notification-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
