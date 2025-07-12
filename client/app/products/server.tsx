import api from "@/lib/axios";

type Product = {
  id: number;
  name: string;
  price: number;
  main_image: string;
  description: string;
  category?: string;
};

type ProductsResponse = {
  results: Product[];
  count: number;
  next: string | null;
  previous: string | null;
};

export async function fetchProducts(params?: {
  page?: number;
  parent_category?: string;
  child_category?: string;
  sort?: string;
  search?: string;
  brand?: string;
}): Promise<{ products: Product[]; count: number; next: string | null; previous: string | null }> {
  try {
    const response = await api.get<ProductsResponse>('/product/product-list/', {
      params: {
        page: params?.page,
        parent_category: params?.parent_category,
        child_category: params?.child_category,
        ordering: params?.sort === 'desc' ? '-price' : 'price',
        search: params?.search,
        brand: params?.brand
      }
    });

    if (response.status === 200) {
      return {
        products: response.data.results.map((item: Product) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          main_image: item.main_image,
          category: item.category
        })),
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous
      };
    }
    return { products: [], count: 0, next: null, previous: null };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], count: 0, next: null, previous: null };
  }
}