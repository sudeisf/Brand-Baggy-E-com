"use client"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { EyeIcon } from "lucide-react"
import ViewDetails from "../components/ViewDetails"
import ViewInvoice from "../components/ViewInvoice"
import { getUserOrders } from "@/hooks/use-order"

export default function Orders() {
    const [timeFilter, setTimeFilter] = useState("past-1-years")
    const [statusFilter, setStatusFilter] = useState("all")

    const { data, isLoading, error } = getUserOrders();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading orders.</div>;

    const orders = data ?? [];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = String(date.getFullYear()).slice(-2); // Get last two digits
        return `${day}/${month}/${year}`;
      };

    const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.order_date)
        const now = new Date()
        if (timeFilter === "past-1-week") {
            const oneWeekAgo = new Date(now.setDate(now.getDate() - 7))
            return orderDate >= oneWeekAgo
        } else if (timeFilter === "past-month") {
            const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1))
            return orderDate >= oneMonthAgo
        }
        return true 
    }).filter(order => 
        statusFilter === "all" || order.status === statusFilter
    )
    const extractMonthName = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString('default', { month: 'long' , day: 'numeric' })
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "pending":
                return "text-yellow-600 bg-yellow-100";
            case "paid":
                return "text-green-600 bg-green-100";
            case "processing":
                return "text-orange-600 bg-orange-100";
            case "shipped":
                return "text-purple-600 bg-purple-100";
            case "delivered":
                return "text-blue-700 bg-blue-100";
            case "cancelled":
                return "text-red-600 bg-red-100";
            case "returned":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-500 bg-gray-100";
        }
    };

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

            <div className="space-y-6 overflow-y-auto h-[800px]">
                {filteredOrders.length === 0 ? (
                    <p className="text-gray-500">No orders found for the selected filters.</p>
                ) : (
                    filteredOrders.map(order => (
                        <Card key={order.id} className="border-1 shadow-none rounded-sm">
                            <CardHeader className="w-full">
                                <CardTitle className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-between border-b border-gray-200 px-2 pb-4 w-full">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm text-gray-500">Order Date:</span>
                                        <span className="text-sm text-[#331d67] font-semibold">{formatDate(order.order_date)}</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm text-gray-500">Total Amount:</span>
                                        <span className="text-sm text-[#331d67] font-semibold">${order.total_price}</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm text-gray-500">Ship To:</span>
                                        <span className="text-sm text-[#331d67] capitalize">{order.shipping_info.city},{order.shipping_info.country}</span>
                                    </div>
                                    <div className="flex flex-col gap-3 items-start sm:items-end">
                                        <div className="flex gap-2">
                                            <span className="text-sm text-gray-500">Order ID:</span>
                                            <span className="text-md font-bold text-[#331d67]">#{order.id}</span>
                                        </div>
                                        <div className="flex gap-2 w-full justify-start sm:justify-end">
                                            {/* <ViewInvoice /> */}
                                            <ViewDetails id={order.id} />
                                        </div>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4 p-4">
                                    {/* <h1 className="text-lg text-[#331d67] font-bold">Delivered {""}</h1> */}
                                    <h2 
                                    className="text-md inline-block font-semibold text-gray-500">Order Status: <span className={`${getStatusStyles(order.status)} ml-2 px-2 py-1 capitalize font-medium font-roboto text-sm rounded-sm`}>{order.status}</span></h2>
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center border-b border-gray-200 pb-4">
                                            <h1 className="hidden sm:block">{item.id}</h1>
                                            <img
                                                src={item.main_image}
                                                alt={item.product_name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex flex-col gap-2 w-full">
                                                <p className="font-semibold">{item.product_name}</p>
                                                <p className="text-gray-600">{item.description}</p>
                                                <div className="flex gap-2 items-center">
                                                    <EyeIcon className="w-4 h-4 text-[#331d67]" />
                                                    <Link href={`/products/${item.product_id}`} className="text-[#331d67] font-semibold">View Product</Link>
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