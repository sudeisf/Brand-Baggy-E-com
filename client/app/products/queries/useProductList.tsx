import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { ProductDetail } from '@/types/product';
import api from '@/lib/axios';
import { useProductFilterStore } from '@/store/productStore';

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  main_image: string;
  category?: string; // Added category field
};

const fetchProducts = async (params?: {
  parent_category?: string;
  child_category?: string[];
  search?: string;
  brand?: string;
}) => {
  try {
    const response = await api.get('/product/product-list/', {
      params: {
        parent_category: params?.parent_category,
        child_category: params?.child_category?.join(','),
        search: params?.search,
        brand: params?.brand
      }
    });
    
    if (response.status === 200) {
      return response.data.results.map((item: Product) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        main_image: item.main_image,
        category: item.category // Include category if available
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const useProductsList = (filters?: {
  search?: string;
  brand?: string;
}) => {
  const { getParentCategory, getChildCategories } = useProductFilterStore();
  
  return useQuery<Product[], Error>({
    queryKey: ['productsList', 
      getParentCategory()?.name, 
      getChildCategories().map(c => c.name),
      filters
    ],
    queryFn: () => fetchProducts({
      parent_category: getParentCategory()?.name,
      child_category: getChildCategories().map(c => c.name),
      ...filters
    }),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData 
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