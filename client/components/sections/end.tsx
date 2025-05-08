"use client"

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";


export default function End(){
    return(
                <motion.section>
                    <div className="flex flex-col font-roboto space-y-8 justify-center items-center py-10">
                        <p className="text-3xl font-bold font-inter text-[#7961a8]">Want to see more of our Products !</p>
                            <button className="flex items-center justify-center gap-2 w-42 bg-[#331d67] text-white px-4 py-2 rounded-xl border shadow-sm shadow-[#331d67]/50 border-white hover:bg-[#331d67]/90 transition-colors">
                                <ArrowUpRight /> Shop now
                            </button>
                    </div>
                </motion.section>
    )
}
        
