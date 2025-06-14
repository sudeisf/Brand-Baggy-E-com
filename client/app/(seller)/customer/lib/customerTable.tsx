// lib/customerTable.ts
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { Ellipsis } from "lucide-react";
import EditCustomer from "../[id]/component/EditCustomer";
import { customerData } from "../[id]/data";

export type Customer = {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  location: string;
  totalSpent: number;
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
    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-2 font-roboto">
        <Avatar className="w-10 h-10">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt={row.original.name}
            className="rounded-md"
          />
          <AvatarFallback>
            {row.original.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <p className="">{row.original.name}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-2 font-roboto">
        {row.original.email}
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex text-left gap-2 font-roboto">
        {row.original.location}
      </div>
    ),
  },
  {
    accessorKey: "orderCount",
    header: "Orders",
    cell: ({ row }) => (
      <div className="flex text-left gap-2 font-roboto">
        {row.original.orderCount}
      </div>
    ),
  },
  {
    accessorKey: "totalSpent",
    header: "Spent",
    cell: ({ row }) => (
      <div className="flex text-left gap-2 font-roboto">
        ${row.original.totalSpent}
      </div>
    ),
  },
  {
    id: "actions",
    header: ({ table }) => (
      <div className="flex justify-end">
        <h1>Action</h1>
      </div>
    ),
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
  },
];

export const data: Customer[] = [
  {
    id: "CUST-1001",
    name: "John Smith",
    email: "john.smith@example.com",
    orderCount: 5,
    location: "New York, USA",
    totalSpent: 1245.99,
  },
  {
    id: "CUST-1002",
    name: "Emily Johnson",
    email: "emily.j@example.com",
    orderCount: 2,
    location: "London, UK",
    totalSpent: 329.5,
  },
  {
    id: "CUST-1003",
    name: "Michael Brown",
    email: "michael.b@example.com",
    orderCount: 8,
    location: "Toronto, Canada",
    totalSpent: 2100.0,
  },
  {
    id: "CUST-1004",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    orderCount: 1,
    location: "Sydney, Australia",
    totalSpent: 149.99,
  },
  {
    id: "CUST-1005",
    name: "David Lee",
    email: "david.lee@example.com",
    orderCount: 12,
    location: "San Francisco, USA",
    totalSpent: 3540.75,
  },
  {
    id: "CUST-1006",
    name: "Jessica Martinez",
    email: "jessica.m@example.com",
    orderCount: 3,
    location: "Madrid, Spain",
    totalSpent: 487.3,
  },
  {
    id: "CUST-1007",
    name: "Robert Wilson",
    email: "robert.w@example.com",
    orderCount: 7,
    location: "Berlin, Germany",
    totalSpent: 1299.0,
  },
  {
    id: "CUST-1008",
    name: "Lisa Anderson",
    email: "lisa.a@example.com",
    orderCount: 4,
    location: "Paris, France",
    totalSpent: 876.45,
  },
  {
    id: "CUST-1009",
    name: "James Taylor",
    email: "james.t@example.com",
    orderCount: 6,
    location: "Tokyo, Japan",
    totalSpent: 1542.8,
  },
  {
    id: "CUST-1010",
    name: "Maria Garcia",
    email: "maria.g@example.com",
    orderCount: 9,
    location: "Mexico City, Mexico",
    totalSpent: 2345.6,
  },
];