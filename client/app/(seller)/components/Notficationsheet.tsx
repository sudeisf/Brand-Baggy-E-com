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

// Dummy notification data with corrected icon reference
const initialNotifications = [
  {
    id: 1,
    title: "New Order Received",
    message: "A new order for $150 has been placed by John Doe.",
    timestamp: "2025-05-20 10:30 AM",
    type: "order",
  },
  {
    id: 2,
    title: "Payment Processed",
    message: "Payment of $200 was successfully processed.",
    timestamp: "2025-05-20 09:15 AM",
    type: "payment",
  },
  {
    id: 3,
    title: "System Update",
    message: "Scheduled maintenance is planned for tonight at 11 PM.",
    timestamp: "2025-05-19 04:45 PM",
    type: "system",
  },
  {
    id: 4,
    title: "User Feedback",
    message: "Jane Smith left a 5-star review for your service.",
    timestamp: "2025-05-19 02:20 PM",
    type: "feedback",
  },
]

export function Notification() {
  const [notifications, setNotifications] = useState(
    initialNotifications.map((n) => ({ ...n, isRead: false }))
  )

  // Mark a single notification as read
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((n) => ({ ...n, isRead: true }))
    )
  }

  // Function to get the appropriate icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
      case "payment":
        return <Package className="w-5 h-5 text-gray-500" />
      case "system":
      case "feedback":
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <Sheet>
      <SheetTrigger className="flex items-center  border-gray-300 border-1 px-2 rounded-lg py-2 gap-2">
        <Bell className="w-4 h-4 text-gray-500" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>View your recent notifications below.</SheetDescription>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="mt-2 text-[#331d67] hover:text-[#331d67]/80 font-roboto"
            disabled={notifications.every((n) => n.isRead)}
          >
            Mark All as Read
          </Button>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start space-x-3 border-b pb-4 px-4 ${
                notification.isRead ? "opacity-50" : ""
              }`}
            >
              <div>{getNotificationIcon(notification.type)}</div>
              <div className="flex-1">
                <h3 className="text-sm font-medium font-roboto text-gray-900 mb-2">{notification.title}</h3>
                <p className="text-sm text-gray-500 font-roboto">{notification.message}</p>
                <p className="text-xs text-gray-400 font-robobto">{notification.timestamp}</p>
                {!notification.isRead && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                    className="mt-1 p-0 text-[#331d67] hover:text-[#331d67]/80 font-roboto"
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
       
      </SheetContent>
    </Sheet>
  )
}