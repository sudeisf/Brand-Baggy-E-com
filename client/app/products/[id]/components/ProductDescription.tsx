"use client"


interface ProductDesciption {
    description : string;
}

export default function ProductDesciption({description} : ProductDesciption){
    return (
        <div className="mt-4 border-1 shadow-xs rounded-lg p-4  space-y-2 border-gray-200 pt-5">
                <h1 className="text-lg text-[#331d67] font-semibold font-roboto">Description & Fit</h1>
                <p className="text-md text-gray-500  font-sans">{description}</p>
        </div>
    )
}