"use client";

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
    day: "numeric",
  });
}

export default function ProductReviewCard({
  name,
  date,
  description,
  url,
  rating,
}: ProductCardProps) {
  return (
    <div className="w-full h-full bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex flex-col gap-3 min-h-[220px]">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10 shadow-sm">
          <AvatarImage src={url} />
          <AvatarFallback>{name ? name[0].toUpperCase() : "U"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm capitalize text-gray-900">{name}</p>
          <p className="text-xs text-gray-400">{formatDate(date)}</p>
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className="w-4 h-4"
            fill={i < rating ? "#331d67" : "none"}
            stroke="#331d67"
          />
        ))}
      </div>

      <p className="text-gray-600 text-sm leading-relaxed line-clamp-5 border-l-2 border-[#331d67] pl-3">
        {description}
      </p>
    </div>
  );
}
