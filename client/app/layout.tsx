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
  const [queryClient] = useState(
    () =>
        new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: false,
                    refetchOnMount: false,
                    staleTime: 5 * 60 * 1000,
                    gcTime: 10 * 60 * 1000, 
                },
            },
        })
);
  return (
    <html lang="en" className="h-full">
            <body className="h-full antialiased bg-white font-sans" suppressHydrationWarning={true}>
                <div className="relative flex min-h-screen flex-col w-full m-0 p-0">
                    <QueryClientProvider client={queryClient}>
                        <HydrationBoundary>
                            <HeaderFooterWrapper>
                                <main className="flex-1">{children}</main>
                            </HeaderFooterWrapper>
                            <Toaster />
                        </HydrationBoundary>
                    </QueryClientProvider>
                </div>
            </body>
        </html>
  );
}
