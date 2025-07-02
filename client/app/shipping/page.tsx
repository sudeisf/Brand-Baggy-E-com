"use client";

import { ProductCrum } from "@/app/products/components/ProductCrum"
import BillingInformation from "./components/InputInformation";
import ShippingInformation from "./components/ShippingInfrom";
import PaymentMethod from "./components/PaymentMethod";
import Summery from "./components/summery";
import { useAddOrderMutation } from "@/hooks/use-order";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { useOrderStore } from "@/store/orderStore";
import { useQueryClient } from "@tanstack/react-query";

export default function ShippingPage() {
  const router = useRouter();
  const mutuate = useAddOrderMutation();
  const [shippingData, setShippingData] = useState<any>(null);
  const { setCurrentOrder } = useOrderStore();
  const queryClient = useQueryClient()
  
  const handleShippingChange = (data: any) => {
    setShippingData(data);
  };

  const handlePlaceOrder = () => {
    if (!shippingData) {
      toast.error("Please fill in shipping information first");
      return;
    }
 
    const orderData = {
      shipping_info: shippingData
    };
    
    console.log("Submitting order data:", orderData);
    
    mutuate.mutate(
      orderData,
      {
        onSuccess: (data) => {
       
          const paymentUrl = `/payment?order_id=${data.id}`;
          toast.success("Order created successfully.");
          router.push(paymentUrl);
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
          }, 3000);
        },
        onError: (error: any) => {
          console.error("Order creation failed:", error);
          toast.error(error?.message || "Failed to create order");
        }
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-5 mb-10">
      <ProductCrum />
      <h1 className="text-4xl w-[1250px] mx-auto text-[#331d67] font-roboto py-5 px-2.5 font-bold ">Shipping Details</h1>
      <div className="w-[1250px] mx-auto">
        <div className="flex gap-4">
          <div className="w-[60%] border-1 shadow-xs border-gray-200 rounded-xl">
            <ShippingInformation onChange={handleShippingChange} />
            <BillingInformation />
          </div>
          <div className="w-[40%]">
            <Summery onPlaceOrder={handlePlaceOrder} />
          </div>
        </div>
      </div>
    </div>
  )
}
    