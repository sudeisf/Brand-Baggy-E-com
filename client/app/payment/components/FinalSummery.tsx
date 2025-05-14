"use client"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Coins, CreditCard } from "lucide-react"
import Link from "next/link"
import { Rubik } from "next/font/google"

const rubik = Rubik({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
})

type FinalSummaryProps = {
  paymentMethod?: string;
  onConfirm?: () => void;
};

export default function FinalSummary({ paymentMethod = "cash", onConfirm }: FinalSummaryProps) {
    const subtotal = 300; // ETB
    const vat = 45; // ETB
    const cashFee = paymentMethod === "cash" ? 2 : 0; // Cash handling fee
    const total = subtotal + vat + cashFee;

    return (
        <div className="border-2 space-y-4 border-gray-200 rounded-xl p-6 h-fit">
            <h1 className="text-2xl font-medium font-roboto text-[#331d67]">Order Summary</h1>
            
            {/* Payment Method Indicator */}
            <div className="flex items-center gap-2 text-sm text-[#331d67]">
                {paymentMethod === "cash" ? (
                    <>
                        <Coins className="w-4 h-4" />
                        <span>Paying with Cash on Delivery</span>
                    </>
                ) : (
                    <>
                        <CreditCard className="w-4 h-4" />
                        <span>Paying with {paymentMethod === "paypal" ? "PayPal" : "Credit Card"}</span>
                    </>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex justify-between">
                    <p>Order Price</p>
                    <p className={`${rubik.className} font-medium tracking-wider`}>
                        {subtotal} <span className="text-sm font-roboto">ETB</span>
                    </p>
                </div>
                <div className="flex justify-between">
                    <p>VAT(15%)</p>
                    <p className={`${rubik.className} font-medium tracking-wider`}>
                        {vat} <span className="text-sm font-roboto">ETB</span>
                    </p>
                </div>
                {paymentMethod === "cash" && (
                    <div className="flex justify-between">
                        <p>Cash Handling Fee</p>
                        <p className={`${rubik.className} font-medium tracking-wider`}>
                            {cashFee} <span className="text-sm font-roboto">ETB</span>
                        </p>
                    </div>
                )}
            </div>
            
            <div className="flex justify-between border-t-2 border-gray-200 pt-2">
                <p className="font-medium">Total</p>
                <p className={`${rubik.className} font-bold tracking-wider text-lg`}>
                    {total} <span className="text-sm font-roboto">ETB</span>
                </p>
            </div>

            <div className="flex items-start gap-2 bg-[#331d67]/5 text-[#331d67] p-4 rounded-md">
                <ShieldCheck className="w-6 h-6" />
                <p className={`${rubik.className} font-medium`}>
                    90 days Limited Warranty against manufacturing defects
                </p>
            </div>

            <div className="flex justify-center items-center">
                <Button 
                    onClick={onConfirm}
                    className="w-full py-6 rounded-md font-semibold tracking-wider bg-[#331d67] text-white hover:bg-[#331d67]/80"
                >
                    {paymentMethod === "cash" ? "Confirm Cash Order" : "Proceed to Payment"}
                </Button>
            </div>
        </div>
    )
}