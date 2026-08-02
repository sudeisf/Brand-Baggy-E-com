"use client"

import { useState } from "react";
import Image from "next/image";

export default function ProductBanner() {
    return (
        <div className="flex flex-col lg:flex-row items-center justify-between w-full h-[400px] rounded-md bg-[#7f72a037] overflow-hidden">
            <div className="flex flex-col w-[400px] md:w-[600px] mt-10 lg:mt-0 mb-10 lg:mb-0">
                <h1 className="text-4xl md:text-5xl text-center lg:text-left leading-tight py-6 ml-0 lg:ml-20 px-2 font-['Playfair_Display'] italic font-semibold text-[#331d67]">
                    Style of the Generation
                </h1>
                <div className="bg-white w-[400px] md:w-[600px] mx-auto lg:mx-0 lg:w-[450px] xl:w-[600px] rounded-md border shadow-sm space-y-2 text-[#331d67] ml-0 lg:ml-10 xl:ml-20 h-[300px] md:h-[200px] px-10 py-10 z-10">
                    <p className="text-xs tracking-[0.15em] uppercase text-[#331d6780] font-['Inter'] font-medium">
                        Style items
                    </p>
                    <p className="text-3xl lg:text-2xl xl:text-3xl font-['Inter'] font-light leading-snug">
                        A style without these items is not complete
                    </p>
                </div>
            </div>
            <div className="w-1/2 space-x-3 hidden lg:flex h-full justify-end z-10">
                <Image
                    src="/assets/products/products-banner.jpg"
                    alt="product banner"
                    width={150}
                    height={100}
                    className="object-cover object-top-center h-full"
                />
                <Image
                    src="/assets/products/products-banner-2.jpg"
                    alt="product banner"
                    width={150}
                    height={100}
                    className="object-cover object-center h-full"
                />
                <Image
                    src="/assets/products/products-banner-3.jpg"
                    alt="product banner"
                    width={150}
                    height={150}
                    className="object-cover object-center h-full"
                />
            </div>
        </div>
    );
}