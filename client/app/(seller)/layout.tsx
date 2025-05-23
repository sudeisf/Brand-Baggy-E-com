
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import AppSidbar from "./components/SideBar";
import { ArrowRightFromLine, Search } from "lucide-react";
import { Notification } from "@/app/(seller)/components/Notficationsheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export const metadata = {
    title: 'Dashboard',
    description: 'Dashboard',
  };

export default function SellerLayotut({children}: {children:React.ReactNode}){
    
        return(
            <SidebarProvider>
                <AppSidbar/>
                <main className="w-full ">
                    <div className="w-full bg-white">
                    <div className="flex items-center justify-between p-5">
                         
                        <div className="hidden sm:flex w-[20rem]   bg-white items-center gap-2 rounded-sm px-3 py-1.5 border-1">
                                <Search className="text-black w-4 h-4 md:w-5 md:h-5" />
                                <input 
                                    type="text" 
                                    placeholder="Search..." 
                                    className="rounded-md outline-none bg-white w-full text-sm md:text-base" 
                                />
                            </div>
                            <div className="flex gap-2">
                                <Notification />
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </div>
                    </div> 
                        {children}
                    </div>
                </main>
            </SidebarProvider>
        )
}