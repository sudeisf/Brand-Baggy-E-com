"use client"

import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import AppSidbar from "./components/SideBar";
import { ArrowRightFromLine, Search , ChevronDown } from "lucide-react";
import { Notification } from "@/app/(seller)/components/Notficationsheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Profile from "./components/ProfileHeader";
import ProtectedRoute from "@/components/protectedRoute";

export default function SellerLayotut({children}: {children:React.ReactNode}){
    
        return(
            <ProtectedRoute allowedRoles={["seller"]}>
            <SidebarProvider>
                <AppSidbar/>
                <main className="w-full ">
                    <div className="w-full bg-white">
                    <div className="flex items-center justify-between border-b mb-2 px-5 py-2">
                        {/* <h1 className="font-medium text-gray-400 text-md font-roboto mb-2 capitalize">wellcome to the best way to manage your commerce</h1> */}
                        <div className="hidden sm:flex w-[20rem]   bg-white items-center gap-2 rounded-sm px-3 py-1.5 border-1">
                                <Search className="text-black w-4 h-4 md:w-5 md:h-5" />
                                <input 
                                    type="text" 
                                    placeholder="Search..." 
                                    className="rounded-md outline-none bg-white w-full text-sm md:text-base" 
                                />
                            </div>
                            <div className="flex gap-4">
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