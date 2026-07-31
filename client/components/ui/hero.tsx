"use client";

import Image from "next/image";
import Link from "next/link";
import hero from "@/public/assets/hero.jpg";
import { Button } from "./button";

export default function Hero() {
  return (
    <div className="relative shadow-lg flex h-[min(85vh,720px)] w-[95%] mx-auto md:rounded-xl mt-2 border border-gray-300 overflow-hidden">
      <Image
        src={hero}
        alt="Brand Baggy collection"
        className="h-full object-cover w-full md:rounded-xl"
        fill
        priority
        style={{ objectFit: "cover" }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent z-10" />

      <div className="absolute inset-0 z-20 flex flex-col items-start justify-center px-6 sm:px-10 md:px-16 max-w-3xl">
        <p className="text-white/90 text-sm sm:text-base tracking-[0.25em] uppercase mb-3 font-medium">
          Brand Baggy
        </p>

        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight mb-4 drop-shadow-md">
          Wear what feels like you
        </h1>

        <p className="text-white/85 text-base sm:text-lg md:text-xl max-w-md mb-8 leading-relaxed">
          Fresh drops and everyday essentials, made to move with your style.
        </p>

        <Button
          asChild
          className="bg-white text-[#331d67] border-2 border-white font-semibold px-8 py-6 rounded-lg shadow-lg hover:bg-[#331d67] hover:text-white hover:border-[#331d67] transition-colors duration-300"
        >
          <Link href="/products">Shop collection</Link>
        </Button>
      </div>
    </div>
  );
}
