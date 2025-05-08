"use client"

import { useRef } from "react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  color: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CEO",
    company: "Tech Innovations",
    content: "Working with this team has been an absolute pleasure. Their attention to detail and commitment to excellence is unmatched.",
    color: "bg-blue-500"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Manager",
    company: "Digital Solutions",
    content: "The level of professionalism and expertise demonstrated by the team is exceptional. They delivered beyond our expectations.",
    color: "bg-green-500"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "Global Brands",
    content: "I'm impressed by their innovative approach and ability to understand our needs perfectly. A truly outstanding experience.",
    color: "bg-purple-500"
  }
];

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
};

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 mt-20 bg-[#331d67] relative overflow-hidden rounded-xl max-w-[1400px] mx-auto ">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHoiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+')]"></div>
      </div>

      <div className="container mx-auto px-4 max-w-[1200px] relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it - hear from some of our satisfied clients
          </p>
        </div>

        <div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/10"
            >
              <div className="flex items-center mb-6">
                <div className={`${testimonial.color} w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-xl mr-5 shadow-md`}>
                  {getInitials(testimonial.name)}
                </div>
                <div>
                  <h3 className="font-bold text-[#331d67] text-lg">{testimonial.name}</h3>
                  <p className="text-sm text-[#331d67]/80">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 italic leading-relaxed">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
