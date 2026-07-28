import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what alerts you want to receive.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base">New Orders</Label>
            <p className="text-sm text-muted-foreground">Receive an email when a new order is placed.</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base">Low Stock Alerts</Label>
            <p className="text-sm text-muted-foreground">Get notified when a product inventory falls below 5 items.</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base">Customer Messages</Label>
            <p className="text-sm text-muted-foreground">Receive emails when a customer sends a message or review.</p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  )
}
