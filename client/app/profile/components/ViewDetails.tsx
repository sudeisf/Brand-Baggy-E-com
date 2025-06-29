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
import { useUserOrderDetail } from "@/hooks/use-order"



export default function ViewDetails({ id  }: { id: number }) {

    const { data, isLoading } = useUserOrderDetail(id);



    if (isLoading || !data) {
        return (
          <Button className="bg-[#331d67] text-white text-sm rounded-sm px-4 py-2" disabled>
            Loading...
          </Button>
        );
      }

    const subtotal = data.items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
    const shipping = subtotal * 0.15;
    const tax = subtotal * 0.15;
    const total = subtotal + shipping + tax;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-[#331d67] text-white text-sm rounded-sm px-4 py-2">
                    View Details
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-7xl p-6 overflow-x-auto">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex flex-col gap-2">
                            <p className="text-md font-semibold capitalize">
                                Order <span className="text-[#331d67] text-md font-bold">#{data.id}</span>
                            </p>
                            <div className="flex items-center justify-between gap-2 py-4">
                                <p className="text-sm font-semibold text-gray-500">{data.order_date}</p>
                                <p className="text-sm font-semibold text-green-500 bg-green-500/10 rounded-sm px-4 py-1">
                                    {data.status}
                                </p>
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    {data.items.map((item, index) => (
                        <div key={index} className="flex gap-4 items-center justify-between">
                            <div className="flex gap-4 items-center">
                                <Image
                                    src={item.main_image}
                                    alt={item.product_name}
                                    width={50}
                                    height={50}
                                    className="rounded"
                                />
                                <div className="flex flex-col gap-1">
                                    <p className="text-md font-semibold capitalize">{item.product_name}</p>
                                    <p className="text-sm font-semibold text-gray-500 capitalize">{item.size}</p>
    
                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <p className="text-sm font-semibold text-gray-500">${item.price}</p> x
                                <p className="text-sm font-semibold text-gray-500">{item.quantity}</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-500">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start mt-4 border-t-2 border-gray-500/10 pt-4 gap-4">
                    <div className="flex flex-col gap-2  border-gray-500/10 pr-4 w-full sm:w-[300px]">
                        <p className="text-sm font-semibold text-gray-500">Order Note</p>
                        <p className="text-sm font-semibold text-gray-500 bg-gray-500/10 rounded-sm px-4 py-1 whitespace-pre-wrap">
                            order will be sent with 3-5 business days.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <div className="flex gap-2 items-center justify-between">
                            <p className="text-sm font-semibold text-gray-500">Subtotal:</p>
                            <p className="text-sm font-semibold text-gray-500">${subtotal.toFixed(2)}</p>
                        </div>
                        <div className="flex gap-2 items-center justify-between">
                            <p className="text-sm font-semibold text-gray-500">Shipping:</p>
                            <p className="text-sm font-semibold text-gray-500">${shipping.toFixed(2)}</p>
                        </div>
                        <div className="flex gap-2 items-center justify-between">
                            <p className="text-sm font-semibold text-gray-500">Tax:</p>
                            <p className="text-sm font-semibold text-gray-500">${tax.toFixed(2)}</p>
                        </div>
                        <div className="flex gap-2 items-center justify-between border-t-2 border-gray-500/10 pt-2">
                            <p className="text-sm font-semibold text-gray-500">Total:</p>
                            <p className="text-sm font-semibold text-gray-500">${total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}