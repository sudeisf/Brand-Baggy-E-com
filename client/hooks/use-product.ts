import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";


interface APIResponse{
      id: number;
      name : string;
      size : string[];
}

export const useListProducts = () =>{
      const token = useAuthStore(s=> s.accessToken)
      return useQuery({
            queryKey : ["sellerProductsLoop"],
            queryFn: async ()=>{
                  const response = await api.get<APIResponse>('/product/seller/product-select-list/',{headers:{Authorization:`Bearer ${token}`}})
                  return response.data
            }
      })
}


// Product Review Types
export interface ProductReview {
      id: number;
      user: string;
      user_image: string | null;
      review: string;
      rating: number;
      created_at: string;
    }
    
    export interface ProductReviewResponse {
      average_rating: number;
      reviews: ProductReview[];
    }

export const useProductReviewRating = (product_id: number) => {
  const token = useAuthStore(s => s.accessToken)
  return useQuery({
    queryKey: ["ReviewAndRating", product_id],
    queryFn: async () => {
      const response = await api.get<ProductReviewResponse>(
        `/product/product-rating-reviews/${product_id}/`
      )
      return response.data
    }
  })
}
export type SuggestedProduct = {
  id: number;
  name: string;
  price: string;
  description: string;
  main_image: string | null;
};

export type SuggestedProductsResponse = {
  data: SuggestedProduct[];
};

export const useProuductSuggestion = (product_id: number) => {
  return useQuery({
    queryKey: ["suggestionProducts", product_id],
    queryFn: async () => {
      const response = await api.get<SuggestedProductsResponse>(
        `/product/suggested-products/${product_id}/`
      )
      return response.data
    }
  })
}