
import { useAuthStore } from '@/store/authStore';
import { useProductStore } from '@/store/prouctStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';

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

const fetchProducts  = async (token : string) =>{
    try {
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/seller/dashboard/`,{
        headers : {
          Authorization : `Bearer ${token}`
        }
      });
    
    if (response.status === 200) {
      return response.data.results.map((item: Product) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity : item.quantity,
        in_stock : item.in_stock,
        main_image : item.main_image,
        category: item.category,
        product_location: item.product_location,
        status: item.in_stock,
        slug: item.slug
      }));
    }
    return [];
  }catch(error){
    console.error("lose",error);
    return [];
  }
}

export const useProducts = () => {
  const token  = useAuthStore((state)=>state.accessToken)
const {setProducts} = useProductStore();

const query =  useQuery<Product[], Error>({
      queryKey: ['products'],
      queryFn: () => fetchProducts(token as string),
      enabled: !!token, 
      staleTime: 5 * 60 * 1000, 
});
      useEffect(()=>{
            if (query.isSuccess && query.data) {
                  setProducts(query.data);
                }
      },[query.isSuccess, query.data, setProducts])

return query
};


