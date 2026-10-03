"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidbar from "./components/SideBar";
import { Search } from "lucide-react";
import { Notification } from "@/app/(seller)/components/Notficationsheet"
import Profile from "./components/ProfileHeader";
import ProtectedRoute from "@/components/protectedRoute";

export default function SellerLayotut({children}: {children:React.ReactNode}){
    return (
        <ProtectedRoute allowedRoles={["seller"]}>
            <SidebarProvider>
                <AppSidbar/>
                <main className="w-full min-h-screen">
                    <div className="w-full bg-white">
                        <div className="flex items-center justify-between border-b mb-2 px-3 sm:px-5 py-2">
                            <div className="flex items-center gap-2">
                                <SidebarTrigger className="lg:hidden text-[#331d67]" />
                                <div className="hidden sm:flex w-[20rem] bg-white items-center gap-2 rounded-sm px-3 py-1.5 border">
                                    <Search className="text-black w-4 h-4 md:w-5 md:h-5" />
                                    <input 
                                        type="text" 
                                        placeholder="Search..." 
                                        className="rounded-md outline-none bg-white w-full text-sm md:text-base" 
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Notification />
                                <Profile />
                            </div>
                        </div>
                        {children}
                    </div>
                </main>
            </SidebarProvider>
        </ProtectedRoute>
    )
}