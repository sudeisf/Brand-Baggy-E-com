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




export default function CreateProduct(){

    return (
        <div className="bg-white min-h-dvh p-3 space-x-5 mt-4 max-w-[1250px] mx-auto mb-5 ">

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
                        <Button className="bg-[#331d67] rounded-sm">
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
                                <label htmlFor="" className="capitalize font-roboto  font-medium text-gray-500">name product</label>
                                <Input placeholder="product name" className="bg-white font-roboto text-gray-700 h-12 shadow-none border capitalize rounded-sm " />
                            </div>
                            <div className="flex flex-col gap-2 px-2">
                                <label htmlFor="" className="capitalize font-roboto  font-medium text-gray-500">description product</label>
                                <Textarea placeholder="add your proudct description" rows={40} className="bg-white font-roboto shadow-none text-gray-700 capitalize rounded-sm min-h-[100px]" />
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
                                            className={`rounded-sm items-center flex justify-center  w-10 h-10 border-1 shadow-none border-gray-200 ${
                                                size === "M" ? "bg-[#331d67] text-white" : "bg-white"
                                            }`}
                                        >
                                            <h1 className="text-xs text-center font-medium font-roboto">{size}</h1>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            </div>
                            <div className="p-4 w-full flex flex-col ">
                            <div>
                            <h1 className="capitalize font-roboto text-lg font-medium text-gray-700">gender</h1>
                            <p className="font-roboto font-medium text-sm text-gray-500">pick availabe gender</p>
                            
                            </div>
                            <RadioGroup defaultValue="comfortable" className="flex mt-5">
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="default" id="r1" />
                                <Label htmlFor="r1" className="font-roboto text-sm capitalize text-gray-500">men</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="comfortable" id="r2" />
                                <Label htmlFor="r2" className="font-roboto text-sm capitalize text-gray-500">woman</Label>
                            </div>
                            
                            </RadioGroup>


                            </div>
                        </div>
                        
                    </div>
                    <div className="w-full   rounded-md shadow-xs p-4 bg-gray-50">
                    <h1 className=" font-roboto text-gray-700 capitalize p-2 font-medium">price and stock</h1>
                    <div className="flex w-full">
                
                        <div className="w-full">
                             <div className="flex flex-col gap-2 p-2">
                                <label htmlFor="" className="capitalize font-roboto text-sm">base price</label>
                                <Input placeholder="$12.99" className="capitalize font-roboto bg-white h-12" />
                            </div>
                            <div className="flex flex-col gap-2 p-2">
                                <label htmlFor="" className="capitalize font-roboto text-sm">discount</label>
                                <Input placeholder="10%"  className="capitalize font-roboto bg-white h-12" />
                            </div>
                        </div>
                        <div className="w-full">
                             <div className="flex flex-col gap-2 p-2">
                                <label htmlFor="" className="capitalize font-roboto text-sm">Stock</label>
                                <Input placeholder="100" className="capitalize font-roboto bg-white h-12" />
                            </div>
                            <div className="flex flex-col gap-2 p-2">
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
        </div>
    )
}