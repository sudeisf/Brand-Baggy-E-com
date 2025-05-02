import React from "react";
import Image from "next/image";
import auth from "@/public/assets/auth.jpg"

export const metadata = {
    title: 'Auth Page',
    description: 'Login or Register to your account',
  };


export default function AuthLayout({
    children
} :{ children : React.ReactNode }) {
    return (
        <div className="min-h-svh flex items-center justify-center ">
          <div className="w-1/2 ">
            {children}
          </div>
          <div className="w-1/2 bg-black min-h-screen relative">
            <Image
                src={auth} // Make sure 'auth' is properly imported
                alt="Authentication illustration" // Required for accessibility
                fill // Makes image fill the container
                className="object-cover" // Ensures proper image scaling
                priority // If this is above-the-fold image
                quality={85} // Optimizes image quality
            />
        </div>

        </div>
    );
}