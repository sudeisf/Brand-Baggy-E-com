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
import { ArrowUp, ArrowDown, ArrowDownUp, AlignCenter , RefreshCcw, ChevronDownIcon, Eye } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  ChevronDown, 
  MoreHorizontal,
  Search, 
  User 
} from "lucide-react"
import { format } from "date-fns"
import { use, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectGroup, SelectValue, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Value } from "@radix-ui/react-select"
import  OrderDetails  from "./orderDetails"
import { SheetContent, SheetDescription, SheetTrigger ,Sheet, SheetTitle } from "@/components/ui/sheet"
import { useAdminOrderTable } from "@/hooks/use-order"
import { OrderTableResponse } from "@/hooks/use-order"
import { columns} from "../lib/column"







export default function OrdersTable() {

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const {data: orders, refetch} = useAdminOrderTable();
  const table = useReactTable<OrderTableResponse>({
    data: orders || [],
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
    table.getColumn("order_id")?.setFilterValue(value);
  };

    return (
        <div className="w-[1250px] bg-white  rounded-md mb-4  mt-4 mx-auto">
          <div className="p-4  rounded-t-md border-b-0">
            <div className="flex justify-between items-center py-4  rounded-md">
                    <div className="hidden sm:flex w-[10rem] md:w-[20rem] bg-white items-center justify-start gap-2 rounded-sm px-3 py-1.5 border-1">
                    <Search className="text-[#331d67] w-4 h-4 md:w-5 md:h-5" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchValue}
                        onChange={(e) => handleSearch(String(e.target.value))}
                        className="rounded-md outline-none bg-white w-full text-sm md:text-base text-[#331d67]"
                    />
                    </div>
                    <div className="flex gap-2">
                    
                  <DropdownMenu>
                  <DropdownMenuTrigger 
                  onClick={() => {
                    table.getColumn("order_id")?.toggleSorting();
                  }} 
                  className="ml-auto font-roboto border flex items-center px-4 py-2 gap-2 rounded-sm text-gray-600 text-sm font-medium shadow-none z-10">
                  <ArrowDownUp className="w-4 h-4" />

                    <span className="text-gray-400 text-sm">Sort:</span>
                    {table.getColumn("order_id")?.getIsSorted() === "asc" ? "Asc" : "Desc"}
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="bg-white border p-2 rounded-md z-10 w-40">
                    <DropdownMenuItem
                      onClick={() => table.getColumn("orderStatus")?.toggleSorting(false)}
                      className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm text-gray-700 py-1.5"
                    >
                      <ArrowUp className="mr-2 h-4 w-4" />
                      Ascending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => table.getColumn("orderStatus")?.toggleSorting(true)}
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
                    <Button onClick={()=>refetch()} variant={"outline"} className="bg-white">
                      <RefreshCcw className="w- h-4 text-black " />
                    </Button>
            </div>
            </div>
          </div>
          <div className="px-4">
            <Table className="rounded-lg border-separate  shadow-sm border-spacing-0 overflow-hidden">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="text-gray-700 text-left font-roboto font-medium  px-4  bg-gray-50 py-2 ">
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
                      className="text-gray-600 font-medium text-left font-roboto p-8"
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell className="px-4 text-md" key={cell.id}>
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
