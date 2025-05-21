"use client"

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Search ,Bell ,ArrowRight , AlignLeft , } from "lucide-react"
import { Rubik } from "next/font/google"
import { ArrowRightFromLine } from "lucide-react"
import Dashheads from "./components/Dashheads"
import { Notification } from "./components/Notficationsheet"
import RecentOrdersTable from "./components/Recentorders"

const rubik = Rubik({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    variable: '--font-rubik',
  })



export default function Dashboard(){
    const {
        open,
        toggleSidebar,
      } = useSidebar(); 


        return (
            <div className="w-[1250px] mx-auto">
            <div className="flex items-center justfy-between  px-4 py-4">
            <div className=" w-full flex itmes-start gap-8">
            {!open && (
                <button 
                    onClick={toggleSidebar}
                    className="pt-2 h-fit text-gray-500"
                >
                    <ArrowRightFromLine className="w-5 h-5" />
                </button>
            )}
                
                <div className="p-2">
                <h1 className={`font-roboto text-2xl font-semibold  text-[#331d67] capitalize`}>Hello, Sudies!</h1>
                <p className="text-gray-400 ">Your current dashboard toady</p>
                </div>
            
            </div>
           <div className="flex items-center px-2 gap-2">
           <div className="hidden sm:flex w-[15rem]  bg-white items-center justify-start gap-2 rounded-sm px-3 py-1.5 border-1">
                    <Search className="text-black w-4 h-4 md:w-5 md:h-5" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="rounded-md outline-none bg-white w-full text-sm md:text-base" 
                    />
                </div>
            
                <Notification />
        
           </div>
            </div>
            <Dashheads />
            <RecentOrdersTable/>
            </div>
        )
}