"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import ImageUpload from "./components/ImageUpload"
import { DatePicker } from "./components/DateTimePicker"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    brand: z.string().optional(),
    productNumber: z.string().optional(),
    modelNumber: z.string().optional(),
    sizes: z.array(z.string()).min(1, "At least one size must be selected"),
    gender: z.enum(["men", "women"]),
    basePrice: z.number().min(0, "Base price must be greater than or equal to 0"),
    stock: z.number().min(0, "Stock must be greater than or equal to 0"),
    discount: z.number().optional(),
    discountType: z.enum(["percentage", "fixed"]).optional(),
    discountStartDate: z.date().optional(),
    discountEndDate: z.date().optional(),
    storeLocation: z.string().min(1, "Store location is required"),
    category: z.string().min(1, "Category is required"),
    subCategory: z.string().min(1, "Subcategory is required"),
    images: z.array(z.instanceof(File)).min(1, "At least one image is required")
});

type ProductFormData = z.infer<typeof productSchema>;

export default function CreateProduct(){
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            sizes: [],
            gender: 'men',
            basePrice: 0,
            stock: 0,
            storeLocation: '',
            category: '',
            subCategory: '',
            images: []
        }
    });

    const handleSizeClick = (size: string) => {
        setSelectedSizes(prev => {
            const newSizes = prev.includes(size) 
                ? prev.filter(s => s !== size)
                : [...prev, size];
            setValue('sizes', newSizes);
            return newSizes;
        });
    };

    const onSubmit = async (data: ProductFormData) => {
        try {
            const submitData = new FormData();
            
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'images') {
                    (value as File[]).forEach((file) => {
                        submitData.append(`images`, file);
                    });
                } else if (value instanceof Date) {
                    submitData.append(key, value.toISOString());
                } else if (Array.isArray(value)) {
                    submitData.append(key, JSON.stringify(value));
                } else if (value !== undefined && value !== null) {
                    submitData.append(key, String(value));
                }
            });

            const response = await fetch('/api/products', {
                method: 'POST',
                body: submitData,
            });

            if (!response.ok) {
                throw new Error('Failed to create product');
            }

         
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white min-h-dvh p-3 space-x-5 mt-4 max-w-[1250px] mx-auto mb-5">
            <div className="flex justify-between mb-8 items-center w-full">
                <div className="flex gap-4 items-center">
                    <div className="border w-fit p-2 rounded-md shadow-xs">
                        <Link href="/products-dashboard">
                            <ArrowLeft className="text-gray-600"/>
                        </Link>
                    </div>
                    <div>
                        <p className="text-gray-500 font-roboto font-medium">Back to product list</p>
                        <h1 className="text-2xl font-roboto font-medium text-gray-700">Add New Product</h1>
                    </div>
                    </div>
                        <Button type="submit" className="bg-[#331d67] rounded-sm">
                        <Check />
                        Add Product
                    </Button>
                </div>
                <div className="flex mt-4 space-x-5 w-full">
                <div id="right-side-pro" className="min-w-3/5 space-y-4 ">
                    <div className=" p-2 rounded-md shadow-xs bg-gray-50">
                        <div className="space-y-4 p-2">
                            <h1 className="capitalize font-inter font-medium text-gray-900 px-2">general information</h1>
                            <div className="flex flex-col gap-2 px-2">
                                <label htmlFor="name" className="capitalize font-roboto font-medium text-gray-500">name product</label>
                                <Input 
                                    id="name"
                                    placeholder="product name" 
                                    className="bg-white font-roboto text-gray-700 h-12 shadow-none border capitalize rounded-sm"
                                    {...register('name')}
                                />
                                {errors.name && (
                                    <span className="text-red-500 text-sm">{errors.name.message}</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 px-2">
                                <label htmlFor="description" className="capitalize font-roboto font-medium text-gray-500">description product</label>
                                <Textarea 
                                    id="description"
                                    placeholder="add your product description" 
                                    rows={40} 
                                    className="bg-white font-roboto shadow-none text-gray-700 capitalize rounded-sm min-h-[100px]"
                                    {...register('description')}
                                />
                                {errors.description && (
                                    <span className="text-red-500 text-sm">{errors.description.message}</span>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2 px-2">
                                    <label htmlFor="brand" className="capitalize font-roboto font-medium text-gray-500">brand</label>
                                    <Input 
                                        id="brand"
                                        placeholder="brand name" 
                                        className="bg-white font-roboto text-gray-700 h-12 shadow-none border capitalize rounded-sm"
                                        {...register('brand')}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 px-2">
                                    <label htmlFor="productNumber" className="capitalize font-roboto font-medium text-gray-500">product number</label>
                                    <Input 
                                        id="productNumber"
                                        placeholder="product number" 
                                        className="bg-white font-roboto text-gray-700 h-12 shadow-none border capitalize rounded-sm"
                                        {...register('productNumber')}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 px-2">
                                    <label htmlFor="modelNumber" className="capitalize font-roboto font-medium text-gray-500">model number</label>
                                    <Input 
                                        id="modelNumber"
                                        placeholder="model number" 
                                        className="bg-white font-roboto text-gray-700 h-12 shadow-none border capitalize rounded-sm"
                                        {...register('modelNumber')}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full">
                            <div className="p-4 w-full">
                                <h1 className="capitalize text-lg font-roboto font-medium text-gray-700">size</h1>
                                <p className="font-roboto font-medium text-gray-500 text-sm">pick availabe size</p>
                                <div className="mt-2">
                                <div className="flex gap-2 w-full items-center">
                                    {["XS","S", "M", "L", "XL", "XXL"].map((size) => (
                                        <div 
                                            key={size} 
                                            onClick={() => handleSizeClick(size)}
                                            className={`rounded-sm items-center flex justify-center w-10 h-10 border-1 shadow-none border-gray-200 cursor-pointer ${
                                                selectedSizes.includes(size) ? "bg-[#331d67] text-white" : "bg-white"
                                            }`}
                                        >
                                            <h1 className="text-xs text-center font-medium font-roboto">{size}</h1>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            </div>
                            <div className="p-4 w-full">
                            <Label className="capitalize font-roboto text-lg font-medium text-gray-700">Gender</Label>
                                <p className="font-roboto font-medium text-gray-500 text-sm">pick availabe gender</p>
                            <RadioGroup
                                className="flex gap-6 mt-4"
                                defaultValue="men"
                                onValueChange={(val) => setValue("gender", val as "men" | "women")}
                            >
                                <div className="flex items-center gap-2">
                                <RadioGroupItem value="men" id="men" />
                                <Label htmlFor="men">Men</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                <RadioGroupItem value="women" id="women" />
                                <Label htmlFor="women">Women</Label>
                                </div>
                            </RadioGroup>
                            {errors.gender && (
                                <p className="text-sm text-red-500">{errors.gender.message}</p>
                            )}
                            </div>

                        </div>
                        
                    </div>
                    <div className="w-full rounded-md shadow-xs p-4 bg-gray-50">
                        <h1 className="font-roboto text-gray-700 capitalize p-2 font-medium">price and stock</h1>
                        <div className="w-full space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="base-price" className="capitalize font-roboto text-sm">base price</label>
                                    <Input 
                                        id="base-price"
                                        placeholder="$12.99" 
                                        className="capitalize font-roboto bg-white h-12" 
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="stock" className="capitalize font-roboto text-sm">Stock</label>
                                    <Input 
                                        id="stock"
                                        placeholder="100" 
                                        className="capitalize font-roboto bg-white h-12" 
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="discount" className="capitalize font-roboto text-sm">discount</label>
                                    <Input 
                                        id="discount"
                                        placeholder="10%"  
                                        className="capitalize font-roboto bg-white h-12" 
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="discount-type" className="capitalize font-roboto text-sm">discount type</label>
                                    <Select>
                                        <SelectTrigger className="w-full bg-white py-6">
                                            <SelectValue placeholder="Select discount type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage">Percentage</SelectItem>
                                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="discount-start" className="capitalize font-roboto text-sm">discount Start Date</label>
                                    <DatePicker />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="discount-end" className="capitalize font-roboto text-sm">discount end date</label>
                                    <DatePicker />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className=" w-full  rounded-md shadow-xs p-4 bg-gray-50">
                        <div className="w-full">
                            <h1 className="capitalize font-roboto text-gray-700 font-medium">Store Loaction</h1>
                            <p className="font-roboto text-gray-500 text-sm">pick availabe store</p>
                        </div>
                        
                        <Input placeholder="store location" className="capitalize font-roboto mt-2 focus:ring-0 border-none bg-white h-12" />
                        
                    </div>
            </div>
            <div id="right-side-block" className="w-full">
                
                    <ImageUpload onChange={function (files: File[]): void {
                            throw new Error("Function not implemented.")
                        } }/>
                <div>
                    <div className="flex flex-col gap-2 p-4">
                                <label htmlFor="catagory" className="capitalize font-roboto text-sm">Catagory</label>
                                <p className="font-roboto capitalize text-xs font-semibold text-gray-500">product catagory</p>
                                <Select>
                                    <SelectTrigger className="w-full bg-gray-100 py-6">
                                        <SelectValue placeholder="jacket" className="capitalize placeholder:capitalize font-roboto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="men">men</SelectItem>
                                        <SelectItem value="women">women</SelectItem>
                                    </SelectContent>
                                </Select>
                                <label htmlFor="catagory" className="capitalize font-roboto text-sm ">sub-Catagory</label>
                                <p className="font-roboto capitalize text-xs font-semibold text-gray-500">product sub catagory</p>
                                <Select>
                                    <SelectTrigger className="w-full bg-gray-100 py-6">
                                        <SelectValue placeholder="jacket" className="capitalize placeholder:capitalize font-roboto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="top">top</SelectItem>
                                        <SelectItem value="t-shirt">t-shirt</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button className="w-fit rounded-md mt-2 h-12 px-4 bg-[#331d67]">
                                    <Plus/> Add Subcatagory
                                </Button>
                            </div>
                </div>
            </div>
            </div>
        </form>
    )
}