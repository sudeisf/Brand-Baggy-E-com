"use client";

import { CalendarDaysIcon, Package, Percent, Truck } from "lucide-react";

interface ShippingInfoProps {
  discount: string;
  packageType: string;
  deliveryTime: string;
  estimatedArrival: string;
}

const items = [
  { key: "discount", label: "Discount", icon: Percent },
  { key: "packageType", label: "Package", icon: Package },
  { key: "deliveryTime", label: "Delivery time", icon: CalendarDaysIcon },
  { key: "estimatedArrival", label: "Estimated arrival", icon: Truck },
] as const;

export default function ShippingInfo({
  discount,
  packageType,
  deliveryTime,
  estimatedArrival,
}: ShippingInfoProps) {
  const values = {
    discount,
    packageType,
    deliveryTime,
    estimatedArrival,
  };

  return (
    <div className="rounded-xl border border-gray-200 p-5 sm:p-6 bg-white h-full">
      <h2 className="text-lg text-[#331d67] font-semibold mb-4">Shipping</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex gap-3 items-start">
            <div className="rounded-full bg-[#331d67]/10 h-11 w-11 flex justify-center items-center shrink-0">
              <Icon className="w-5 h-5 text-[#331d67]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-sm sm:text-base text-[#331d67] font-medium break-words">
                {values[key]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
