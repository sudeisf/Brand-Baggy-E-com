"use client"

import Link from "next/link"
import { User, ShoppingBag, CreditCard, Settings, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Custom hook to detect mobile viewport
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 1024) // 1024px is the lg breakpoint
        }

        // Initial check
        checkIsMobile()

        // Add event listener for window resize
        window.addEventListener('resize', checkIsMobile)

        // Cleanup
        return () => window.removeEventListener('resize', checkIsMobile)
    }, [])

    return isMobile
}

export default function SideBarMenu() {
    const pathname = usePathname()
    const router = useRouter()
    const isMobile = useIsMobile()
    const isActive = (path: string) => pathname === path
    const defaultPath = "/profile"

    const tabs = [
        { path: defaultPath, icon: User, label: "Details" },
        { path: "/profile/orders", icon: ShoppingBag, label: "Orders" },
        { path: "/profile/payment", icon: CreditCard, label: "Payment" },
        { path: "/profile/settings", icon: Settings, label: "Settings" },
        { path: "/", icon: LogOut, label: "Logout" }
    ]

    return (
        <>
            {isMobile ? (
                // Mobile Tab Bar
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                    <Tabs 
                        defaultValue={pathname} 
                        className="w-full"
                        onValueChange={(value) => {
                            router.push(value)
                        }}
                    >
                        <TabsList className="w-full h-16 grid grid-cols-5 rounded-none border-t">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <TabsTrigger
                                        key={tab.path}
                                        value={tab.path}
                                        className={`
                                            flex flex-col items-center justify-center gap-1
                                            data-[state=active]:text-[#4b3188]
                                            data-[state=active]:bg-transparent
                                            data-[state=active]:shadow-none
                                            rounded-none
                                            h-full
                                        `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-xs">{tab.label}</span>
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>
                    </Tabs>
                </div>
            ) : (
                // Desktop Sidebar
                <div className="w-[300px] border-gray-200">
                    <div className="flex flex-col gap-4 px-4 pt-4">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <Link
                                    key={tab.path}
                                    href={tab.path}
                                    className={`
                                        flex items-center gap-2 w-48
                                        text-sm font-medium rounded-md
                                        ${isActive(tab.path) 
                                            ? "bg-[#331d67]/5 text-[#4b3188] px-4 py-2" 
                                            : "text-gray-500 px-4 py-2"
                                        }
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    <h1>{tab.label}</h1>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}
        </>
    )
}