import ueWebScocket from "react-use-websocket"
import { useEffect } from "react"
import useWebSocket from "react-use-websocket"
import { useAnalyticsStore } from "@/store/metricStore"
import { AnalyticsMetric } from "@/types/analytics"


export const useAnalystics = (token : string | null) =>
{
      const setMetrics = useAnalyticsStore((state) => state.setMetrics)
      const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL;
      const {lastMessage ,readyState} = useWebSocket(token ? `${process.env.NEXT_PUBLIC_WS_URL}/ws/seller-analytics/?token=${token}` : null,
            {
                  shouldReconnect: () => true,
                  reconnectInterval: 3000,
                })
             useEffect(() => {
                  if (lastMessage?.data) {
                    try {
                      const Wsdata = JSON.parse(lastMessage.data)
                      console.log("[Analytics WS] Received data:", Wsdata)
                      // optionally wrap in { type: 'analytics', data: [...] } from backend
                      if (Array.isArray(Wsdata)) {
                        setMetrics(Wsdata as AnalyticsMetric[])
                      } else if (Wsdata.type === "analytics") {
                        setMetrics(Wsdata.data as AnalyticsMetric[])
                      }
                    } catch (err) {
                      console.error("Error parsing WebSocket message:", err)
                    }
                  }
                }, [lastMessage, setMetrics])
                return {
                  readyState,
            }
}



