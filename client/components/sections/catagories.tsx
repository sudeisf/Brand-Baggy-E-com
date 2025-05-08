"use client"

import { useState } from "react";
import Image from "next/image"; 
import { ArrowRightIcon  } from "lucide-react";
import { MoveUpRight , ChevronRight } from 'lucide-react';
import { motion } from "framer-motion";

type Catagory = {
    id: number;
    name: string;
    image: string;
}

const catagories: Catagory[] = [
    {
        id: 1,
        name: "Men",
        image: "assets/products/mens.jpg"
    },
    {
        id: 2,
        name: "Women",
        image: "assets/products/womens.jpg"
    },
    {
        id: 3,
        name: "Kids",
        image: "assets/products/kids.jpg"
    },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

const imageHoverVariants = {
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.3,
            ease: "easeInOut"
        }
    }
};

export default function Catagories(){
    return (
        <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="py-10 md:py-20 mt-10 md:mt-20 min-h-screen *:font-roboto"
        >
            <div className="container mx-auto px-4 max-w-[1200px]">
                <h2 className="text-3xl md:text-4xl font-bold text-[#331d67] text-center mb-4">
                    Our Catagories
          <span className="block mx-auto mt-2 w-12 md:w-24 h-1 bg-gradient-to-r from-[#331d67] via-[#6c47c6] to-[#331d67] rounded"></span>
                    
                </h2>
                <p className="text-center md:text-lg text-gray-600 mb-3 ">
                    Explore our wide range of products in different categories.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 min-h-[600px]">
                    {/* Men's section - larger */}
                    <div className="lg:col-span-2 lg:row-span-2 shadow-md">
                        <div className="relative h-[300px] md:h-[500px] lg:h-[620px] w-full">
                            <img 
                                src={catagories[0].image} 
                                alt={catagories[0].name} 
                                className="w-full h-full object-cover object-left-top rounded-lg" 
                            />
                            <div className="absolute rounded-b-md top-2 right-0 bottom-0 left-0 p-6 bg-gradient-to-t from-black/60 to-transparent w-full">
                                <h3 className="text-4xl font-bold text-white font-inter mb-2 uppercase">{catagories[0].name} style</h3>
                                <motion.button 
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 md:px-6 flex items-center gap-2 py-2 bg-[#331d67] text-white rounded-full hover:bg-[#331d67]/80 transition-colors"
                                >
                                    Shop Now <ArrowRightIcon className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Women's section */}
                    <div className="h-[300px] w-full shadow-md">
                        <div className="relative h-full w-full">
                            <img 
                                src={catagories[1].image} 
                                alt={catagories[1].name} 
                                className="w-full h-full object-center object-cover rounded-lg" 
                            />
                            <div className="absolute rounded-b-md top-2 bottom-0 left-0 p-4 bg-gradient-to-t from-black/60 to-transparent w-full">
                                <h3 className="text-xl font-semibold text-white mb-2">{catagories[1].name} Style</h3>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className=" flex font-bold underline underline-offset-8  gap-2 py-2  items-center justify-start text-white rounded-full px-5 text-center hover:bg-white/40 transition-colors"
                                >
                                    Shop Now <ChevronRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Kids' section */}
                    <div className="h-[300px] w-full shadow-md">
                        <div className="relative h-full w-full">
                            <img 
                                src={catagories[2].image} 
                                alt={catagories[2].name} 
                                className="w-full h-full object-cover object-top rounded-lg" 
                            />
                            <div className="absolute rounded-b-md top-2 bottom-0 left-0 p-4 bg-gradient-to-t from-black/60 to-transparent w-full">
                                <h3 className="text-xl font-semibold text-white mb-2">{catagories[2].name} Style</h3>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className=" flex font-bold underline underline-offset-8  gap-2 py-2  items-center justify-start text-white rounded-full px-5 text-center text-md hover:bg-white/40 transition-colors"
                                >
                                    Shop Now <ChevronRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    )
}
