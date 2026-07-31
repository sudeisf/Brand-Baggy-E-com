"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Loader2Icon } from "lucide-react";
import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  orderId: number;
};

export default function CashOnDelivery({ orderId }: Props) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await api.post("/payment/pay/cod/", { order_id: orderId });
      setIsConfirmed(true);
      toast.success("Cash on delivery order confirmed");
      queryClient.invalidateQueries({ queryKey: ["getUserOrders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setTimeout(() => router.push("/profile/orders"), 1500);
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to confirm cash payment";
      toast.error(typeof message === "string" ? message : "Failed to confirm cash payment");
    } finally {
      setLoading(false);
    }
  };

  if (isConfirmed) {
    return (
      <div className="p-6 w-full rounded-xl border border-green-200 bg-green-50 space-y-3">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h2 className="text-xl font-semibold text-[#331d67] font-roboto">Order Confirmed!</h2>
        </div>
        <p className="text-gray-600 font-roboto text-sm">
          Your cash on delivery order has been placed. We&apos;ll call you within 24 hours to confirm delivery time.
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Estimated delivery: 3-5 business days</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full rounded-xl border border-gray-200 bg-gray-50 space-y-4">
      <h2 className="text-xl font-semibold text-[#331d67] font-roboto">Cash On Delivery</h2>
      <div className="space-y-2 text-gray-600 text-sm font-roboto">
        <p>• Pay with cash when your order arrives</p>
        <p>• Please have exact amount ready</p>
        <p>• Delivery agent will provide receipt</p>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <p className="text-sm text-yellow-700 font-roboto">
          Please keep your phone available so we can confirm the delivery address.
        </p>
      </div>

      <Button
        onClick={handleConfirm}
        disabled={loading}
        className="w-full mt-2 py-6 bg-[#331d67] hover:bg-[#331d67]/90"
      >
        {loading ? (
          <>
            <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
            Confirming...
          </>
        ) : (
          "Confirm Cash Payment"
        )}
      </Button>
    </div>
  );
}
