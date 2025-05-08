"use client"

import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"

export default function Contactus() {
    return (
        <section className="relative bg-[#f9f9ff] py-8 sm:py-12 md:py-16 *:font-roboto mt-5">
            {/* Decorative SVG Background */}
            <div className="absolute inset-0 -z-10 opacity-10">
                <img
                    src="/patterns/diagonal-lines.svg" // Place a pattern SVG in your public/patterns folder
                    alt="Background pattern"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 max-w-6xl flex flex-col md:flex-row items-start justify-center gap-6 md:gap-10">
                {/* Left: Form */}
                <div className="bg-white shadow-sm border rounded-2xl p-6 sm:p-8 md:p-10 w-full md:w-1/2">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#331d67] text-center mb-4 md:mb-6 tracking-tight">
                        Have a Question? <br /> Let's Talk!
                    </h2>

                    <form className="space-y-4 sm:space-y-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm sm:text-base">Name</Label>
                            <Input type="text" id="name" placeholder="Your Name" required className="text-sm sm:text-base" />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                            <Input type="email" id="email" placeholder="you@example.com" required className="text-sm sm:text-base" />
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-sm sm:text-base">Message</Label>
                            <Textarea
                                id="message"
                                placeholder="Write your message here..."
                                rows={4}
                                required
                                className="text-sm sm:text-base"
                            />
                        </div>

                        {/* Submit */}
                        <Button
                            className="bg-[#331d67] text-white w-full hover:bg-[#45228a] transition-all duration-300 text-sm sm:text-base py-2 sm:py-3"
                            type="submit"
                        >
                            Send Message
                        </Button>
                    </form>
                </div>

                {/* Right: Info / Text */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-start text-left mt-8 md:mt-0">
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#331d67] mb-3 md:mb-4">
                        Let's Connect 🤝
                    </h3>
                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 md:mb-6">
                        Whether you're curious about features, a free trial, or even press—we're ready to answer
                        any and all questions. We usually respond within 24 hours.
                    </p>

                    <p className="text-sm sm:text-base text-gray-800">
                        You can also email us directly at:
                        <a
                            href="mailto:support@example.com"
                            className="text-[#331d67] underline ml-2 hover:text-[#45228a]"
                        >
                            support@example.com
                        </a>
                    </p>
                </div>
            </div>
        </section>
    )
}
