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
import EditCustomer from "../[email]/component/EditCustomer";
import { customerData } from "../[email]/data";


export interface CustomerListItem {
  name: string;
  email: string;
  is_registered: boolean;
  order_count: number;
  total_spent: string; 
  last_order_date: string; 
  country: string;
  city: string;
  main_image: string | null;
}
export const columns: ColumnDef<CustomerListItem>[] = [
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
            src={row.original.main_image ?? ""}
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
        {row.original.city} ,{row.original.country}
      </div>
    ),
  },
  {
    accessorKey: "orderCount",
    header: "Orders",
    cell: ({ row }) => (
      <div className="flex text-left gap-2 font-roboto">
        {row.original.order_count}
      </div>
    ),
  },
  {
    accessorKey: "totalSpent",
    header: "Spent",
    cell: ({ row }) => (
      <div className="flex text-left gap-2 font-roboto">
        ${row.original.total_spent}
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
                href={`/customer/${encodeURIComponent(row.original.email)}`}
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

