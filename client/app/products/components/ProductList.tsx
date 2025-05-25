"use client"
import { useRef } from "react"
import Image from "next/image"
import { Plus } from "lucide-react"
import Link from "next/link"

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
    {
        id: 8,
        name: "Product 8",
        price: 800,
        image: "/assets/products/product8.jpg",
        description: "An innovative product designed to meet your needs.",
    },
    {
        id: 9,
        name: "Product 9",
        price: 900,
        image: "/assets/products/product9.jpg",
        description: "An innovative product designed to meet your needs.",
    },
]   

export function ProductList(){
    return(
        <div>
            <div className="relative w-full">
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 w-full  ml-0 "
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-inherit rounded-md transition-shadow duration-300 w-64 md:w-92 h-[22rem] md:h-[24rem] flex flex-col flex-shrink-0 snap-start justify-between group border items-start border-gray-200"
              >
                <div className="overflow-hidden rounded-t-md w-full h-48 md:h-56">
                  <Link href={`/products/${product.id}`}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={220}
                    height={220}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  </Link>
                </div>
                <div className="flex flex-col items-start justify-start px-4 w-full">
                  <Link href={`/products/${product.id}`}>
                      <h2 className="text-base md:text-lg font-semibold text-gray-900 py-2 mb-1 md:mb-2 text-left">{product.name}</h2>
                  </Link>
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
        </div> 
        </div>
    )
}
