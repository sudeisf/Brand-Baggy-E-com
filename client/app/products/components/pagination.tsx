"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

export function ProductPagination({ 
  totalItems, 
  itemsPerPage, 
  currentPage 
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Always render the pagination component
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href={createPageURL(Math.max(1, currentPage - 1))}
            isActive={currentPage > 1}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                router.push(createPageURL(currentPage - 1));
              }
            }}
          />
        </PaginationItem>

        {/* Current Page Indicator */}
        <PaginationItem>
          <PaginationLink isActive>
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href={createPageURL(Math.min(totalPages, currentPage + 1))}
            isActive={currentPage < totalPages}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                router.push(createPageURL(currentPage + 1));
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}