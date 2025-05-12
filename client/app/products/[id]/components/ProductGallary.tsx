"use client"
import Image from "next/image";

interface ProductGalleryProps {
    mainImage : string;
    images : string [];
    name : string;
}


export default function ProductGalary({mainImage,images , name} :ProductGalleryProps) {
    return (
        <div className=" relative w-full "> 
                    <img src={mainImage} alt={name}  className="rounded-lg w-[600px] h-[700px]" />
                    <div className=" relative -top-33 justify-center flex flex-row gap-4 h-30 w-full px-4">
                        {images.map((image) => (
                            <Image key={image} src={image} alt={name} width={200} height={100} className="rounded-lg object-cover border-[3px] border-white" />
                        ))}
                    </div>
                </div>
    );
}