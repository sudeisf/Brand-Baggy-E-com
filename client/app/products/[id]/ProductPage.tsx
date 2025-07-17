// ProductPage.tsx
"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import ProductGallery from "./components/ProductGallary";
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

function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

interface ProductPageProps {
  initialProduct: ProductDetail;
}

export default function ProductPage({ initialProduct }: ProductPageProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const isSelectedSize = !!selectedSize; // Fixed typo and simplified
  const [isHeart, setIsHeart] = useState<boolean>(false);
  const params = useParams();
  const productId = Number(params.id);
  const { data: fetchedProduct, isLoading, error } = useProductDetail(productId, {
    intialData: initialProduct,
  });

  const product = fetchedProduct ?? initialProduct;

  // Ensure product is defined before accessing properties
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || !product) {
    return <div>Error loading product</div>;
  }

  const availableSizes = product.variants
    ?.filter((variant) => variant.stock > 0)
    ?.map((variant) => variant.size.code) ?? [];

  const today = new Date();
  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(today.getDate() + 5);

  const estimatedArrival = `${formatDate(today)} - ${formatDate(fiveDaysLater)}`;

  return (
    <div className="flex flex-col mx-auto min-h-screen">
      <div
        className="
          flex flex-col 
          md:flex-row 
          p-2 mb-2 gap-4 
          max-w-full md:max-w-[1250px] 
          h-auto md:h-[750px] 
          mx-auto rounded-lg
        "
      >
        <ProductGalary
          mainImage={product.main_image ?? ""}
          images={product.images ?? []}
          name={product.name ?? ""}
        />
        <div className="w-full px-0 md:px-3 flex flex-col mt-4 md:mt-0">
          <ProductHeader
            catagory={product.gender ?? ""} // Fixed typo
            name={product.name ?? ""}
            price={product.price ?? ""}
          />

          <SizeSelector
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
            availableSizes={availableSizes}
          />

          <AddToCartButton
            isSizeSelected={isSelectedSize}
            product_id={product.id}
            cartItem={{
              id: product.id?.toString() ?? "",
              main_image: product.main_image ?? "",
              name: product.name ?? "",
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

          <ProductDescription description={product.description ?? ""} />

          <ShippingInfo
            discount={`Desc ${
              product.discount?.is_active && product.discount?.is_valid
                ? product.discount.value
                : "0.00"
            } ${product.discount?.type === "percentage" ? "%" : ""}`}
            packageType="Regular package"
            deliveryTime="3-5 Working days"
            estimatedArrival={estimatedArrival}
          />
        </div>
      </div>

      <ProductReviews ProductId={product.id} />

      <RelatedProducts product_id={product.id} />
    </div>
  );
}