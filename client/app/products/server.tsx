
import api from "@/lib/axios";

type Product = {
  id: number;
  name: string;
  price: number;
  main_image: string;
  description: string;
};

export async function fetchProducts() {
  try {
    const response = await api.get('/product/product-list/',);
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
}

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

interface Image {
  image: string;
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

interface ProductDetail {
  id: number;
  name: string;
  description: string;
  main_image: string;
  brand: string;
  category: Category;
  images: Image[];
  reviews: Review[];
  variants: Variant[];
  seller: Seller;
}


export async function fetchProductDetail(id: number): Promise<ProductDetail | null> {
  try {
    const response = await api.get<ProductDetail>(`/product/${id}/detail/`);
    if (response.status === 200) {
      return response.data;
    }
    return null; 
  } catch (error) {
    console.error("Error fetching product detail:", error);
    return null;
  }
}