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
import { useProductBeforeMutation , useUpdateProductMutaion } from "../../lib/mutation/productmutation"
import { toast } from "sonner"
import {z} from "zod";
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"



const productSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  productNumber: z.string().optional(),
  modelNumber: z.string().optional(),
  sizes: z.array(z.string()).optional(),
  gender: z.enum(["men", "women", "kids"]).optional(),
  basePrice: z.number().min(0).optional(),
  stock: z.number().min(0).optional(),
  discount: z.number().optional(),
  discountType: z.enum(["percentage", "fixed_amount"]).optional(),
  discountStartDate: z.date().optional(),
  discountEndDate: z.date().optional(),
  storeLocation: z.string().optional(),
  isDiscountOn: z.boolean().optional()
});


type  ProductFormData = z.infer<typeof productSchema>;

interface ProductVariant {
  size: { name: string }
}
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
  brand : string,
  model_number : string;
  product_code : string;
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
  const { mutate: productDetailFn} = useProductBeforeMutation();
  const { mutate: updateFn, isPending : isLoading, error} = useUpdateProductMutaion();

  
  
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



  const {
    register,
    control,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      sizes: [],
      gender: undefined,
      brand: '',
      modelNumber: '',
      productNumber: '',
      basePrice: undefined,
      stock: undefined,
      storeLocation: '',
      isDiscountOn: false,
    },
  });
  useEffect(() => {
    if (productDetail?.variants) {
      const sizes = productDetail.variants.map((variant) => variant.size.name);
      setSelectedSizes(sizes);
      setValue("sizes", sizes);
    }
  }, [productDetail]);

  useEffect(() => {
    if (productDetail) {
      reset({
        name: productDetail.name,
        description: productDetail.description,
        sizes: productDetail.variants?.map(v => v.size.name) || [],
        gender: productDetail.gender as any,
        basePrice: Number(productDetail.price),
        stock: productDetail.quantity,
        brand : productDetail.brand,
        modelNumber: productDetail.model_number,
        productNumber : productDetail.product_code,
        discount: Number(productDetail.discount?.value || 0),
        discountType: productDetail.discount?.discount_type as any,
        isDiscountOn : productDetail.discount.is_active,
        discountStartDate: productDetail.discount?.start_date
          ? new Date(productDetail.discount.start_date)
          : undefined,
        discountEndDate: productDetail.discount?.end_date
          ? new Date(productDetail.discount.end_date)
          : undefined,
        storeLocation: productDetail.product_location.name,
      });
      setIsDiscountEnabled(productDetail.discount?.is_active);

    }
  }, [productDetail]);

  const toggleSize = (size: string) => {
    const currentSizes = watch("sizes") ?? [];
    const updatedSizes = currentSizes.includes(size)
      ? currentSizes.filter((s: string) => s !== size)
      : [...currentSizes, size];
    setValue("sizes", updatedSizes, { shouldDirty: true });
    setSelectedSizes(updatedSizes);
  };
  const onSubmit = async (values: ProductFormData) => {
    const dirty = formState.dirtyFields;
    const payload: Record<string, any> = {};
  
    for (const key in dirty) {
      const value = values[key as keyof ProductFormData];
  
      switch (key) {
        case "basePrice":
          payload["price"] = value;
          break;
        case "stock":
          payload["quantity"] = value;
          break;
        case "modelNumber":
          payload["model_number"] = value;
          break;
        case "productNumber":
          payload["product_code"] = value;
          break;
        case "storeLocation":
          payload["product_location"] = value;
          break;
        case "discount":
          payload["discount_value"] = value;
          break;
        case "discountType":
          payload["discount_type"] = value;
          break;
        case "discountStartDate":
          payload["discount_start_date"] = value instanceof Date ? value.toISOString() : value;
        case "discountEndDate":
          payload["discount_end_date"] = value instanceof Date ? value.toISOString() : value;
          break;
        case "isDiscountOn":
          payload["is_active"] = value;
          break;
        default:
          payload[key] = value;
          break;
      }
    }

      updateFn({
        id ,
        payload
      },{
        onSuccess : (data) =>{
          toast.success(data.message);
        },onError : (error)=>{
          toast.error(error.message)
        }
      }
    )
  };
  
  




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
  
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 overflow-y-auto max-h-[600px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="space-y-4">
            <div className="space-y-4 p-2">
              <h1 className="capitalize font-inter font-medium text-gray-900 px-2">General Information</h1>
              <div className="flex flex-col gap-2 px-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="product-name" className="capitalize font-roboto font-medium text-gray-500">Product Name</label>
                  <InfoIcon className="h-4 w-4 text-gray-400" />
                </div>
                <Input 
                  {...register("name")}
                  id="product-name"  
                  className="bg-white font-roboto text-gray-700 h-12 shadow-none border capitalize rounded-sm focus:ring-2 focus:ring-[#331d67] focus:border-transparent" 
                />
              </div>
              <div className="flex flex-col gap-2 px-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="product-description" className="capitalize font-roboto font-medium text-gray-500">Product Description</label>
                  <InfoIcon className="h-4 w-4 text-gray-400" />
                </div>
                <Textarea 
                 {...register('description')}
                  id="product-description" 
                  rows={4} 
                  className="bg-white font-roboto shadow-none text-gray-700 capitalize rounded-sm min-h-[100px] focus:ring-2 focus:ring-[#331d67] focus:border-transparent" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 px-2">
                    <label htmlFor="brand" className="capitalize font-roboto font-medium text-gray-500">brand</label>
                    <Input 
                        {...register("brand")}
                        id="brand"
                        className="bg-white font-roboto text-gray-700 h-12 shadow-none border capitalize rounded-sm"
                        
                    />
                </div>
                <div className="flex flex-col gap-2 px-2">
                    <label htmlFor="productNumber" className="capitalize font-roboto font-medium text-gray-500">product number</label>
                    <Input 
                        {...register("productNumber")}
                        id="productNumber"
                        className="bg-white font-roboto text-gray-700 h-12 shadow-none border capitalize rounded-sm"
                        
                    />
                </div>
                <div className="flex flex-col gap-2 px-2">
                    <label htmlFor="modelNumber" className="capitalize font-roboto font-medium text-gray-500">model number</label>
                    <Input 
                        {...register("modelNumber")}
                        id="modelNumber"
                        className="bg-white font-roboto text-gray-700 h-12 shadow-none border capitalize rounded-sm"
                        
                    />
                </div>
            </div>
            <div className="flex w-full gap-4">
              <div className="p-4 w-full">
                <h1 className="capitalize text-lg font-roboto font-medium text-gray-700">Size</h1>
                <p className="font-roboto font-medium text-gray-500 text-sm">Select available sizes</p>
                <div className="mt-2">
                  <Controller
                    control={control}
                    name="sizes"
                    render={({ field }) => (
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
                    )}
                  />
                  
                  {formState.errors.sizes && (
                    <span className="text-red-500 text-xs">{formState.errors.sizes.message}</span>
                  )}
                </div>
              </div>
              <div className="p-4 w-full flex flex-col">
                <div>
                  <h1 className="capitalize font-roboto text-lg font-medium text-gray-700">Gender</h1>
                  <p className="font-roboto font-medium text-sm text-gray-500">Select target gender</p>
                </div>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex mt-5"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="men" id="r1" />
                        <Label htmlFor="r1">Men</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="women" id="r2" />
                        <Label htmlFor="r2">Women</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>
            </div>

            <div className="w-full rounded-md shadow-xs p-4 bg-gray-50">
              <h1 className="font-roboto text-gray-700 capitalize p-2 font-medium">Price and Stock</h1>
              <div className="flex w-full gap-4">
                <div className="w-full">
                  <div className="flex flex-col gap-2 p-2">
                    <label htmlFor="base-price" className="capitalize font-roboto text-sm">Base Price</label>
                    <Input 
                      {...register("basePrice", { valueAsNumber: true })}
                      id="base-price" 
                      className="capitalize font-roboto bg-white h-12 focus:ring-2 focus:ring-[#331d67] focus:border-transparent" 
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="discount" className="capitalize font-roboto text-sm">Discount</label>
                      
                    </div>
                    <Input 
                      {...register("discount", { valueAsNumber: true })}
                      id="discount" 
                      className="capitalize font-roboto bg-white h-12 focus:ring-2 focus:ring-[#331d67] focus:border-transparent" 
                      disabled={!isDiscountEnabled}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex flex-col gap-2 p-2">
                    <label htmlFor="stock" className="capitalize font-roboto text-sm">Stock</label>
                    <Input 
                      {...register("stock", { valueAsNumber: true })}
                      id="stock" 
                      className="capitalize font-roboto bg-white h-12 focus:ring-2 focus:ring-[#331d67] focus:border-transparent" 
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-2">
                    <label htmlFor="discount-type" className="capitalize font-roboto text-sm">Discount Type</label>
                    <Controller
                      control={control}
                      name="discountType"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!isDiscountEnabled}
                        >
                          <SelectTrigger className="...">
                            <SelectValue placeholder="Select discount type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label 
                    htmlFor="discount-start" 
                    className="capitalize font-roboto text-sm">discount Start Date</label>
                    <Controller
                      control={control}
                      name="discountStartDate"
                      render={({ field }) => (
                        <DatePicker 
                        value={field.value instanceof Date ? field.value.toLocaleDateString('en-CA') : null}
                          onChange={field.onChange} 
                          disabled={!isDiscountEnabled}
                        />
                      )}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label 
                    htmlFor="discount-end" 
                    className="capitalize font-roboto text-sm">discount end date</label>
                    <Controller
                        control={control}
                        name="discountEndDate"
                        render={({ field }) => (
                          <DatePicker 
                          value={field.value instanceof Date ? field.value.toISOString().split('T')[0]: null}
                            onChange={field.onChange} 
                            disabled={!isDiscountEnabled}
                          />
                        )}
                      />
                </div>
            </div>
             
            </div>
            <Controller
                control={control}
                name="isDiscountOn"
                defaultValue={productDetail?.discount?.is_active ?? false}
                render={({ field }) => (
                  <div className="p-2 flex items-center gap-5">
                    <Toggle 
                      className="font-normal text-xs"
                      pressed={field.value}
                      onPressedChange={field.onChange}
                      variant={`${field.value ? "active" : "notActive"}`}
                    >
                      {field.value ? "Disable Discount" : "Enable Discount"}
                    </Toggle>
                    <p>
                      {field.value ? "Discount has been Enabled" : "Discount has been Disabled"}
                    </p>
                  </div>
                )}
              />

                

            <div className="w-full rounded-md shadow-xs p-4 bg-gray-50">
              <div className="w-full">
                <h1 className="capitalize font-roboto text-gray-700 font-medium mb-1">Store Location</h1>
                <p className="font-roboto text-gray-500 text-sm">Select your store location</p>
              </div>
              <Input 
                {...register("storeLocation")}
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