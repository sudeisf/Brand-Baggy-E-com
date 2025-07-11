"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface ProductCardProps {
    name: string;
    date: string;
    description: string;
    url: string;
    rating: number;
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

export default function ProductReviewCard({ name, date, description, url, rating }: ProductCardProps) {
    const renderStars = (rating: number) => (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    className="w-5 h-5"
                    fill={i < rating ? "#331d67" : "none"}
                    stroke="#331d67"
                    aria-label={i < rating ? "Filled star" : "Empty star"}
                />
            ))}
        </div>
    );

    return (
        <div className="flex-shrink-0 flex items-center justify-center w-[90vw] max-w-[350px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] h-full">
            <div className="w-full bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col gap-4 transition-shadow "
                style={{ minHeight: 260, maxHeight: 320, height: "32vh" }}>
                <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 shadow">
                        <AvatarImage src={url} />
                        <AvatarFallback>
                            {name ? name[0].toUpperCase() : "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-semibold text-base capitalize text-gray-900">{name}</div>
                        <div className="text-xs text-gray-400">{formatDate(date)}</div>
                    </div>
                </div>
                <div className="flex items-center">{renderStars(rating)}</div>
                <p className="text-gray-700 text-md leading-relaxed font-rubik border-l-4 border-[#331d67] pl-4 bg-gray-50 rounded">
                    {description}
                </p>
            </div>
        </div>
    );
}
  