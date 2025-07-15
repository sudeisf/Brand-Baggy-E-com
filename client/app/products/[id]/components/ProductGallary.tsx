"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
interface ProductGalleryProps {
    mainImage : string;
    images : string [];
    name : string;
}


export default function ProductGalary({mainImage,images,name} :ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string>(mainImage);

  useEffect(() => {
    setSelectedImage(mainImage);
  }, [mainImage]);

    return (
        <div className="relative w-full">
            <div className="relative flex gap-1 md:gap-2 top-5 bottom-0 left-0 w-full px-1 md:px-2 z-10">
                <div className={`w-full h-1 rounded-full ${selectedImage === mainImage ? "bg-[#f4f4f4]" : "bg-[#331d6736]"}`}></div>
                <div className={`w-full h-1 rounded-full ${selectedImage === images[0] ? "bg-[#f4f4f4]" : "bg-[#331d6736]"}`}></div>
                <div className={`w-full h-1 rounded-full ${selectedImage === images[1] ? "bg-[#f4f4f4]" : "bg-[#331d6736]"}`}></div>
                <div className={`w-full h-1 rounded-full ${selectedImage === images[2] ? "bg-[#f4f4f4]" : "bg-[#331d6736]"}`}></div>
            </div>
            <Image 
                src={selectedImage} 
                alt={name}  
                width={400} // smaller default
                height={400}
                className="
                    rounded-lg object-cover w-full 
                    max-w-[350px] h-auto 
                    mx-auto
                    sm:max-w-[500px] sm:w-[500px] sm:h-[600px]
                    md:max-w-[400px] md:w-[400px] md:h-[500px]
                    lg:max-w-[600px] lg:w-[600px] lg:h-[700px]
                "
                onClick={()=> setSelectedImage(mainImage)}
            />
            <div className="relative -top-20 md:-top-28 justify-center flex flex-row gap-1 md:gap-2 h-16 md:h-20 w-full px-1 md:px-2">
                {images.map((image) => (
                    <Image
                        key={image} 
                        src={image} 
                        alt={name} 
                        width={80} // smaller default
                        height={60}
                        className={`
                            rounded-lg object-cover border-[2px] border-white 
                            w-14 h-10
                            sm:w-[120px] sm:h-[80px]
                            md:w-[80px] md:h-[60px]
                            lg:w-[200px] lg:h-[100px]
                            ${selectedImage === image ? "border-2 border-black" : ""}
                        `} 
                        onClick={() => setSelectedImage(image)}
                    />
                ))}
            </div>
        </div>
    );
}