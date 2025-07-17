// app/products/[id]/page.tsx
import { fetchProductDetail } from "./fetchProductDetail";
import ProductPage from "./ProductPage";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>; // Use Promise for params
}

export default async function ProductPageSSR({ params }: PageProps) {
  const { id } = await params; // Await the params Promise
  const productId = Number(id);
  if (isNaN(productId) || productId <= 0) {
    notFound();
  }
  const initialProduct = await fetchProductDetail(productId);
  if (!initialProduct) {
    notFound();
  }
  return <ProductPage initialProduct={initialProduct} />;
}