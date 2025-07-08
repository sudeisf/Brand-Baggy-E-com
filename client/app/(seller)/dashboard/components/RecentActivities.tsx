"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "lucide-react"
import { formatRelative, parse } from "date-fns"
import { useSellerActivity } from "@/hooks/use-order"


export default function RecentActivity() {
  const [filter, setFilter] = useState("all")
  const {data: activities, isLoading} = useSellerActivity()

  const mappedActivities = activities?.map((activity) => ({
    name: activity.customer,
    dateTime: activity.exact_time,
    orderType: activity.status,
  })) || []

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
      case "paid":
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
    const date = parse(dateTime, "EEEE 'at' hh:mm a", new Date())
    return formatRelative(date, new Date())
  }

  // Filter activities based on selected orderType
  const filteredActivities = filter === "all"
    ? mappedActivities
    : mappedActivities.filter((activity) => activity?.orderType === filter)

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