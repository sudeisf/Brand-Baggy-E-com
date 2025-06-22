import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  main_image: string;
};

const fetchProducts = async (token: string) => {
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
  const token = useAuthStore((state) => state.accessToken);

  return useQuery<Product[], Error>({
    queryKey: ['productsList'],
    queryFn: () => fetchProducts(token as string),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};