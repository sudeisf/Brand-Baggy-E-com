"use client"

import { Button } from "@/components/ui/button"
import { Loader2Icon, MoveRightIcon } from "lucide-react"
import Image from "next/image"
import { useCartStore } from "@/store/cartStore"

type Props = {
  onPlaceOrder?: () => void;
  isLoading?: boolean;
  canPlaceOrder?: boolean;
}

export default function Summery({ onPlaceOrder, isLoading = false, canPlaceOrder = false }: Props) {
  const items = useCartStore(s => s.items)
  const total = useCartStore(state => state.total)
  const discount = useCartStore(state => state.totalDiscount)
  const Subtotal = useCartStore(s => s.subtotal)

  return (
    <div className="border border-gray-200 rounded-xl w-full p-5 sm:p-6 h-fit bg-white shadow-sm space-y-5">
      <h2 className="text-xl font-roboto font-semibold text-[#331d67]">
        Order Summary
      </h2>

      <div className="flex flex-col gap-4 max-h-[280px] overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 font-roboto">Your cart is empty.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {item.main_image ? (
                  <Image
                    src={item.main_image}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="rounded-md object-cover border border-gray-200 shrink-0"
                    unoptimized
                  />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-gray-100 border border-gray-200 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="font-roboto font-medium text-gray-700 text-sm truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400 font-roboto">Qty {item.quantity}</p>
                </div>
              </div>
              <p className="font-roboto font-medium text-gray-700 text-sm whitespace-nowrap">
                {(item.price * item.quantity).toFixed(2)} ETB
              </p>
            </div>
          ))
        )}
      </div>

      <div className="space-y-2 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <p className="font-roboto text-gray-500">Subtotal</p>
          <p className="font-roboto font-medium tracking-wide">
            {Subtotal().toFixed(2)} ETB
          </p>
        </div>
        <div className="flex justify-between text-sm">
          <p className="font-roboto text-gray-500">Discount</p>
          <p className="font-roboto font-medium tracking-wide">
            {discount().toFixed(2)} ETB
          </p>
        </div>
        <div className="flex justify-between text-sm">
          <p className="font-roboto text-gray-500">Delivery Fee</p>
          <p className="font-roboto font-medium tracking-wide text-green-600">Free</p>
        </div>
      </div>

      <div className="flex justify-between border-t border-gray-200 pt-3">
        <p className="font-roboto font-medium text-gray-700">Total</p>
        <p className="text-xl font-roboto font-semibold text-[#331d67] tracking-wide">
          {total().toFixed(2)} ETB
        </p>
      </div>

      <Button
        onClick={onPlaceOrder}
        disabled={isLoading || !canPlaceOrder || items.length === 0}
        className="w-full py-6 rounded-md flex items-center justify-center gap-2 font-roboto font-medium tracking-wide bg-[#331d67] text-white hover:bg-[#331d67]/90 disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2Icon className="w-5 h-5 animate-spin" />
            Placing order...
          </>
        ) : (
          <>
            Place Order
            <MoveRightIcon className="w-5 h-5" />
          </>
        )}
      </Button>

      {!canPlaceOrder && items.length > 0 && (
        <p className="text-xs text-center text-gray-400 font-roboto">
          Complete shipping details to continue
        </p>
      )}
    </div>
  )
}
