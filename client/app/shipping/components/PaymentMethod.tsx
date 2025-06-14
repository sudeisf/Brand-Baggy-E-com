"use client"
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, Coins } from "lucide-react";

export default function PaymentMethod() {
    return (
        <div className="w-full rounded-b-xl p-4">
            <h1 className="text-lg font-medium text-[#331d67] p-2">Payment Method</h1>
            <RadioGroup defaultValue="cash-on-delivery" className="flex flex-col gap-2 p-2">
                        <div className="flex items-center space-x-2 pb-2">
                            <RadioGroupItem value="cash-on-delivery" id="cash-on-delivery" />
                            <Label htmlFor="cash-on-delivery" className="font-medium text-gray-500 text-md">Cash On Delivery</Label>
                            <Coins className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="flex items-center space-x-4 border-t-2 border-gray-200 pt-4 mb-2">
                            <RadioGroupItem value="paypal" id="paypal" className="border-[#331d67]" />
                            <Label htmlFor="paypal" className="font-medium text-gray-500 text-md">Paypal</Label>
                            <img src="/assets/paypal.svg" alt="paypal" className="w-12 h-12" />
                            </div>
                            <div className="flex items-center space-x-4">
                                <RadioGroupItem value="stripe" id="stripe" className="border-[#331d67] fill-indigo-600" />
                                <Label htmlFor="stripe" className="font-medium text-gray-500 text-md">Stripe</Label>
                                <img src="/assets/stripe.svg" alt="stripe" className="w-10 h-10" />
                            </div>
                        </RadioGroup>
                        <div className="flex justify-center items-center space-x-2 bg-red-200 p-4 rounded-lg mt-5">
                            <AlertCircle className="w-10 h-10 text-red-500" />
                            <p className="text-md text-gray-500 font-medium p-4"> Warning ! please be cautious on the biling informantion and shipping informantion</p>
                        </div>
                </div>
    )
}
