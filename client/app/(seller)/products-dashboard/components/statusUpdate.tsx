"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DotIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useUpdateStockProductMutaion } from "../lib/mutation/productmutation"
import { BlobOptions } from "buffer"
import { toast } from "sonner"



interface props {
      id : number
      in_stock : boolean
}
export const statusStyles: Record<string, string> = {
      "true": "bg-green-500/5 text-green-500 rounded-md",
      "false": "bg-red-500/5 text-red-500",
    };


export default function UpdateProductStatus({id ,in_stock}:props){
      const [status, setStatus] = useState(in_stock ? "Active" : "Inactive");
      const {mutate:updateStockFn , isPending:isLoading , error} = useUpdateStockProductMutaion();
      const loadingToastId = useRef<string | number | null>(null);
      const handleChange = async (in_stock : boolean)=>{
            const data = {
                  id : id,
                  in_stock : in_stock
            }
            updateStockFn(
                 data,
                  {
                        onSuccess : (data)=>{
                              toast.success(data.message)
                        }
                        ,onError: (error)=>{
                              toast.error(error.message)
                        },
                  }
                  
            )
      }
      useEffect(() => {
            if (isLoading) {
                  // Show loading toast and keep its ID
                  loadingToastId.current = toast.loading("Updating status...");
            } else if (loadingToastId.current) {
                  // Dismiss loading toast when not loading
                  toast.dismiss(loadingToastId.current);
                  loadingToastId.current = null;
            }
      }, [isLoading])
     
      return(
            <Select
            value={status}
            onValueChange={(value: string) => {
              setStatus(value);
              handleChange(value === "Active");
            }}
          >
            <SelectTrigger
              className={`w-[120px] px-2 py-4 rounded-sm text-xs font-medium capitalize flex items-center gap-2 font-roboto border-none ${
                statusStyles[String(in_stock)]
              }`}
            >
              <DotIcon
                className={`${
                  in_stock ? "text-green-500" : "text-red-500"
                } bg-none border-none w-3 h-3`}
              />
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-50 border-1 p-2 rounded-b-md">
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
          </Select>
      )
}