
"use client";
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
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateRange } from "react-day-picker";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlignCenter,
  ChevronDown,
  Search,
  ArrowDownUp,
  ArrowUp,
  ArrowDown,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { endOfDay, startOfDay } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { columns, Product, data } from "./lib/productTable";

export default function RecentOrdersTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable<Product>({
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
  };

  return (
    <div className="w-[1250px] bg-white rounded-md mb-4 mx-auto">
      <div className="p-4 rounded-t-md border-b-0 mb-4">
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
                className="rounded-md outline-none bg-white w-full text-sm md:text-base text-[#331d67]"
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
                  <AlignCenter />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-[#331d67] rounded-sm">
              <Link href={'/products-dashboard/create-product'} className="flex items-center gap-2 w-full">
                <Plus />
                <p>Add Product</p>
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex w-full bg-white border rounded-md p-2">
            <div className="flex flex-col gap-2 w-full px-2 py-2">
              <h1 className="text-sm font-medium text-gray-600">Category</h1>
              <DropdownMenu>
                <DropdownMenuTrigger
                  onClick={() => table.getColumn("category")?.setFilterValue(undefined)}
                  className="w-full font-roboto bg-gray-50 border flex items-center justify-between px-4 py-2 rounded-sm text-gray-600 text-sm font-medium shadow-none"
                >
                  {table.getColumn("category")?.getFilterValue() as string || "All categories"}
                  <ChevronDown className="w-4 h-4" />
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
                  <ChevronDown className="w-4 h-4" />
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
                  <ChevronDown className="w-4 h-4" />
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
                  <ChevronDown className="w-4 h-4" />
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
            {table.getHeaderGroups().map((headerGroup, index) => (
              <TableRow key={index}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead key={index} className="text-gray-600 text-left font-medium bg-gray-50 py-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={index}
                  className="text-gray-600 font-medium text-left py-1 px-4"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 px-5">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
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
  );
}