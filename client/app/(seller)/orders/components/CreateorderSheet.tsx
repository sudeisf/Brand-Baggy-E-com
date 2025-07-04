"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Plus, Search, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scrollarea"
import SelectProducts from "./selectProducts"
import { useProductStore } from "@/store/selectedProducts"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import api from "@/lib/axios"

type OrderItem = {
  id: number
  name: string
  size: string
  quantity: number
}

// 1. Define Zod schema
const orderSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(7),
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip_code: z.string().min(1),
  country: z.string().min(1),
})

type OrderFormValues = z.infer<typeof orderSchema>

export function CreateOrder() {
  const { selectedProducts, removeProduct, updateQuantity } = useProductStore()

  // 2. useForm setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      email: "",
      phone: "",
      name: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
    },
  })

  const handleQuantityChange = (id: number, size: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(id, size, newQuantity)
  }

  const handleRemoveItem = (id: number, size: string) => {
    removeProduct(id, size)
  }

  const pricePerItem = 49.99
  const subtotal = selectedProducts.reduce(
    (sum, item) => sum + pricePerItem * item.quantity,
    0
  )
  const shipping = 5.99
  const total = subtotal + shipping

  const onSubmit = async (data: OrderFormValues) => {
    if (selectedProducts.length === 0) {
      alert("No products selected.")
      return
    }
  
    const guest_user = {
      full_name: data.name,
      email: data.email,
      phone: data.phone,
    }
  
    const shipping_info = {
      full_name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      country: data.country,
      phone: data.phone,
      email: data.email,
    }
  
    const items = selectedProducts.map((item) => ({
      product_id: item.id,
      variant_size: item.size,  // rename this based on what your backend expects
      price: pricePerItem,
      quantity: item.quantity,
    }))
  
    const payload = {
      guest_user,
      shipping_info,
      items,
      total_price: subtotal + shipping,
      payment_method: "cod",
    }
  
    console.log(payload)
    try {
      const res = await api.post("/orders/seller/create-order/", payload, {
        headers: { "Content-Type": "application/json" },
      })
  
      if (res.status != 201) {
        console.error()
        alert("Order creation failed.")
        return
      }
  
      alert("Order created successfully!")
      // Optionally reset form and product store here
    } catch (err) {
      console.error(err)
      alert("Something went wrong.")
    }
  }
  

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-2 rounded-sm shadow-2xs bg-[#331d67] text-white font-roboto hover:bg-[#331d67]/90 hover:text-white"
        >
          <Plus className="h-4 w-4" />
          Create order
        </Button>
      </SheetTrigger>
      <SheetContent side="right" style={{ width: "600px", maxWidth: "100vw" }}>
        <SheetHeader>
          <SheetTitle className="text-gray-700 font-roboto font-medium">
            New Order
          </SheetTitle>
          <SheetDescription className="font-roboto">
            Add customer details and order items
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-8 overflow-y-auto h-[calc(100vh-180px)] px-4">
            <section className="space-y-4">
              <h2 className="font-medium text-gray-900 font-roboto text-md">
                Customer Information
              </h2>
              <div className="grid grid-cols-2 gap-4 font-roboto text-gray-700">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="customer@example.com" {...register("email")} />
                  {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+1 (555) 123-4567" {...register("phone")} />
                  {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" {...register("name")} />
                  {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Main St" {...register("address")} />
                  {errors.address && <span className="text-red-500 text-xs">{errors.address.message}</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="New York" {...register("city")} />
                  {errors.city && <span className="text-red-500 text-xs">{errors.city.message}</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="NY" {...register("state")} />
                  {errors.state && <span className="text-red-500 text-xs">{errors.state.message}</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip_code">Zip Code</Label>
                  <Input id="zip_code" placeholder="10001" {...register("zip_code")} />
                  {errors.zip_code && <span className="text-red-500 text-xs">{errors.zip_code.message}</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" placeholder="United States" {...register("country")} />
                  {errors.country && <span className="text-red-500 text-xs">{errors.country.message}</span>}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-medium text-gray-900">Order Items</h2>
                <SelectProducts />
              </div>

              <ScrollArea className="border rounded-sm h-40">
                {selectedProducts.map((item, index) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="p-4 flex items-center justify-between border-b"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-100 rounded-md w-10 h-10 flex items-center justify-center">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium">{`${item.name} ${item.size}`}</p>
                        <p className="text-sm text-gray-500">SKU: PRD-{item.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            handleQuantityChange(item.id, item.size, item.quantity - 1)
                          }
                        >
                          -
                        </Button>
                        <span className="px-2">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            handleQuantityChange(item.id, item.size, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                      </div>
                      <p className="w-20 text-right">
                        ${(pricePerItem * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400"
                        onClick={() => handleRemoveItem(item.id, item.size)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </section>

            <section className="space-y-4">
              <h2 className="font-medium text-gray-900">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </section>
          </div>

          <SheetFooter className="mt-4">
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button type="submit" className="bg-[#331d67] hover:bg-[#331d67]/90">
              Create Order
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}