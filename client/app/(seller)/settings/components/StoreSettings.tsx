import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function StoreSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Settings</CardTitle>
        <CardDescription>Manage your shop details, brand identity, and currency.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="store-name">Store Name</Label>
          <Input id="store-name" placeholder="My Awesome Store" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="store-description">Store Description</Label>
          <Textarea 
            id="store-description" 
            placeholder="Tell your customers what your store is about..." 
            className="min-h-[100px]"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currency">Default Currency</Label>
            <Input id="currency" defaultValue="USD ($)" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="support-email">Support Email</Label>
            <Input id="support-email" type="email" placeholder="support@example.com" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-border pt-6 mt-6">
        <Button>Save Store Details</Button>
      </CardFooter>
    </Card>
  )
}
