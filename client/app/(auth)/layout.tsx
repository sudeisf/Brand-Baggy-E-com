import React from "react";
import Image from "next/image";
import auth from "@/public/assets/auth.jpg"

export const metadata = {
    title: 'Auth Page',
    description: 'Login or Register to your account',
  };


  export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left side - Form Content (always full width on mobile) */}
        <div className="w-full md:w-1/2 p-6 flex items-center justify-center">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
  
        {/* Right side - Image (hidden on mobile, shown on md+) */}
        <div className="hidden md:block md:w-1/2 relative bg-black">
          <Image
            src={auth}
            alt="Authentication illustration"
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="(max-width: 768px) 0px, 50vw" // Optimizes image loading
          />
        </div>
      </div>
    );
  }