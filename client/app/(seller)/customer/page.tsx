"use client";

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlignCenter,
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  Search,
} from "lucide-react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddCustomerSheet } from "./components/addCustomerSheet";
import { columns } from "./lib/customerTable";
import { useFeatchCustomerLsit } from "@/hooks/use-customer";

export default function Customers() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [searchValue, setSearchValue] = useState("");

  const { data: customerData } = useFeatchCustomerLsit();

  const table = useReactTable({
    data: customerData?.results ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);
    table.getColumn("name")?.setFilterValue(value);
  };

  return (
    <div className="w-[1250px] bg-white rounded-md mb-4 mx-auto">
      <div className="p-4 rounded-t-md border-b mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-[#331d67]/90">Customers</h1>
            <p className="text-gray-500 font-medium">Organize all of your customers</p>
          </div>
          <AddCustomerSheet />
        </div>

        <div className="flex justify-between py-4">
          {/* Search Box */}
          <div className="hidden sm:flex w-[10rem] md:w-[20rem] border rounded-sm px-3 py-1.5 items-center gap-2">
            <Search className="text-[#331d67] w-4 h-4" />
            <input
              type="text"
              placeholder="Search customer..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full text-sm bg-white text-[#331d67] outline-none"
            />
          </div>

          {/* Sort + Filter Columns */}
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 text-gray-600 text-sm border px-4 py-2 rounded-sm">
                <ArrowDownUp className="w-4 h-4" />
                <span>Sort:</span>
                {table.getColumn("name")?.getIsSorted() === "asc" ? "Asc" : "Desc"}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border rounded-md w-40 p-1">
                <DropdownMenuItem
                  onClick={() => table.getColumn("name")?.toggleSorting(false)}
                >
                  <ArrowUp className="mr-2 h-4 w-4" /> Ascending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => table.getColumn("name")?.toggleSorting(true)}
                >
                  <ArrowDown className="mr-2 h-4 w-4" /> Descending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-sm text-gray-600">
                  <AlignCenter className="w-4 h-4 mr-1" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((col) => col.getCanHide())
                  .map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      checked={col.getIsVisible()}
                      onCheckedChange={(val) => col.toggleVisibility(!!val)}
                    >
                      {col.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-4">
        <Table className="border-separate border-spacing-0">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-gray-50 py-2 text-left text-gray-600 font-medium">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6 text-gray-400">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-5 py-4 text-sm text-muted-foreground">
        <div>
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
  );
}
