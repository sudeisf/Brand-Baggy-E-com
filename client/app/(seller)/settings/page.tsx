"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "./components/ProfileSettings"
import { StoreSettings } from "./components/StoreSettings"
import { NotificationSettings } from "./components/NotificationSettings"
import { SecuritySettings } from "./components/SecuritySettings"
import { User, Store, Bell, Shield } from "lucide-react"

export default function Settings() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-8 px-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings, store preferences, and notifications.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="inline-flex h-10 w-full sm:w-fit items-center justify-start gap-1 rounded-lg bg-muted p-1 text-muted-foreground">
          <TabsTrigger value="profile" className="gap-1.5 data-[state=active]:shadow-sm">
            <User className="size-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="store" className="gap-1.5 data-[state=active]:shadow-sm">
            <Store className="size-4" />
            Store
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 data-[state=active]:shadow-sm">
            <Bell className="size-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 data-[state=active]:shadow-sm">
            <Shield className="size-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
          <TabsContent value="store">
            <StoreSettings />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}