"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Eye } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scrollarea";

type Order = {
  id: string;
  orderDate: string;
  customer: string;
  email: string;
  phone: string;
  total: number;
  paymentStatus: string;
  items: { name: string; price: number; image: string }[];
  orderStatus: number;
};

type Props = {
  order: Order;
};

export default function OrderDetails({ order }: Props) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return "Processing";
      case 2:
        return "Shipped";
      case 3:
        return "Delivered";
      case 4:
        return "Returned";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
      <Button
          variant="ghost"
          className="w-full font-roboto px-2 text-gray-700 justify-start"
          aria-label="View order details"
        >
          View Detail
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[500px] sm:max-w-[90vw]">
        <SheetTitle className="text-gray-600 font-roboto space-y-1 p-4 border-b-1 w-full mx-auto">
          <p className="text-md">{order.id}</p>
          <p className="text-gray-700 font-roboto font-medium text-sm ">Order details</p>
        </SheetTitle>
        <div className="flex flex-col">
            <div className="px-4 space-y-2">
              <h1 className="font-roboto font-medium text-md text-gray-700 capitalize">Items</h1>
              <ScrollArea className="flex flex-col gap-4 max-h-52 px-2 ">
                  {
                    order.items.map((item,index)=> {
                      return(
                          <div key={index} className="w-full flex justify-between items-center mb-4">
                              <div className="flex gap-4">
                                <Image src={`${item.image}`} width={40} height={40} alt={"product image"} className="rounded-md shadow-sm border-2" />
                                <p>{item.name}</p>
                              </div>
                                <p>{item.price}</p>
                          </div>
                      )
                    })
                  }
              </ScrollArea>
              <div className="w- space-y-3 px-2 border-t py-2">
                    <div className="flex justify-between">
                      <p className="font-roboto  text-gray-500">Created at</p>
                      <p className="font-roboto font-medium text-black text-sm">{formatDate(order.orderDate)}</p> 
                    </div>

                    <div className="flex justify-between">
                      <p className="font-roboto  text-gray-500">Payment method</p>
                      <p className="font-roboto font-medium text-black text-sm">COD</p>
                    </div>
                    
                    <div className="flex justify-between">
                      <p className="font-roboto  text-gray-500">Status</p>
                      <p className="font-roboto font-medium text-black text-sm">{order.paymentStatus}</p>
                    </div>
              </div>
              <div className="w- space-y-3 py-2 px-2 border-t">
                <div className="flex justify-between">
                  <p className="font-roboto  text-gray-500">Customer name</p>
                  <p className="font-roboto font-medium text-black text-sm">{order.customer}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-roboto  text-gray-500">Email</p>
                  <p className="font-roboto font-medium text-black text-sm">{order.email}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-roboto  text-gray-500">Phone</p>
                  <p className="font-roboto font-medium text-black text-sm">{order.phone}</p>
                </div>
              </div>
              <div className="w- space-y-3 py-2 px-2 border-t">
                <h1>Payment</h1>
                <div className="flex justify-between">
                  <p className="font-roboto  text-gray-500">Subtotal</p>
                  <p className="font-roboto font-medium text-black text-sm">{order.total}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-roboto  text-gray-500">Shipping fee</p>
                  <p className="font-roboto font-medium text-black text-sm">free</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-roboto  text-gray-500">Total</p>
                  <p className="font-roboto font-medium text-black text-sm">{order.total}</p>
                </div>
              </div>

            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}