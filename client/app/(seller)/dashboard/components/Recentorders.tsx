"use client"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
  } from "@tanstack/react-table"
  import Image from "next/image"
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { DateRange } from "react-day-picker"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  AlignCenter, 
  ChevronDown,
  ChevronDownIcon, 
  Search, 
  User 
  } from "lucide-react"
import { 
  endOfDay, 
  format, 
  parse, 
  startOfDay 
} from "date-fns"

import { useState } from "react"
import { DatePickerWithRange } from "./DateFilter"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { Button } from "@/components/ui/button"





export const data: Order[] = [
    {
      id: 1,
      customer: "John Doe",
      product: "Product 1",
      orderDate: "2025-05-20 12:06",
      status: "Pending",
      image: "/assets/products/product1.jpg",
      price: 200,
      sold: 120,
      invoice: "INV-001",
    },
    {
      id: 2,
      customer: "Jane Doe",
      product: "Product 2",
      orderDate: "2025-05-20 09:15",
      status: "Completed",
      image: "/assets/products/product2.jpg",
      price: 200,
      sold: 120,
      invoice: "INV-002",
    },
    {
      id: 3,
      customer: "Jane Doe",
      product: "Product 3",
      orderDate: "2025-05-19 16:45",
      status: "Completed",
      image: "/assets/products/product3.jpg",
      price: 200,
      sold: 120,
      invoice: "INV-002",
    },
    {
      id: 4,
      customer: "Jane Doe",
      product: "Product 4",
      orderDate: "2025-05-19 14:20",
      status: "Cancelled",
      image: "/assets/products/product4.jpg",
      price: 200,
      sold: 120,
      invoice: "INV-002",
    },
    {
      id: 5,
      customer: "Jane Doe",
      product: "Product 5",
      orderDate: "2025-05-18 10:30",
      status: "Completed",
      image: "/assets/products/product5.jpg",
      price: 200,
      sold: 120,
      invoice: "INV-002",
    },
    {
      id: 6,
      customer: "Jane Doe",
      product: "Product 6",
      orderDate: "2025-05-18 08:00",
      status: "Cancelled",
      image: "/assets/products/product6.jpg",
      price: 200,
      sold: 120,
      invoice: "INV-002",
    },
    {
      id: 7,
      customer: "Jane Doe",
      product: "Product 7",
      orderDate: "2025-05-17 15:10",
      status: "Completed",
      image: "/assets/products/product7.jpg",
      price: 200,
      sold: 120,
      invoice: "INV-002",
    },
    {
      id: 8,
      customer: "Jane Doe",
      product: "Product 8",
      orderDate: "2025-05-17 11:25",
      status: "Shipped",
      image: "/assets/products/product8.jpg",
      price: 200,
      sold: 120,
      invoice: "INV-002",
    },
    {
      id: 9,
      customer: "Jane Doe",
      product: "Product 9",
      orderDate: "2025-05-16 13:50",
      status: "Shipped",
      image: "/assets/products/product9.jpg",
      price: 200,
      sold: 120,
      invoice: "INV-002",
    },
  ]


export type Order = {
    id: number;
    customer: string;
    product: string;
    orderDate: string;
    status: string;
    image: string;
    price: number;
    sold: number;
    invoice: string;
}

const statusStyles: Record<string, string> = {
    Pending: "bg-yellow-500/5 text-yellow-500",
    Completed: "bg-green-500/5 text-green-500",
    Shipped: "bg-blue-500/5 text-blue-500",
    Cancelled: "bg-red-500/5 text-red-500",
  }

export const columns : ColumnDef<Order>[] = [
    {
        accessorKey: "product",
        header: "Product name",
        cell: ({row}) => {
            return (
                    <div className="flex items-center gap-2 px-2 font-roboto">
                        <Image src={row.original.image} alt={row.original.product} width={40} height={40} />
                        {row.original.product}
                    </div>
            )
        }
    },
    {
        accessorKey: "invoice",
        header: "Invoice",
        cell: ({row}) => {
            return (
                <div className="flex text-left gap-2 font-roboto">
                    {row.original.invoice}
                </div>
            )
        }
    },
    {
        accessorKey: "orderDate",
        header: "Order date",
        cell: ({row}) => {
          const formatted = format(
            parse(row.original.orderDate, "yyyy-MM-dd HH:mm", new Date()),
            "MMM d, yyyy, h:mm a"

          );
            return (
                <div className="flex text-left gap-2 font-roboto">
                    {formatted}
                </div>
            )
        },
        filterFn: (row, columnId, filterValue) => {
          const dateString = row.getValue(columnId);
          const [fromDate, toDate] = filterValue || [null, null];
          
          if (!fromDate || !toDate) return true;
          if (typeof dateString !== 'string') return false;
          
          try {
            const orderDate = parse(dateString, "yyyy-MM-dd HH:mm", new Date());
            return orderDate >= fromDate && orderDate <= toDate;
          } catch (error) {
            return false;
          }
        }
    },
    {
        accessorKey: "customer",
        header: "Customer",
        cell: ({row}) => {
            return (
                <div className="flex text-left items-center gap-2 font-roboto">
                      <Avatar className="w-10 h-10">
                              <AvatarImage src="https://github.com/shadcn.png" className="rounded-full" />
                              <AvatarFallback>
                                  <User className="w-3 h-3" />
                              </AvatarFallback>
                      </Avatar>
                    {row.original.customer}
                </div>
            );
        }
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({row}) => {
            return (
                <div className="flex text-left gap-2  font-roboto">
                    ${row.original.price}
                </div>
            )
        }
    },
    {
        accessorKey: "sold",
        header: "Sold",
        cell: ({row}) => {
            return (
                <div className="flex text-left gap-2 font-roboto ">
                    {row.original.sold}
                </div>
            )
        }
    },
    {
        accessorKey: "status",
        header: ({column}) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger className="text-left" asChild>
                        <Button variant="ghost" className="items-center m-0" >
                            <span className="text-sm font-medium text-left">Satus</span>
                            <ChevronDownIcon className="h-2 w-2" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-50 border-1 p-2  rounded-b-md">
                    {["Pending", "Completed", "Shipped", "Cancelled"].map((status) => (
                        <DropdownMenuItem
                            key={status}
                            onClick={() => column.setFilterValue(status)}
                            className="text-[#331d67]"
                        >
                            <span className="cursor-pointer px-2 py-2 mb-1">{status}</span>
                        </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        cell: ({row}) => {
            return (
                <div className={`flex text-left gap-2 font-roboto`}>
                    <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        statusStyles[row.original.status] || "bg-gray-500 text-white"
                    }`}
                    >
                    {row.original.status.toLowerCase()}
                    </span>
                </div>
            )
        }
    }
]



export default function RecentOrdersTable() {

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 4, 7), 
    to: new Date(2025, 4, 21), 
  });

  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    setSearchValue(value);
    table.getColumn("product")?.setFilterValue(value);
  };

  const handleDateRange = (range: DateRange | undefined) => {
    setDateRange(range);
    
    table.getColumn("orderDate")?.setFilterValue(
      range?.from && range?.to 
        ? [startOfDay(range.from), endOfDay(range.to)] 
        : undefined
    );
  }

    return (
        <div className="w-[1220px] bg-white  rounded-md mb-4  mt-8 mx-auto">
          <div className="p-4  rounded-t-md border-b-0">
            <div>
                <h1 className="font-roboto font-medium text-2xl text-[#331d67]">Recent Orders</h1>
            </div>
            <div className="flex justify-between items-center py-4">
                    <div className="hidden sm:flex w-[10rem] md:w-[20rem] bg-white items-center justify-start gap-2 rounded-sm px-3 py-1.5 border-1">
                    <Search className="text-[#331d67] w-4 h-4 md:w-5 md:h-5" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchValue}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="rounded-md outline-none bg-white w-full text-sm md:text-base text-[#331d67]"
                    />
                    </div>
                    <div className="flex gap-2">
                    <DatePickerWithRange onDateChange={handleDateRange} />
                    <DropdownMenu>
                    <DropdownMenuTrigger
                        onClick={() => table.getColumn("status")?.setFilterValue(undefined)}
                        className="ml-auto font-roboto border-1 flex items-center px-4 gap-2 rounded-sm text-gray-600 text-sm font-medium shadow-none z-10" 
                    >
                        <span className="text-gray-400 text-sm">Status :</span> All Status <ChevronDown className="w-4 h-4"/>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="bg-white border-1 p-2 rounded-b-md z-10">
                    <DropdownMenuItem
                        onClick={() => table.getColumn("status")?.setFilterValue(undefined)}
                        className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm font-medium text-[#331d67] py-1 mb-1"
                    >
                        All
                    </DropdownMenuItem>
                    {["Pending", "Completed", "Shipped", "Cancelled"].map((status) => (
                        <DropdownMenuItem
                        key={status}
                        onClick={() => table.getColumn("status")?.setFilterValue(status)}
                        className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm font-medium text-gray-600 py-1 mb-1 "
                        >
                        {status}
                        </DropdownMenuItem>
                    ))}
                    </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto font-roboto rounded-sm text-gray-600 shadow-none">
                        <AlignCenter/>
                         Filter
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" >
                        {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                            return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                                }
                            >
                                {column.id}
                            </DropdownMenuCheckboxItem>
                            )
                        })}
                    </DropdownMenuContent>
                    </DropdownMenu>
            </div>
            </div>
          </div>
          <div className="px-4">
            <Table className="rounded-lg border-separate border-1 border-spacing-0 overflow-hidden">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="text-gray-500 text-left font-medium border-b-1  bg-gray-50 py-2 ">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="text-gray-600 font-medium text-left py-2 px-4"
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )
    }
