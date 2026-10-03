"use client"
import { TrendingDown , TrendingUp , DollarSign } from "lucide-react"
import { DashChart } from "./Dashchart"
import { RevenueChart } from "./Salesbar";
import Recentactivity from "./RecentActivities";
import { useAnalyticsStore } from "@/store/metricStore";
import { useAuthStore } from "@/store/authStore";
import { useAnalystics } from "@/hooks/useAnalaytics";

  export default function Dashheads() {
    const token  = useAuthStore(s=>s.accessToken)
    useAnalystics(token)
    const data = useAnalyticsStore(s=>s.metrics)
    return (
      <div className="flex flex-col gap-8 bg-white ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {data.length === 0 ? (
          [1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg h-[200px] p-5 border relative animate-pulse flex flex-col justify-between"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-8 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))
        ) : data.map((item, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg h-[200px] flex-1 flex justify-between p-5 items-baseline  border relative"
          >
            {/* Left side - Text content */}
            <div className="flex flex-col h-full justify-between">
              <h2 className="text-md mb-2 text-gray-400 text-start font-medium font-roboto capitalize">
                {item.header}
              </h2>
              <p className="text-3xl font-medium flex items-center text-[#331d67]">
                <DollarSign className="w-8 h-8 stroke-3"/>
                {item.amount} ETB
              </p>
              <p className={`${item.growthType === "up" ? "text-green-500" : "text-red-400"} flex gap-1 font-semibold items-center text-sm`}>
                {item.growthType === "up" ? 
                  <TrendingUp className="w-4 h-4" /> : 
                  <TrendingDown className="w-4 h-4" />}
                {item.percentile}
                <span className="text-gray-400 ml-2 font-medium font-roboto capitalize text-sm">{item.discription}</span>
              </p>
            </div>
  
           
            <div className="absolute right-1 bottom-0 h-[90px]">
              <DashChart 
                data={item.chartData} 
                label={item.header} 
                growthType={item.growthType as any} 
              />
            </div>
          </div>
        ))}
      </div>
        <div className="flex flex-col lg:flex-row w-full px-4 gap-4">
          <RevenueChart />
          <Recentactivity/>
        </div>
      </div>
    )
  }