"use client"
import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
  } from "@/components/ui/sidebar"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { url } from "inspector"
import { Calendar,Package, Home, ShoppingCart,Package2, Settings, Search, Link , LogOutIcon, User } from "lucide-react"



interface Item{
        title : string,
        url : string,
        icon : any
}

const items : Item[] = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Order",
        url: "#",
        icon: ShoppingCart,
      },
      {
        title: "Products",
        url: "#",
        icon: Package,
      },
      {
        title: "Search",
        url: "#",
        icon: Search,
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings,
      },    
    ]


import { Rubik } from "next/font/google"
import { useState } from "react"

const rubik = Rubik({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    variable: '--font-rubik',
  });

import { usePathname } from "next/navigation"
 
export default function AppSidbar(){

    
    const pathname = usePathname();
    


    return (
        <Sidebar className="h-full">
        <SidebarContent className="bg-gray-50 text-[#331d67] ">
            <SidebarHeader className="flex flex-row items-center  pb-5 justify-between mx-4 mt-2 border-b-1 ">
                <h1 className={`font-medium text-xl  tracking-tighter ${rubik.className}`}>Brand-Baggy</h1>
                <SidebarTrigger />

            </SidebarHeader>
          <SidebarGroup>
            
            <SidebarGroupContent className="mt-5">
            {/* <SidebarGroupLabel className="uppercase text-gray-400 font-thin font-inter">Main menu</SidebarGroupLabel> */}
            <SidebarMenu className="mx-2">
                            {items.map((item) => {
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            className={`hover:bg-[#331d67]/5 rounded-none px-5  mb-3 ${
                                                isActive 
                                                    ? ' border-l-3 rounded-none text-md border-[#331d67] text-[#2d116d] font-bold ' 
                                                    : 'text-gray-500'
                                            }`}
                                            asChild
                                        >
                                            <a href={item.url}>
                                                <item.icon className={isActive ? 'text-[#331d67]' : ''} />
                                                <span className={`font-medium font-inter ${
                                                    isActive ? 'text-[#6449a3] ' : ''
                                                }`}>
                                                    {item.title}
                                                </span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        <SidebarFooter className="bg-gray-50 flex flex-col mx-4 ">
        
            <div className="flex items-center gap-3 pt-4 mb-2">
            <div className=" flex justify-center space-x-3 items-center">
                <Avatar className="w-10 h-10">
                <AvatarImage src="https://github.com/shadcn.png" className="rounded-full" />
                <AvatarFallback>
                    <User className="w-5 h-5" />
                </AvatarFallback>
                </Avatar>
                <div className=" flex flex-col gap-1 ">
                    <p className="font-rubik font-semibold text-sm tracking-tight  text-[#331d67] capitalize">sudeis fedlu</p>
                    <p className="text-sm text-gray-400 font-roboto">sudeisfedlu@gmail.com</p>
                </div>
            </div>
            </div>
            </SidebarFooter>
      </Sidebar>
    )
}