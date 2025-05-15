"use client"

import { ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function ProductCrum() {
  const pathname = usePathname(); // e.g., "/products/category/shoes"
  const segments = pathname.split("/").filter(Boolean); // ['products', 'category', 'shoes']

  const createPath = (index: number) =>
    "/" + segments.slice(0, index + 1).join("/");

  return (
    <Breadcrumb className="*:text-md py-3 px-8 border-b border-t border-gray-200">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" className="capitalize text-[1rem] font-normal">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const path = createPath(index);
          const isLast = index === segments.length - 1;

          return (
            <div key={index} className="flex items-center">
              <BreadcrumbSeparator>
                <ChevronRight size={16} className="text-[#331d67]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="capitalize text-[#331d67] text-[1rem] font-normal ml-2">
                    {decodeURIComponent(segment)}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={path} className="capitalize text-[#331d67] text-[1rem] font-normal ml-2">
                      {decodeURIComponent(segment)}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
