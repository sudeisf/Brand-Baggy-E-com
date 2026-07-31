"use client"

import { useState } from "react"
import { loadStripe, type Stripe } from "@stripe/stripe-js"
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
import { Button } from "@/components/ui/button"
import { Loader2Icon } from "lucide-react"

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""

let stripePromise: Promise<Stripe | null> | null = null

function getStripe() {
  if (!stripePublishableKey) return null
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey)
  }
  return stripePromise
}

function CheckoutForm({ orderId }: { orderId: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [cardReady, setCardReady] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) return

    setLoading(true)

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      })

      if (error || !paymentMethod) {
        toast.error(error?.message || "Failed to create payment method")
        return
      }

      await api.post("/payment/stripe/pay-and-capture/", {
        order_id: orderId,
        payment_method_id: paymentMethod.id,
      })

      toast.success("Payment successful and order completed!")
      queryClient.invalidateQueries({ queryKey: ["getUserOrders"] })
      router.push("/profile/orders")
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Payment failed, please try again"
      toast.error(typeof message === "string" ? message : "Payment failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="p-4 border border-gray-200 rounded-lg bg-white min-h-[52px]">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                fontFamily: '"Neue Montreal", Satoshi, sans-serif',
                letterSpacing: '-0.01em',
                "::placeholder": {
                  color: "#a0aec0",
                },
              },
              invalid: {
                color: "#fa755a",
              },
            },
          }}
          onReady={() => setCardReady(true)}
        />
      </div>

      <Button
        type="submit"
        disabled={loading || !stripe || !cardReady}
        className="w-full bg-[#331d67] hover:bg-[#331d67]/90 text-white py-6"
      >
        {loading ? (
          <>
            <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          "Pay with Stripe"
        )}
      </Button>
    </form>
  )
}

export default function StripeCheckout({ orderId }: { orderId: number }) {
  const stripe = getStripe()

  if (!stripePublishableKey || !stripe) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Stripe is not configured. Set <code className="font-mono">NEXT_PUBLIC_STRIPE_PUBLIC_KEY</code> and
        rebuild the frontend.
      </div>
    )
  }

  return (
    <Elements stripe={stripe}>
      <CheckoutForm orderId={orderId} />
    </Elements>
  )
}
