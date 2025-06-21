"use client"
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore"


interface response {
      success : boolean,
      message : string
}

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

export const  useCreateProductMutation =  () =>{
      const accessToken = useAuthStore((state)=> state.accessToken);
      const queryClient = useQueryClient();
      return useMutation<response,Error,FormData>(
            {     
                  mutationKey: ['createProduct'],
                  mutationFn : async (submitedData:FormData) => {
                        const result = await api.post('/product/seller/create-product/',
                              submitedData,{
                                    headers : {
                                          "Content-Type" : 'multipart/form-data',
                                          'Authorization': `Bearer ${accessToken}`,
                                    }
                              }
                        );
                        if(result?.status !== 201){
                              throw Error("couldn't create the product")
                        }
                        return{
                              success : true,
                              message : "product created succefully"
                        }

                  },
                  onSuccess(data, variables, context) {
                        queryClient.invalidateQueries({queryKey : ["products"]});
                  },
            },
      )
      
}

export  const  useDeleteProdcutMutation =  () =>{
      const accessToken = useAuthStore((state)=> state.accessToken);
      const queryClient = useQueryClient();
      return useMutation<response,Error,number>(
            {
                  mutationKey: ['deleteProduct'],
                  mutationFn : async (id:number) => {
                        const result =  await api.delete(`/product/seller/${id}/delete/`,
                              {
                                    headers : {
                                          'Authorization': `Bearer ${accessToken}`,
                                    }
                              }
                        );
                        if(result?.status !== 204){
                              throw Error("couldn't delete the product")
                        }
                        return{
                              success : true,
                              message : "product deleted succefully"
                        }

                  },
                  onSuccess(data, variables, context) {
                        queryClient.invalidateQueries({queryKey : ["products"]});
                  },   
            }
      )
}

export  const  useUpdateProductMutaion =  () =>{
      const accessToken = useAuthStore((state)=> state.accessToken);
      const queryClient = useQueryClient();
      return useMutation<response,Error,{ id: number, payload: Record<string, any> }>(
            {
                  mutationKey: ['updateProduct'],
                  mutationFn : async ({ id, payload }:{ id: number, payload: Record<string, any>}) => {
                        const result =  await api.patch(`/product/seller/${id}/update/`,
                              payload ,
                              {
                                    headers : {
                                          'Authorization': `Bearer ${accessToken}`,
                                    }
                              }
                        );
                        if(result?.status !== 200){
                              throw Error("couldn't update the product stock")
                        }
                        console.log(payload)
                        return{
                              success : true,
                              message : "product stock updated succefully"
                        }
                  },
                  onSuccess(data, variables, context) {
                        queryClient.invalidateQueries({queryKey : ["products"]});
                  },   
            }
      )
}


export  const  useUpdateStockProductMutaion =  () =>{
      const accessToken = useAuthStore((state)=> state.accessToken);
      const queryClient = useQueryClient();
      return useMutation<response,Error,{ id: number, in_stock: boolean }>(
            {
                  mutationKey: ['updateStockStatus'],
                  mutationFn : async ({ id, in_stock }: { id: number, in_stock: boolean }) => {
                        const result =  await api.patch(`/product/seller/${id}/update-stock/`,
                              {in_stock},
                              {
                                    headers : {
                                          'Authorization': `Bearer ${accessToken}`,
                                    }
                              }
                        );
                        if(result?.status !== 200){
                              throw Error("couldn't update the product")
                        }
                        return{
                              success : true,
                              message : "product updated succefully"
                        }
                  },
                  onSuccess(data, variables, context) {
                        queryClient.invalidateQueries({queryKey : ["products"]});
                  },   
            }
      )
}
interface detailResponse {
      success : true,
      detail : any
      message : "product detail fetched updated succefully"
}
export  const  useProductBeforeMutation =  () =>{
      const accessToken = useAuthStore((state)=> state.accessToken);
      const queryClient = useQueryClient();
      return useMutation<detailResponse,Error ,number>(
            {
                  mutationKey: ['getProductDetail'],
                  mutationFn : async (id:number) => {
                        const result = await api.get(
                              `/product/seller/${id}/detail/`,
                              {
                                    headers: {
                                          'Authorization': `Bearer ${accessToken}`,
                                    }
                              }
                        );
                        if (result?.status !== 200) {
                              throw Error("couldn't fetch the product detail");
                        }
                        return{
                              success : true,
                              detail: result.data,
                              message : "product detail fetched updated succefully"
                        }
                  }   
            }
      )
}



