"use client"

import { CalendarDaysIcon, Package, Percent, Truck } from "lucide-react";

interface ShippingInfoProps {
    discount : string;
    packageType : string;
    deliveryTime : string;
    estimatedArrival : string;
}

export default function ShippingInfo({discount,packageType,deliveryTime,estimatedArrival}:ShippingInfoProps){
    return (
        <div className="mt-4 border-2 rounded-lg p-2 px-4 space-y-2 border-gray-200 ">
        <h1 className="text-md text-[#331d67] font-semibold font-rubik mt-2">Shipping</h1>
        <div className="grid grid-cols-2 grid-rows-2 gap-2">

            <div className="flex gap-2 h-fit items-center">
                <div className="rounded-full bg-[#331d67]/10  h-12 w-12 flex justify-center items-center">
                    <div className=" rounded-full bg-[#331d67]  h-5 w-5 flex justify-center items-center">
                        <Percent className="w-3 h-3 stroke-white" />
                    </div>
                </div>
                <div className="flex flex-col gap-1 p-2">
                    <h1 className="text-sm font-medium font-rubik text-gray-500">Discount</h1>
                    <h1 className="text-sm capitalize text-[#331d67] font-semibold font-rubik">{discount}</h1>
                </div>
            </div>

            <div className="flex gap-2 h-fit">
                <div className="rounded-full bg-[#331d67]/10 p-2 h-12 w-12 flex justify-center items-center">
                    <Package className="w-7 h-7 stroke-1 stroke-white  fill-[#331d67]" />
                </div>
                <div className="flex flex-col gap-1 p-2">
                    <h1 className="text-sm font-medium font-rubik text-gray-500">Package</h1>
                    <h1 className="text-sm capitalize text-[#331d67] font-semibold font-rubik">{packageType}</h1>
                </div>
            </div>
            <div className="flex gap-2 h-fit">
                <div className="rounded-full bg-[#331d67]/10 p-2 h-12 w-12 flex justify-center items-center">
                    <CalendarDaysIcon className="w-6 h-6 stroke-1 stroke-white fill-[#331d67]" />
                </div>
                <div className="flex flex-col gap-1 p-2">
                    <h1 className="text-sm font-medium font-rubik text-gray-500">Delivery-time</h1>
                    <h1 className="text-sm capitalize text-[#331d67] font-semibold font-rubik">{deliveryTime}</h1>
                </div>
            </div>
            <div className="flex gap-2 h-fit">
                <div className="rounded-full bg-[#331d67]/10 p-2 h-12 w-12 flex justify-center items-center">
                    <Truck className="w-7 h-7 stroke-1 stroke-white fill-[#331d67]" />
                </div>
                <div className="flex flex-col gap-1 p-2">
                    <h1 className="text-sm font-medium font-rubik text-gray-500">Estimation Arrive</h1>
                    <h1 className="text-sm capitalize text-[#331d67] font-semibold font-rubik">{estimatedArrival}</h1>
                </div>
            </div>

        </div>
    </div>
    );
}
