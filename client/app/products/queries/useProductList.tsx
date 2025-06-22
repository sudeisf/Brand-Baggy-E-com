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



interface Size {
  id: number;
  name: string;
  code: string;
  is_favourited: boolean;
}

interface Variant {
  id: number;
  stock: number;
  sku: string;
  size: Size;
}


interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
}

interface Seller {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: string;
  birth_date: string;
  user_role: string;
  profile_url: string;
}

interface Review {
  // Define review structure if needed
  // Example:
  // id: number;
  // rating: number;
  // comment: string;
}
interface discount {
  type: string;
  value: string;
  is_active : boolean
}
interface ProductDetail {
  id: number;
  name: string;
  description: string;
  main_image: string;
  brand: string;
  category: Category;
  images: string[];
  reviews: Review[];
  variants: Variant[];
  seller: Seller;
  price: string;
  discount : discount;
  in_stock : boolean
}




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
export const useProductDetail = (id: number) => {
  return useQuery<ProductDetail | null, Error>({
    queryKey: ['productPublicDetail',id],
    queryFn: () => fetchProductDetail(id),
    staleTime: 5 * 60 * 1000,
  });
}