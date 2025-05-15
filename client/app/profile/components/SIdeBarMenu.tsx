"use client"

import Link from "next/link"
import { User, MapPin, ShoppingBag, CreditCard, Settings, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
export default function SideBarMenu() {
    const pathname = usePathname()
    const isActive = (path: string) => pathname === path
    const defultPath = "/profile/myaccount"

    return (
        <div className="w-[250px] h-svh">  
            <h1 className="text-2xl font-bold p-4">My Account</h1>
            <div className="flex flex-col gap-4 px-4">
                <Link href={defultPath} className={`flex items-center gap-2 text-sm font-medium  rounded-md   ${isActive(defultPath) ? "bg-[#331d67]/5 text-[#4b3188] px-4 py-2" : "text-gray-500 px-4 py-2"}`}>
                    <User className="w-4 h-4" />
                    <h1>My details</h1>
                </Link> 
                <Link href="/profile/addresses" className={`flex items-center gap-2 text-sm font-medium  rounded-md  px-4 py-2 ${isActive("/profile/addresses") ? "bg-[#331d67]/5 text-[#4b3188] px-4 py-2" : "text-gray-500 px-4 py-2"}`}>
                    <MapPin className="w-4 h-4" />
                    <h1>My Addresses book</h1>
                </Link>
                <Link href="/profile/orders" className={`flex items-center gap-2 text-sm font-medium  rounded-md  px-4 py-2 ${isActive("/profile/orders") ? "bg-[#331d67]/5 text-[#4b3188] px-4 py-2" : "text-gray-500 px-4 py-2"}`}>
                    <ShoppingBag className="w-4 h-4" />
                    <h1>My Orders</h1>
                </Link>
                    <Link href="/profile/payment" className={`flex items-center gap-2 text-sm font-medium  rounded-md  px-4 py-2 ${isActive("/profile/payment") ? "bg-[#331d67]/5 text-[#4b3188] px-4 py-2" : "text-gray-500 px-4 py-2"}`}>
                    <CreditCard className="w-4 h-4" />
                    <h1>My Payment methods</h1>
                </Link>
                <Link href="/profile/settings" className={`flex items-center gap-2 text-sm font-medium  rounded-md  px-4 py-2 ${isActive("/profile/settings") ? "bg-[#331d67]/5 text-[#4b3188] px-4 py-2" : "text-gray-500 px-4 py-2"}`}>
                    <Settings className="w-4 h-4" />    
                    <h1>Settings</h1>
                </Link>
                <Link href="/profile/logout" className={`flex items-center gap-2 text-sm font-medium  rounded-md  px-4 py-2 ${isActive("/profile/logout") ? "bg-[#331d67]/5 text-[#4b3188] px-4 py-2" : "text-gray-500 px-4 py-2"}`}>
                    <LogOut className="w-4 h-4" />
                    <h1>Logout</h1>
                </Link>
            </div>
        </div>
    )
}
