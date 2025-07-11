
"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/ui/header";
import Footer from "@/components/sections/footer";

export default function HeaderFooterWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const authRoutes = [
    '/login',
    '/register',
    '/new-password',
    '/forgot-password',
    '/verify-otp',
    

    //seler side
    '/dashboard',
    '/orders',
    '/customer',
    '/settings',
    '/products-dashboard',
    '/create-product',
    '/profile-detail',
    '/reviews/'


  ];

  const isAuthPage = authRoutes.some(route => 
    pathname?.startsWith(route)
  );

  return (
    <div className="relative flex min-h-screen flex-col w-full m-0 p-0">
      {!isAuthPage && <Header />}
      <main className="flex-1">{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
