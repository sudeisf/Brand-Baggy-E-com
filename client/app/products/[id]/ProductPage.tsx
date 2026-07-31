"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import SizeSelector from "./components/SizeSelector";
import ProductHeader from "./components/ProductHeader";
import AddToCartButton from "./components/AddToCartButton";
import ProductDescription from "./components/ProductDescription";
import ShippingInfo from "./components/ShippingInfo";
import ProductReviews from "./components/ProductReviews";
import RelatedProducts from "./components/RelatedProducts";
import { useProductDetail } from "../queries/useProductList";
import { ProductDetail } from "@/types/product";
import ProductGalary from "./components/ProductGallary";
import { Loader2Icon } from "lucide-react";
import { ProductCrum } from "../components/ProductCrum";

function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

function decodeHtml(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

interface ProductPageProps {
  initialProduct: ProductDetail;
}

export default function ProductPage({ initialProduct }: ProductPageProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const params = useParams();
  const productId = Number(params.id);
  const { data: fetchedProduct, isLoading, error } = useProductDetail(productId, {
    intialData: initialProduct,
  });

  const product = fetchedProduct ?? initialProduct;

  if (isLoading && !product) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center gap-2 text-gray-500">
        <Loader2Icon className="w-5 h-5 animate-spin" />
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-red-500">
        Could not load this product.
      </div>
    );
  }

  const availableSizes =
    product.variants
      ?.filter((variant) => variant.stock > 0)
      ?.map((variant) => variant.size.code) ?? [];

  const today = new Date();
  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(today.getDate() + 5);
  const estimatedArrival = `${formatDate(today)} - ${formatDate(fiveDaysLater)}`;

  const discountLabel =
    product.discount?.is_active && product.discount?.is_valid
      ? `${product.discount.value}${product.discount?.type === "percentage" ? "%" : " ETB"} off`
      : "No active discount";

  return (
    <div className="min-h-screen bg-white pb-12">
      <ProductCrum />

      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="pb-8 md:pb-10">
            <ProductGalary
              mainImage={product.main_image ?? ""}
              images={product.images ?? []}
              name={decodeHtml(product.name ?? "")}
            />
          </div>

          <div className="flex flex-col gap-6 lg:sticky lg:top-6">
            <ProductHeader
              catagory={product.gender ?? product.category?.name ?? ""}
              name={decodeHtml(product.name ?? "")}
              price={product.price ?? ""}
              inStock={product.in_stock}
              brand={product.brand}
            />

            <SizeSelector
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
              availableSizes={availableSizes}
            />

            <AddToCartButton
              isSizeSelected={Boolean(selectedSize)}
              product_id={product.id}
              cartItem={{
                id: product.id?.toString() ?? "",
                main_image: product.main_image ?? "",
                name: decodeHtml(product.name ?? ""),
                size: selectedSize,
                quantity: 1,
                price: product.price ?? "",
                in_stock: product.in_stock ?? false,
                discount: {
                  discount_value: product.discount?.value ?? 0,
                  discount_type: product.discount?.type ?? "",
                  discount_start_date: product.discount?.start_date,
                  discount_end_date: product.discount?.end_date,
                  discount_is_valid: product.discount?.is_valid ?? false,
                  discount_is_active: product.discount?.is_active ?? false,
                },
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-10">
          <ProductDescription description={decodeHtml(product.description ?? "")} />
          <ShippingInfo
            discount={discountLabel}
            packageType="Regular package"
            deliveryTime="3-5 working days"
            estimatedArrival={estimatedArrival}
          />
        </div>

        <div className="mt-10">
          <ProductReviews ProductId={product.id} />
        </div>

        <div className="mt-12">
          <RelatedProducts product_id={product.id} />
        </div>
      </div>
    </div>
  );
}
