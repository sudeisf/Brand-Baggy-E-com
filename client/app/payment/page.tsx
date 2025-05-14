"use client";

import { ProductCrum } from "@/app/products/components/ProductCrum"
import { Rubik } from "next/font/google"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Coins } from "lucide-react"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CardMethod } from "./components/CardMethod";
import FinalSummery from "./components/FinalSummery";
const rubik = Rubik({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    variable: '--font-rubik',
  });

export default function PaymentPage() {
    const [paymentMethod, setPaymentMethod] = useState<string>("paypal");

    const handlePaymentMethodChange = (value: string) => {
        setPaymentMethod(value);
    }
    

  return (
    <div className="container mx-auto px-4 py-5 mb-10">
      <ProductCrum />
      <div className="flex gap-4 justify-center p-4">
      <div>
        <div className="w-[700px] mx-auto">
            <h1 className={`text-4xl font-bold text-[#331d67] ${rubik.className} p-2 mt-4`}>Payment Method</h1>
        <p className={`text-gray-500 text-md ${rubik.className} p-2 mt-4`}>Please select the payment method you want to use</p>
        <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodChange} className="flex gap-4 rounded-xl mt-4">
            <div
                onClick={() => handlePaymentMethodChange("paypal")}
                className={`w-1/3 border-2 rounded-xl p-4 cursor-pointer transition-colors ${
                    paymentMethod === "paypal" 
                    ? " bg-gray-100" 
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <h1 className={`${rubik.className} font-medium text-[#331d67]`}>PayPal</h1>
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
                    <h1 className={`${rubik.className} font-medium text-[#331d67]`}>Stripe</h1>
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
                    <h1 className={`${rubik.className} font-medium text-[#331d67]`}>Cash On Delivery</h1>
                </div>
                <Coins className="w-16 h-16 text-[#331d67] mt-2" />
            </div>
        </RadioGroup>
      </div>

      <div>
        {(paymentMethod === "paypal" || paymentMethod === "stripe") && (
            <CardMethod />
        )}
        {paymentMethod === "cash" && (
            <div>
                <h1>Cash On Delivery</h1>
            </div>
        )}
      </div>
      </div>
      <FinalSummery />
     </div>
    </div>

  ) 
}