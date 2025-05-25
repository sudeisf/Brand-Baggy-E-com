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
import { ArrowUp, ArrowDown, ArrowDownUp, AlignCenter , RefreshCcw, ChevronDownIcon } from "lucide-react"
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
import { use, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectGroup, SelectValue, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Value } from "@radix-ui/react-select"

export const orders: Order[] = [
  {
      id: "#ORD-2023-1001",
      orderDate: "2023-05-15T09:30:00Z",
      customer: "Alex Johnson",
      total: 149.99,
      paymentStatus: "paid",
      items: 3,
      orderStatus: 2 // Shipped
  },
  {
      id: "#ORD-2023-1002",
      orderDate: "2023-05-16T14:22:00Z",
      customer: "Maria Garcia",
      total: 87.50,
      paymentStatus: "paid",
      items: 1,
      orderStatus: 3 // Delivered
  },
  {
      id: "#ORD-2023-1003",
      orderDate: "2023-05-17T11:05:00Z",
      customer: "James Wilson",
      total: 234.95,
      paymentStatus: "pending",
      items: 5,
      orderStatus: 1 // Processing
  },
  {
      id: "#ORD-2023-1004",
      orderDate: "2023-05-18T16:45:00Z",
      customer: "Sophie Lee",
      total: 65.00,
      paymentStatus: "refunded",
      items: 2,
      orderStatus: 4 // Returned
  },
  {
      id: "#ORD-2023-1005",
      orderDate: "2023-05-19T10:15:00Z",
      customer: "Daniel Kim",
      total: 320.75,
      paymentStatus: "paid",
      items: 7,
      orderStatus: 2 // Shipped
  },
  {
    id: "#ORD-2023-1006",
    orderDate: "2023-05-19T10:15:00Z",
    customer: "Daniel Kim",
    total: 320.75,
    paymentStatus: "paid",
    items: 7,
    orderStatus: 2 // Shipped
},
{
  id: "#ORD-2023-1007",
  orderDate: "2023-05-19T10:15:00Z",
  customer: "Daniel Kim",
  total: 320.75,
  paymentStatus: "paid",
  items: 7,
  orderStatus: 2 // Shipped
},
{
  id: "#ORD-2023-1008",
  orderDate: "2023-05-19T10:15:00Z",
  customer: "Daniel Kim",
  total: 320.75,
  paymentStatus: "paid",
  items: 7,
  orderStatus: 2 // Shipped
},
{
  id: "#ORD-2023-1009",
  orderDate: "2023-05-19T10:15:00Z",
  customer: "Daniel Kim",
  total: 320.75,
  paymentStatus: "paid",
  items: 7,
  orderStatus: 2 // Shipped
},
{
  id: "#ORD-2023-1010",
  orderDate: "2023-05-19T10:15:00Z",
  customer: "Daniel Kim",
  total: 320.75,
  paymentStatus: "paid",
  items: 7,
  orderStatus: 2 // Shipped
}
];

export type Order = {
  id: string;
  orderDate: string;
  customer: string;
  total: number;
  paymentStatus: string;
  items: number;
  orderStatus: number;
}

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-500/5 text-yellow-500 w-fit",
  Processing: "bg-blue-500/5 text-blue-500 w-fit",
  Shipped: "bg-indigo-500/5 text-indigo-500 w-fit",
  Delivered: "bg-green-500/5 text-green-500 w-fit",
  Returned: "bg-red-500/5 text-red-500 w-fit",
  Cancelled: "bg-gray-500/5 text-gray-500 w-fit",
}

const paymentStatusStyles: Record<string, string> = {
  paid: "bg-green-500/5 text-green-500 w-fit",
  pending: "bg-yellow-500/5 text-yellow-500 w-fit",
  refunded: "bg-purple-500/5 text-purple-500 w-fit",
  failed: "bg-red-500/5 text-red-500 w-fit"
}

const getOrderStatus = (code: number): string => {
  const statusMap: Record<number, string> = {
    0: "Pending",
    1: "Processing",
    2: "Shipped",
    3: "Delivered",
    4: "Returned",
    5: "Cancelled"
  }
  return statusMap[code] || "Unknown"
}

const PaymentStats= [
  "paid",
  "pending",
  "refunded",
  "failed"
]
const orderStatus : String[] =[
     "Pending",
     "Processing",
     "Shipped",
     "Delivered",
     "Returned",
     "Cancelled"
]

export const columns: ColumnDef<Order>[] = [
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
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <div className="font-medium text-left">
        {row.original.id}
      </div>
    ),
    filterFn: (row, id, value) => {
      return String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase())
    }
  },
  {
    accessorKey: "orderDate",
    header: "Date",
    cell: ({ row }) => {
      const formatted = format(
        new Date(row.original.orderDate),
        "MMM d, yyyy"
      )
      return <div>{formatted}</div>
    }
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{row.original.customer}</span>
      </div>
    )
  },

  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => (
      <div className="font-medium">
        ${row.original.total.toFixed(2)}
      </div>
    )
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment status",
    cell: ({ row }) => {
      const [status, setStatus] = useState(row.original.paymentStatus);
      const isDisabled = status === "paid";
      return(
      <div className={`rounded-full  text-center ${
        paymentStatusStyles[status] || "bg-gray-100"
      }  ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
        <Select value={status} onValueChange={(value) => setStatus(value)} disabled={isDisabled}>
        <SelectTrigger className="w-fit rounded-full border-none shadow-none flex items-center justify-between "  disabled={isDisabled}>
            <SelectValue className="text-xs p-0"  />
            
        </SelectTrigger>
        <SelectContent>
            {PaymentStats.map(status => (
            <SelectItem key={status} value={status as string}>
                {status}
              </SelectItem>
                    ))}
          </SelectContent>
        </Select>

      </div>
    );
    }
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => (
      <div>
        {row.original.items} {row.original.items === 1 ? 'item' : 'items'}
      </div>
    )
  },
  {
    accessorKey: "orderStatus",
    header: "Order Status",
    cell: ({ row }) => {
      const initialStatus = getOrderStatus(row.original.orderStatus); 
      const [selectedStatus, setSelectedStatus] = useState(initialStatus);
      const nonEditableStatuses = ["Shipped", "Delivered", "Returned", "Cancelled"];
      const isDisabled = nonEditableStatuses.includes(selectedStatus);
  
      return (
        <div
          className={`px-3 rounded-full text-xs font-medium ${
            statusStyles[selectedStatus] || "bg-gray-100"
          } ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}` }
        >
          <Select value={selectedStatus} onValueChange={setSelectedStatus} disabled={isDisabled}>
            <SelectTrigger className="w-fit rounded-full border-none shadow-none flex items-center justify-between" disabled={isDisabled}>
              <SelectValue className="text-xs p-0" />
            </SelectTrigger >
            <SelectContent>
              {orderStatus.map((status, index) => (
                <SelectItem key={index} value={status as string}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    },  
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
            Copy Order ID
          </DropdownMenuItem>
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Print Invoice</DropdownMenuItem>
          <DropdownMenuItem>Resend Notification</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }
]



export default function OrdersTable() {

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable<Order>({
    data: orders,
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
    table.getColumn("id")?.setFilterValue(value);
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
                        onChange={(e) => handleSearch(e.target.value)}
                        className="rounded-md outline-none bg-white w-full text-sm md:text-base text-[#331d67]"
                    />
                    </div>
                    <div className="flex gap-2">
                    
                  <DropdownMenu>
                  <DropdownMenuTrigger className="ml-auto font-roboto border flex items-center px-4 py-2 gap-2 rounded-sm text-gray-600 text-sm font-medium shadow-none z-10">
                  <ArrowDownUp className="w-4 h-4" />

                    <span className="text-gray-400 text-sm">Sort:</span>
                    {table.getColumn("orderStatus")?.getIsSorted() === "asc" ? "Asc" : "Desc"}
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
                    <Button variant={"outline"} className="bg-white">
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
