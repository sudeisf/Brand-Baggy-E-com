// lib/productTable.ts
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Image from "next/image";
import { DotIcon, Trash2Icon } from "lucide-react";
import EditDialog from "../create-product/components/EditDialog";

export type Product = {
  id?: string;
  productName: string;
  sku: string;
  image: string;
  category: string;
  unitPrice: number;
  products: number;
  status: string;
  store: string;
};

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
        onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="shadow-sm"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
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
          <div className="flex flex-col gap-2">
            <p className="">{row.original.productName}</p>
            <p className="text-[.8rem] font-roboto font-medium text-gray-400">{row.original.sku}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Catagory",
    cell: ({ row }) => {
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
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Select
          value={row.original.status}
          onValueChange={(value: any) => {
            // Handle status change
          }}
        >
          <SelectTrigger
            className={`w-[120px] px-2 py-4 rounded-sm text-xs font-medium capitalize flex items-center gap-2 font-roboto border-none ${
              statusStyles[row.original.status] || "bg-gray-500 text-white"
            }`}
          >
            <DotIcon
              className={`${
                row.original.status == "Active" ? "text-green-500" : "text-red-500"
              } bg-none border-none w-3 h-3`}
            />
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-50 border-1 p-2 rounded-b-md">
            {["Active", "Inactive"].map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    id: "store",
    header: "Store",
    cell: ({ row }) => {
      return (
        <div>
          <p>{row.original.store}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: ({ table }) => {
      return (
        <div className="flex justify-end">
          <h1>Action</h1>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2 w-full">
        <EditDialog />
        <button className="text-gray-600" aria-label="Delete product">
          <Trash2Icon className="text-sm w-4 h-4" />
        </button>
      </div>
    ),
  },
];

// Assuming 'data' is imported from './data', re-export it
export { data } from "../data";