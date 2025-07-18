import { useEffect, useRef } from "react"
import { useAnalyticsStore } from "@/store/metricStore"
import { AnalyticsMetric } from "@/types/analytics"

export const useAnalystics = (token: string | null) => {
  const setMetrics = useAnalyticsStore((state) => state.setMetrics)
  const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL
  const wsUrl =
    token && wsBaseUrl
      ? `${wsBaseUrl}/ws/analytics/?token=${encodeURIComponent(token)}`
      : null

  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!wsUrl) return

    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log("[Analytics WS] Connected")
    }

    ws.onmessage = (event) => {
      try {
        const Wsdata = JSON.parse(event.data)
        console.log("[Analytics WS] Received data:", Wsdata)
        if (Array.isArray(Wsdata)) {
          setMetrics(Wsdata as AnalyticsMetric[])
        } else if (Wsdata.type === "analytics") {
          setMetrics(Wsdata.data as AnalyticsMetric[])
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err)
      }
    }

    ws.onerror = (err) => {
      console.error("[Analytics WS] Error:", err)
    }

    ws.onclose = (event) => {
      console.log("[Analytics WS] Disconnected", event)
      // Optionally, you can implement reconnection logic here
    }

    // Cleanup on unmount or wsUrl change
    return () => {
      ws.close()
    }
  }, [wsUrl, setMetrics])

  // You can return connection state if you want
  return {}
}



