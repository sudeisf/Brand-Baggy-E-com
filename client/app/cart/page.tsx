"use client";

import { ProductCrum } from "@/app/products/components/ProductCrum"
import CartTable from "@/app/cart/Components/CartTable"
import OrderSummary from "@/app/cart/Components/OrderCard"
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-5 mb-10">
      <ProductCrum />
      <h1 className="text-4xl w-[1400px] mx-auto text-[#331d67] font-roboto py-5 px-2.5 font-bold ">Shopping Cart</h1>
      <div className="flex gap-4 w-[1400px] mx-auto items-start">
        <CartTable />
        <OrderSummary />
      </div>
      <div className="w-[1400px] flex flex-col space-y-3 mx-auto mt-6">
        <p className="text-slate-500 capitalize">If you want to add more to the cart , click the button below</p>
        <Link href="/products">m
        <Button className="w-56 rounded-full py-6 bg-[#331d67]">
            Update Cart
        </Button>
        </Link>
      </div>
      

    </div>
  )
}
    