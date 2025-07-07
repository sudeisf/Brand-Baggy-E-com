"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateProductMutation } from "../lib/mutation/productmutation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Check, Loader2Icon, Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import ImageUpload from "./components/ImageUpload"
import { DatePicker } from "./components/DateTimePicker"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import api from "@/lib/axios"
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { useProductStore } from "@/store/prouctStore";
import { useRouter } from "next/navigation";

const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    brand: z.string().optional(),
    productNumber: z.string().optional(),
    modelNumber: z.string().optional(),
    sizes: z.array(z.string()).min(1, "At least one size must be selected"),
    gender: z.enum(["men", "women", "kids"]).optional(),
    basePrice: z.number().min(0, "Base price must be greater than or equal to 0"),
    stock: z.number().min(0, "Stock must be greater than or equal to 0"),
    discount: z.number().optional(),
    discountType: z.enum(["percentage", "fixed_amount"]).optional(),
    discountStartDate: z.date().optional(),
    discountEndDate: z.date().optional(),
    storeLocation: z.string().min(1, "Store location is required"),
    category: z.string().min(1, "Category is required"),
    subCategory: z.string().min(1, "Subcategory is required"),
    images: z.array(z.any()).min(1, "At least one image is required"),
    cost_price: z.number().min(0, "Cost price must be greater than or equal to 0").optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function CreateProduct() {
    const { mutate : createProductFn, isPending : isLoading, error } = useCreateProductMutation();
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const router = useRouter();    
    const [images, setImages] = useState<File[]>([]);
    const [parentCategory, setParentCategory] = useState<Array<{
        id: number;
        name: string;
        slug: string;
        description: string;
        parent: null;
    }>>([]);
    const [childCategory, setChildCategory] = useState<Array<{
        id: number;
        name: string;
        slug: string;
        description: string;
        parent: number;
    }>>([]);

    const {
        register,
        reset,
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
            images: [],
            cost_price: 0,
        }
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const categoryParent = await api.get('/product/catagory-list');
                const categoryChildren = await api.get('/product/catagory-sub-list');
                if (categoryChildren && categoryParent) {
                    setParentCategory(categoryParent.data);
                    setChildCategory(categoryChildren.data);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        setValue('subCategory', '');
    }, [watch('category')]);

    const handleSizeClick = (size: string) => {
        setSelectedSizes(prev => {
            const newSizes = prev.includes(size) 
                ? prev.filter(s => s !== size)
                : [...prev, size];
            setValue('sizes', newSizes);
            return newSizes;
        });
    };
    const handleImageChange = (files: File[]) => {
        setImages(files);
        setValue('images', files);
    };

    const onSubmit = async (data: ProductFormData) => {
        try {
           
            const submitData = new FormData();
            submitData.append('category', data.subCategory); 
            submitData.append('product_location', data.storeLocation);
            submitData.append('name', data.name);
            submitData.append('description', data.description);
            submitData.append('price', String(data.basePrice));
            if (data.stock == null || isNaN(data.stock)) {
                throw new Error('Stock must be a valid number');
            }
            submitData.append('quantity', String(data.stock));
            submitData.append('brand', data.brand || '');
            submitData.append('model_number', data.modelNumber || '');
            submitData.append('product_code', data.productNumber || '');
            if (data.gender) submitData.append('gender', data.gender);
            if (data.discount) submitData.append('discount_value', String(data.discount));
            if (data.discountType) {
                submitData.append('discount_type', data.discountType);
            }
            if (data.discountStartDate) submitData.append('discount_start_date', data.discountStartDate.toISOString());
            if (data.discountEndDate) submitData.append('discount_end_date', data.discountEndDate.toISOString());
            submitData.append('cost_price', String(data.cost_price));

            if (data.images.length > 0) {
                submitData.append('main_image', data.images[0]);
                data.images.slice(1).forEach((file, index) => {
                    submitData.append(`images`, file);
                });
            }
            const variants = data.sizes.map(size => ({
                size: { name: size, code: size },
                stock: Math.floor(data.stock / data.sizes.length)
            }));
            submitData.append('variants', JSON.stringify(variants));
            createProductFn(submitData,{
                onSuccess: (data)=> {
                    toast.success(data.message);
                    router.push('/products-dashboard');
                    reset();
                    setSelectedSizes([]);
                    setImages([]);
                },
                onError : (err)=>{
                    toast.error(error?.message)
                }
            })

        } catch (err) {
            console.error('Error creating product:', err);
        }
    };

    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg flex flex-col items-center gap-4">
                        <Loader2Icon className="animate-spin w-8 h-8 text-[#331d67]" />
                        <p className="text-gray-700 font-medium">Creating your product...</p>
                        <p className="text-gray-500 text-sm">Please wait while we process your request</p>
                    </div>
                </div>
            )}
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
                    <Button type="submit" className="bg-[#331d67] rounded-sm p-5">
                        <Check />
                        {isLoading ? <Loader2Icon className="animate-spin w-5 h-5" /> : "Add Product"}
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
                                        <label htmlFor="cost_price" className="capitalize font-roboto font-medium text-gray-500">product cost</label>
                                        <Input 
                                            id="cost_price"
                                            placeholder="product cost" 
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="bg-white font-roboto text-gray-700 h-12 shadow-none border capitalize rounded-sm"
                                            {...register('cost_price', { required: true })}
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
                                    <p className="font-roboto font-medium text-gray-500 text-sm">pick available size</p>
                                    <div className="mt-2">
                                        <div className="flex gap-2 w-full items-center">
                                            {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
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
                                        {errors.sizes && (
                                            <span className="text-red-500 text-sm">{errors.sizes.message}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 w-full">
                                    <Label className="capitalize font-roboto text-lg font-medium text-gray-700">Gender</Label>
                                    <p className="font-roboto font-medium text-gray-500 text-sm">pick available gender</p>
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
                                            type="number"
                                            {...register('basePrice', { valueAsNumber: true })}
                                        />
                                        {errors.basePrice && (
                                            <span className="text-red-500 text-sm">{errors.basePrice.message}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="stock" className="capitalize font-roboto text-sm">Stock</label>
                                        <Input 
                                            id="stock"
                                            placeholder="100" 
                                            className="capitalize font-roboto bg-white h-12"
                                            type="number"
                                            {...register('stock', { valueAsNumber: true })}
                                        />
                                        {errors.stock && (
                                            <span className="text-red-500 text-sm">{errors.stock.message}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="discount" className="capitalize font-roboto text-sm">discount</label>
                                        <Input 
                                            id="discount"
                                            placeholder="10%" 
                                            className="capitalize font-roboto bg-white h-12"
                                            type="number"
                                            {...register('discount', { valueAsNumber: true })}
                                        />
                                        {errors.discount && (
                                            <span className="text-red-500 text-sm">{errors.discount.message}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="discount-type" className="capitalize font-roboto text-sm">discount type</label>
                                        <Select onValueChange={(val) => setValue('discountType', val as "percentage" | "fixed_amount" | undefined)}>
                                            <SelectTrigger className="w-full bg-white py-6">
                                                <SelectValue placeholder="Select discount type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="percentage">Percentage</SelectItem>
                                                <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 ">
                                    <div className="flex flex-col gap-2 ">
                                        <label htmlFor="discount-start" className="capitalize font-roboto text-sm">discount Start Date</label>
                                        <DatePicker 
                                            value={watch('discountStartDate') ? watch('discountStartDate')?.toISOString() : null}
                                            onChange={(date) => setValue('discountStartDate', date)}
                                            disabled={false}
                                        />
                                        {errors.discountStartDate && (
                                            <span className="text-red-500 text-sm">{errors.discountStartDate.message}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="discount-end" className="capitalize font-roboto text-sm">discount end date</label>
                                        <DatePicker 
                                            value={watch('discountEndDate') ? watch('discountEndDate')?.toISOString() : null}
                                            onChange={(date) => setValue('discountEndDate', date)}
                                            disabled={false}
                                        />
                                        {errors.discountEndDate && (
                                            <span className="text-red-500 text-sm">{errors.discountEndDate.message}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full rounded-md shadow-xs p-4 bg-gray-50">
                            <div className="w-full">
                                <h1 className="capitalize font-roboto text-gray-700 font-medium">Store Location</h1>
                                <p className="font-roboto text-gray-500 text-sm">pick available store</p>
                            </div>
                            <Input 
                                placeholder="store location" 
                                className="capitalize font-roboto mt-2 focus:ring-0 border-none bg-white h-12"
                                {...register('storeLocation')}
                            />
                            {errors.storeLocation && (
                                <span className="text-red-500 text-sm">{errors.storeLocation.message}</span>
                            )}
                        </div>
                    </div>
                    <div id="right-side-block" className="w-full">
                        <ImageUpload onChange={handleImageChange} />
                        <div>
                            <div className="flex flex-col gap-2 p-4">
                                <label htmlFor="category" className="capitalize font-roboto text-sm">Category</label>
                                <p className="font-roboto capitalize text-xs font-semibold text-gray-500">product category</p>
                                <Select onValueChange={(val) => setValue('category', val)}>
                                    <SelectTrigger className="w-full bg-gray-100 py-6" value={watch("category")}>
                                        <SelectValue placeholder="Select category" className="capitalize placeholder:capitalize font-roboto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {parentCategory.map((category) => (
                                            <SelectItem key={category.id} value={String(category.id)}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <span className="text-red-500 text-sm">{errors.category.message}</span>
                                )}
                                <label htmlFor="subCategory" className="capitalize font-roboto text-sm">Sub-Category</label>
                                <p className="font-roboto capitalize text-xs font-semibold text-gray-500">product sub category</p>
                                <Select 
                                    onValueChange={(val) => setValue('subCategory', val)}
                                    disabled={!watch('category')}
                                >
                                    <SelectTrigger className="w-full bg-gray-100 py-6" value={watch('subCategory')}>
                                        <SelectValue 
                                            placeholder={watch('category') ? "Select sub-category" : "Select a category first"} 
                                            className="capitalize placeholder:capitalize font-roboto" 
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {childCategory
                                            .filter(subCat => subCat.parent === Number(watch('category')))
                                            .map((subCategory) => (
                                                <SelectItem key={subCategory.id} value={String(subCategory.id)}>
                                                    {subCategory.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                {errors.subCategory && (
                                    <span className="text-red-500 text-sm">{errors.subCategory.message}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}