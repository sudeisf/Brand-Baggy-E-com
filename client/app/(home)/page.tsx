"use client"

import Header from "@/components/ui/header"
import Hero from "@/components/ui/hero"
import NewArrivals from "@/components/ui/newArrivals"
export default function HomePage(){
    return(
        <div>
            <Header />
            <main>
               <Hero />
               <NewArrivals />
            </main>
        </div>
    )
}
