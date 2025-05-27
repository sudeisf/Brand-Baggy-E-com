
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Eye } from "lucide-react";
import { useState } from "react";

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
      <SheetContent side="right" className="w-[700px] sm:max-w-[90vw]">
        <SheetTitle>{order.id} - Order Details</SheetTitle>
        <div className="space-y-4 p-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="col-span-2 font-bold">Customer</Label>
              <p className="col-span-2">{order.customer}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="col-span-2 font-bold">Email</Label>
              <p className="col-span-2">{order.email}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="col-span-2 font-bold">Phone</Label>
              <p className="col-span-2">{order.phone}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="col-span-2 font-bold">Order Date</Label>
              <p className="col-span-2">{new Date(order.orderDate).toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="col-span-2 font-bold">Total</Label>
              <p className="col-span-2">${order.total.toFixed(2)}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="col-span-2 font-bold">Payment</Label>
              <p className="col-span-2">{order.paymentStatus}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="col-span-2 font-bold">Status</Label>
              <p className="col-span-2">{getStatusText(order.orderStatus)}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="col-span-2 font-bold">Items</Label>
              <div className="col-span-2 space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/48";
                      }}
                    />
                    <div>
                      <p>{item.name}</p>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(`https://wa.me/${order.phone.replace(/[^0-9]/g, "")}`, "_blank")}
            >
              Contact via WhatsApp
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}