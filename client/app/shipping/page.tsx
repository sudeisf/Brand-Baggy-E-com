"use client";

import { ProductCrum } from "@/app/products/components/ProductCrum"
import BillingInformation from "./components/InputInformation";
import ShippingInformation from "./components/ShippingInfrom";
import PaymentMethod from "./components/PaymentMethod";
import Summery from "./components/summery";
export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-5 mb-10">
      <ProductCrum />
      <h1 className="text-4xl w-[1250px] mx-auto text-[#331d67] font-roboto py-5 px-2.5 font-bold ">Shipping Details</h1>
      <div className="w-[1250px] mx-auto">
        <div className="flex gap-4">
          <div className="w-[60%] border-2 border-gray-200 rounded-xl">
            <BillingInformation />
            <ShippingInformation />
            {/* <PaymentMethod /> */}
          </div>
          <div className="w-[40%]">
            <Summery />
          </div>
        </div>
      </div>
    </div>
  )
}
    