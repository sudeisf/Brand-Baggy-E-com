"use client"

import { useProductStore } from "@/store/prouctStore"
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { useDeleteProdcutMutation } from "../lib/mutation/productmutation";
import { data } from "../data";

interface props {
      id : any
}

export default function DeleteProduct({id}:props) {
      const {mutate : deleteFn , isPending : isLoading , error} = useDeleteProdcutMutation();
      const handleDelete = async ()=>{
            deleteFn(id,{
                  onSuccess : (data)=> {
                        toast.success(data.message)
                  },
                  onError : (error) =>{
                        toast.error(error.message)
                  }
            })
      }
      return (
            <>
            {isLoading && (
                  <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                      <div className="bg-white p-8 rounded-lg flex flex-col items-center gap-4 shadow-lg transform transition-all">
                          <div className="relative">
                              <Loader2Icon className="animate-spin w-8 h-8 text-red-500" />
                              <Trash2Icon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                          </div>
                          <p className="text-gray-700 font-medium">Deleting product...</p>
                          <p className="text-gray-500 text-sm">Please wait while we remove this item</p>
                      </div>
                  </div>
            )}
            <button 
                  onClick={handleDelete} 
                  className="text-gray-600 hover:text-red-500 transition-colors duration-200" 
                  aria-label="Delete product"
            >
                  <Trash2Icon className="text-sm w-4 h-4" />
            </button>
            </>
      )
}