"use client"
import type { Metadata } from "next";
import "./globals.css";
import HeaderFooterWrapper from "@/components/ui/HeaderFooterWrapper";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import {Toaster} from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';

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
  const [queryClient] = useState(() => new QueryClient());
  useEffect(()=>{
      checkAuthFn()
  },[])
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased bg-gray-50">
        <div className="relative flex min-h-screen flex-col w-full m-0 p-0">
          <HeaderFooterWrapper>
            <main className="flex-1">
            <QueryClientProvider client={queryClient}>
              <HydrationBoundary>{children}</HydrationBoundary>
            </QueryClientProvider>
            </main>
          </HeaderFooterWrapper>
          <Toaster/>
        </div> 
      </body>
    </html>
  );
}
