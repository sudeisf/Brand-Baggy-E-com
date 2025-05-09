"use client"

import Hero from "@/components/ui/hero"
import NewArrivals from "@/components/ui/newArrivals"
import Services from "@/components/sections/services"
import Testimonials from "@/components/sections/testimonials"
import Catagories from "@/components/sections/catagories"
import End from "@/components/sections/end"
import Contactus from "@/components/sections/contactus"

export default function HomePage(){
    return(
            <>
               <Hero />
               <NewArrivals />
               <Services />
               <Testimonials />
               <Catagories />
               <End />
               <Contactus />
            </>
    )
}
