"use client"

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Search ,Bell ,ArrowRight , AlignLeft , } from "lucide-react"
import { Rubik } from "next/font/google"
import { ArrowRightFromLine } from "lucide-react"
import Dashheads from "./components/Dashheads"

import RecentOrdersTable from "./components/Recentorders"

const rubik = Rubik({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    variable: '--font-rubik',
  })



export default function Dashboard(){
  


        return (
            <div className="w-[1250px] mx-auto bg-white">
            <Dashheads />
            <RecentOrdersTable/>
            </div>
        )
}