// stores/analyticsStore.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { AnalyticsMetric } from "@/types/analytics"

interface AnalyticsStore {
  metrics: AnalyticsMetric[]
  setMetrics: (data: AnalyticsMetric[]) => void
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set) => ({
      metrics: [],
      setMetrics: (data) => set({ metrics: data }),
    }),
    {
      name: "analytics-storage",
      partialize: (state) => ({ metrics: state.metrics }),
    }
  )
)
