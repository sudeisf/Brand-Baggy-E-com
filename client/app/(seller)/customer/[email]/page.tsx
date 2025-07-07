"use client";

import { Check, DotIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { statusStyles } from "./lib/statusStyles";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  ColumnFiltersState,
  VisibilityState,
  SortingState,
  flexRender,
} from "@tanstack/react-table";
import { useState } from "react";
import EditCustomer from "./component/EditCustomer";
import { useFetchCustomerDetails } from "@/hooks/use-customer";
import { useParams } from "next/navigation";

export interface CustomerOrder {
  order_id: string;
  product_name: string;
  date: string;
  status: string;
  payment_status: string;
  payment_method: string;
  price: number;
  quantity: number;
}

const columns: ColumnDef<CustomerOrder>[] = [
  {
    id: "id",
    header: "ID",
    cell: ({ row }) => <div>#{row.original.order_id}</div>,
  },
  {
    accessorKey: "name",
    header: "Product name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-gray-900 font-medium font-roboto">
        <p>{row.original.product_name}</p>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 font-roboto">
        {row.original.date}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div
        className={`flex text-left gap-2 font-roboto px-2 py-1 ${
          statusStyles[row.original.status]
        }`}
      >
        {row.original.status}
      </div>
    ),
  },
  {
    accessorKey: "payment",
    header: "Payment",
    cell: ({ row }) => (
      <div className="flex text-left gap-2 font-roboto">
        {row.original.payment_status}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div className="flex text-left gap-2 font-roboto">
        ${row.original.price}
      </div>
    ),
  },
];

export default function CustomerDetailPage() {
  console.log("Hook 1: useState (sorting)");
  const [sorting, setSorting] = useState<SortingState>([]);
  console.log("Hook 2: useState (columnFilters)");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  console.log("Hook 3: useState (columnVisibility)");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  console.log("Hook 4: useParams");
  const params = useParams();
  const email = decodeURIComponent(params.email as string);
  console.log("Hook 5: useState (rowSelection)");
  const [rowSelection, setRowSelection] = useState({});
  console.log("Hook 6: useFetchCustomerDetails");
  const { data: Details, isLoading, error } = useFetchCustomerDetails(email);
  console.log("Hook 7: useReactTable");
  const table = useReactTable({
    data: Details?.orders ?? [],
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

  if (!email) return <div>Invalid email param</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error || !Details) return <div>Error loading customer details</div>;

  return (
    <div className="bg-white min-h-fit p-3 space-x-5 mt-4 max-w-[1250px] mx-auto mb-5">
      <div className="flex justify-between mb-8 items-center w-full">
        <div className="flex gap-4 items-center">
          <div className="border w-fit p-2 rounded-md shadow-xs">
            <Link href="/customer">
              <ArrowLeft className="text-gray-600" />
            </Link>
          </div>
          <div>
            <p className="text-gray-500 font-roboto font-medium">
              Back to customer list
            </p>
            <h1 className="text-2xl font-roboto font-medium text-gray-700">
              {Details.customer_info.name}
            </h1>
          </div>
        </div>
        <div className="flex items-center border px-2 rounded-md">
          <Check className="w-4 h-4" />
          {/* <EditCustomer data={Details.customer_info} /> */}
        </div>
      </div>
      <div className="flex justify-around border-b pb-5">
        <div className="border-r-2 px-8">
          <p className="text-gray-500 font-roboto font-medium">Total Cost</p>
          <h1 className="text-3xl font-roboto font-medium text-gray-700 mt-4">
            ${Details.summary.total_spent}
          </h1>
          <p className="text-gray-500 font-roboto font-medium">
            new cost last 365 days
          </p>
        </div>
        <div className="border-r-2 px-8">
          <p className="text-gray-500 font-roboto font-medium">Total Order</p>
          <h1 className="text-3xl font-roboto font-medium text-gray-700 mt-4 flex items-center gap-4">
            {Details.summary.total_orders}{" "}
            <DotIcon className=" stroke-[.8rem] text-yellow-400" />
          </h1>
          <p className="text-gray-500 font-roboto font-medium">
            new cost last 365 days
          </p>
        </div>
        <div className="border-r-2 px-8">
          <p className="text-gray-500 font-roboto font-medium">Completed</p>
          <h1 className="text-3xl font-roboto font-medium text-gray-700 mt-4 flex items-center gap-4">
            {Details.summary.completed_orders}{" "}
            <DotIcon className=" stroke-[.8rem] text-green-400" />
          </h1>
          <p className="text-gray-500 font-roboto font-medium">
            new cost last 365 days
          </p>
        </div>
        <div className="px-8">
          <p className="text-gray-500 font-roboto font-medium">Canceled</p>
          <h1 className="text-3xl font-roboto font-medium text-gray-700 mt-4 flex items-center gap-4">
            {Details.summary.canceled_orders}{" "}
            <DotIcon className=" stroke-[.8rem] text-red-400" />
          </h1>
          <p className="text-gray-500 font-roboto font-medium">
            new cost last 365 days
          </p>
        </div>
      </div>
      <div className="w-full flex mt-10">
        <div className="w-4/12 space-y-2 px-4">
          <h1 className="text-lg font-medium text-gray-600 pl-2 font-roboto capitalize">
            customer information
          </h1>
          <div className="border-2 p-5 space-y-2 rounded-sm">
            <div>
              <div className="flex justify-between gap-2">
                <div>
                  <h1 className="capitalize text-gray-600">name</h1>
                  <p className="text-gray-800 font-medium">
                    {Details.customer_info.name}
                  </p>
                </div>
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt={Details.customer_info.name}
                    className="rounded-md"
                  />
                  <AvatarFallback>
                    {Details.customer_info.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="">Email</label>
              <p className="text-gray-800 font-medium">
                {Details.customer_info.email}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="">Phone</label>
              <p className="text-gray-800 font-medium">
                {Details.customer_info.phone}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="">Shipping address</label>
              <p className="text-gray-800 font-medium">
                {`${Details.customer_info.city} ${Details.customer_info.country}`}
              </p>
            </div>
          </div>
        </div>
        <div className="w-4/6 h-[600px] space-y-2">
          <h1 className="text-lg font-medium text-gray-600 pl-2 font-roboto capitalize">
            orders
          </h1>
          <div className="border-2 rounded-md px-2">
            <Table className="rounded-lg border border-gray-200 overflow-hidden h-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup, index) => (
                  <TableRow key={index}>
                    {headerGroup.headers.map((header, index) => (
                      <TableHead
                        key={index}
                        className="text-gray-600 border-b text-md text-left font-medium bg-white py-2"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="border-1">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={index}
                      className="text-gray-600 h-16 font-medium text-left py-5 border-1 px-4"
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
                      className="h-32 text-center border-1"
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
      </div>
    </div>
  );
}