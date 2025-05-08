"use client"

import { useRef } from "react";
import { Truck, Shield, RefreshCw, CreditCard, Headphones, Package } from "lucide-react";

export default function Services() {
    const containerRef = useRef<HTMLDivElement>(null);
    
    const services = [
        {
            icon: <Truck className="w-8 h-8 text-[#331d67]" />,
            title: "Fast Delivery",
            description: "Free shipping on orders over $50. Delivery within 2-3 business days."
        },
        {
            icon: <Shield className="w-8 h-8 text-[#331d67]" />,
            title: "Secure Shopping",
            description: "Your data is protected with our advanced security measures."
        },
        {
            icon: <RefreshCw className="w-8 h-8 text-[#331d67]" />,
            title: "Easy Returns",
            description: "30-day return policy. Hassle-free returns and exchanges."
        },
        {
            icon: <CreditCard className="w-8 h-8 text-[#331d67]" />,
            title: "Multiple Payment Options",
            description: "Pay with credit cards, PayPal, or other secure payment methods."
        },
        {
            icon: <Headphones className="w-8 h-8 text-[#331d67]" />,
            title: "24/7 Support",
            description: "Our customer service team is always ready to help you."
        },
        {
            icon: <Package className="w-8 h-8 text-[#331d67]" />,
            title: "Quality Products",
            description: "Carefully curated products from trusted brands and suppliers."
        }
    ];

    return (
        <div className="flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <h1 className="text-3xl md:text-4xl font-bold text-[#331d67] mb-2 font-inter">Our Services</h1>
            <span className="block mx-auto mt-2 w-16 md:w-24 h-1 bg-gradient-to-r from-[#331d67] via-[#6c47c6] to-[#331d67] rounded mb-12"></span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
                {services.map((service, index) => (
                    <div 
                        key={index}
                        className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md  transition-shadow duration-300 border border-gray-200"
                    >
                        <div className="mb-4 p-3 bg-gray-50 rounded-full">
                            {service.icon}
                        </div>
                        <h2 className="text-xl font-semibold text-[#331d67] mb-2 font-inter">{service.title}</h2>
                        <p className="text-gray-600 text-center text-sm md:text-base font-inter">{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
