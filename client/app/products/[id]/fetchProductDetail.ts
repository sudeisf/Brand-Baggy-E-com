import api from "@/lib/axios";
import { ProductDetail } from "@/types/product";

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