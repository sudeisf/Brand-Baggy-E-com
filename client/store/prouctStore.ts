import api from "@/lib/axios";
import {create} from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./authStore";



interface category {
      id : number;
      name : string;
      parent :{
            id : number,
            name : string,
      }
}

type product  = {
      id : number,
      name : string,
      price : number,
      quantity : number,
      in_stock : boolean,
      main_image :string,
      product_location: string,
      slug: string,
      catagory : category
}

interface productStore {
      products: product[] | undefined;
      isLoading : boolean;
      error : string | null;
      createProductFn : (submitedData : any) => Promise<{
            success: boolean,
            message : string
      }|void>;
      fetchProductFn : () => Promise<{products? : product[] , error? : string , success? : boolean}|void>
}


export const useProductStore = create<productStore>()(
  persist(
    (set, get) => ({
      products: [],
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
      },
      fetchProductFn :async () => {
            try {
                  set({isLoading: true, error: null});
                  const {accessToken} = useAuthStore.getState();
                  const response = await api.get('/product/seller/dashboard/',
                        {
                              headers : {
                                    "Content-Type" : 'multipart/form-data',
                                    'Authorization': `Bearer ${accessToken}`,
                              }
                        }    
                  );
                  if(response.status == 200){
                        set({ products: response.data.results, isLoading: false, error: null });
                        return {
                              success : true ,
                              product : response.data.results
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
                  return {
                        success: false,
                        error: error instanceof Error ? error.message : 'An error occurred'
                  }
            }
      }
    }),
    {
      name: 'product-storage', 
    }
  )
)