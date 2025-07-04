"use client"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useProductStore } from "@/store/selectedProducts"

// Mock product data with sizes
const products = [
  { id: 1, name: "Nike", sizes: ["S", "M", "L", "XL"] },
  { id: 2, name: "Adidas", sizes: ["S", "M", "L"] },
  { id: 3, name: "Puma", sizes: ["M", "L", "XL"] },
  { id: 4, name: "Reebok", sizes: ["S/M", "L/XL"] },
]

// Generate product-size combinations
const productOptions = products.flatMap((product) =>
  product.sizes.map((size) => ({
    id: product.id,
    name: `${product.name} ${size}`,
    size,
  }))
)

export default function SelectProducts() {
  const { selectedProducts, addProduct, removeProduct, updateQuantity } = useProductStore()

  const handleSelect = (value: string) => {
    const [productId, size] = value.split("-")
    const id = parseInt(productId)
    const product = products.find((p) => p.id === id)
    if (product) {
      addProduct({ id, name: product.name, size, quantity: 1 })
    }
  }

  const handleConfirm = () => {
    // Replace this with your logic (e.g., API call, etc.)
    console.log("Selected products:", selectedProducts)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Items <Plus /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Products</DialogTitle>
          <DialogDescription>
            Choose one or more products and their sizes to add to the order.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Select onValueChange={handleSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a product and size" />
            </SelectTrigger>
            <SelectContent>
              {productOptions.map((option) => (
                <SelectItem key={`${option.id}-${option.size}`} value={`${option.id}-${option.size}`}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-col gap-2 h-40 overflow-y-auto border rounded-md p-2">
            {selectedProducts.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex items-center justify-between p-2 bg-gray-100 rounded"
              >
                <span>{`${item.name} ${item.size}`}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                  >
                    +
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProduct(item.id, item.size)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Selected: {selectedProducts.length > 0
              ? selectedProducts
                  .map((item) => `${item.name} ${item.size} (Qty: ${item.quantity})`)
                  .join(", ")
              : "None"}
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}