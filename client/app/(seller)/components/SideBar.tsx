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
        url: "/orders",
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
        <SidebarContent className="bg-white text-[#331d67] ">
            <SidebarHeader className="flex flex-row items-center  pb-5 justify-between mx-4 mt-2 border-b-1 ">
                <h1 className={`font-medium text-xl  tracking-tighter ${rubik.className}`}>Brand-Baggy</h1>
                <SidebarTrigger />

            </SidebarHeader>
          <SidebarGroup>
            
            <SidebarGroupContent className="mt-5">
            {/* <SidebarGroupLabel className="uppercase text-gray-400 font-thin font-inter">Main menu</SidebarGroupLabel> */}
            <SidebarMenu className="mx-2">
                            {items.slice(0,4).map((item) => {
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
                                                <span className={`font-medium font-inter text-md ${
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
        <SidebarFooter className="bg-white flex mb-4 flex-col  ">
                <Button
                     className={`hover:bg-white shadow-none bg-white items-start justify-start px-5 text-gray-500 flex flex-row w-full`}>
                            <a href={items[4].url} className="text-left flex gap-2 ">
                            <Settings />
                            <span className={`font-medium font-inter text-md `}>
                                {items[4].title}
                            </span>
                        </a>
                    </Button>
            </SidebarFooter>
      </Sidebar>
    )
}