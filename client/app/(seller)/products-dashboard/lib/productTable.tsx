// lib/productTable.ts
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Image from "next/image";
import { DotIcon, Trash2Icon } from "lucide-react";
import EditDialog from "../create-product/components/EditDialog";
import DeleteProduct from "../components/DeleteProduct";
import UpdateProductStatus from "../components/statusUpdate";



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
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 px-2 font-roboto">
          <Image
            src={row.original.main_image}
            alt={row.original.name}
            width={40}
            height={40}
            className="rounded-md shadow-sm border-2 border-gray-300"
          />
          <div className="flex flex-col gap-2">
            <p className="">{row.original.name}</p>
            <p className="text-[.8rem] font-roboto font-medium text-gray-400">{row.original.slug}</p>
          </div>
        </div>
      );
    },
  },
  {
    id: "category.parent.name",
    accessorKey: "category.parent.name",
    header: "Category",
    cell: ({ row }) => {
      const parentName = row.original.category?.parent?.name;
      return (
        <div className="flex items-center gap-2 px-2 font-roboto">
          {parentName || "N/A"}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value) return true;
      const parentName = row.original.category?.parent?.name;
      return parentName ? parentName.toLowerCase().includes(value.toLowerCase()) : false;
    },
  },
  {
    accessorKey: "price",
    header: "Product Unit Price",
    cell: ({ row }) => {
      return (
        <div className="flex text-left gap-2 font-roboto">
          ${row.original.price}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value) return true;
      const price = row.original.price;
      
      switch (value) {
        case "Under $50":
          return price < 50;
        case "$50 - $100":
          return price >= 50 && price <= 100;
        case "$100 - $200":
          return price >= 100 && price <= 200;
        case "Over $200":
          return price > 200;
        default:
          return true;
      }
    }
  },
  {
    accessorKey: "quantity",
    header: "Products",
    cell: ({ row }) => {
      return (
        <div className="flex text-left gap-2 font-roboto">
          {row.original.quantity}
        </div>
      );
    },
  },
  {
    accessorKey: "in_stock",
    header: "Status",
    cell: ({ row }) => {
     return (
        <div>
        <UpdateProductStatus id={row.original.id} in_stock={row.original.in_stock} />
        </div>
     )
    },
    filterFn: (row, id, value) => {
      const status = row.original.in_stock ? "Active" : "Inactive";
      return status === value;
    }
  },
  {
    accessorKey: "product_location",
    header: "Store",
    cell: ({ row }) => {
      return (
        <div>
          <p className="text-gray-700 capitalize">{row.original.product_location || "N/A"}</p>
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
        <EditDialog id={row.original.id} />
        <DeleteProduct id={row.original.id}/>
      </div>
    ),
  },
];

export { data } from "../data";