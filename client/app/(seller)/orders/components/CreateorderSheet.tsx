import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, Search, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scrollarea";

type OrderItem = {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
};

export function CreateOrder() {
  const [items, setItems] = useState<OrderItem[]>([
    {
      id: "1",
      name: "Premium Headphones",
      sku: "PRD-001",
      price: 49.99,
      quantity: 1,
    },
    {
      id: "2",
      name: "Premium Headphones",
      sku: "PRD-001",
      price: 49.99,
      quantity: 1,
    },
    {
      id: "2",
      name: "Premium Headphones",
      sku: "PRD-001",
      price: 49.99,
      quantity: 1,
    },{
      id: "2",
      name: "Premium Headphones",
      sku: "PRD-001",
      price: 49.99,
      quantity: 1,
    }
  ]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const total = subtotal + shipping;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex gap-2 rounded-sm shadow-2xs bg-[#331d67] text-white font-roboto hover:bg-[#331d67]/90 hover:text-white">
          <Plus className="h-4 w-4" />
          Create order
        </Button>
      </SheetTrigger>
      <SheetContent side="right" width="w-full sm:w-[600px]">
        <SheetHeader className="">
          <SheetTitle className="text-gray-700 font-roboto font-medium">New Order</SheetTitle>
          <SheetDescription className="font-roboto">
            Add customer details and order items
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 overflow-y-auto h-[calc(100vh-180px)] px-4">
          <section className="space-y-4">
            <h2 className="font-medium text-gray-900 font-roboto text-md">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4 font-roboto text-gray-700">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="customer@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
            </div>
          </section>

          {/* Order Items Section */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-medium text-gray-900">Order Items</h2>
              <Button variant="ghost" size="sm" className="text-[#331d67]">
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>
            
            <ScrollArea className="border rounded-sm h-40 ">
              {items.map((item , index) => (
                <div key={index} className="p-4 flex items-center justify-between border-b">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 rounded-md w-10 h-10 flex items-center justify-center">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border rounded-md">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="px-2">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <p className="w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-gray-400"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </section>

          {/* Order Summary */}
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
      </SheetContent>
    </Sheet>
  );
}