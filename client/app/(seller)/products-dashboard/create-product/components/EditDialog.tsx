import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { Edit2Icon, InfoIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { DatePicker } from "./DateTimePicker"
import { useProductBeforeMutation } from "../../lib/mutation/productmutation"
import { toast } from "sonner"

interface ProductVariant {
  size: { name: string }
}
// "discount": {
//         "discount_type": "percentage",
//         "value": "20.00",
//         "start_date": "2025-06-16T21:00:00Z",
//         "end_date": "2025-06-25T21:00:00Z",
//         "is_active": true,
//         "usage_limit": null,
//         "time_used": 0
//     },
interface ProductDiscount {
  discount_type :string ;
  value : string,
  start_date : string;
  end_date : string ;
  is_active : boolean
}
interface ProductLoaction {
  name : string
}
interface ProductDetail {
  name:string;
  description :string;
  gender :string;
  price : string;
  quantity: number;
  variants?: ProductVariant[];
  discount : ProductDiscount;
  product_location : ProductLoaction;
}

interface props{
  id : number
}
export default function EditDialog({ id }: props) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [productDetail, setProductDetail] = useState<ProductDetail>();
  const [isDiscountEnabled, setIsDiscountEnabled] = useState<boolean| undefined>(productDetail?.discount?.is_active);
  const { mutate: productDetailFn, isPending, error } = useProductBeforeMutation();

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }
  useEffect(()=>{
    productDetailFn(id,
      {
        onSuccess:(data) => {
          console.log("API response:", data);
            setProductDetail(data.detail)
        },onError : (error) => {
          toast.error(error.message || "Failed to fetch product");
        }
      }
    );
    
  },[id])
  useEffect(() => {
    if (productDetail?.variants) {
      const sizes = productDetail.variants.map((variant) => variant.size.name);
      setSelectedSizes(sizes);
    }
  }, [productDetail]);


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-8 w-20 rounded-sm border-1 font-roboto p-0 text-[#333567] shadow-none hover:bg-gray-50 transition-colors"
          aria-label="Open actions menu"
        >
          <Edit2Icon className="mr-2 h-4 w-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#331d67] font-bold">Edit Product</DialogTitle>
          <DialogDescription className="text-gray-500">
            Make changes to your product information here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <form className="space-y-6 overflow-y-auto max-h-[600px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="space-y-4">
            <div className="space-y-4 p-2">
              <h1 className="capitalize font-inter font-medium text-gray-900 px-2">General Information</h1>
              <div className="flex flex-col gap-2 px-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="product-name" className="capitalize font-roboto font-medium text-gray-500">Product Name</label>
                  <InfoIcon className="h-4 w-4 text-gray-400" />
                </div>
                <Input 
                  id="product-name"  
                  placeholder={productDetail?.name}
                  className="bg-white font-roboto text-gray-700 h-12 shadow-none border capitalize rounded-sm focus:ring-2 focus:ring-[#331d67] focus:border-transparent" 
                />
              </div>
              <div className="flex flex-col gap-2 px-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="product-description" className="capitalize font-roboto font-medium text-gray-500">Product Description</label>
                  <InfoIcon className="h-4 w-4 text-gray-400" />
                </div>
                <Textarea 
                  id="product-description" 
                  placeholder={productDetail?.description} 
                  rows={4} 
                  className="bg-white font-roboto shadow-none text-gray-700 capitalize rounded-sm min-h-[100px] focus:ring-2 focus:ring-[#331d67] focus:border-transparent" 
                />
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className="p-4 w-full">
                <h1 className="capitalize text-lg font-roboto font-medium text-gray-700">Size</h1>
                <p className="font-roboto font-medium text-gray-500 text-sm">Select available sizes</p>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2 w-full items-center">
                    {["XS","S", "M", "L", "XL", "XXL"].map((size) => (
                      <button
                        type="button"
                        key={size} 
                        onClick={() => toggleSize(size)}
                        className={`rounded-sm items-center flex justify-center w-10 h-10 border-1 shadow-none border-gray-200 transition-colors duration-200 ${
                          selectedSizes.includes(size) 
                            ? "bg-[#331d67] text-white hover:bg-[#2a174f]" 
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        <h1 className="text-xs text-center font-medium font-roboto">{size}</h1>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 w-full flex flex-col">
                <div>
                  <h1 className="capitalize font-roboto text-lg font-medium text-gray-700">Gender</h1>
                  <p className="font-roboto font-medium text-sm text-gray-500">Select target gender</p>
                </div>
                <RadioGroup defaultValue={productDetail?.gender} className="flex mt-5">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="men" id="r1" />
                    <Label htmlFor="r1" className="font-roboto text-sm capitalize text-gray-500">Men</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="women" id="r2" />
                    <Label htmlFor="r2" className="font-roboto text-sm capitalize text-gray-500">Women</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="w-full rounded-md shadow-xs p-4 bg-gray-50">
              <h1 className="font-roboto text-gray-700 capitalize p-2 font-medium">Price and Stock</h1>
              <div className="flex w-full gap-4">
                <div className="w-full">
                  <div className="flex flex-col gap-2 p-2">
                    <label htmlFor="base-price" className="capitalize font-roboto text-sm">Base Price</label>
                    <Input 
                      id="base-price" 
                      placeholder={`${productDetail?.price}`} 
                      className="capitalize font-roboto bg-white h-12 focus:ring-2 focus:ring-[#331d67] focus:border-transparent" 
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="discount" className="capitalize font-roboto text-sm">Discount</label>
                      
                    </div>
                    <Input 
                      id="discount" 
                      placeholder={productDetail?.discount.value} 
                      className="capitalize font-roboto bg-white h-12 focus:ring-2 focus:ring-[#331d67] focus:border-transparent" 
                      disabled={isDiscountEnabled}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex flex-col gap-2 p-2">
                    <label htmlFor="stock" className="capitalize font-roboto text-sm">Stock</label>
                    <Input 
                      id="stock" 
                      placeholder={productDetail?.quantity !== undefined ? `${productDetail.quantity}` : "Loading..."} 
                      className="capitalize font-roboto bg-white h-12 focus:ring-2 focus:ring-[#331d67] focus:border-transparent" 
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-2">
                    <label htmlFor="discount-type" className="capitalize font-roboto text-sm">Discount Type</label>
                    <Select defaultValue={productDetail?.discount.discount_type} disabled={isDiscountEnabled}>
                      <SelectTrigger className="w-full bg-white py-6 focus:ring-2 focus:ring-[#331d67] focus:border-transparent">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label 
                    htmlFor="discount-start" 
                    className="capitalize font-roboto text-sm">discount Start Date</label>
                    <DatePicker 
                      onChange={(date) => console.log(date)}
                      disabled={!isDiscountEnabled}   
                      value={productDetail?.discount.start_date}                                     
                      />
                </div>
                <div className="flex flex-col gap-2">
                    <label 
                    htmlFor="discount-end" 
                    className="capitalize font-roboto text-sm">discount end date</label>
                    <DatePicker    
                      onChange={(date) => console.log(date)} 
                      disabled={!isDiscountEnabled}     
                      value={productDetail?.discount.end_date}                                   
                      />
                </div>
            </div>
             
            </div>
            <div className="p-2 flex items-center gap-5">
              <Toggle 
                    className="font-normal text-xs"
                    pressed={isDiscountEnabled}
                    onPressedChange={setIsDiscountEnabled}
                    variant={`${!isDiscountEnabled ? "active" : "notActive"}`}
                  >
                    {!isDiscountEnabled ? "Disable Discount" : "Enable Discount"}
                      </Toggle>
                      <p>
                {!isDiscountEnabled ? "Discount has been Enabled" : "Discount has been Disabled"}
                </p>
                </div>
                

            <div className="w-full rounded-md shadow-xs p-4 bg-gray-50">
              <div className="w-full">
                <h1 className="capitalize font-roboto text-gray-700 font-medium mb-1">Store Location</h1>
                <p className="font-roboto text-gray-500 text-sm">Select your store location</p>
              </div>
              <Input 
                placeholder={productDetail?.product_location.name}
                className="capitalize font-roboto mt-2 focus:ring-2 focus:ring-[#331d67] focus:border-transparent border-none bg-white h-12" 
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button 
                variant="outline" 
                className="border-[#331d67] text-[#331d67] hover:bg-[#331d67]/10 rounded-md"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              className="bg-[#331d67] text-white hover:bg-[#2a174f] rounded-md"
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}