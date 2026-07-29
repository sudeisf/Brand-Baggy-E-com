"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import api from "@/lib/axios"
import {
  Bell,
  Loader2,
  PackageCheck,
  AlertTriangle,
  MessageSquare,
} from "lucide-react"

type NotificationPrefs = {
  new_orders: boolean
  low_stock_alerts: boolean
  customer_messages: boolean
}

const NOTIFICATION_OPTIONS: {
  key: keyof NotificationPrefs
  label: string
  description: string
  icon: React.ReactNode
}[] = [
  {
    key: "new_orders",
    label: "New Orders",
    description: "Receive an email when a new order is placed.",
    icon: <PackageCheck className="size-5 text-emerald-500" />,
  },
  {
    key: "low_stock_alerts",
    label: "Low Stock Alerts",
    description: "Get notified when a product inventory falls below 5 items.",
    icon: <AlertTriangle className="size-5 text-amber-500" />,
  },
  {
    key: "customer_messages",
    label: "Customer Messages",
    description: "Receive emails when a customer sends a message or review.",
    icon: <MessageSquare className="size-5 text-blue-500" />,
  },
]

export function NotificationSettings() {
  const [isFetching, setIsFetching] = useState(true)
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    new_orders: true,
    low_stock_alerts: true,
    customer_messages: false,
  })

  // Fetch notification preferences on mount
  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        setIsFetching(true)
        const response = await api.get("/accounts/notification-settings/")
        setPrefs({
          new_orders: response.data.new_orders ?? true,
          low_stock_alerts: response.data.low_stock_alerts ?? true,
          customer_messages: response.data.customer_messages ?? false,
        })
      } catch {
        // silently handle
      } finally {
        setIsFetching(false)
      }
    }
    fetchPrefs()
  }, [])

  const handleToggle = async (key: keyof NotificationPrefs, checked: boolean) => {
    const previousPrefs = { ...prefs }
    const updatedPrefs = { ...prefs, [key]: checked }
    setPrefs(updatedPrefs)

    try {
      await api.patch("/accounts/notification-settings/", { [key]: checked })
    } catch {
      // Revert on error
      setPrefs(previousPrefs)
      toast.error("Failed to update notification settings.", { position: "top-right" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="size-5" />
          Notifications
        </CardTitle>
        <CardDescription>
          Choose what alerts you want to receive. Changes save automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isFetching ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-1">
            {NOTIFICATION_OPTIONS.map((option, index) => (
              <div key={option.key}>
                <div className="flex items-center justify-between rounded-lg p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex size-9 items-center justify-center rounded-lg bg-muted">
                      {option.icon}
                    </div>
                    <div className="space-y-0.5">
                      <Label
                        htmlFor={option.key}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {option.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={option.key}
                    checked={prefs[option.key]}
                    onCheckedChange={(checked) =>
                      handleToggle(option.key, checked)
                    }
                  />
                </div>
                {index < NOTIFICATION_OPTIONS.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
