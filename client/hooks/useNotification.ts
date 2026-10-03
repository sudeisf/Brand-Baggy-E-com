import useWebSocket from 'react-use-websocket'
import { useEffect } from 'react'
import { useNotificationStore } from '@/store/useNotificationStore'
import { string } from 'zod'



export const useNotificationWs = (token : string | null ) =>{
  const addNotification = useNotificationStore((s) => s.addNotification);
  const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL;

  // Validate WebSocket URL before connecting
  const wsUrl = token && wsBaseUrl 
    ? `${wsBaseUrl}/ws/notifications/?token=${token}` 
    : null;
    const {lastMessage} = useWebSocket(
              token ? `${wsUrl}` : null,
            {
                  shouldReconnect: () => true,
                  reconnectInterval: 3000,
                }
      )
      useEffect(() => {
        if (lastMessage?.data) {
          try {
            const wsData = JSON.parse(lastMessage.data);
            if (wsData.type === "notification" && wsData.data) {
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
          } catch (err) {
            console.error("Failed to parse notification WebSocket message:", err);
          }
        }
      }, [lastMessage, addNotification]);
} 