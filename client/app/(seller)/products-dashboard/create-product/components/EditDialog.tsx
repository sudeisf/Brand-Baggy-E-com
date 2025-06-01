import { Button } from "@/components/ui/button"
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
import { Edit2Icon } from "lucide-react"

export default function EditDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-8 w-20 rounded-sm border-1 font-roboto p-0 text-[#333567] shadow-none"
          aria-label="Open actions menu"
        >
          <Edit2Icon /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to your product information here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <form className="space-y-6 overflow-y-auto max-h-[600px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="space-y-4">
            <div className="space-y-4 p-2">
              <h1 className="capitalize font-inter font-medium text-gray-900 px-2">general information</h1>
              <div className="flex flex-col gap-2 px-2">
                <label htmlFor="product-name" className="capitalize font-roboto font-medium text-gray-500">name product</label>
                <Input id="product-name" placeholder="product name" className="bg-white font-roboto text-gray-700 h-12 shadow-none border capitalize rounded-sm" />
              </div>
              <div className="flex flex-col gap-2 px-2">
                <label htmlFor="product-description" className="capitalize font-roboto font-medium text-gray-500">description product</label>
                <Textarea id="product-description" placeholder="add your product description" rows={4} className="bg-white font-roboto shadow-none text-gray-700 capitalize rounded-sm min-h-[100px]" />
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className="p-4 w-full">
                <h1 className="capitalize text-lg font-roboto font-medium text-gray-700">size</h1>
                <p className="font-roboto font-medium text-gray-500 text-sm">pick available size</p>
                <div className="mt-2">
                  <div className="flex gap-2 w-full items-center">
                    {["XS","S", "M", "L", "XL", "XXL"].map((size) => (
                      <div 
                        key={size} 
                        className={`rounded-sm items-center flex justify-center w-10 h-10 border-1 shadow-none border-gray-200 ${
                          size === "M" ? "bg-[#331d67] text-white" : "bg-white"
                        }`}
                      >
                        <h1 className="text-xs text-center font-medium font-roboto">{size}</h1>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 w-full flex flex-col">
                <div>
                  <h1 className="capitalize font-roboto text-lg font-medium text-gray-700">gender</h1>
                  <p className="font-roboto font-medium text-sm text-gray-500">pick available gender</p>
                </div>
                <RadioGroup defaultValue="comfortable" className="flex mt-5">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="men" id="r1" />
                    <Label htmlFor="r1" className="font-roboto text-sm capitalize text-gray-500">men</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="women" id="r2" />
                    <Label htmlFor="r2" className="font-roboto text-sm capitalize text-gray-500">women</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="w-full rounded-md shadow-xs p-4 bg-gray-50">
              <h1 className="font-roboto text-gray-700 capitalize p-2 font-medium">price and stock</h1>
              <div className="flex w-full gap-4">
                <div className="w-full">
                  <div className="flex flex-col gap-2 p-2">
                    <label htmlFor="base-price" className="capitalize font-roboto text-sm">base price</label>
                    <Input id="base-price" placeholder="$12.99" className="capitalize font-roboto bg-white h-12" />
                  </div>
                  <div className="flex flex-col gap-2 p-2">
                    <label htmlFor="discount" className="capitalize font-roboto text-sm">discount</label>
                    <Input id="discount" placeholder="10%" className="capitalize font-roboto bg-white h-12" />
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex flex-col gap-2 p-2">
                    <label htmlFor="stock" className="capitalize font-roboto text-sm">Stock</label>
                    <Input id="stock" placeholder="100" className="capitalize font-roboto bg-white h-12" />
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

            <div className="w-full rounded-md shadow-xs p-4 bg-gray-50">
              <div className="w-full">
                <h1 className="capitalize font-roboto text-gray-700 font-medium">Store Location</h1>
                <p className="font-roboto text-gray-500 text-sm">pick available store</p>
              </div>
              <Input placeholder="store location" className="capitalize font-roboto mt-2 focus:ring-0 border-none bg-white h-12" />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-[#331d67] rounded-sm">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
