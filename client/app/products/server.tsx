
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

