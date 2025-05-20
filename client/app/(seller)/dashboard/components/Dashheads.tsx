"use client"
import { TrendingDown , TrendingUp , DollarSign } from "lucide-react"
import { DashChart } from "./Dashchart"
import { RevenueChart } from "./Salesbar";
const data = [
    {
      header: "Total Income",
      amount: 1200,
      discription: "from last week",
      percentile: "12%",
      growthType: "up",
      chartData: [
        { day: "Monday", value: 200 },
        { day: "Tuesday", value: 214.29 },
        { day: "Wednesday", value: 228.57 },
        { day: "Thursday", value: 242.86 },
        { day: "Friday", value: 257.14 },
        { day: "Saturday", value: 271.43 },
        { day: "Sunday", value: 285.71 },
      ],
    },
    {
      header: "Total Orders",
      amount: 120,
      discription: "from last week",
      percentile: "15%",
      growthType: "down",
      chartData: [
        { day: "Monday", value: 40 },
        { day: "Tuesday", value: 38.57 },
        { day: "Wednesday", value: 37.14 },
        { day: "Thursday", value: 35.71 },
        { day: "Friday", value: 34.29 },
        { day: "Saturday", value: 32.86 },
        { day: "Sunday", value: 31.43 },
      ],
    },
    {
      header: "Total Expenses",
      amount: 7000,
      discription: "from last week",
      percentile: "10%",
      growthType: "up",
      chartData: [
        { day: "Monday", value: 1000 },
        { day: "Tuesday", value: 1071.43 },
        { day: "Wednesday", value: 1142.86 },
        { day: "Thursday", value: 1214.29 },
        { day: "Friday", value: 1285.71 },
        { day: "Saturday", value: 1357.14 },
        { day: "Sunday", value: 1428.57 },
      ],
    },
  ];

  export default function Dashheads() {
    return (
      <div className="flex flex-col gap-4 ">
      <div className="flex gap-4 px-4">
        {data.map((item, index) => (
          <div 
            key={index}
            className="bg-gray-50 rounded-lg h-[200px] flex-1 flex justify-between p-5 items-baseline  border relative"
          >
            {/* Left side - Text content */}
            <div className="flex flex-col h-full justify-between">
              <h2 className="text-md mb-2 text-gray-400 text-start font-medium font-roboto capitalize">
                {item.header}
              </h2>
              <p className="text-4xl font-medium flex items-center text-[#331d67]">
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
  
           
            <div className="absolute right-2 bottom-0 h-[80px]">
              <DashChart 
                data={item.chartData} 
                label={item.header} 
                growthType={item.growthType as any} 
              />
            </div>
          </div>
        ))}
      </div>
        <div className="flex w-full px-4">
          <RevenueChart />
        </div>
      </div>
    )
  }