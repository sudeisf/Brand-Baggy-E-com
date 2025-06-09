"use client"
import {ChevronDown, LogInIcon, User} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Profile() {
    const user = useAuthStore((state)=> state.user);
    const logoutFn = useAuthStore((state)=>state.logout);
    const router = useRouter();

    async function handleLogout(){
        toast.promise(
            logoutFn().then((result)=> {
                if(result?.success){
                    router.replace('/login');
                }
            }),
            {
                loading : "logging you out please wait.",
                success: "logged out sucessfully.",
                error: "log out failed , please try again."
            },

        );
    }

    return(
        <div className="flex gap-2 items-center border bg-gray-50 py-2 px-4 rounded-full ">
            <Avatar className="w-7 h-7">
                <AvatarImage src={user?.profile_url || undefined} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
            <p className="font-medium font-roboto text-sm">
                {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : user?.username}
            </p>
            <p className="text-xs">{user?.email}</p>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="-translate-x-8">
                    <DropdownMenuItem>
                        <Link href={'/profile-detail'} className="flex items-center gap-2 font-roboto p-0"><User className="w-4 h-4"/> Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <button onClick={(e)=>{
                            e.preventDefault();
                            handleLogout();
                            }} className="flex items-center gap-2 font-roboto p-0"><LogInIcon/>Logut</button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>
    );
}