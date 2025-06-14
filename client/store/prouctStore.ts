import api from "@/lib/axios";
import { error } from "console";
import {create} from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./authStore";


interface productStore {
      isLoading : boolean;
      error : string | null;
      createProductFn : (submitedData : any) => Promise<{
            success: boolean,
            message : string
      }|void>
}


export const useProductStore = create<productStore>()(
  persist(
    (set, get) => ({
      isLoading : false,
      error : null,
      createProductFn : async (submitedData: any) => {
            try{
                  set({isLoading:true,error:null})
                  const {accessToken} = useAuthStore.getState();
                  const response = await api.post('/product/seller/create-product/' , submitedData,
                        {
                              headers : {
                                     "Content-Type" : 'multipart/form-data',
                                     'Authorization': `Bearer ${accessToken}`,
                              }
                        }
                  );
                  if(response.status == 201){
                        set({isLoading : false, error: null})
                        return {
                              success : true,
                              message : "product successfully created"
                        }
                  }
            }catch(error){
                  console.log(error)
                  set(
                       {
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'An error occurred'
                       }
                  )
                  return{
                        success : false,
                        message : "product can't be created"
                  }
            }
      }
    }),
    {
      name: 'product-storage', 
    }
  )
)