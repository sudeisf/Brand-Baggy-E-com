"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Bell, Package, AlertCircle } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { useNotificationWs } from "@/hooks/useNotification"
import { useLoadNotifications, useMarkAllNotification, useMarkNotification } from "@/hooks/useLoadNotification"
import { useNotificationStore } from "@/store/useNotificationStore"


export function Notification() {
  const token  = useAuthStore(s=> s.accessToken)
  useNotificationWs(token)
  useLoadNotifications()
  const notifications = useNotificationStore(s=>s.notifications)
  const unreadCount = useNotificationStore(s => s.unreadCount())
  const markAsRead = useMarkNotification()
  const markAsAllRead = useMarkAllNotification()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ORDER":
        return <Package className="w-5 h-5 text-gray-500" />
      case "PRODUCT":
        return <Package className="w-5 h-5 text-gray-500" />
      case "SYSTEM":
      case "feedback":
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <Sheet>
      <SheetTrigger className="flex items-center  border-gray-300  px-2 rounded-lg py-2 gap-2 relative">
        <Bell className="w-5 h-5 text-[#331d67]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-bold">
            {unreadCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>View your recent notifications below.</SheetDescription>
          <Button
            variant="ghost"
            size="sm"
            onClick={()=> markAsAllRead.mutate()
            }
            className="mt-2 text-[#331d67] hover:text-[#331d67]/80 font-roboto"
            disabled={notifications.every((n) => n.is_read)}
          >
            Mark All as Read
          </Button>
        </SheetHeader>
        <div className="mt-4 space-y-4 max-h-[800px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {notifications.map((notification) => {
            return (
              <div
                key={notification.id}
                className={`flex items-start space-x-3 border-b pb-4 px-4 ${
                  notification.is_read === true ? "opacity-50" : ""
                }`}
              >
                <div>{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium font-roboto capitalize text-gray-900 mb-2">{notification.type === "ORDER" ? "new order" :notification.type }</h3>
                  <p className="text-sm text-gray-500 font-roboto">{notification.message}</p>
                  <p className="text-xs text-gray-400 font-robobto">{notification.timestamp}</p>
                  {notification.is_read === false && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => markAsRead.mutate(notification.id)}
                      className="mt-1 p-0 text-[#331d67] hover:text-[#331d67]/80 font-roboto"
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
       
      </SheetContent>
    </Sheet>
  )
}