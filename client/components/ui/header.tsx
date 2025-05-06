"use client"

import { useAuthStore } from "@/store/authStore"
import Link from "next/link";
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ShoppingCart } from "lucide-react"
import { DollarSign } from "lucide-react"
import { User } from "lucide-react"
import { Jersey_10 } from "next/font/google";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronUp } from "lucide-react"
import React, { useState } from "react"

const jersey10 = Jersey_10({ subsets: ["latin"], weight: "400" });

export default function Header(){
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const logout = useAuthStore((state) => state.logout);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    

    return(
        <header className=" flex justify-between items-center px-20 py-2 bg-inherit">

            <div className="flex justify-between items-center gap-10" >
                    <div className="flex justify-between items-center">
                        <h1 className={`${jersey10.className} text-[#331d67] font-bold text-2xl`}>Brand-Baggy</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-[#331d67] font-semibold">Products</Link>
                        <DropdownMenu
                            open={dropdownOpen}
                            onOpenChange={setDropdownOpen}
                        >
                            <DropdownMenuTrigger className="text-[#331d67] font-semibold outline-none flex items-center gap-1">
                                Categories
                                {dropdownOpen ? (
                                    <ChevronUp className="w-4 h-4 " />
                                ) : (
                                    <ChevronDown className="w-4 h-4 mt-1" />
                                )}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="rounded-sm">
                                <DropdownMenuItem>Men</DropdownMenuItem>
                                <DropdownMenuItem>Women</DropdownMenuItem>
                                <DropdownMenuItem>Children</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
            </div>
           


            <div className="flex justify-between items-center space-x-4">
                <div className=" w-[30rem] bg-white  flex items-center justify-start gap-2  rounded-md px-4 py-1.5 border border-[#918c9e]">
                        <Search className=" text-balck w-5 h-5" />
                        <input type="text" placeholder="Search for products" className="rounded-md outline-none bg-white" />
                    </div>
            
                <div className="flex items-center gap-4">

                <div className="bg-white rounded-full border border-gray-300 w-10 h-10 flex items-center justify-center">
                        <Link href="/login" className="flex items-center justify-center w-full h-full">
                            <User className="text-[#2d1a4d] w-5 h-5" />
                        </Link>
                     </div>
                    
                    <div className=" bg-white rounded-full p-2 border border-gray-400">
                        <Link href="/cart" className="flex items-center gap-2 px-2">
                            <ShoppingCart className="text-[#2d1a4d] w-5 h-5" />
                            <span className="text-[#2d1a4d] text-sm font-semibold">
                                $0.00
                            </span>
                        </Link>
                     </div>
                    
                   
                </div>
            </div>
                
        </header>
    )
}
