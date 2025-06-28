"use client";

import { ProductCrum } from "@/app/products/components/ProductCrum"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Coins } from "lucide-react"
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CardMethod } from "./components/CardMethod";
import FinalSummery from "./components/FinalSummery";
import CashOnDelivery from "./components/CodMethod";
import { Button } from "@/components/ui/button";
import { PaypalReactButton } from "./components/PaypalReactButton";
import { useSearchParams } from 'next/navigation';

export default function PaymentPage() {
    const [paymentMethod, setPaymentMethod] = useState<string>("paypal");
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');

    const handlePaymentMethodChange = (value: string) => {
        setPaymentMethod(value);
    }
    

  return (
    <div className="container mx-auto px-4 py-5 mb-10 min-h-screen">
      <ProductCrum />

       <div className="flex flex-col w-[1250px] mx-auto mb-4 ">
            <h1 className="text-4xl font-bold text-[#331d67] p-2 mt-2">Payment Method</h1>
            <p className="text-gray-500 text-md p-2 mt-2">Please select the payment method you want to use</p>
       </div>

      <div className="flex gap-4 justify-center px-4">
      <div>
        <div className="w-[700px] mx-auto">
           <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodChange} className="flex gap-4 rounded-xl ">
            <div
                onClick={() => handlePaymentMethodChange("paypal")}
                className={`w-1/3 border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                    paymentMethod === "paypal" 
                    ? " bg-gray-100" 
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <h1 className="font-medium text-[#331d67]">PayPal</h1>
                </div>
                <img src="/assets/paypal.svg" alt="paypal" className="w-20 h-20" />
            </div>
            <div 
                onClick={() => handlePaymentMethodChange("stripe")}
                className={`w-1/3 border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                    paymentMethod === "stripe" 
                    ? " bg-gray-100" 
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <h1 className="font-medium text-[#331d67]">Stripe</h1>
                </div>
                <img src="/assets/stripe.svg" alt="stripe" className="w-20 h-20" />
            </div>
            <div 
                onClick={() => handlePaymentMethodChange("cash")}
                className={`w-1/3 border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                    paymentMethod === "cash" 
                    ? " bg-gray-100" 
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <h1 className="font-medium text-[#331d67]">Cash On Delivery</h1>
                </div>
                <Coins className="w-16 h-16 text-[#331d67] mt-2" />
            </div>
        </RadioGroup>
      </div>

      <div>
        {paymentMethod === "paypal" && orderId && (
            <PaypalReactButton orderId={parseInt(orderId)} />
        )}

        {paymentMethod === "stripe" && (
            <CardMethod />
        )}


        {paymentMethod === "cash" && (
            <CashOnDelivery />
        )}
</div>
      <div className="flex justify-start items-center border-t border-gray-200 pt-4">
        <Button className="bg-[#331d67]/40 text-white h-10 rounded-md hover:bg-[#331d67]">
            <Link href="/shipping" className="flex items-center  gap-2">
                <ArrowLeft className="w-4 h-4" />
                Edit Shipping Address
            </Link>
        </Button>   
     </div>
      </div>
      <FinalSummery paymentMethod={paymentMethod} />
     </div>
     
    </div>

  ) 
}