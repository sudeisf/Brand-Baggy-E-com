"use client"

import { useRef, useState } from "react";
import Image from "next/image";
import { Plus , ArrowLeft , ArrowRight  } from "lucide-react";

const products = [
    {
        id: 1,
        name: "Product 1",
        price: 100,
        image: "/assets/products/product1.jpg",
        description: "A stylish and comfortable product perfect for everyday use.",
    },
    {
        id: 2,
        name: "Product 2",
        price: 200,
        image: "/assets/products/product2.jpg",
        description: "This is a description of the product",
    },
    {   
        id: 3,
        name: "Product 3",
        price: 300,
        image: "/assets/products/product3.jpg",
        description: "An innovative product designed to meet your needs.",
        
    },
    {
        id: 4,  
        name: "Product 4",
        price: 400,
        image: "/assets/products/product4.jpg",
        description: "An innovative product designed to meet your needs.",
    },
    {
        id: 5,
        name: "Product 5",
        price: 500,
        image: "/assets/products/product5.jpg",
        description: "An innovative product designed to meet your needs.",
    },
    {
        id: 6,
        name: "Product 6",
        price: 600,
        image: "/assets/products/product6.jpg",
        description: "An innovative product designed to meet your needs.",
    },
    {
        id: 7,
        name: "Product 7",
        price: 700,
        image: "/assets/products/product7.jpg",
        description: "An innovative product designed to meet your needs.",
    },
]   
export default function NewArrivals() {
    const containerRef = useRef<HTMLDivElement>(null);
  
    const scroll = (direction: string) => {
      if (containerRef.current) {
        const scrollAmount = window.innerWidth < 768 ? 250 : 400;
        containerRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      }
    };
  
    return (
      <div className="flex mt-2 flex-col items-start justify-start max-w-[1350px] mb-5 mx-auto py-2 *:font-inter min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="text-2xl md:text-3xl py-4 font-medium text-center items-center w-full mb-2 md:mb-2 tracking-tight font-roboto text-[#331d67] relative">
          New Arrivals
          <span className="block mx-auto mt-2 w-16 md:w-24 h-1 bg-gradient-to-r from-[#331d67] via-[#6c47c6] to-[#331d67] rounded"></span>
        </h1>
  
        {/* Categories */}
        <div className="w-full max-w-[1350px]">
          <h1 className="text-xl md:text-2xl font-semibold font-inter text-[#331d67] text-left mb-2">Explore the items you'll love</h1>
          <div className="flex items-start py-4 gap-3 md:gap-5 *:font-roboto *:tracking-tight *:font-bold mb-3 *:text-[#331d67] overflow-x-auto scrollbar-hide">
            <div className="border-2 border-[#5f5283] px-3 md:px-4 py-1  rounded-sm flex-shrink-0 flex items-center gap-2">For Men</div>
            <div className=" px-3 md:px-4 py-1  rounded-full flex-shrink-0 flex items-center gap-2">For Women</div>
            <div className=" px-3 md:px-4 py-1  rounded-full flex-shrink-0 flex items-center gap-2">For Kids</div>
          </div>
        </div>
  
        {/* Product Carousel */}
        <div className="relative w-full">
          <div 
            ref={containerRef}
            className="flex gap-4 md:gap-8 w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory ml-0 pr-32"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-inherit rounded-md transition-shadow duration-300 w-64 md:w-80 h-[22rem] md:h-[24rem] flex flex-col flex-shrink-0 snap-start group border items-start border-gray-200"
              >
                <div className="overflow-hidden rounded-r-sm ronded-l-sm w-full h-48 md:h-56">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={220}
                    height={220}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col items-start justify-start px-4 w-full">
                  <h2 className="text-base md:text-lg font-semibold text-gray-900 py-2 mb-1 md:mb-2 text-left">{product.name}</h2>
                  <p className="text-sm md:text-base text-gray-600 mb-2 line-clamp-2 text-left">{product.description}</p>
                  <div className="flex justify-between w-full mt-2 mb-2">
                    <p className="text-base md:text-lg font-bold text-[#331d67]">${product.price}</p>
                    <div className="w-fit h-fit bg-[#331d67] rounded-full p-1">
                      <Plus className="text-white w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
  
          {/* Fade Effect */}
          {/* <div className="absolute right-0 top-0 bottom-0 w-24 md:w-10 pointer-events-none z-10">
            <div className="h-full w-full relative">
              <div className="absolute inset-0 bg-gradient-to-l from-gray-50 via-gray-50/70 to-transparent"></div>
              <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200"></div>
            </div>
          </div>*/}
        </div> 
  
        {/* Navigation Buttons */}
        <div className="flex *:font-inter justify-between gap-4 w-full max-w-[1350px] mt-6 md:mt-8">
          <button 
            onClick={() => scroll('left')}
            className="bg-[#331d67b6] text-white px-3 md:px-4 py-1 md:py-2 rounded-full flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> <span>Previous</span>
          </button>
          <button 
            onClick={() => scroll('right')}
            className="bg-[#331d67b6] text-white px-3 md:px-4 py-1 md:py-2 rounded-full flex items-center gap-2 text-sm"
          >
            <span>Next</span> <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>
      </div>
    );
  }
