import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '@/store/useNotificationStore'
import api from "@/lib/axios"
import { useEffect } from 'react'

export const useLoadNotifications = () => {
  const setAll = useNotificationStore((s) => s.setAll)

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications/')
      return res.data
    },
    staleTime: 1000 * 60 * 1, 
  })

  useEffect(() => {
    if (query.data) setAll(query.data)
  }, [query.data, setAll])

  return query
}

export const useMarkNotification = () => {
      const queryClient = useQueryClient()
    
      return useMutation({
        mutationFn: async (id: string) => {
          await api.patch(`/notifications/${id}/mark-as-read/`)
        },
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey : ['notifications']})
        },
      })
    }


export const useMarkAllNotification = () => {
      const queryClient = useQueryClient()
    
      return useMutation({
        mutationFn: async () => {
          await api.patch(`/notifications/mark-all-read/`)
        },
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey : ['notifications']})
        },
      })
    }