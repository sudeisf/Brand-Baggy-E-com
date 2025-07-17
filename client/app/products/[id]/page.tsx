import { fetchProductDetail } from "./fetchProductDetail";
import ProductPage from "./ProductPage";
import { notFound } from "next/navigation";

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