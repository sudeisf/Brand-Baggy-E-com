import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OrderTableResponse } from "@/hooks/use-order"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import UpdatePaymentStatus from "../components/UpdatePaymentStatus"
import UpdateOrderStatus from "../components/updateOrderStatuse"
import OrderDetails from "../components/orderDetails"



  
    
    
export const columns: ColumnDef<OrderTableResponse>[] = [
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
        accessorKey: "order_id",
        header: "Order ID",
        cell: ({ row }) => (
          <div className="font-medium text-left">
            {row.original.order_id}
          </div>
        ),
        filterFn: (row, id, value) => {
          return String(row.getValue(id)) === String(value);
        }
      },
      {
        accessorKey: "orderDate",
        header: "Date",
        cell: ({ row }) => {
          let dateValue = row.original.date;
          let formatted = "N/A";
          if (dateValue) {
            let isoString = dateValue.trim().replace(" ", "T");
            if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(isoString)) {
              isoString += ":00";
            }
            const dateObj = new Date(isoString);
            if (!isNaN(dateObj.getTime())) {
              formatted = format(dateObj, "MMM d, yyyy");
            }
          }
          return <div>{formatted}</div>;
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
            ${row.original.total}
          </div>
        )
      },
      {
        accessorKey: "paymentStatus",
        header: "Payment status",
        cell: ({ row }) => {
          return (
           <UpdatePaymentStatus order_id={row.original.order_id} status={row.original.payment_status} />
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
            // console.log(row.original.status)
          return (
            <UpdateOrderStatus order_id={row.original.order_id} status={row.original.status} />
          );
        },  
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  aria-label="Open actions menu"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
              <OrderDetails order_id={row.original.order_id} />
    
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.order_id.toString())}>
                  Copy Order ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                {/* <DropdownMenuItem>Resend Notification</DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      }
    ]
    