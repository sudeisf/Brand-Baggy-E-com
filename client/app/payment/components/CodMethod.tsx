"use client"
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

export default function CashOnDelivery() {
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (isConfirmed) {
    return (
      <div className="p-6 w-[700px] mx-auto rounded-xl border-2 border-green-200 bg-green-50 mt-4">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h1 className="text-xl font-semibold text-[#331d67]">Order Confirmed!</h1>
        </div>
        <p className="text-gray-600 mb-4">
          Your cash on delivery order has been placed. We'll call you within 24 hours to confirm delivery time.
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Estimated delivery: 3-5 business days</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-[700px] mx-auto rounded-xl border-2 border-gray-200 bg-gray-50 mt-4 space-y-4">
      <h1 className="text-xl font-semibold text-[#331d67]">Cash On Delivery</h1>
      <div className="space-y-2 text-gray-600">
        <p>• Pay with cash when your order arrives</p>
        <p>• Please have exact amount ready</p>
        <p>• Delivery agent will provide receipt</p>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              A $2.00 cash handling fee will be added to your order total.
            </p>
          </div>
        </div>
      </div>

      <Button 
        onClick={() => setIsConfirmed(true)}
        className="w-full mt-4 bg-[#331d67] hover:bg-[#4a2d8a]"
      >
        Confirm Cash Payment
      </Button>
    </div>
  );
}