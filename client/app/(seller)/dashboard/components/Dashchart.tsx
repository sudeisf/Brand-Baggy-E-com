"use client"
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis } from "recharts"

export function DashChart({
  data,
  label,
  growthType,
}: {
  data: any[]
  label: string
  growthType: "up" | "down"
}) {
  const color = growthType === "up" ? "#22c55e" : "#ef4444" // green or red
  const LabelColor = growthType === "up" ? "bg-gradient-to-r from-green-500 to-green-300" : "bg-gradient-to-r from-red-500 to-red-300"

  return (
    <div className="flex-1 pr-4 mt-2">
      <AreaChart
        width={170}
        height={80}
        data={data}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id={`color-${growthType}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.1} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="day" hide />
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <Tooltip />
        <Area
          type="natural"
          dataKey="value"
          stroke={color}
          fillOpacity={1}
          fill={`url(#color-${growthType})`}
        />
      </AreaChart>
    </div>
  )
}