"use client"
import { useParams } from "next/navigation";
import { useState } from "react";
import ProductGalary from "./components/ProductGallary";
import SizeSelector from "./components/SizeSelector";
import ProductHeader from "./components/ProductHeader";
import AddToCartButton from "./components/AddToCartButton";
import ProductDesciption from "./components/ProductDescription";
import ShippingInfo from "./components/ShippingInfo";
import ProductReviews from "./components/ProductReviews";
import RelatedProducts from "./components/RelatedProducts";
import { useProductDetail } from "../queries/useProductList";
import { ProductDetail } from "@/types/product";




function formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

interface ProductPageProps {
    initialProduct: ProductDetail;
}

export default function ProductPage({ initialProduct }: ProductPageProps) {
    const [selectedSize, setSelectedSize] = useState<string>("");
    const isSlectedSize = selectedSize ? true : false
    const [isHeart, setIsHeart] = useState<boolean>(false);
    const params = useParams();
    const productId = Number(params.id);
    const {data:fetchedProduct , isLoading , error} = useProductDetail(productId , 
      {intialData : initialProduct});

    const product = fetchedProduct ?? initialProduct;
   
    const availableSizes = product?.variants
            .filter(variant => variant.stock > 0)
            .map(variant => variant.size.code);

    const today = new Date();
    const fiveDaysLater = new Date();
    fiveDaysLater.setDate(today.getDate() + 5);

    const estimatedArrival = `${formatDate(today)} - ${formatDate(fiveDaysLater)}`;
    return(
        <div 
            className="flex flex-col mx-auto min-h-screen ">
            <div
              className="
                flex flex-col 
                md:flex-row 
                p-2 mb-2 gap-4 
                max-w-full md:max-w-[1250px] 
                h-auto md:h-[750px] 
                mx-auto rounded-lg
              ">
                <ProductGalary
                    mainImage={product.main_image ?? ""}
                    images={product?.images ?? []}
                    name={product?.name ?? ""}
                />
                <div className="w-full px-0 md:px-3 flex flex-col mt-4 md:mt-0">
                    <ProductHeader
                        catagory={product?.gender ?? ""}
                        name={product?.name ?? ""}
                        price={product?.price ?? ""}
                    />

                    <SizeSelector
                        selectedSize={selectedSize}
                        onSizeChange={setSelectedSize}
                        availableSizes={availableSizes?? []}
                       />

                    <AddToCartButton
                        isSizeSelected={isSlectedSize}
                        // isHeart={isHeart}
                        product_id={product?.id}
                        // onHeartClick={() => setIsHeart(!isHeart)}
                        cartItem={{
                            id: product?.id?.toString() ?? "",
                            main_image: product?.main_image ?? "",
                            name: product?.name ?? "",
                            size: selectedSize,
                            quantity: 1,
                            price: product?.price ?? "",
                            in_stock: product?.in_stock ?? false,
                            discount: {
                                discount_value: product?.discount?.value,
                                discount_type: product?.discount?.type,
                                discount_start_date: product?.discount?.start_date,
                                discount_end_date: product?.discount?.end_date,
                                discount_is_valid : product.discount.is_valid,
                                discount_is_active : product.discount.is_active
                            }

                        }}
                     />

                    <ProductDesciption 
                        description={product?.description ?? ""} 
                    />

                    <ShippingInfo 
                        discount={`Desc ${
                            product?.discount.is_active && product?.discount.is_valid ?  product?.discount.value : "0.00"
                        } ${product.discount.type === "percentage" ? "%" : ""}`} 
                        packageType="Regular package" 
                        deliveryTime="3-5 Working days" 
                        estimatedArrival={estimatedArrival}
                    />
                </div> 
            </div>

            <ProductReviews
                ProductId = {product.id}
            />

            <RelatedProducts 
                product_id={product.id} 
            />

        </div>
    );
}
