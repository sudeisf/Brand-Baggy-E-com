"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check } from 'lucide-react'
import { CustomerInfo, Address } from '../data'

interface EditCustomerProps { 
  data: CustomerInfo
}

export default function EditCustomer({ 
  data
}: EditCustomerProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<CustomerInfo>({
    ...data,
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    shippingAddress: data.shippingAddress || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    billingAddress: data.billingAddress || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [addressType, field] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [addressType]: {
          ...(prev[addressType as keyof CustomerInfo] as Address),
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className='text-left'>
          Edit Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px] w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-medium">Shipping Address</h3>
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="shippingAddress.street">Street</Label>
                <Input
                  id="shippingAddress.street"
                  name="shippingAddress.street"
                  value={formData.shippingAddress.street}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="shippingAddress.city">City</Label>
                  <Input
                    id="shippingAddress.city"
                    name="shippingAddress.city"
                    value={formData.shippingAddress.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="shippingAddress.state">State</Label>
                  <Input
                    id="shippingAddress.state"
                    name="shippingAddress.state"
                    value={formData.shippingAddress.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingAddress.zipCode">Zip Code</Label>
                  <Input
                    id="shippingAddress.zipCode"
                    name="shippingAddress.zipCode"
                    value={formData.shippingAddress.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingAddress.country">Country</Label>
                  <Input
                    id="shippingAddress.country"
                    name="shippingAddress.country"
                    value={formData.shippingAddress.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Billing Address</h3>
            <div className="space-y-2">
              <Label htmlFor="billingAddress.street">Street</Label>
              <Input
                id="billingAddress.street"
                name="billingAddress.street"
                value={formData.billingAddress.street}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingAddress.city">City</Label>
                <Input
                  id="billingAddress.city"
                  name="billingAddress.city"
                  value={formData.billingAddress.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingAddress.state">State</Label>
                <Input
                  id="billingAddress.state"
                  name="billingAddress.state"
                  value={formData.billingAddress.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingAddress.zipCode">Zip Code</Label>
                <Input
                  id="billingAddress.zipCode"
                  name="billingAddress.zipCode"
                  value={formData.billingAddress.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingAddress.country">Country</Label>
                <Input
                  id="billingAddress.country"
                  name="billingAddress.country"
                  value={formData.billingAddress.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-[#17185b]"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}