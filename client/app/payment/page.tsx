"use client";

import { ProductCrum } from "@/app/products/components/ProductCrum";
import { ArrowLeft, Coins, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CashOnDelivery from "./components/CodMethod";
import { PaypalReactButton } from "./components/PaypalReactButton";
import StripeCheckout from "./components/StripeCheckout";
import { useSearchParams } from "next/navigation";

function PaymentMethodButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-56 min-h-[120px] px-4 py-5 flex flex-col items-center justify-center gap-2 rounded-xl border-2 bg-white transition-colors ${
        selected
          ? "border-[#331d67] bg-gray-50 shadow-sm"
          : "border-gray-200 hover:border-[#331d67]/40"
      }`}
    >
      {children}
    </button>
  );
}

function PaymentContent() {
  const [paymentMethod, setPaymentMethod] = useState<string>("paypal");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const parsedOrderId = orderId ? parseInt(orderId, 10) : NaN;
  const hasOrder = Number.isFinite(parsedOrderId);

  const handlePaymentSelect = (method: string) => {
    setPaymentMethod(method);
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-white mb-10">
      <ProductCrum />

      <div className="container mx-auto px-4 py-6 max-w-[1250px]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#331d67] font-roboto">
            Payment Method
          </h1>
          <p className="text-gray-500 mt-2 font-roboto">
            Please select the payment method you want to use
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="hidden md:flex justify-center flex-wrap gap-4 mb-8">
            <PaymentMethodButton
              selected={paymentMethod === "paypal"}
              onClick={() => setPaymentMethod("paypal")}
            >
              <img src="/assets/paypal.svg" alt="PayPal" className="w-14 h-14 object-contain" />
              <span className="text-[#331d67] font-medium font-roboto">PayPal</span>
            </PaymentMethodButton>

            <PaymentMethodButton
              selected={paymentMethod === "stripe"}
              onClick={() => setPaymentMethod("stripe")}
            >
              <img src="/assets/stripe.svg" alt="Stripe" className="w-14 h-14 object-contain" />
              <span className="text-[#331d67] font-medium font-roboto">Stripe</span>
            </PaymentMethodButton>

            <PaymentMethodButton
              selected={paymentMethod === "cash"}
              onClick={() => setPaymentMethod("cash")}
            >
              <Coins className="w-10 h-10 text-[#331d67]" />
              <span className="text-[#331d67] font-medium font-roboto text-center">
                Cash on Delivery
              </span>
            </PaymentMethodButton>
          </div>

          <div className="md:hidden mb-6 w-full flex justify-center">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full max-w-sm text-[#331d67] border-2 border-[#331d67] bg-white hover:bg-gray-50">
                  Choose Payment Method <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="flex flex-col gap-3">
                <DialogTitle className="text-lg font-semibold text-[#331d67]">
                  Select Payment Method
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  Choose your preferred payment method to complete your order.
                </DialogDescription>
                <Button
                  variant="outline"
                  onClick={() => handlePaymentSelect("paypal")}
                  className="w-full flex items-center justify-start gap-3 border-2 h-14"
                >
                  <img src="/assets/paypal.svg" alt="PayPal" className="w-8 h-8" />
                  <span className="text-[#331d67] font-medium">PayPal</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePaymentSelect("stripe")}
                  className="w-full flex items-center justify-start gap-3 border-2 h-14"
                >
                  <img src="/assets/stripe.svg" alt="Stripe" className="w-8 h-8" />
                  <span className="text-[#331d67] font-medium">Stripe</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePaymentSelect("cash")}
                  className="w-full flex items-center justify-start gap-3 border-2 h-14"
                >
                  <Coins className="w-6 h-6 text-[#331d67]" />
                  <span className="text-[#331d67] font-medium">Cash on Delivery</span>
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          <div className="w-full max-w-md">
            {!hasOrder ? (
              <p className="text-center text-red-500 font-roboto">
                Missing order information. Please place your order again from shipping.
              </p>
            ) : (
              <>
                {paymentMethod === "paypal" && (
                  <PaypalReactButton orderId={parsedOrderId} />
                )}
                {paymentMethod === "stripe" && (
                  <div className="w-full p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <StripeCheckout orderId={parsedOrderId} />
                  </div>
                )}
                {paymentMethod === "cash" && (
                  <CashOnDelivery orderId={parsedOrderId} />
                )}
              </>
            )}
          </div>

          <div className="flex justify-start w-full max-w-md border-t border-gray-200 pt-4 mt-10">
            <Button asChild className="bg-[#331d67] text-white h-10 rounded-md hover:bg-[#331d67]/90">
              <Link href="/shipping" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Edit Shipping Address
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading payment details...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
