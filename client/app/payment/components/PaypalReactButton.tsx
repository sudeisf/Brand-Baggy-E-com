"use client";

import {
  PayPalScriptProvider,
  PayPalButtons,
  ReactPayPalScriptOptions,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useCallback, useEffect, useState } from "react";

type Props = {
  orderId: number;
};

const initialOptions: ReactPayPalScriptOptions = {
  clientId: "AS9bn9IUeqoppNyayui-Ko3ATsUx9jFO90zqcjOO22Mm5hHPCKsW8qlWgmj-VhbPw8mRWDv1XimX7NfA", 
  currency: "USD",
  components: "buttons",
  intent: "capture",
};


function PaypalButtonLogic({ orderId }: Props) {
  const [{ isPending, isInitial, isRejected }] = usePayPalScriptReducer();
  const [isPayPalReady, setIsPayPalReady] = useState(false);

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
        },
        body: JSON.stringify({ order_id: orderId }),
      });

      if (!res.ok) {
        throw new Error('Failed to create PayPal order');
      }

      const data = await res.json();
      return data.paypal_order_id;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      throw error;
    }
  }, [orderId]);

  const onApprove = useCallback(async (data: any) => {
    console.log("✅ Payment Approved", data);
    window.location.href = "/payment/success";
  }, []);

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

// ✅ The outer component stays clean
export function PaypalReactButton({ orderId }: Props) {
  return (
    <PayPalScriptProvider options={initialOptions}>
      <PaypalButtonLogic orderId={orderId} />
    </PayPalScriptProvider>
  );
}
