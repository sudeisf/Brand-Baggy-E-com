"use client"

import { useEffect, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js"
import api from "@/lib/axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

function CheckoutForm({ orderId }: { orderId: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const queryClieint = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) return

    setLoading(true)

    try {
      // Step 1: create PaymentMethod from card input
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      })

      if (error || !paymentMethod) {
        alert(error?.message || "Failed to create payment method")
        setLoading(false)
        return
      }

      const res = await api.post("/payment/stripe/pay-and-capture/", {
        order_id: orderId,
        payment_method_id: paymentMethod.id,
      })

      toast.success("Payment successful and order completed!")
      queryClieint.invalidateQueries({queryKey : ["getUserOrders"]})
      router.push("/profile/orders")



    } catch (err: any) {
     
      toast.error("Payment failed please try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto w-full">
  <div className="p-4 border rounded bg-white w-full">
    <CardElement
      options={{
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: 'inherit',
            '::placeholder': {
              color: '#a0aec0',
            },
          },
          invalid: {
            color: '#fa755a',
          },
        },
      }}
    />
  </div>

  <button
    type="submit"
    disabled={loading || !stripe}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
  >
    {loading ? "Processing..." : "Pay with Stripe"}
  </button>
</form>

  )
}

export default function StripeCheckout({ orderId }: { orderId: number }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm orderId={orderId} />
    </Elements>
  )
}
