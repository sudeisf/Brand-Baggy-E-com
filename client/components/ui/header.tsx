"use client"

import { useAuthStore } from "@/store/authStore"
import Link from "next/link";
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, ChevronDown, ChevronUp , Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Jersey_10 , Rubik } from "next/font/google";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React, { useState } from "react"

const jersey10 = Jersey_10({ subsets: ["latin"], weight: "400" });
const rubik = Rubik({ subsets: ["latin"], weight: "500" });

export default function Header(){
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const logout = useAuthStore((state) => state.logout);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return(
        <header className="flex justify-between items-center px-4 sm:px-8 md:px-12 lg:px-20 py-2 bg-inherit w-full">
            {/* Mobile Menu Button (Hamburger) - Only shows on small screens */}
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

            {/* Brand Logo */}
            <div className="flex items-center">
                <h1 className={`${rubik.className} text-[#331d67]  tracking-tighter  text-md sm:text-2xl`}>Baggy-Brand</h1>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
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

            {/* Search and User Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Search Bar - Hidden on small mobile */}
                <div className="hidden sm:flex w-[10rem] md:w-[20rem] lg:w-[30rem] bg-white items-center justify-start gap-2 rounded-sm px-3 py-1.5 border-2">
                    <Search className="text-black w-4 h-4 md:w-5 md:h-5" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="rounded-md outline-none bg-white w-full text-sm md:text-base" 
                    />
                </div>

                {/* Mobile Search Icon - Shows on small screens */}
                <div className="sm:hidden">
                    <Search className="text-[#2d1a4d] w-5 h-5" />
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="bg-white rounded-full border border-gray-300 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                        <Link href="/profile" className="flex items-center justify-center w-full h-full">
                            <User className="text-[#2d1a4d] w-4 h-4 sm:w-5 sm:h-5" />
                        </Link>
                    </div>
                    
                    <div className="bg-white rounded-md p-1 sm:p-2  border-1 relative">
                        <Link href="/cart" className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2">
                            <ShoppingCart className="text-[#2d1a4d] w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline text-[#2d1a4d] text-sm font-semibold">
                                $220.00
                            </span>
                        </Link>
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            3
                        </span>
                    </div>
                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center border border-gray-400 relative">
                        <Link href="/favorites" className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2">
                            <Heart className="text-[#2d1a4d] w-4 h-4 sm:w-5 sm:h-5" />
                        </Link>
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            3
                        </span>
                    </div>
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