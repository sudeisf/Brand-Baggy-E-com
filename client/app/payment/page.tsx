"use client";

import { ProductCrum } from "@/app/products/components/ProductCrum";
import { ArrowLeft, Coins } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CardMethod } from "./components/CardMethod";
import FinalSummery from "./components/FinalSummery";
import CashOnDelivery from "./components/CodMethod";
import { Button } from "@/components/ui/button";
import { PaypalReactButton } from "./components/PaypalReactButton";
import { useSearchParams } from "next/navigation";
import StripeCheckout from "./components/StripeCheckout"
import { string } from "zod";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<string>("paypal");
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="container mx-auto px-4 py-5 mb-10 min-h-screen">
      <ProductCrum />

      <div className="flex flex-col w-full max-w-[1250px] mx-auto mb-6">
        <h1 className="text-4xl font-bold text-[#331d67] p-2 mt-2">Payment Method</h1>
        <p className="text-gray-500 text-md p-2 mt-2">
          Please select the payment method you want to use
        </p>
      </div>
      <div className="flex max-w-[1240px] mx-auto space-x-5">
      <div className="flex-col justify-between h-full">
      <div className="flex justify-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => setPaymentMethod("paypal")}
          className={`w-60 p-6 flex flex-col h-20 items-center gap-2 rounded-xl border-2 ${
            paymentMethod === "paypal" ? "border-[#331d67] bg-gray-100" : ""
          }`}
        >
          <img src="/assets/paypal.svg" alt="paypal" className="w-16 h-16" />
          {/* <span className="text-[#331d67] font-medium">PayPal</span> */}
        </Button>

        <Button
          variant="outline"
          onClick={() => setPaymentMethod("stripe")}
          className={`w-60 p-6 flex flex-col h-20 items-center gap-2 rounded-xl border-2 ${
            paymentMethod === "stripe" ? "border-[#331d67] bg-gray-100" : ""
          }`}
        >
          <img src="/assets/stripe.svg" alt="stripe" className="w-16 h-16" />
          {/* <span className="text-[#331d67] font-medium">Stripe</span> */}
        </Button>

        <Button
          variant="outline"
          onClick={() => setPaymentMethod("cash")}
          className={`w-60 p-6 flex flex-col h-20 items-center gap-2 rounded-xl border-2 ${
            paymentMethod === "cash" ? "border-[#331d67] bg-gray-100" : ""
          }`}
        >
          <Coins className="w-10 h-10 text-[#331d67]" />
          <span className="text-[#331d67] font-medium">Cash on Delivery</span>
        </Button>
      </div>
      <div className="flex flex-col items-center">
        {paymentMethod === "paypal" && orderId ? (
          <PaypalReactButton orderId={parseInt(orderId)} />
        ) : paymentMethod === "paypal" ? (
          <p className="text-red-500">Missing order information</p>
        ) : null}

        {paymentMethod === "stripe" && orderId && (
          <div className="w-full max-w-md p-6 bg-white rounded shadow mx-auto">
            <StripeCheckout orderId={parseInt(orderId)} />
          </div>
        )}
        
        {paymentMethod === "cash" && <CashOnDelivery />}
      </div>

      <div className="flex justify-start items-center border-t border-gray-200 pt-4 mt-10">
        <Button className="bg-[#331d67]/40 text-white h-10 rounded-md hover:bg-[#331d67]">
          <Link href="/shipping" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Edit Shipping Address
          </Link>
        </Button>
      </div>
      </div>
          <div>  
           <FinalSummery paymentMethod={paymentMethod} />
          </div>
      </div>
      
    </div>
  );
}
