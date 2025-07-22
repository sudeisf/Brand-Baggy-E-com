"use client";

import { ProductCrum } from "@/app/products/components/ProductCrum"
import CartTable from "@/app/cart/Components/CartTable"
import OrderSummary from "@/app/cart/Components/OrderCard"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";
import {useCart} from "@/hooks/useCart"


export default function CartPage() {
  return (
    <div className="container mx-auto md:px-4 md:py-5 md:mb-10">
      <ProductCrum />
      <h1 className="text-4xl  max-w-[400px] md:w-[1400px] md:ml-10 lg:ml-2  text-[#331d67] font-roboto py-5 px-2.5 font-bold ">Shopping Cart</h1>
      <div className="flex flex-col mx-auto lg:flex-row gap-4 max-w-[450px] sm:max-w-[1400px] items-start ">

        <CartTable />
        <OrderSummary />
      </div>
      <div className="max-w-[400px] md:max-w-[1400px] flex flex-col space-y-3 mx-auto mt-6 p-2 mb-4">
        <p className="text-slate-500 capitalize">
          If you want to add more to the cart, click the button below
        </p>
        <Button asChild className="w-56 py-6 rounded-md flex items-center justify-center gap-2 font-roboto font-medium tracking-wider text-[#331d67] bg-[#331d67]/5 hover:bg-[#331d67]/80 hover:text-white">
          <Link href="/products">
            <MoveLeftIcon className="w-6 h-6" />
            Update Cart
          </Link>
        </Button>
      </div>

      

    </div>
  )
}
    