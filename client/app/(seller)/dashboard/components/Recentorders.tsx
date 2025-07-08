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
import { Checkbox } from "@/components/ui/checkbox"
import { useSellerRecentOrders } from "@/hooks/use-order"
import { SellerRecentOrder } from "@/types/analytics"



const statusStyles: Record<string, string> = {
    "pending": "bg-yellow-500/5 text-yellow-500",
    "paid": "bg-green-500/5 text-green-500",
    "delivered": "bg-green-500/5 text-green-500",
    "shipped": "bg-blue-500/5 text-blue-500",
    "cancelled": "bg-red-500/5 text-red-500",
}

const paymentStatusStyles: Record<string, string> = {
    "pending": "bg-yellow-500/5 text-yellow-500",
    "completed": "bg-green-500/5 text-green-500",
    "failed": "bg-red-500/5 text-red-500",
    "refunded": "bg-blue-500/5 text-blue-500",
    "cancelled": "bg-red-500/5 text-red-500",
}

export const columns : ColumnDef<SellerRecentOrder>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="shadow-sm"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="shadow-sm"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
    {
        accessorKey: "product",
        header: "Product name",
        cell: ({row}) => {
            return (
                    <div className="flex items-center gap-2 px-2 font-roboto">
                        <Image src={row.original.product_image} alt={row.original.product_image} width={40} height={40} className="rounded-md shadow-sm border-2 border-gray-300" />
                        {row.original.product_name}
                    </div>
            )
        }
    },
    {
        accessorKey: "payment",
        header: "Payment",
        cell: ({row}) => {
            return (
              <span
              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                  paymentStatusStyles[row.original.payment_status] || "bg-gray-500 text-white"
              }`}
              >
                    {row.original.payment_status}
                </span>
            )
        }
    },
    {
        accessorKey: "orderDate",
        header: "Order date",
        cell: ({row}) => {
          const formatted = format(
            parse(row.original.order_date, "yyyy-MM-dd HH:mm", new Date()),
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
                <div className="flex text-md text-left items-center gap-2 font-roboto">
                      <Avatar className="">
                              <AvatarImage src={row.original.customer.image} className="rounded-full w-8 h-8" />
                              <AvatarFallback>
                                  <User className="w-3 h-3" />
                              </AvatarFallback>
                      </Avatar>
                    {row.original.customer.username}
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
  const {data : recentOrders , isLoading} = useSellerRecentOrders()

  const table = useReactTable({
    data : recentOrders ?? [],
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
        <div className="w-[1250px] bg-white  rounded-md mb-4  mt-8 mx-auto">
          <div className=" p-4 rounded-t-md border-b-0 mb-4">
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
            <Table className="rounded-lg border-separate border-spacing-0 overflow-hidden">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup , index) => (
                  <TableRow key={index}>
                    {headerGroup.headers.map((header , index) => {
                      return (
                        <TableHead key={index} className="text-gray-600 text-left font-medium px-4  bg-gray-50 py-2 ">
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
                  table.getRowModel().rows.map((row,index) => (
                    <TableRow
                      key={index}
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
          <div className="flex items-center justify-end space-x-2 py-4 px-5">
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
