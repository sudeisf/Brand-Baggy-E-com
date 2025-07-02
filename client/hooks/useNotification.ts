import useWebSocket from 'react-use-websocket'
import { useEffect } from 'react'
import { useNotificationStore } from '@/store/useNotificationStore'
import { string } from 'zod'



export const useNotificationWs = (token : string | null ) =>{
      const addNotification = useNotificationStore(s => s.addNotification)
      const {lastMessage} = useWebSocket(
            token ? `ws://localhost:8000/ws/notifications/?token=${token}` : null,
            {
                  shouldReconnect: () => true,
                  reconnectInterval: 3000,
                }
      )
      useEffect(() => {
            if (lastMessage) {
              const wsData = JSON.parse(lastMessage.data);
              if (wsData.type === "notification") {
                const data = wsData.data;
                addNotification({
                  id: data.id,
                  title: data.title || "",
                  message: data.message,
                  timestamp: data.created_at,
                  is_read: data.is_read,
                  type: data.type
                });
              }
            }
          }, [lastMessage])
} 