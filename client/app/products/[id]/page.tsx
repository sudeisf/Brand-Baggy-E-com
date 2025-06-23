import api from "@/lib/axios";
import ProductPage from "./ProductPage";
import { ProductDetail } from "@/types/product";
import { notFound } from "next/navigation";
  
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

export default async function ProductPageSSR({ params }: { params: { id: string } }) {
    const productId = Number(params.id);
    if (isNaN(productId) || productId <= 0) {
      notFound();
    }
    const initialProduct = await fetchProductDetail(productId);
    if (!initialProduct) {
      notFound();
    }
  return <ProductPage initialProduct={initialProduct} />
}