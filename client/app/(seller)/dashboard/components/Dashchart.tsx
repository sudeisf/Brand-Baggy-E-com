"use client"
import { Area, AreaChart, Tooltip, XAxis } from "recharts"

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

  return (
    <div className="w-full h-[80px]">
      <AreaChart
        width={180}
        height={80}
        data={data}
        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id={`color-${growthType}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="day" hide />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "none",
            borderRadius: "0.5rem",
            fontSize: "0.75rem",
            color: "#fff",
          }}
          labelStyle={{ display: "none" }}
          cursor={{ stroke: "transparent" }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#color-${growthType})`}
        />
      </AreaChart>
    </div>
  )
}
