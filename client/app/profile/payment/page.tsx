"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Plus, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { AddAddress } from "../components/AddAddress"
import { AddPayment } from "../components/AddPayment"
import { EditAddress } from "../components/EditAddress"
import { EditPayment } from "../components/EditPayment"

const paymentMethods = [
    {
        id: 1,
        image: "/images/debit-card.png",
        name: "Debit Card",
        last4: "1234",
        number: "1000 XXXX XXXX 1234",
        expiry: "01/24",
        cvv: "123",
        holder: "John Doe",
    },
   
    {
        id: 3,
        image: "/images/paypal.png",
        name: "Paypal",
        last4: "1234",
        number: "1000 XXXX XXXX 1234",
        expiry: "01/24",
        cvv: "123",
        holder: "John Doe",
    },
]

export default function Payment() {
    const [showCvv, setShowCvv] = useState<number[]>([]);

    const handleShowCvv = (id: number) => {
        if(showCvv.includes(id)){
            setShowCvv(showCvv.filter((item) => item !== id));
        }else{
            setShowCvv([...showCvv, id]);
        }
    }

    return (
        <div className="container sm:px-4 px-2 space-y-8 mx-auto p-4 max-w-4xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#331d67]">My Payment Methods</h1>
                    <p className="text-gray-500 text-sm">Manage your payment methods and add new ones.</p>
                </div>
                <AddPayment />
            </div>
            <div className="flex flex-col gap-4 w-full bg-white rounded-lg">
                <div className="flex flex-col gap-4 w-full">
                    {paymentMethods.map((method) => (
                        <div key={method.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4 border-b last:border-b-0">
                            <div className="flex items-center gap-2 px-2">
                                <Image src={method.image} alt={method.name} width={32} height={32} />
                                <p className="text-sm sm:text-base">{method.number}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                                <p className="text-sm sm:text-base">{method.holder}</p>
                                <p className="text-sm sm:text-base">{method.expiry}</p>
                                <Button 
                                    onClick={() => handleShowCvv(method.id)} 
                                    variant="outline" 
                                    className="rounded-full px-4 sm:px-8 text-gray-500 text-sm sm:text-base"
                                >
                                    {showCvv.includes(method.id) ? "cvv" : "123"}
                                </Button>
                                <EditPayment payment={{
                                    id: method.id.toString(),
                                    cardholderName: method.holder,
                                    cardNumber: method.number,
                                    expiry: method.expiry,
                                    cvv: method.cvv,
                                }} onUpdate={() => {}} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-4 w-full mt-4 rounded-lg">    
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-xl sm:text-2xl font-semibold text-[#331d67]">Shipping Address</h1>
                        <p className="text-gray-500 text-sm">select where you want to ship your order</p>
                    </div>
                    <AddAddress />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full bg-white p-4 rounded-lg">
                    <div className="flex flex-col gap-2">
                        <p className="text-md font-medium text-[#331d67]">John Doe</p>
                        <p className="text-sm text-gray-500">123 Main St, Anytown, USA</p>
                    </div>
                    <EditAddress address={{
                        id: "1",
                        name: "John Doe",
                        address: "123 Main St",
                        city: "Anytown",
                        state: "CA",
                        zip: "12345",
                        country: "USA"
                    }} onUpdate={() => {}} />
                </div>
            </div>
        </div>
    );
}

