"use client"


interface ProductHeaderProps{
   catagory : string;
   name : string;
   price: string;
}


export default function ProductHeader({catagory, name, price} : ProductHeaderProps){
    return(
        <><div className="rounded-full bg-gray-100 px-4 py-1 w-fit border-2 border-gray-200">
            <h1 className="text-sm text-[#331d67] font-medium font-rubik">{catagory}</h1>
        </div><div className="flex flex-col gap-2 mt-4">
                <h1 className="text-3xl font-medium font-rubik capitalize">{name}</h1>
                <p className="text-2xl font-medium font-rubik">${price}</p>
            </div></>
    )
}
