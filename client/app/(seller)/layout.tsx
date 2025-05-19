
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidbar from "./components/SideBar";
export const metadata = {
    title: 'Auth Page',
    description: 'Login or Register to your account',
  };


export default function SellerLayotut({children}: {children:React.ReactNode}){
        return(
            <SidebarProvider>
                <AppSidbar/>
                <main>
                <SidebarTrigger />
                   
                    <div>
                        {children}
                    </div>
                </main>
            </SidebarProvider>
        )
}