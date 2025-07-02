"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

const paymentStatus: string[] = [
  "paid",
  "pending",
  "refunded",
  "failed",
  "no payment",
  "completed"
]

const paymentStatusStyles: Record<string, string> = {
  "PAID": "bg-green-500/10 text-green-600 w-fit",
  "PENDING": "bg-yellow-500/10 text-yellow-600 w-fit",
  "REFUNDED": "bg-purple-500/10 text-purple-600 w-fit",
  "FAILED": "bg-red-500/10 text-red-600 w-fit",
  "NO PAYMENT": "bg-gray-300/10 text-gray-700 w-fit",
  "COMPLETED" :  "bg-yellow-500/10 text-yellow-700 w-fit",
}

interface Props {
  order_id: number
  status: string
}

export default function UpdatePaymentStatus({ order_id, status }: Props) {
  const [selected, setSelected] = useState(status.toLowerCase())

  return (
    <div
      className={`rounded-md text-center ${
        paymentStatusStyles[selected.toUpperCase()] || "bg-gray-100"
      }`}
    >
      <Select
        value={selected}
        onValueChange={(value: string) => {
          setSelected(value)
          console.log(`Order ${order_id} status changed to:`, value)
        }}
      >
        <SelectTrigger className="w-[120px] px-2 py-4 rounded-sm text-xs font-medium capitalize flex items-center gap-2 font-roboto border-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-50 border-1 p-2 rounded-b-md">
          {paymentStatus.map((s) => (
            <SelectItem key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
