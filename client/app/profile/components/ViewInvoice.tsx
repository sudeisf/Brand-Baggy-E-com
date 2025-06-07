"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const invoiceDetails = {
    id: 1234567890,
    orderDate: "2021-01-01",
    companyName: "Mama's Kitchen",
    companyAddress: "123 Main St, Anytown, USA",
    companyPhone: "123-456-7890",
    companyEmail: "info@mamaskitchen.com",
    companyWebsite: "www.mamaskitchen.com",
    customerName: "John Doe",
    customerAddress: "456 Oak Ave, Anytown, USA",
    customerPhone: "123-456-7890",
    customerEmail: "john.doe@example.com",
    customerWebsite: "www.johndoe.com",
    items: [
        {
            name: "Item 1",
            description: "Description 1",
            quantity: 1,
            price: 100
        },
        {
            name: "Item 2",
            description: "Description 2",
            quantity: 2,
            price: 200
        },
        {
            name: "Item 3",
            description: "Description 3",
            quantity: 3,
            price: 300
        }
    ]
}

export default function ViewInvoice() {
   

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-white border border-gray-500 hover:border-gray-500 hover:bg-gray-50/10 text-[#331d67] text-sm rounded-sm px-4 py-2">
                    View Invoice
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:w-[90vw] p-3 sm:p-6 overflow-x-auto max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <DialogHeader>
                    <DialogTitle>
                    <div className="flex flex-col gap-2">
                        
                        <h1 className="text-2xl font-bold">Invoice <span className="text-[#331d67]">#{invoiceDetails.id}</span></h1>
                        
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">Order Date: {invoiceDetails.orderDate}</p>
                            <p className="text-sm text-green-500 bg-green-500/10 capitalize mt-1 py-1 rounded-sm w-fit px-4">paid</p>
                        </div>
                    </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col md:flex-row justify-between gap-4 bg-gray-200/50 p-4 rounded-md">
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex flex-col">
                            <h2 className="text-sm text-gray-500 font-medium">Bill From</h2>
                            <p className="text-lg font-bold text-gray-500">{invoiceDetails.customerName}</p>
                            <p className="text-sm text-gray-500">{invoiceDetails.customerAddress}</p>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-sm text-gray-500 font-medium capitalize">issued on</h1>
                            <p className="text-lg font-bold text-gray-500">{invoiceDetails.orderDate}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex flex-col">
                            <h2 className="text-sm text-gray-500 font-medium">Bill To</h2>
                            <p className="text-lg font-bold text-gray-500">{invoiceDetails.customerName}</p>
                            <p className="text-sm text-gray-500">{invoiceDetails.customerAddress}</p>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-sm text-gray-500 font-medium capitalize">due on</h1>
                            <p className="text-lg font-bold text-gray-500">{invoiceDetails.orderDate}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 p-2">
                    <h1 className="text-sm text-gray-500 font-bold">Invoice Details</h1>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col ">
                            <div className="grid grid-cols-4 sm:grid-cols-5 items-center gap-4 border-b border-t border-gray-500 py-4 text-sm text-gray-500">
                                <p className="text-sm col-span-2 font-bold capitalize">Description</p>
                                <p className="text-sm font-bold capitalize text-center">price</p>
                                <p className="text-sm font-bold capitalize text-center">quantity</p>
                                <p className="text-sm font-bold capitalize text-right">total</p>
                            </div>

                            <div className="flex flex-col gap-4">
                                {invoiceDetails.items.map((item) => (
                                    <div className="grid grid-cols-4 sm:grid-cols-5 text-center items-center gap-2 py-2 text-sm text-gray-500">
                                        <p className="text-sm col-span-2 text-left font-bold capitalize">{item.name}</p>
                                        <p className="text-sm font-bold">${item.price}</p>
                                        <p className="text-sm font-bold">{item.quantity}</p>
                                        <p className="text-sm font-bold text-right">${item.price * item.quantity}</p>
                                    </div>
                                ))}
                                <div className="flex flex-col gap-1 text-right mt-2 sm:mt-0">
                                    <p>${invoiceDetails.items.reduce((acc, item) => acc + item.price * item.quantity, 0)}</p>
                                    <p>${invoiceDetails.items.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.1}</p>
                                    <p>${invoiceDetails.items.reduce((acc, item) => acc + item.price * item.quantity, 0) + invoiceDetails.items.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.1}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 bg-gray-200/50 p-2 rounded-md text-center mt-2">
                    <p className="text-sm text-gray-500">Baggy Brand inc.</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}