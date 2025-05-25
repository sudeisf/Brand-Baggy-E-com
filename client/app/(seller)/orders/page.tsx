"use client"

import { Button } from "@/components/ui/button"
import { CreateOrder } from "./components/CreateorderSheet"
import OrderDashboard from "./components/OrderDashboard"
import { Download } from "lucide-react"
import OrdersTable from "./components/OrdersTable"





export default function Orders(){

    return (
        <div className="w-[1250px] mx-auto min-h-svh">
            <div className="flex justify-between px-5 mt-6">
                <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold font-roboto text-[#331d67]/90">Order</h1>
                <p className="text-gray-500 font-medium font-roboto">Organize all of orderd products</p>
                </div>
                <div className = "flex gap-2 ">
                    <Button variant = "outline" className="rounded-sm shadow-xs">Today</Button>
                    <Button variant = "outline" className="rounded-sm flex gap-2 shadow-2xs">
                        <Download/>
                        Export
                        </Button>
                    <CreateOrder/>
                </div>
            </div>
            <OrderDashboard/>
            <OrdersTable/>
        </div>
    )
}