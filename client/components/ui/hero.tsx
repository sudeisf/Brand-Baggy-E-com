"use client"

import Image from "next/image"
import hero from "@/public/assets/hero.jpg"
import { Button } from "./button";


export default function Hero(){
    return(
        <div className="relative shadow-lg flex h-[600px] w-[95%] mx-auto md:rounded-xl mt-2 border border-gray-300 overflow-hidden">
            <Image src={hero} alt="hero" className="h-full object-cover w-full md:rounded-xl" fill style={{objectFit: "cover"}} />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10"></div>
            {/* Content */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-white text-xl mb-2 tracking-widest font-semibold uppercase bg-gradient-to-r from-white/50 to-white/20 p-2 rounded-md">New Season, New Style</h2>
                <h1 className="text-white text-5xl md:text-6xl font-extrabold drop-shadow-lg mb-4">
                    Discover the Best Deals on Trendy Products!
                </h1>
                <p className="text-white text-2xl md:text-3xl mb-8 max-w-2xl drop-shadow">
                    Elevate your look. Unbeatable deals. <span className="font-bold">Shop the new you!</span>
                </p>
                <Button className="bg-white font-roboto tracking-tighter text-[#331d67] border-2 border-[#331d67]  font-bold px-8 py-5 rounded-lg shadow-lg hover:bg- hover:text-white transition-colors duration-300">
                    Start Shopping
                </Button>
            </div>
        </div>
    );
}
