"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRevenuChartDataForOrders } from "@/hooks/use-order"

// Data for different time periods
const yearlyData = [
  { month: "January", revenue: 186 },
  { month: "February", revenue: 305 },
  { month: "March", revenue: 237 },
  { month: "April", revenue: 73 },
  { month: "May", revenue: 209 },
  { month: "June", revenue: 214 },
]

// Monthly data (e.g., June, for simplicity)
const monthlyData = [
  { month: "June", revenue: 214 },
]

// Daily data (interpolated from previous "Total Income" data, adapted for revenue)
const dailyData = [
  { day: "Monday", revenue: 200 },
  { day: "Tuesday", revenue: 123.29 },
  { day: "Wednesday", revenue: 300.57 },
  { day: "Thursday", revenue: 242.86 },
  { day: "Friday", revenue: 190.14 },
  { day: "Saturday", revenue: 271.43 },
  { day: "Sunday", revenue: 285.71 },
]

const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#331d67",
    },
  } satisfies ChartConfig

export function RevenueChart() {
  const {data ,isLoading} = useRevenuChartDataForOrders()
  const [activeTab, setActiveTab] = useState("year")

  // Select data based on active tab
  const getChartData = () => {
    switch (activeTab) {
      case "year":
        return data?.yearly
      case "month":
        return data?.monthly
      case "day":
        return data?.monthly
      default:
        return data?.yearly
    }
  }

  // Determine XAxis dataKey and tickFormatter based on tab
  const xAxisProps = activeTab === "day" 
    ? { dataKey: "day", tickFormatter: (value: string) => value.slice(0, 3) }
    : { dataKey: "month", tickFormatter: (value: string) => value.slice(0, 3) }

  return (
    <Card className="w-[700px] h-[350px] bg-white border-1 shadow-none">
      <CardHeader className="flex items-center justify-between px-4 mt-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-gray-500" />
          Sales Revenue
        </CardTitle>
        <Tabs defaultValue="year">
        <TabsList className="bg-transparent">
          <TabsTrigger className="data-[state=active]:bg-[#331d67] data-[state=active]:text-white bg-gray-50 text-gray-700 rounded-md"  value="year" onClick={() => setActiveTab("year")}>1y</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-[#331d67] data-[state=active]:text-white bg-gray-50 text-gray-700 rounded-md" value="month" onClick={() => setActiveTab("month")}>1m</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-[#331d67] data-[state=active]:text-white bg-gray-50 text-gray-700 rounded-md" value="day" onClick={() => setActiveTab("day")}>1d</TabsTrigger>
        </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="year" value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="year" className="mt-0">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart accessibilityLayer data={getChartData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  {...xAxisProps}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} barSize={40} />
              </BarChart>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="month" className="mt-0">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart accessibilityLayer data={getChartData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  {...xAxisProps}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8}  barSize={40} />
              </BarChart>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="day" className="mt-0">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart accessibilityLayer data={getChartData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  {...xAxisProps}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} barSize={40} />
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}