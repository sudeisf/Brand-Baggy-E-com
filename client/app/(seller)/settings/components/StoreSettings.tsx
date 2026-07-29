"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import api from "@/lib/axios"
import { Loader2, Save, Store } from "lucide-react"

const CURRENCIES = [
  { value: "USD ($)", label: "USD ($)" },
  { value: "EUR (€)", label: "EUR (€)" },
  { value: "GBP (£)", label: "GBP (£)" },
  { value: "ETB (Br)", label: "ETB (Br)" },
  { value: "NGN (₦)", label: "NGN (₦)" },
  { value: "KES (KSh)", label: "KES (KSh)" },
]

export function StoreSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const [storeName, setStoreName] = useState("")
  const [storeDescription, setStoreDescription] = useState("")
  const [defaultCurrency, setDefaultCurrency] = useState("USD ($)")
  const [supportEmail, setSupportEmail] = useState("")

  // Fetch store settings on mount
  useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        setIsFetching(true)
        const response = await api.get("/accounts/store-settings/")
        const data = response.data
        setStoreName(data.store_name || "")
        setStoreDescription(data.store_description || "")
        setDefaultCurrency(data.default_currency || "USD ($)")
        setSupportEmail(data.support_email || "")
      } catch {
        // silently handle — new profile may not exist yet
      } finally {
        setIsFetching(false)
      }
    }
    fetchStoreSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await api.patch("/accounts/store-settings/", {
        store_name: storeName,
        store_description: storeDescription,
        default_currency: defaultCurrency,
        support_email: supportEmail,
      })
      toast.success("Store settings saved!", { position: "top-right" })
    } catch {
      toast.error("Failed to update store settings.", { position: "top-right" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="size-5" />
          Store Settings
        </CardTitle>
        <CardDescription>
          Manage your shop details, brand identity, and currency preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isFetching ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} id="store-form">
            <div className="space-y-6">
              {/* Store Name */}
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input
                  id="store-name"
                  placeholder="My Awesome Store"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This is your public store name visible to customers.
                </p>
              </div>

              {/* Store Description */}
              <div className="space-y-2">
                <Label htmlFor="store-description">Store Description</Label>
                <Textarea
                  id="store-description"
                  placeholder="Tell your customers what your store is about..."
                  className="min-h-[120px] resize-none"
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {storeDescription.length}/500 characters
                </p>
              </div>

              <Separator />

              {/* Currency & Support Email */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                    <SelectTrigger id="currency" className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input
                    id="support-email"
                    type="email"
                    placeholder="support@example.com"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Customer inquiries will be sent here.
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-6">
        <Button type="submit" form="store-form" disabled={isLoading || isFetching} className="gap-2">
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Save Store Details
        </Button>
      </CardFooter>
    </Card>
  )
}
