"use client";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { columns } from "./lib/productTable";
import { useProductStore } from "@/store/prouctStore";
import { useProducts } from "@/app/(seller)/products-dashboard/lib/queries/useProducts";
import { HydrationBoundary, useQueryClient } from "@tanstack/react-query";
interface Category {
      id: number;
      name: string;
      parent: {
        id: number;
        name: string;
      };
    }
    
    type Product = {
      id: number;
      name: string;
      price: number;
      quantity: number;
      in_stock: boolean;
      main_image: string;
      product_location: string;
      slug: string;
      category: Category;
    };

type props = {
      initialProducts : Product[]
}

export default function ProductListPage({initialProducts}:props) {
  const products = useProductStore((state)=> state.products);
  const {data : queryProducts, isFetching , error: queryError } = useProducts()
  const queryClient = useQueryClient();
  
  useEffect(() => {
    useProductStore.setState({ products: initialProducts })
  }, [initialProducts])

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable<Product>({
    data: products,
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

  const handlePriceRange = (range: string) => {
    console.log('Selected range:', range);
    table.getColumn("price")?.setFilterValue(range);
  };

  return (
    <HydrationBoundary state={{ queries: [{ queryKey: ['products'], state: { data: initialProducts } }] }} >
    <div className="w-[1250px] bg-white rounded-md mb-4 mx-auto min-h-[87vh]">
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
                  onClick={() => table.getColumn("category.parent.name")?.setFilterValue(undefined)}
                  className="w-full font-roboto bg-gray-50 border flex items-center justify-between px-4 py-2 rounded-sm text-gray-600 text-sm font-medium shadow-none"
                >
                  {table.getColumn("category.parent.name")?.getFilterValue() as string || "All categories"}
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border p-2 rounded-b-md w-full">
                  <DropdownMenuItem
                    onClick={() => table.getColumn("category.parent.name")?.setFilterValue(undefined)}
                    className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm font-medium text-[#331d67] py-1 mb-1"
                  >
                    All Categories
                  </DropdownMenuItem>
                  {[...new Set(initialProducts
                    .filter(product => product.category && product.category.parent)
                    .map(product => product.category.parent.name)
                  )].map((categoryName, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => table.getColumn("category.parent.name")?.setFilterValue(categoryName)}
                      className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm font-medium text-gray-600 py-1 mb-1"
                    >
                      {categoryName}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-col gap-2 w-full px-2 py-2">
              <h1 className="text-sm font-medium text-gray-600">Status</h1>
              <DropdownMenu>
                <DropdownMenuTrigger
                  onClick={() => table.getColumn("in_stock")?.setFilterValue(undefined)}
                  className="w-full font-roboto bg-gray-50 border flex items-center justify-between px-4 py-2 rounded-sm text-gray-600 text-sm font-medium shadow-none"
                >
                  {table.getColumn("in_stock")?.getFilterValue() as string || "All Status"}
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border p-2 rounded-b-md w-full">
                  <DropdownMenuItem
                    onClick={() => table.getColumn("in_stock")?.setFilterValue(undefined)}
                    className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm font-medium text-[#331d67] py-1 mb-1"
                  >
                    All Status
                  </DropdownMenuItem>
                  {["Active", "Inactive"].map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => table.getColumn("in_stock")?.setFilterValue(status === "Active")}
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
                  onClick={() => table.getColumn("price")?.setFilterValue(undefined)}
                  className="w-full font-roboto bg-gray-50 border flex items-center justify-between px-4 py-2 rounded-sm text-gray-600 text-sm font-medium shadow-none"
                >
                  {table.getColumn("price")?.getFilterValue() as string || "All Prices"}
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border p-2 rounded-b-md w-full">
                  <DropdownMenuItem
                    onClick={() => table.getColumn("price")?.setFilterValue(undefined)}
                    className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm font-medium text-[#331d67] py-1 mb-1"
                  >
                    All Prices
                  </DropdownMenuItem>
                  {["Under $50", "$50 - $100", "$100 - $200", "Over $200"].map((priceRange) => (
                    <DropdownMenuItem
                      key={priceRange}
                      onClick={() => handlePriceRange(priceRange)}
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
                  onClick={() => table.getColumn("product_location")?.setFilterValue(undefined)}
                  className="w-full font-roboto bg-gray-50 border flex items-center justify-between px-4 py-2 rounded-sm text-gray-600 text-sm font-medium shadow-none"
                >
                  {table.getColumn("product_location")?.getFilterValue() as string || "All Stores"}
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border p-2 rounded-b-md w-full">
                  <DropdownMenuItem
                    onClick={() => table.getColumn("product_location")?.setFilterValue(undefined)}
                    className="cursor-pointer hover:bg-gray-100 rounded-sm px-2 text-sm font-medium text-[#331d67] py-1 mb-1"
                  >
                    All Stores
                  </DropdownMenuItem>
                  {[...new Set(initialProducts.map(product => product.product_location))].map((store) => (
                    <DropdownMenuItem
                      key={store}
                      onClick={() => table.getColumn("product_location")?.setFilterValue(store)}
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
    </HydrationBoundary>
  );
}