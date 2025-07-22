"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User, ChevronDown, ChevronUp, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useCartStore } from "@/store/cartStore";
import { useFavoritesStore } from "@/store/favStore";
import CartBadge from "./CartBadge";
import FavBadge from "./FavBadge";
import { useCart } from "@/hooks/useCart";
import { useFav } from "@/hooks/useFav";
import SearchBar from "./SearchBar";
import { useProductFilterStore } from "@/store/productStore";

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isLoading, error } = useCart({ requireAuth: true });
  const { isLoading: loading, error: err } = useFav();
  const { clearFilters, toggleSubcategory } = useProductFilterStore();

  const categories = [
    { id: 1, name: "Men", slug: "men" },
    { id: 2, name: "Women", slug: "women" },
    { id: 3, name: "Children", slug: "children" }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCategoryClick = (category: { id: number; name: string; slug: string }) => {
    // Clear any existing filters first
    clearFilters();
    // Add the selected category filter
    toggleSubcategory({
      id: `parent_${category.id}`,
      name: category.slug,
      isParent: true
    });
    // Close the dropdown
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    // Navigate to products page
    router.push('/products');
  };

  return (
    <header className="flex justify-between items-center px-4 sm:px-8 md:px-10 lg:px-10 py-2 bg-inherit w-full">
      {/* Mobile Menu Button */}
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

      {/* Logo */}
      <div className="flex items-center">
        <h1 className="text-[#331d67]  text-lg sm:text-xl font-sans font-semibold">Baggy-Brand</h1>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-10">
        <div className="flex items-center gap-4">
          <Link href="/products" className="text-[#331d67] font-semibold hover:text-[#6c47c6] transition-colors">
            Products
          </Link>
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
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  onSelect={() => handleCategoryClick(category)}
                  className="cursor-pointer hover:bg-[#331d6710]"
                >
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        <SearchBar />

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="bg-white rounded-full border border-gray-300 w-10 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
            {mounted && isAuthenticated && user?.user_role === "buyer" ? (
              <Link href="/profile" className="flex items-center justify-center w-full h-full">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user?.profile_url || undefined} className="object-center object-cover" />
                  <AvatarFallback>
                    <p className="font-roboto capitalize font-semibold text-gray-700"> {user?.username[0]}</p>
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Link href="/login" className="flex items-center justify-center w-full h-full">
                <User className="text-[#2d1a4d] w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            )}
          </div>
       
          <CartBadge />
          <FavBadge />
  
         
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-50 p-4">
          <div className="flex flex-col space-y-4">
            <Link
              href="/products"
              className="text-[#331d67] font-semibold px-4 py-2 hover:bg-gray-100 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <div className="px-4 py-2">
              <div className="text-[#331d67] font-semibold mb-2">Categories</div>
              <div className="flex flex-col space-y-2 pl-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className="hover:text-[#6c47c6] cursor-pointer py-1"
                  >
                    {category.name}
                  </div>
                ))}
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
  );
}