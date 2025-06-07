"use client"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderFooterWrapper from "@/components/ui/HeaderFooterWrapper";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import {Toaster} from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata: Metadata = {
  title: "E-Commerce App",
  description: "A modern e-commerce application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const checkAuthFn = useAuthStore((state)=> state.checkAuth);
  useEffect(()=>{
      checkAuthFn()
  },[])
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-gray-50`}>
      <div className="relative flex min-h-screen flex-col w-full m-0 p-0">
          <HeaderFooterWrapper>
            <main className="flex-1">{children}</main>
          </HeaderFooterWrapper>
          <Toaster/>
        </div> 
      </body>
    </html>
  );
}
