"use client";

import {
  PayPalScriptProvider,
  PayPalButtons,
  ReactPayPalScriptOptions,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useActionState, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

type Props = {
  orderId: number;
};

const initialOptions: ReactPayPalScriptOptions = {
  clientId: "AS9bn9IUeqoppNyayui-Ko3ATsUx9jFO90zqcjOO22Mm5hHPCKsW8qlWgmj-VhbPw8mRWDv1XimX7NfA", 
  currency: "USD",
  components: "buttons",
  intent: "capture",
  disableFunding: "venmo",
};

function PaypalButtonLogic({ orderId }: Props) {
  const [{ isPending, isInitial, isRejected }] = usePayPalScriptReducer();
  const [isPayPalReady, setIsPayPalReady] = useState(false);
  const accessToken = useAuthStore((s)=>s.accessToken);
  useEffect(() => {
    const checkPayPal = () => {
      if (typeof window !== 'undefined' && window.paypal && window.paypal.Buttons) {
        setIsPayPalReady(true);
      } else {
        setTimeout(checkPayPal, 100);
      }
    };
    checkPayPal();
  }, []);

  const createOrder = useCallback(async () => {
    try {
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ order_id: orderId }),
      });
      if (!res.ok) throw new Error("Failed to create PayPal order");
      const data = await res.json();
      return data.paypal_order_id;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      throw error;
    }
  }, [orderId, accessToken]);

  const onApprove = useCallback(async (data: any) => {
    try {
      const res = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          paypal_payment_id: data.orderID,
          order_id: orderId,
        }),
      });

      if (res.ok) {
        window.location.href = "/payment/success";
      } else {
        alert("Error capturing payment");
      }
    } catch (error) {
      console.error("Error capturing payment:", error);
      alert("Error capturing payment");
    }
  }, [orderId, accessToken]);

  const onError = useCallback((err: any) => {
    console.error("❌ PayPal Error", err);
    alert("Something went wrong during the payment.");
  }, []);

  if (isPending || isInitial || !isPayPalReady) return <p>Loading PayPal button...</p>;
  if (isRejected) return <p>Failed to load PayPal. Please refresh the page.</p>;

  return (
    <PayPalButtons
      style={{ layout: "vertical", shape: "rect" }}
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onError}
    />
  );
}

export function PaypalReactButton({ orderId }: Props) {
  return (
    <PayPalScriptProvider options={initialOptions}>
      <PaypalButtonLogic orderId={orderId} />
    </PayPalScriptProvider>
  );
}
