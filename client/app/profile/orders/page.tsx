"use client"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { EyeIcon } from "lucide-react"
import ViewDetails from "../components/ViewDetails"
import ViewInvoice from "../components/ViewInvoice"

const orders = [
    {
        id: "1234567890",
        date: "2021-01-01",
        total: 100,
        shipTo: "addis abeba, ethiopia",
        items: [
            { id: 1, name: "Product 1", image: "/assets/products/product1.jpg", price: 100 , description: "Product 1 description" },
            { id: 2, name: "Product 2", image: "/assets/products/product2.jpg", price: 100 , description: "Product 2 description" },
            { id: 3, name: "Product 3", image: "/assets/products/product3.jpg", price: 100 , description: "Product 3 description" },
        ],
        status: "deliverd",
        deliveryStatus: "delivered",
        deliveryDate: "2025-05-17",
    },
    {
        id: "1234567891",
        date: "2025-01-01",
        total: 100,
        shipTo: "addis abeba, ethiopia",
        items: [
            { id: 1, name: "Product 1", image: "/assets/products/product1.jpg", price: 100 , description: "Product 1 description" },
            { id: 2, name: "Product 2", image: "/assets/products/product2.jpg", price: 100 , description: "Product 2 description" },
        ],
        status: "cancelled",
        deliveryStatus: "cancelled",
        deliveryDate: "2025-05-17",
    }
]

export default function Orders() {
    const [timeFilter, setTimeFilter] = useState("past-1-years")
    const [statusFilter, setStatusFilter] = useState("all")

    const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.date)
        const now = new Date()
        if (timeFilter === "past-1-week") {
            const oneWeekAgo = new Date(now.setDate(now.getDate() - 7))
            return orderDate >= oneWeekAgo
        } else if (timeFilter === "past-month") {
            const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1))
            return orderDate >= oneMonthAgo
        }
        return true // past-1-years shows all
    }).filter(order => 
        statusFilter === "all" || order.status === statusFilter
    )
    const extractMonthName = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString('default', { month: 'long' , day: 'numeric' })
    }
    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold text-[#331d67] mb-2">My Orders</h1>
            <p className="text-gray-500 text-md mb-6">Here are the orders you have made.</p>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex gap-4">
                    <Button
                        
                        className={`${statusFilter === "all" ? "bg-[#331d67]/5 text-[#503395] shadow-none rounded-sm hover:bg-bg-[#331d67]/20 hover:text-[#331d67]" : "bg-inherit text-[#331d67] border-none shadow-none  rounded-sm hover:bg-inherit hover:text-[#331d67] "}`}
                        onClick={() => setStatusFilter("all")}
                    >
                        All Orders
                    </Button>
                    <Button
                        
                        className={`${statusFilter === "pending" ? "bg-[#331d67]/5 text-[#624d93]shadow-none rounded-sm hover:bg-bg-[#331d67]/20 hover:text-[#331d67]" : "bg-inherit text-[#331d67] shadow-none  border-none rounded-sm hover:bg-inherit hover:text-[#331d67] "}`}
                        onClick={() => setStatusFilter("pending")}
                    >
                        Not Yet Shipped
                    </Button>
                    <Button
                      
                        className={`${statusFilter === "cancelled" ? "bg-[#331d67]/5 text-[#503395] shadow-none rounded-sm hover:bg-bg-[#331d67]/20 hover:text-[#331d67]" : "bg-inherit text-[#331d67]  border-none shadow-none  rounded-sm hover:bg-inherit hover:text-[#331d67] "}`}
                        onClick={() => setStatusFilter("cancelled")}
                    >
                        Cancelled
                    </Button>
                </div>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="past-1-years">Past Year</SelectItem>
                        <SelectItem value="past-1-week">Past Week</SelectItem>
                        <SelectItem value="past-month">Past Month</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-6">
                {filteredOrders.length === 0 ? (
                    <p className="text-gray-500">No orders found for the selected filters.</p>
                ) : (
                    filteredOrders.map(order => (
                        <Card key={order.id} className="border-none rounded-sm">
                            <CardHeader className="w-full">
                                <CardTitle className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-between border-b border-gray-200 px-2 pb-4 w-full">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm text-gray-500">Order Date:</span>
                                        <span className="text-sm text-[#331d67] font-semibold">{order.date}</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm text-gray-500">Total Amount:</span>
                                        <span className="text-sm text-[#331d67] font-semibold">${order.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm text-gray-500">Ship To:</span>
                                        <span className="text-sm text-[#331d67] capitalize">{order.shipTo}</span>
                                    </div>
                                    <div className="flex flex-col gap-3 items-start sm:items-end">
                                        <div className="flex gap-2">
                                            <span className="text-sm text-gray-500">Order ID:</span>
                                            <span className="text-md font-bold text-[#331d67]">#{order.id}</span>
                                        </div>
                                        <div className="flex gap-2 w-full justify-start sm:justify-end">
                                            <ViewInvoice />
                                            <ViewDetails status={order.deliveryStatus} />
                                        </div>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4 p-4">
                                    <h1 className="text-lg text-[#331d67] font-bold">Delivered {extractMonthName(order.deliveryDate)}</h1>
                                    <h2 className="text-md inline-block font-semibold text-gray-500">Order Status: <span className={`${order.deliveryStatus === "delivered" ? "text-green-500 ml-2 bg-green-500/10 px-2 py-1 rounded-sm" : "text-red-500 ml-2 bg-red-500/10 px-2 py-1 rounded-sm"}`}>{order.deliveryStatus}</span></h2>
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center border-b border-gray-200 pb-4">
                                            <h1 className="hidden sm:block">{item.id}</h1>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex flex-col gap-2 w-full">
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-gray-600">{item.description}</p>
                                                <div className="flex gap-2 items-center">
                                                    <EyeIcon className="w-4 h-4 text-[#331d67]" />
                                                    <Link href={`/products/${item.id}`} className="text-[#331d67] font-semibold">View Product</Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}