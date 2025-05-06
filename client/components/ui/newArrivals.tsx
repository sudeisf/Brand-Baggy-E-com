"use client"

import { useState } from "react";
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
]   
export default function NewArrivals(){
    return(
        <div className="flex flex-col items-center justify-center py-2 *:font-inter min-h-screen ">
            <h1 className="text-3xl font-medium text-center w-full mb-10 tracking-tight font-roboto text-[#331d67] relative">
                New Arrivals
                <span className="block mx-auto mt-2 w-24 h-1 bg-gradient-to-r from-[#331d67] via-[#6c47c6] to-[#331d67] rounded"></span>
            </h1>
            <div className="w-full min-w-[300px] max-w-[1350px]">
                <h1 className="text-2xl font-medium font-inter text-[#331d67]">Explore the items you love</h1>
                <div className="flex items-start py-4 gap-5  *:font-inter *:font-bold mb-3">
                    <div className="border-2 border-[#331d67] text-[#331d67] px-4 py-2 rounded-sm flex items-center gap-2">For Men</div>
                    <div className=" text-[#331d67] px-4 py-2 rounded-full flex items-center gap-2">For Women</div>
                    <div className=" text-[#331d67] px-4 py-2 rounded-full flex items-center gap-2">For Kids</div>
                </div>
            </div>
            
            <div className="flex  gap-8 w-full min-w-[300px] max-w-[1350px]">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-inherit rounded-md  transition-shadow duration-300 w-96 h-[24rem] flex flex-col group border items-center border-gray-300"
                    >
                        <div className="overflow-hidden">
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={220}
                                height={220}
                                className="object-cover max-w-dvh w-full group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="flex flex-col items-start justify-start px-4">
                            <h2 className="text-lg font-semibold text-gray-900 py-2 mb-2">{product.name}</h2>
                            <p className="text-gray-600 mb-2">{product.description}</p>
                            <div className="flex justify-between w-full mt-2 mb-2">
                                <p className="text-lg font-bold text-[#331d67] mb-2">${product.price}</p>
                                <div className="w-fit h-fit bg-[#331d67] rounded-full p-1">
                                    <Plus className="text-white w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))} 
            </div>

            <div className="flex *:font-inter justify-between  gap-4  w-full min-w-[300px] max-w-[1350px]  mt-8">
                <button className="bg-[#331d67b6] text-white px-4 py-2 rounded-full flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> <span className="text-sm">Previous</span>
                </button>
                <button className="bg-[#331d67b6] text-white px-4 py-2 rounded-full flex items-center gap-2">
                    <span className="text-sm">Next</span> <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
