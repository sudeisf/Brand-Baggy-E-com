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
  } from "@/components/ui/sidebar"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { url } from "inspector"
import { Calendar, Home, ShoppingCart,Package2, Settings, Search, Link , LogOutIcon, User } from "lucide-react"



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
        icon: Package2,
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
        <Sidebar >
        <SidebarContent className="bg-gray-100 text-[#331d67]  ">
            <SidebarHeader className="flex flex-row items-center border-b-2 pb-5 justify-between mx-4 mt-2 ">
                <h1 className={`font-medium text-xl  tracking-tighter ${rubik.className}`}>Brand-Baggy</h1>
            </SidebarHeader>
          <SidebarGroup>
            
            <SidebarGroupContent className="px-2">
            <SidebarGroupLabel className="uppercase text-gray-400 font-thin font-inter">Main menu</SidebarGroupLabel>
            <SidebarMenu>
                            {items.map((item) => {
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            className={`hover:bg-[#331d67]/5 rounded-sm py-5 ${
                                                isActive 
                                                    ? 'bg-[#331d67]/10 border-r-4 border-[#331d67]' 
                                                    : ''
                                            }`}
                                            asChild
                                        >
                                            <a href={item.url}>
                                                <item.icon className={isActive ? 'text-[#331d67]' : ''} />
                                                <span className={`font-medium font-inter ${
                                                    isActive ? 'text-[#331d67] font-semibold' : ''
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
        <SidebarFooter className="bg-gray-100 flex flex-col px-4 ">
            <SidebarGroupLabel className="uppercase text-gray-400 font-thin font-inter">others</SidebarGroupLabel>
            <div className="flex mb-4 items-center gap-3">
            <div className=" flex justify-center space-x-2 items-center">
                <Avatar className="w-8 h-8">
                <AvatarImage src="https://github.com/shadcn.png" className="rounded-full" />
                <AvatarFallback>
                    <User className="w-4 h-4" />
                </AvatarFallback>
                </Avatar>
                <div className="">
                    <p className="font-roboto font-medium text-md  text-gray-600 capitalize">sudeis fedlu</p>
                    <p className="text-sm text-gray-400 font-roboto">sudeisfedlu@gmail.com</p>
                </div>
            </div>

            <Button variant="ghost" className="text-[#331d67] w-fit flex gap-2 items-center justify-center">
                <LogOutIcon className="w-4 h-4" />
                
            </Button>
            </div>
            </SidebarFooter>
      </Sidebar>
    )
}