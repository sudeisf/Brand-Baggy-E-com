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
import { Product, data } from './data'

export const statusStyles: Record<string, string> = {
  Active: "bg-green-500/5 text-green-500 rounded-md",
  Inactive: "bg-red-500/5 text-red-500",
};

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: "productName",
    header: "Product Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 px-2 font-roboto">
          <Image
            src={row.original.image}
            alt={row.original.productName}
            width={40}
            height={40}
            className="rounded-md shadow-sm border-2 border-gray-300"
          />
          <div className="flex  flex-col gap-2">
          <p className="">{row.original.productName}</p>
          <p className="text-[.8rem] font-roboto font-medium text-gray-400">{row.original.sku}</p>
          </div>
        </div>
      );
    },
  },
  {
  accessorKey : "category",
  header: "Catagory",
  cell : ({row})=>{
      return (
          <div className="flex items-center gap-2 px-2 font-roboto">
          {row.original.category}
          </div>
        );
      },
  },
  {
    accessorKey: "unitPrice",
    header: "Product Unit Price",
    cell: ({ row }) => {
      return (
        <div className="flex text-left gap-2 font-roboto">
          ${row.original.unitPrice}
        </div>
      );
    },
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      return (
        <div className="flex text-left gap-2 font-roboto">
          {row.original.products}
        </div>
      );
    },
  },{
  accessorKey: "status",
  header: "Status", 
  cell: ({ row }) => {
      return (
        <Select
          value={row.original.status}
          onValueChange={(value) => {
            // Handle status change
          }}
        >
          <SelectTrigger
            className={`w-[120px] px-2 py-4 rounded-sm text-xs font-medium capitalize flex items-center gap-2 font-roboto border-none ${
              statusStyles[row.original.status] || "bg-gray-500 text-white"
            }`}
          >
              <DotIcon className={`${row.original.status == "Active" ? "text-green-500" : "text-red-500" } bg-none border-none w-3 h-3    `}/>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-50 border-1 p-2 rounded-b-md">
            {["Active", "Inactive"].map((status) => (
              <SelectItem
                key={status}
                value={status}
              >
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },{
      id : "store",
      header : "Store",
      cell: ({row})=>{
        return (
            <div>
              <p>{row.original.store}</p>
            </div>
        )
      }
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
             <Button
                variant="outline"
                className="h-8 w-20 rounded-sm border-1 font-roboto  p-0  text-[#333567] shadow-none"
                aria-label="Open actions menu"
              >
                <Edit2Icon /> Edit
              </Button>
              <button className="text-gray-600" aria-label="Delete product">
                  <Trash2Icon className="text-sm w-4 h-4" />
              </button>
             </div>

            
  ),
}     
];

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
    table.getColumn("productName")?.setFilterValue(value);
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
        <div className="w-[1250px] bg-white  rounded-md mb-4 mx-auto">
          <div className=" p-4 rounded-t-md border-b-0 mb-4">
            <div className="space-y-2">
            <h1 className="text-2xl font-semibold font-roboto text-[#331d67]/90">Products</h1>
            <p className="text-gray-500 font-medium font-roboto">Organize all of your products</p>
            </div>
             <div className="flex justify-between py-4">
                  <div className="flex gap-2">
                  <div className="hidden sm:flex w-[10rem] md:w-[20rem] bg-white items-center justify-start gap-2 rounded-sm px-3 py-1.5 border-1">
                    <Search className="text-[#331d67] w-4 h-4 md:w-5 md:h-5" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchValue}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="rounded-md outline-none bg-gray-50 w-full text-sm md:text-base text-[#331d67]"
                    />
                    </div>

                    <DropdownMenu>
                  <DropdownMenuTrigger className="ml-auto font-roboto border flex items-center px-4 py-2 gap-2 rounded-sm text-gray-600 text-sm font-medium shadow-none z-10">
                  <ArrowDownUp className="w-4 h-4" />

                    <span className="text-gray-400 text-sm">Sort:</span>
                    {table.getColumn("status")?.getIsSorted() === "asc" ? "Asc" : "Desc"}
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="bg-white border p-2 rounded-md z-10 w-40">
                    <DropdownMenuItem
                      onClick={() => table.getColumn("status")?.toggleSorting(false)}
                      className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm text-gray-700 py-1.5"
                    >
                      <ArrowUp className="mr-2 h-4 w-4" />
                      Ascending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => table.getColumn("status")?.toggleSorting(true)}
                      className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm text-gray-700 py-1.5"
                    >
                      <ArrowDown className="mr-2 h-4 w-4" />
                      Descending
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                  </div>
                  <div className="flex gap-2">
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

                    <Button
                    className="bg-[#331d67] rounded-sm"
                    >
                      <Link href={'/products-dashboard/create-product'} className="flex items-center gap-2 w-full">
                      <Plus />
                     <p>Add Product</p>
                      </Link>
                    </Button>
                  </div>
            </div>  
            <div className="flex justify-between items-center ">
                    
                   
                   
                    <div className="flex w-full bg-white border rounded-md  p-2">
                   
                    <div className="flex flex-col gap-2 w-full px-2 py-2">
                      <h1 className="text-sm font-medium text-gray-600">Category</h1>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          onClick={() => table.getColumn("category")?.setFilterValue(undefined)}
                          className="w-full font-roboto bg-gray-50 border flex items-center justify-between px-4 py-2 rounded-sm text-gray-600 text-sm font-medium shadow-none" 
                        > 
                          {table.getColumn("category")?.getFilterValue() as string || "All categories"}
                          <ChevronDown className="w-4 h-4"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white border p-2 rounded-b-md w-full">
                          <DropdownMenuItem
                            onClick={() => table.getColumn("category")?.setFilterValue(undefined)}
                            className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm font-medium text-[#331d67] py-1 mb-1"
                          >
                            All Categories
                          </DropdownMenuItem>
                          {["Men", "Women", "Kids"].map((category) => (
                            <DropdownMenuItem
                              key={category}
                              onClick={() => table.getColumn("category")?.setFilterValue(category)}
                              className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm font-medium text-gray-600 py-1 mb-1"
                            >
                              {category}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex flex-col gap-2 w-full px-2 py-2">
                      <h1 className="text-sm font-medium text-gray-600">Status</h1>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          onClick={() => table.getColumn("status")?.setFilterValue(undefined)}
                          className="w-full font-roboto bg-gray-50 border flex items-center justify-between px-4 py-2 rounded-sm text-gray-600 text-sm font-medium shadow-none" 
                        >
                          {table.getColumn("status")?.getFilterValue() as string || "All Status"}
                          <ChevronDown className="w-4 h-4"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white border p-2 rounded-b-md w-full">
                          <DropdownMenuItem
                            onClick={() => table.getColumn("status")?.setFilterValue(undefined)}
                            className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm font-medium text-[#331d67] py-1 mb-1"
                          >
                            All Status
                          </DropdownMenuItem>
                          {["Active", "Inactive"].map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => table.getColumn("status")?.setFilterValue(status)}
                              className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm font-medium text-gray-600 py-1 mb-1"
                            >
                              {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex flex-col gap-2 w-full px-2 py-2">
                      <h1 className="text-sm font-medium text-gray-600">Price</h1>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          onClick={() => table.getColumn("unitPrice")?.setFilterValue(undefined)}
                          className="w-full font-roboto bg-gray-50 border flex items-center justify-between px-4 py-2 rounded-sm text-gray-600 text-sm font-medium shadow-none" 
                        >
                          {table.getColumn("unitPrice")?.getFilterValue() as string || "All Prices"}
                          <ChevronDown className="w-4 h-4"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white border p-2 rounded-b-md w-full">
                          <DropdownMenuItem
                            onClick={() => table.getColumn("unitPrice")?.setFilterValue(undefined)}
                            className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm font-medium text-[#331d67] py-1 mb-1"
                          >
                            All Prices
                          </DropdownMenuItem>
                          {["Under $100", "$100 - $200", "$200 - $300", "Over $300"].map((priceRange) => (
                            <DropdownMenuItem
                              key={priceRange}
                              onClick={() => table.getColumn("unitPrice")?.setFilterValue(priceRange)}
                              className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm font-medium text-gray-600 py-1 mb-1"
                            >
                              {priceRange}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex flex-col gap-2 w-full px-2 py-2">
                      <h1 className="text-sm font-medium text-gray-600">Store</h1>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          onClick={() => table.getColumn("store")?.setFilterValue(undefined)}
                          className="w-full font-roboto bg-gray-50 border flex items-center justify-between px-4 py-2 rounded-sm text-gray-600 text-sm font-medium shadow-none" 
                        >
                          {table.getColumn("store")?.getFilterValue() as string || "All Stores"}
                          <ChevronDown className="w-4 h-4"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white border p-2 rounded-b-md w-full">
                          <DropdownMenuItem
                            onClick={() => table.getColumn("store")?.setFilterValue(undefined)}
                            className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm font-medium text-[#331d67] py-1 mb-1"
                          >
                            All Stores
                          </DropdownMenuItem>
                          {["Addis Ababa", "Dire Dawa", "Hawassa"].map((store) => (
                            <DropdownMenuItem
                              key={store}
                              onClick={() => table.getColumn("store")?.setFilterValue(store)}
                              className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm font-medium text-gray-600 py-1 mb-1"
                            >
                              {store}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
