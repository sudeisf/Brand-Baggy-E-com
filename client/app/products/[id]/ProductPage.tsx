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


const products = [
    {
        id: 1,
        name: "Product 1",
        price: 100,
        image: "/assets/products/product1.jpg",
        description: "A stylish and comfortable product perfect for everyday use.",
    },
    {
        id: 2,
        name: "Product 2",
        price: 200,
        image: "/assets/products/product2.jpg",
        description: "This is a description of the product",
    },
    {   
        id: 3,
        name: "Product 3",
        price: 300,
        image: "/assets/products/product3.jpg",
        description: "An innovative product designed to meet your needs.",
        
    },
    {
        id: 4,  
        name: "Product 4",
        price: 400,
        image: "/assets/products/product4.jpg",
        description: "An innovative product designed to meet your needs.",
    }
]   


const reviews = [
    {
      name: "John Doe",
      rating: 4.5,
      date: "13 Oct 2024",
      comment: "This product strikes a great balance between functionality and design. As someone who uses it daily in a professional setting, I appreciate the attention to detail and thoughtful features.",
      avatar: "https://github.com/shadcn.png"
    },
    {
        name: "Jane Smith",
        rating: 5,
        date: "14 Oct 2024",
        comment: "I've been using this product for a week now, and it's been a game-changer. The quality is top-notch, and the customer service is outstanding.",
        avatar: "https://github.com/shadcn.png"
    },
    {
        name: "John Doe",
        rating: 4.5,
        date: "13 Oct 2024",
        comment: "This product strikes a great balance between functionality and design. As someone who uses it daily in a professional setting, I appreciate the attention to detail and thoughtful features.",
        avatar: "https://github.com/shadcn.png"
    }
];


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
              className="flex flex-row p-2 mb-2 gap-4 max-w-[1250px] h-[750px] mx-auto rounded-lg">
                <ProductGalary
                    mainImage={product?.main_image ?? ""}
                    images={product?.images ?? []}
                    name={product?.name ?? ""}
                />
                <div className="w-full px-3 flex flex-col">
                    <ProductHeader
                        catagory="Men Fashion"
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
                        isHeart={isHeart}
                        onHeartClick={() => setIsHeart(!isHeart)}
                        cartItem={{
                            id: product?.id?.toString() ?? "",
                            main_image: product?.main_image ?? "",
                            name: product?.name ?? "",
                            size: selectedSize,
                            quantity: 1,
                            price: product?.price ?? "",
                            in_stock : product?.in_stock?? false
                        }}
                     />

                    <ProductDesciption 
                        description={product?.description ?? ""} 
                    />

                    <ShippingInfo 
                        discount={`Desc ${Number(product?.discount.value)}%`} 
                        packageType="Regular package" 
                        deliveryTime="3-5 Working days" 
                        estimatedArrival={estimatedArrival}
                    />
                </div> 
            </div>

            <ProductReviews
                avarageRating={4.5} 
                totalReviews={50} 
                reviews={reviews} 
            />

            <RelatedProducts 
                products={products} 
            />

        </div>
    );
}
