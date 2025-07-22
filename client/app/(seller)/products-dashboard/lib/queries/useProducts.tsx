
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

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
export const fetchProducts = async (
  token: string,
  page = 1
): Promise<PaginatedResponse<Product>> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/product/seller/dashboard/?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
};

export const useProducts = (page: number) => {
  const token = useAuthStore((state) => state.accessToken);
  const { setProducts } = useProductStore(); // optional: you might not even need this if you use React Table directly

  const query = useQuery({
    queryKey: ["products", page],
    queryFn: () => fetchProducts(token as string, page),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // optional: sync result to Zustand if needed
  useEffect(() => {
    if (query.isSuccess && query.data?.results) {
      setProducts(query.data.results);
    }
  }, [query.data, query.isSuccess, setProducts]);

  return query;
};


