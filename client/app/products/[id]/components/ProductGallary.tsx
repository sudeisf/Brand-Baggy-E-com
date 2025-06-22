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
        <div className=" relative w-full "> 
                    <div className="relative flex gap-2 top-5 bottom-0 left-0 w-full px-4 z-10">
                        <div className={` w-full h-1 rounded-full ${selectedImage === mainImage ? "bg-[#f4f4f4]" : "bg-[#331d6736]"}`}></div>
                        <div className={` w-full h-1 rounded-full ${selectedImage === images[0] ? "bg-[#f4f4f4]" : "bg-[#331d6736]"}`}></div>
                        <div className={` w-full h-1 rounded-full ${selectedImage === images[1] ? "bg-[#f4f4f4]" : "bg-[#331d6736]"}`}></div>
                        <div className={` w-full h-1 rounded-full ${selectedImage === images[2] ? "bg-[#f4f4f4]" : "bg-[#331d6736]"}`}></div>
                    </div>
                    <Image 
                        src={selectedImage} 
                        alt={name}  
                        width={600} 
                        height={700} 
                        className="rounded-lg object-cover w-[600px] h-[700px]"
                        onClick={()=> setSelectedImage(mainImage)}
                         />
                    <div className=" relative -top-33 justify-center flex flex-row gap-4 h-30 w-full px-4">
                        {images.map((image) => (
                            <Image
                             key={image} 
                             src={image} 
                             alt={name} 
                             width={200} 
                             height={100} 
                             className={`rounded-lg object-cover border-[3px] border-white ${selectedImage === image ? "border-2 border-black" : ""}`} 
                             onClick={() => setSelectedImage(image)}
                             />
                        ))}
                    </div>
                </div>
    );
}