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

const product = {
    id: 1,
    name: "loose fit hoodie",
    price: 29.99,
    description: "This premium loose-fit zip hoodie combines streetwear style with everyday comfort. Designed with a relaxed silhouette, it offers unrestricted movement while maintaining a fashionable oversized look. The full-zip front allows for versatile styling options, making it perfect for layering or wearing solo.",
    mainImage: "/assets/products/product1.jpg",
    images: [
        "/assets/products/product1.jpg",
        "/assets/products/product2.jpg",
        "/assets/products/product3.jpg"
    ]
}

const reviews = [
    {
      name: "John Doe",
      rating: 4.5,
      date: "2024-01-01",
      comment: "This product is great!",
      avatar: "https://github.com/shadcn.png"
    }
];

export default function ProductPage(){
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [isHeart, setIsHeart] = useState<boolean>(false);

    return(
        <div 
            className="flex flex-col mx-auto min-h-screen ">
            <div
              className="flex flex-row p-2 mb-2 gap-4 max-w-[1250px] h-[750px] mx-auto rounded-lg">
                <ProductGalary
                    mainImage={product.mainImage}
                    images={product.images}
                    name={product.name}
                />
                <div className="w-full px-3 flex flex-col">
                    <ProductHeader
                        catagory="Men Fashion"
                        name={product.name}
                        price={product.price}
                    />

                    <SizeSelector
                        selectedSize={selectedSize}
                        onSizeChange={setSelectedSize}
                       />

                    <AddToCartButton
                        isHeart ={isHeart} 
                        onHeartClick={()=> setIsHeart(!isHeart)} 
                     />

                    <ProductDesciption 
                        description={product.description} 
                    />

                    <ShippingInfo 
                        discount="Desc 50%" 
                        packageType="Regular package" 
                        deliveryTime="3-5 Working days" 
                        estimatedArrival="10-15 october 2025" 
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
