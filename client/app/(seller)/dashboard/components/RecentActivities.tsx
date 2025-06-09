
"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "lucide-react"
import { formatRelative, parse } from "date-fns"

const activities = [
  {
    name: "John Doe",
    dateTime: "2025-05-17 12:34",
    orderType: "new order",
  },
  {
    name: "Jane Smith",
    dateTime: "2025-05-19 09:15",
    orderType: "completed",
  },
  {
    name: "Alex Johnson",
    dateTime: "2025-05-20 14:22",
    orderType: "new order",
  },
  {
    name: "Emily Brown",
    dateTime: "2025-05-18 16:45",
    orderType: "cancelled",
  },
  {
    name: "Michael Lee",
    dateTime: "2025-05-20 08:30",
    orderType: "new order",
  },
  {
    name: "Sarah Davis",
    dateTime: "2025-05-19 11:50",
    orderType: "completed",
  },
  {
    name: "David Wilson",
    dateTime: "2025-05-17 18:20",
    orderType: "cancelled",
  },
  {
    name: "Laura Martinez",
    dateTime: "2025-05-20 10:47",
    orderType: "new order",
  },
  {
    name: "Chris Taylor",
    dateTime: "2025-05-18 13:10",
    orderType: "completed",
  },
  {
    name: "Anna Clark",
    dateTime: "2025-05-19 15:30",
    orderType: "new order",
  },
]

export default function RecentActivity() {
  const [filter, setFilter] = useState("all")

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getOrderTypeStyles = (orderType: string) => {
    switch (orderType) {
      case "new order":
        return "bg-[#331d67]/5 text-[#331d67] font-medium font-roboto capitalize"
      case "completed":
        return "bg-green-100 text-green-800 font-medium font-roboto capitalize"
      case "cancelled":
        return "bg-red-100 text-red-800 font-medium font-roboto capitalize"
      default:
        return "bg-gray-100 text-gray-800 font-medium font-roboto capitalize"
    }
  }

  // Helper to format dateTime as relative
  const formatRelativeDateTime = (dateTime: string) => {
    const date = parse(dateTime, "yyyy-MM-dd HH:mm", new Date())
    return formatRelative(date, new Date("2025-05-20T23:18:00+03:00"))
  }

  // Filter activities based on selected orderType
  const filteredActivities = filter === "all"
    ? activities
    : activities.filter((activity) => activity.orderType === filter)

  return (
    <div className="w-[500px] h-[350px] bg-white border rounded-md shadow-none flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-md font-medium text-[#331d67] font-roboto">Recent Activity</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[120px] focus:ring-none outlne-none ring-none foucs:outline-none border-1 shadow-none  text-[#331d67] font-roboto text-sm rounded-md">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="new order">New</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <p className="text-sm text-gray-400 font-roboto">No activities found</p>
        ) : (
          filteredActivities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-3 py-2 border-b border-gray-200 last:border-b-0"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src="" className="rounded-full" />
                <AvatarFallback className="bg-gray-200 text-gray-700 flex items-center justify-center">
                  {getInitials(activity.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-roboto font-medium text-sm text-[#331d67] capitalize">
                    {activity.name}
                  </p>
                  <span
                    className={`text-xs font-roboto px-2 py-1 rounded-full ${getOrderTypeStyles(
                      activity.orderType
                    )}`}
                  >
                    {activity.orderType}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-roboto">
                  {formatRelativeDateTime(activity.dateTime)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}