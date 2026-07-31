"use client";

import {
  PayPalScriptProvider,
  PayPalButtons,
  ReactPayPalScriptOptions,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

type Props = {
  orderId: number;
};

const paypalClientId =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
  "AS9bn9IUeqoppNyayui-Ko3ATsUx9jFO90zqcjOO22Mm5hHPCKsW8qlWgmj-VhbPw8mRWDv1XimX7NfA";

const initialOptions: ReactPayPalScriptOptions = {
  clientId: paypalClientId,
  currency: "USD",
  components: "buttons",
  intent: "capture",
  disableFunding: "venmo",
};

function PaypalButtonLogic({ orderId }: Props) {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  const accessToken = useAuthStore((s) => s.accessToken);

  const createOrder = useCallback(async () => {
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ order_id: orderId }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.paypal_order_id) {
      throw new Error(data.error || "Failed to create PayPal order");
    }
    return data.paypal_order_id as string;
  }, [orderId, accessToken]);

  const onApprove = useCallback(
    async (data: { orderID?: string }) => {
      try {
        const res = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            paypal_payment_id: data.orderID,
            order_id: orderId,
          }),
        });

        if (res.ok) {
          toast.success("Payment successful");
          window.location.href = "/profile/orders";
        } else {
          const err = await res.json().catch(() => ({}));
          toast.error(err.error || "Error capturing payment");
        }
      } catch {
        toast.error("Error capturing payment");
      }
    },
    [orderId, accessToken]
  );

  if (isPending) {
    return <p className="text-center text-gray-500 py-6">Loading PayPal...</p>;
  }

  if (isRejected) {
    return (
      <p className="text-center text-red-500 py-6">
        Failed to load PayPal. Please refresh the page.
      </p>
    );
  }

  return (
    <PayPalButtons
      style={{ layout: "vertical", shape: "rect" }}
      createOrder={createOrder}
      onApprove={onApprove}
      onError={() => toast.error("Something went wrong during PayPal payment.")}
    />
  );
}

export function PaypalReactButton({ orderId }: Props) {
  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="w-full min-h-[150px]">
        <PaypalButtonLogic orderId={orderId} />
      </div>
    </PayPalScriptProvider>
  );
}
