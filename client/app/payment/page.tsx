// app/payment/page.tsx
"use client";

import { ProductCrum } from "@/app/products/components/ProductCrum";
import { ArrowLeft, Coins, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CashOnDelivery from "./components/CodMethod";
import { PaypalReactButton } from "./components/PaypalReactButton";
import StripeCheckout from "./components/StripeCheckout";
import { useSearchParams } from "next/navigation";

function PaymentContent() {
  const [paymentMethod, setPaymentMethod] = useState<string>("paypal");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const handlePaymentSelect = (method: string) => {
    setPaymentMethod(method);
    setDialogOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-5 mb-10 min-h-screen">
      <ProductCrum />

      {/* Title */}
      <div className="flex flex-col w-full max-w-[1250px] mx-auto mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#331d67] p-2 mt-2">
          Payment Method
        </h1>
        <p className="text-gray-500 text-md p-2">
          Please select the payment method you want to use
        </p>
      </div>

      {/* Payment Selection */}
      <div className="w-full max-w-[1250px] mx-auto flex flex-col items-center">
        {/* Desktop View */}
        <div className="hidden md:flex justify-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => setPaymentMethod("paypal")}
            className={`w-60 p-6 flex flex-col h-20 items-center gap-2 rounded-xl border-2 ${
              paymentMethod === "paypal" ? "border-[#331d67] bg-gray-100" : ""
            }`}
          >
            <img src="/assets/paypal.svg" alt="PayPal" className="w-16 h-16" />
            <span className="text-[#331d67] font-medium">PayPal</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setPaymentMethod("stripe")}
            className={`w-60 p-6 flex flex-col h-20 items-center gap-2 rounded-xl border-2 ${
              paymentMethod === "stripe" ? "border-[#331d67] bg-gray-100" : ""
            }`}
          >
            <img src="/assets/stripe.svg" alt="Stripe" className="w-16 h-16" />
            <span className="text-[#331d67] font-medium">Stripe</span>
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

        {/* Mobile/Tablet View (Dialog) */}
        <div className="md:hidden mb-6 w-full text-center">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full max-w-sm mx-auto text-[#331d67] border-2 border-[#331d67] bg-white">
                Choose Payment Method <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
              <DialogContent className="flex flex-col gap-4 items-center">
              <DialogTitle className="text-lg font-semibold text-[#331d67]">
                Select Payment Method
              </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mb-2">
              Choose your preferred payment method to complete your order.
            </DialogDescription>
              <Button
                variant="outline"
                onClick={() => handlePaymentSelect("paypal")}
                className="w-full flex items-center justify-start gap-3 border-2 -z-10"
              >
                <img src="/assets/paypal.svg" alt="PayPal" className="w-10 h-10" />
                <span className="text-[#331d67] font-medium">PayPal</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => handlePaymentSelect("stripe")}
                className="w-full flex items-center justify-start gap-3 border-2"
              >
                <img src="/assets/stripe.svg" alt="Stripe" className="w-10 h-10" />
                <span className="text-[#331d67] font-medium">Stripe</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => handlePaymentSelect("cash")}
                className="w-full flex items-center justify-start gap-3 border-2"
              >
                <Coins className="w-6 h-6 text-[#331d67]" />
                <span className="text-[#331d67] font-medium">Cash on Delivery</span>
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Payment Form Section */}
        <div className="w-full max-w-xl">
          {paymentMethod === "paypal" && orderId ? (
            <PaypalReactButton orderId={parseInt(orderId)} />
          ) : paymentMethod === "paypal" ? (
            <p className="text-red-500">Missing order information</p>
          ) : null}

          {paymentMethod === "stripe" && orderId ? (
            <div className="w-full max-w-md p-6 bg-white rounded shadow mx-auto">
              <StripeCheckout orderId={parseInt(orderId)} />
            </div>
          ) : paymentMethod === "stripe" ? (
            <p className="text-red-500">Missing order information</p>
          ) : null}

          {paymentMethod === "cash" && <CashOnDelivery />}
        </div>

        {/* Back to Shipping */}
        <div className="flex justify-start w-full max-w-xl border-t border-gray-200 pt-4 mt-10">
          <Button className="bg-[#331d67]/40 text-white h-10 rounded-md hover:bg-[#331d67]">
            <Link href="/shipping" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Edit Shipping Address
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading payment details...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
