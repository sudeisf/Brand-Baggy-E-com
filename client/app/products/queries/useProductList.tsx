import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { ProductDetail } from '@/types/product';
import api from '@/lib/axios';

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  main_image: string;
};

const fetchProducts = async () => {
  try {
    const response = await api.get('/product/product-list/', {
    });
    if (response.status === 200) {
      return response.data.results.map((item: Product) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        main_image: item.main_image,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const useProductsList = () => {

  return useQuery<Product[], Error>({
    queryKey: ['productsList'],
    queryFn: () => fetchProducts(),
    staleTime: 5 * 60 * 1000,
  });
};



const fetchProductDetail = async (id: number) : Promise<ProductDetail | null> => {
  try {
    const response = await api.get<ProductDetail>(`/product/${id}/detail/`);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
};
export const useProductDetail = (
  id: number , 
  options : { intialData? : ProductDetail | null} = {} 
) => {
  return useQuery<ProductDetail | null, Error>({
    queryKey: ['productPublicDetail',id],
    queryFn: () => fetchProductDetail(id),
    staleTime: 5 * 60 * 1000,
    initialData : options.intialData,
    enabled : !!id
  });
}