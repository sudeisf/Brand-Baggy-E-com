import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
  
  export function PaginationDemo() {
    return (
      <Pagination className="mt-10 mb-10">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious className="text-[#331d67] text-lg" href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className="text-[#331d67] text-lg" href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className="text-[#331d67] text-lg" href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className="text-[#331d67] text-lg" href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className="text-[#331d67] text-lg" href="#">4</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className="text-[#331d67] text-lg" href="#">5</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className="text-[#331d67] text-lg" href="#">6</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis className="text-[#331d67] text-lg" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext className="text-[#331d67] text-lg" href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }
  