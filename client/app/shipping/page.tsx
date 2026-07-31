"use client";

import { ProductCrum } from "@/app/products/components/ProductCrum"
import ShippingInformation from "./components/ShippingInfrom";
import Summery from "./components/summery";
import { useAddOrderMutation } from "@/hooks/use-order";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { useOrderStore } from "@/store/orderStore";
import { useQueryClient } from "@tanstack/react-query";

type ShippingFormData = {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
};

export default function ShippingPage() {
  const router = useRouter();
  const mutuate = useAddOrderMutation();
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const { setCurrentOrder } = useOrderStore();
  const queryClient = useQueryClient()
  
  const handleShippingChange = (data: ShippingFormData) => {
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
    
    mutuate.mutate(
      orderData,
      {
        onSuccess: (data) => {
          setCurrentOrder(data as any);
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
    <div className="min-h-screen bg-white mb-10">
      <ProductCrum />
      <div className="container mx-auto px-4 py-6 max-w-[1250px]">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl text-[#331d67] font-roboto font-bold">
            Shipping Details
          </h1>
          <p className="text-gray-500 font-roboto mt-1 text-sm md:text-base">
            Enter your delivery address to continue to payment
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          <div className="w-full lg:flex-1 border border-gray-200 rounded-xl bg-white p-4 sm:p-6 shadow-sm">
            <ShippingInformation onChange={handleShippingChange} />
          </div>
          <div className="w-full lg:w-[380px] lg:sticky lg:top-6">
            <Summery
              onPlaceOrder={handlePlaceOrder}
              isLoading={mutuate.isPending}
              canPlaceOrder={Boolean(shippingData)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
