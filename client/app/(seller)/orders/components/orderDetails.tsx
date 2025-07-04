"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Eye } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scrollarea";
import { useSellerOrderDetails } from "@/hooks/use-order";
import dayjs from "dayjs"



type Props = {
  order_id: number;
};

export default function OrderDetails({ order_id }: Props) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const {data:details ,isLoading , error} = useSellerOrderDetails(order_id)
  

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
    const date = dayjs(dateString).format("MMMM D, YYYY h:mm A");
    return date
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
          <p className="text-md">{details?.id}</p>
          <p className="text-gray-700 font-roboto font-medium text-sm ">Order details</p>
        </SheetTitle>
        <div className="flex flex-col">
            <div className="px-4 space-y-2">
              <h1 className="font-roboto font-medium text-md text-gray-700 capitalize">Items</h1>
              <ScrollArea className="flex flex-col gap-4 max-h-52 px-2 ">
                  {
                    details?.items.map((item,index)=> {
                      return(
                          <div key={index} className="w-full flex justify-between items-center mb-4">
                              <div className="flex gap-4">
                                <Image src={`${item.main_image}`} width={40} height={40} alt={"product image"} className="rounded-md shadow-sm border-2" />
                                <p>{item.product_name}</p>
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
                      <p className="font-roboto font-medium text-black text-sm">{formatDate(details?.order_date?? "")}</p> 
                    </div>

                    <div className="flex justify-between">
                      <p className="font-roboto  text-gray-500">Payment method</p>
                      <p className="font-roboto font-medium text-black text-sm">{details?.payment_method}</p>
                    </div>
                    
                    <div className="flex justify-between">
                      <p className="font-roboto  text-gray-500">Status</p>
                      <p className="font-roboto font-medium text-black text-sm">{details?.status}</p>
                    </div>
              </div>
              <div className="w- space-y-3 py-2 px-2 border-t">
                <div className="flex justify-between">
                  <p className="font-roboto  text-gray-500">Customer name</p>
                  <p className="font-roboto font-medium text-black text-sm">{details?.user_data.full_name}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-roboto  text-gray-500">Email</p>
                  <p className="font-roboto font-medium text-black text-sm">{details?.user_data.email}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-roboto  text-gray-500">Phone</p>
                  <p className="font-roboto font-medium text-black text-sm">{details?.user_data.phone}</p>
                </div>
              </div>
              <div className="w- space-y-3 py-2 px-2 border-t">
                <h1>Payment</h1>
                <div className="flex justify-between">
                  <p className="font-roboto  text-gray-500">Subtotal</p>
                  <p className="font-roboto font-medium text-black text-sm">{details?.total_price}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-roboto  text-gray-500">Shipping fee</p>
                  <p className="font-roboto font-medium text-black text-sm">free</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-roboto  text-gray-500">Total</p>
                  <p className="font-roboto font-medium text-black text-sm">{details?.total_price}</p>
                </div>
              </div>

            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}