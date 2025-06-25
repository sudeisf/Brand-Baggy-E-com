"use client"

import { useAuthStore } from "@/store/authStore"
import Link from "next/link";
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, ChevronDown, ChevronUp, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React, { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useCartStore } from "@/store/cartStore";
import { useFavoritesStore } from "@/store/favStore";
import CartBadge from "./CartBadge";
import FavBadge from "./FavBadge";
import { useCart } from "@/hooks/useCart";
import { useFav } from "@/hooks/useFav";

export default function Header(){
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const logout = useAuthStore((state) => state.logout);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const {isLoading,error} = useCart({requireAuth:true});
    const fetch = useFav({requireAuth:true})

    useEffect(() => {
        setMounted(true);
    }, []);

    return(
        <header className="flex justify-between items-center px-4 sm:px-8 md:px-10 lg:px-10 py-2 bg-inherit w-full">
            <div className="lg:hidden">
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-[#331d67] p-2"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            <div className="flex items-center">
                <h1 className="text-[#331d67] tracking-tighter text-md sm:text-2xl">Baggy-Brand</h1>
            </div>

        
            <div className="hidden lg:flex items-center gap-10">
                <div className="flex items-center gap-4">
                    <Link href="/products" className="text-[#331d67] font-semibold hover:text-[#6c47c6] transition-colors">Products</Link>
                    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                        <DropdownMenuTrigger className="text-[#331d67] font-semibold outline-none flex justify-center items-center gap-2 hover:text-[#6c47c6] transition-colors">
                            Categories
                            {dropdownOpen ? (
                                <ChevronUp className="w-4 h-4 mt-1" />
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

            
            <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden sm:flex w-[10rem] md:w-[20rem] lg:w-[30rem] bg-white items-center justify-start gap-2 rounded-sm px-3 py-1.5 border-1">
                    <Search className="text-black w-4 h-4 md:w-5 md:h-5" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="rounded-md outline-none bg-white w-full text-sm md:text-base" 
                    />
                </div>

           

                <div className="flex items-center gap-2 sm:gap-4">
                <div className="bg-white rounded-full border border-gray-300 w-10 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                        {mounted && isAuthenticated && user?.user_role === "buyer"  ? (
                            <Link href="/profile" className="flex items-center justify-center w-full h-full">
                             <Avatar className="w-8 h-8">
                                <AvatarImage src={user?.profile_url || undefined} />
                                <AvatarFallback>
                                   <p className="font-roboto capitalize font-semibold text-gray-700 "> {user?.username[0]}</p>
                                </AvatarFallback>
                            </Avatar>
                            </Link>
                        ) : (
                            <Link href="/login" className="flex items-center justify-center w-full h-full">
                            <User className="text-[#2d1a4d] w-4 h-4 sm:w-5 sm:h-5" />
                        </Link>
                        )}
                    </div>
                    <CartBadge/>
                    <FavBadge/>
                </div>
            </div>

            {/* Mobile Menu - Shows when hamburger is clicked */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-50 p-4">
                    <div className="flex flex-col space-y-4">
                        <Link 
                            href="/" 
                            className="text-[#331d67] font-semibold px-4 py-2 hover:bg-gray-100 rounded"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Products
                        </Link>
                        <div className="px-4 py-2">
                            <div className="text-[#331d67] font-semibold mb-2">Categories</div>
                            <div className="flex flex-col space-y-2 pl-4">
                                <Link href="#" className="hover:text-[#6c47c6]">Men</Link>
                                <Link href="#" className="hover:text-[#6c47c6]">Women</Link>
                                <Link href="#" className="hover:text-[#6c47c6]">Children</Link>
                            </div>
                        </div>
                        <div className="sm:hidden px-4 py-2">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5">
                                <Search className="text-black w-4 h-4" />
                                <input 
                                    type="text" 
                                    placeholder="Search products..." 
                                    className="outline-none bg-transparent w-full text-sm" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}