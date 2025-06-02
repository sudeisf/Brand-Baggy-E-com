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
  User ,
  Dot,
  DotIcon,
  MoreHorizontal,
  Edit2Icon,
  Trash2Icon,
  Plus,
  ArrowDownUp,
  ArrowUp,
  ArrowDown,
  Ellipsis,
  } from "lucide-react"
import Link from "next/link"
import { 
  endOfDay, 
  format, 
  parse, 
  startOfDay 
} from "date-fns"

import { useState } from "react"
// import { DatePickerWithRange } from "./DateFilter"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { table } from "console"
import { Customer, data } from './data'
import { AddCustomerSheet } from "./components/addCustomerSheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import EditCustomer from "./[id]/component/EditCustomer"
import { customerData } from "./[id]/data"

export const statusStyles: Record<string, string> = {
  Active: "bg-green-500/5 text-green-500 rounded-md",
  Inactive: "bg-red-500/5 text-red-500",
};

export const columns: ColumnDef<Customer>[] = [
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
    accessorKey: "name",
    header: "Customer Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 px-2 font-roboto">
          <Avatar className="w-10 h-10">
            <AvatarImage
             src="https://github.com/shadcn.png"
              alt={row.original.name}
              className="rounded-md"
            />
            <AvatarFallback>
              {row.original.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <p className="">{row.original.name}</p>
          </div>
        </div>
      );
    },
  },
  {
  accessorKey : "email",
  header: "Email",
  cell : ({row})=>{
      return (
          <div className="flex items-center gap-2 px-2 font-roboto">
          {row.original.email}
          </div>
        );
      },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      return (
        <div className="flex text-left gap-2 font-roboto">
          {row.original.location}
        </div>
      );
    },
  },
  {
    accessorKey: "orderCount",
    header: "Orders",
    cell: ({ row }) => {
      return (
        <div className="flex text-left gap-2 font-roboto">
          {row.original.orderCount}
        </div>
      );
    },
  },{
  accessorKey: "totalSpent",
  header: "Spent", 
  cell: ({ row }) => {
      return (
        <div className="flex text-left gap-2 font-roboto">
          ${row.original.totalSpent}
        </div>
      );
    },
  },
  {
      id: "actions",
      header: ({table}) => {
          return (
              <div className="flex justify-end">
                  <h1>Action</h1>
              </div>
          )
      },
      cell: ({ row }) => (
  
        <div className="flex items-center justify-end gap-2 w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Ellipsis className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end">
            <div className="flex flex-col gap-1">
              <Link
                href={`/customer/${row.original.id}`}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-sm"
              >
                View Details
              </Link>
              <button
                onClick={() => navigator.clipboard.writeText(row.original.name)}
                className="w-full text-left px-3 py-2 text-sm border-b hover:bg-gray-100 rounded-sm"
              >
                Copy Name
              </button>
              <EditCustomer data={customerData} />
              
            </div>
          </PopoverContent>
        </Popover>
      </div>

            
  ),
}     
];

export default function Customers() {

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


  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    setSearchValue(value);
    table.getColumn("name")?.setFilterValue(value);
  };


    return (
        <div className="w-[1250px] bg-white  rounded-md mb-4 mx-auto">
          <div className=" p-4 rounded-t-md border-b-0 mb-4">
            <div className="flex justify-between items-center">
            <div className="space-y-2">
            <h1 className="text-2xl font-semibold font-roboto text-[#331d67]/90">Customers</h1>
            <p className="text-gray-500 font-medium font-roboto">Organize all of your customers</p>
            </div>
            <AddCustomerSheet/>
            </div>
             <div className="flex justify-between py-4 ">
                  
                  <div className="hidden sm:flex w-[10rem] md:w-[20rem] bg-white items-center justify-start gap-2 rounded-sm px-3 py-1.5 border-1">
                    <Search className="text-[#331d67] w-4 h-4 md:w-5 md:h-5" />
                    <input
                        type="text"
                        placeholder="Search customer..."
                        value={searchValue}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="rounded-md outline-none bg-white w-full text-sm md:text-base text-[#331d67]"
                    />
                    </div>

                    <div className="flex gap-2">
                       

                    <DropdownMenu>
                  <DropdownMenuTrigger className="ml-auto font-roboto border flex items-center px-4 py-2 gap-2 rounded-sm text-gray-600 text-sm font-medium shadow-none z-10">
                  <ArrowDownUp className="w-4 h-4" />

                    <span className="text-gray-400 text-sm">Sort:</span>
                    {table.getColumn("name")?.getIsSorted() === "asc" ? "Asc" : "Desc"}
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="bg-white border p-2 rounded-md z-10 w-40">
                    <DropdownMenuItem
                      onClick={() => table.getColumn("name")?.toggleSorting(false)}
                      className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm text-gray-700 py-1.5"
                    >
                      <ArrowUp className="mr-2 h-4 w-4" />
                      Ascending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => table.getColumn("name")?.toggleSorting(true)}
                      className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm text-gray-700 py-1.5"
                    >
                      <ArrowDown className="mr-2 h-4 w-4" />
                      Descending
                    </DropdownMenuItem>
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
                        <TableHead key={index} className="text-gray-600 text-left font-medium   bg-gray-50 py-2 ">
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
                      className="text-gray-600 font-medium text-left py-1 px-4"
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
