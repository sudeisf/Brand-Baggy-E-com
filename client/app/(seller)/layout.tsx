
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidbar from "./components/SideBar";
export const metadata = {
    title: 'Dashboard',
    description: 'Dashboard',
  };

export default function SellerLayotut({children}: {children:React.ReactNode}){
        return(
            <SidebarProvider>
                <AppSidbar/>
                <main className="w-full ">
                    <div className="w-full">
                        {children}
                    </div>
                </main>
            </SidebarProvider>
        )
}