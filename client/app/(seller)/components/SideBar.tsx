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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarTrigger,
    useSidebar,
  } from "@/components/ui/sidebar"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { url } from "inspector"
import { Calendar,Package, User2Icon, Home, ShoppingCart,Package2, Settings, Search, Link , LogOutIcon, User, Plus } from "lucide-react"



interface Item{
        title : string,
        url : string,
        icon : any,
        subMenu?: {
            title: string,
            url: string,
            icon: any
        }[]
}

const items : Item[] = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        subMenu :[]
      },
      {
        title: "Order",
        url: "/orders",
        icon: ShoppingCart,
      },
      {
        title: "Products",
        url: "/products-dashboard",
        icon: Package,
        subMenu : [
            {
                title: "Create Products",
                url: "/products-dashboard/create-product",
                icon: Plus
            }
        ]
      },
      {
        title: "Customers",
        url: "/customer",
        icon: User2Icon,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },    
    ]

import { useState } from "react"
import { usePathname } from "next/navigation"
import { title } from "process"
 
export default function AppSidbar(){

    
    const pathname = usePathname();
    


    return (
        <Sidebar className="h-full">
        <SidebarContent className="bg-white text-[#331d67] flex flex-col h-full">
            <SidebarHeader className="flex flex-row items-center pb-5 justify-between mx-4 mt-2">
                <h1 className="font-medium text-xl tracking-tighter">Brand-Baggy</h1>
                <SidebarTrigger />
            </SidebarHeader>
            <SidebarGroup className="flex-1">
                <SidebarGroupContent className="mt-5">
                    <SidebarMenu className="mx-2">
                        {items.slice(0,4).map((item) => {
                            const isActive = pathname === item.url;
                            const hasOpenSubmenu = item.subMenu?.some(subItem => pathname === subItem.url);
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        className={`hover:bg-[#331d67]/5 rounded-none px-5 mb-3 ${
                                            isActive 
                                                ? 'border-l-3 rounded-none text-md border-[#331d67] text-[#2d116d] font-bold' 
                
                                                : 'text-gray-500'
                                        }`}
                                        asChild
                                    >
                                        <a href={item.url}>
                                            <item.icon className={isActive ? 'text-[#331d67]' : ''} />
                                            <span className={`font-medium font-inter text-md ${
                                                isActive ? 'text-[#6449a3]' : ''
                                            }`}>
                                                {item.title}
                                            </span>
                                        </a>
                                    </SidebarMenuButton>
                                    {item.subMenu && item.subMenu.length > 0 && (
                                        <SidebarMenuSub>
                                            {item.subMenu.map((subItem) => {
                                                const isSubActive = pathname === subItem.url;
                                                return (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton
                                                            className={`hover:bg-[#331d67]/5 rounded-none  mb-2 ${
                                                                isSubActive 
                                                                    ? ' rounded-none text-md border-[#331d67] text-[#2d116d] font-bold' 
                                                                    : 'text-gray-500'
                                                            }`}
                                                            asChild
                                                        >
                                                            <a href={subItem.url}>
                                                                <subItem.icon className={isSubActive ? 'text-[#331d67]' : ''} />
                                                                <span className={`font-medium font-inter text-md ${
                                                                    isSubActive ? 'text-[#6449a3]' : ''
                                                                }`}>
                                                                    {subItem.title}
                                                                </span>
                                                            </a>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                );
                                            })}
                                        </SidebarMenuSub>
                                    )}
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            <SidebarFooter className="bg-white mt-auto">
                <Button
                    className="hover:bg-white shadow-none bg-white items-start justify-start px-5 text-gray-500 flex flex-row w-full">
                    <a href={items[4].url} className="text-left flex gap-2">
                        <Settings />
                        <span className="font-medium font-inter text-md">
                            {items[4].title}
                        </span>
                    </a>
                </Button>
            </SidebarFooter>
        </SidebarContent>
        </Sidebar>
    )
}