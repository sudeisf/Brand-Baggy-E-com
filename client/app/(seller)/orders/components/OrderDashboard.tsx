"use client"

import { Clock, DollarSign, RefreshCw, ShoppingBag, Truck } from "lucide-react"





export default function OrderDashboard(){
    return (
        <div className="flex items-center justify-around mt-8 px-2">
        <div className="border-1 flex gap-4 items-center w-[14rem] shadow-xs  p-4 rounded-md">
            
            <ShoppingBag className="w-10 h-10 border-1 p-2 rounded-md shadow-xs " />
            <div className="flex flex-col gap-1">
            <h1 className="text-gray-500 font-roboto font-medium flex items-center gap-2">
                 Total orders
            </h1>
            <p className="text-xl font-medium text-[#331d67]">1230</p>
            </div>
        </div>
        <div className="border-1 flex gap-4 items-center w-[14rem] shadow-xs p-4 rounded-md">
            <DollarSign className="w-10 h-10 border-1 p-2 rounded-md shadow-xs " /> 
            <div className="flex flex-col gap-1">
            <h1 className="text-gray-500 font-roboto font-medium flex items-center gap-2">
               Avg. Order Value
            </h1>
            <p className="text-xl font-medium text-[#331d67]">$123.56</p>
            </div>
        </div>
        <div className="border-1 flex gap-3 items-center w-[14rem] shadow-xs  p-4 rounded-md">
            <Clock className="w-10 h-10 border-1 p-2 rounded-md shadow-xs " />
            <div className="flex flex-col gap-1">
            <h1 className="text-gray-500 font-roboto font-medium flex items-center gap-2">
                 Pending Fulfillment
            </h1>
            <p className="text-xl font-medium text-[#331d67]">15</p>
            </div>
            
        </div>
        <div className="border-1 flex gap-4 items-center w-[14rem] shadow-xs  p-4 rounded-md">
        <RefreshCw className="w-10 h-10 border-1 p-2 rounded-md shadow-xs " /> 
        <div className="flex flex-col gap-1">
        <h1 className="text-gray-500 font-roboto font-medium flex items-center gap-2">
                 Return Rate
            </h1>
            <p className="text-xl font-medium text-[#331d67]">3.2%</p>
        </div>
            
        </div>
        <div className="border-1 flex gap-4 items-center w-[14rem] shadow-xs  p-4 rounded-md">
        <Truck className="w-10 h-10 border-1 p-2 rounded-md shadow-xs " /> 
        <div className="flex flex-col gap-1">
            <h1 className="text-gray-500 font-roboto font-medium flex items-center gap-2">
                    Delivered Orders
                </h1>
                <p className="text-xl font-medium text-[#331d67]">1200</p>
        </div>
            
        </div>
    </div>
    )
}