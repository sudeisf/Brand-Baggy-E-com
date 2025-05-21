"use client"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
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
  import { Button } from "@/components/ui/button"
import { Dropdown } from "react-day-picker"
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@radix-ui/react-dropdown-menu"
import { AlignCenter, ChevronDown, ChevronDownIcon, Search } from "lucide-react"
import { Span } from "next/dist/trace"
import { Input } from "@/components/ui/input"





export const data : Order[] = [
    {
        id: 1,
        customer: "John Doe",
        product: "Product 1",
        orderDate: "2021-01-01 12:06",
        status: "Pending",
        image: "/assets/products/product1.jpg",
        price: 200,
        sold: 120,
        invoice: "INV-001"
    },
    {
        id: 2,
        customer: "Jane Doe",
        product: "Product 2",
        image: "/assets/products/product2.jpg",
        orderDate: "2021-01-02 12:06",
        status: "Completed",
        price: 200,
        sold: 120,
        invoice: "INV-002"
    },
    {
        id: 3,
        customer: "Jane Doe",
        product: "Product 3",
        image: "/assets/products/product3.jpg",
        orderDate: "2021-01-02 12:06",
        status: "Completed",
        price: 200,
        sold: 120,
        invoice: "INV-002"
        },
    {
        id: 4,
        customer: "Jane Doe",
        product: "Product 4",
        image: "/assets/products/product4.jpg",
        orderDate: "2021-01-02 12:06",
        status: "Cancelled",
        price: 200,
        sold: 120,
        invoice: "INV-002"
    } ,
    {
        id: 5,
        customer: "Jane Doe",
        product: "Product 5",
        orderDate: "2021-01-02 12:06",
        image : "/assets/products/product5.jpg",
        status: "Completed",
        price: 200,
        sold: 120,
        invoice: "INV-002"
    } ,
    {
        id: 6,
        customer: "Jane Doe",
        product: "Product 6",
        orderDate: "2021-01-02 12:06",
        image : "/assets/products/product6.jpg",
        status: "Cancelled",
        price: 200,
        sold: 120,
        invoice: "INV-002"
    },
    {
        id: 7,
        customer: "Jane Doe",
        product: "Product 7",
        orderDate: "2021-01-02 12:06",
        image : "/assets/products/product7.jpg",
        status: "Completed",
        price: 200,
        sold: 120,
        invoice: "INV-002"
    },
    {
        id: 8,
        customer: "Jane Doe",
        product: "Product 8",
        orderDate: "2021-01-02 12:06",
        image : "/assets/products/product8.jpg",
        status: "Shipped",
        price: 200,
        sold: 120,
        invoice: "INV-002"
    },
    {
        id: 9,
        customer: "Jane Doe",
        product: "Product 9",
        orderDate: "2021-01-02 12:06",
        image : "/assets/products/product9.jpg",
        status: "Shipped",
        price: 200,
        sold: 120,
        invoice: "INV-002"
    }
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
            return (
                <div className="flex text-left gap-2 font-roboto">
                    {row.original.orderDate}
                </div>
            )
        }
    },
    {
        accessorKey: "customer",
        header: "Customer",
        cell: ({row}) => {
            return (
                <div className="flex text-left gap-2 font-roboto">
                    {row.original.customer}
                </div>
            )
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

import { useState } from "react"
import { DatePickerWithRange } from "./DateFilter"

export default function RecentOrdersTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
 

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
        }
    })

 

    return (
        <div className="w-[1220px] bg-white  rounded-md mb-4 mx-auto mt-8">
          <div className="p-4 border-x-1 border-t-1 rounded-t-md border-b-0">
            <div>
                <h1 className="font-roboto font-medium">Recent Orders</h1>
            </div>
            <div className="flex justify-between items-center py-4">
            <div className="hidden sm:flex w-[10rem] md:w-[20rem]  bg-white items-center justify-start gap-2 rounded-sm px-3 py-1.5 border-1">
                    <Search className="text-black w-4 h-4 md:w-5 md:h-5" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="rounded-md outline-none bg-white w-full text-sm md:text-base" 
                    />
                </div>

            <div className="flex gap-2">
                     <DatePickerWithRange/>

                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto font-roboto rounded-sm font-medium text-gray-600">
                         <span className="text-gray-500">Status :</span>All Status <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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


                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto font-roboto rounded-sm text-gray-600 shadow-none">
                        <AlignCenter/>
                         Filter
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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
          <div className="rounded-b-md border">
            <Table className="">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="text-gray-500 text-left font-medium  bg-gray-100 py-2 ">
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
