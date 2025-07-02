"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUpdateOrderStatus } from "@/hooks/use-order"
import { useState } from "react"
import { toast } from "sonner"

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-500/5 text-yellow-500 w-fit",
  PROCESSING: "bg-blue-500/5 text-blue-500 w-fit",
  SHIPPED: "bg-indigo-500/5 text-indigo-500 w-fit",
  DELIVERED: "bg-green-500/5 text-green-500 w-fit",
  RETURNED: "bg-red-500/5 text-red-500 w-fit",
  CANCELLED: "bg-gray-500/5 text-gray-500 w-fit",
  PAID: "bg-green-500/10 text-green-600 w-fit",
}

const orderStatus: string[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "returned",
  "cancelled",
  "paid"

]

interface Props {
  order_id: number
  status: string
}

export default function UpdateOrderStatus({ order_id, status }: Props) {
  const [selected, setSelected] = useState(status.toLowerCase())
  const mutuation = useUpdateOrderStatus();
  const handleChange = (value:string)=>{
    mutuation.mutate(
      {
        order_id : Number(order_id),
        order_status : value 
      }, {
        onSuccess : (data)=>{
              toast.success(data.message)
        }
        ,onError: (error)=>{
              toast.error(error.message)
        },
  }
    )
  }
  
  return (
    <div
      className={`rounded-md text-center ${
        statusStyles[selected.toUpperCase()] || "bg-gray-100"
      }`}
    >
      <Select
        value={selected}
        onValueChange={(value: string) => {
          setSelected(value)
          handleChange(value)
        }}
      >
        <SelectTrigger className="w-[120px] px-2 py-4 rounded-sm text-xs font-medium capitalize flex items-center gap-2 font-roboto border-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-50 border-1 p-2 rounded-b-md">
          {orderStatus.map((s) => (
            <SelectItem key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
