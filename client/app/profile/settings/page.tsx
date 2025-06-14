"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { User } from "lucide-react"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"

// Mock data
const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
}

const addresses = [
  {
    id: "1",
    name: "John Doe",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "US",
  },
  {
    id: "2",
    name: "John Doe",
    address: "456 Elm St",
    city: "Los Angeles",
    state: "CA",
    zip: "90001",
    country: "US",
  },
]

const payments = [
  {
    id: "1",
    cardholderName: "John Doe",
    cardNumber: "**** **** **** 1234",
    expiry: "12/25",
    cardType: "Visa",
  },
]

const preferences = {
  emailNotifications: true,
  smsNotifications: false,
  defaultAddressId: "1",
}

export default function Settings() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-[#331d67] mb-8">Account Settings</h1>

      {/* User Profile */}
      <Card className="mb-8 border-1 shadow-none rounded-md  animate-in fade-in-50 duration-300">
        <CardHeader>
          <CardTitle className="text-xl text-[#331d67] font-semibold">User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 rounded-full">
                  <AvatarImage src="https://github.com/shadcn.png" />
             </Avatar>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-[#331d67]">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">{user.phone}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-4 text-[#331d67] rounded-md hover:from-[#2a1654] hover:to-[#4f2f96] transition-all duration-300"
            disabled
          >
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card className="mb-8 border-1 shadow-none rounded-md  animate-in fade-in-50 duration-300">
        <CardHeader>
          <CardTitle className="text-xl text-[#331d67] font-semibold">Shipping Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="border-b pb-4">
                <p className="font-semibold text-[#331d67]">{address.name}</p>
                <p className="text-gray-600">{address.address}</p>
                <p className="text-gray-600">{address.city}, {address.state} {address.zip}</p>
                <p className="text-gray-600">{address.country}</p>
              </div>
            ))}
            <Button
              variant="outline"
              className="mt-4 border-[#331d67] text-[#331d67] hover:bg-[#331d67]/10 rounded-md"
              disabled
            >
              Manage Addresses
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="mb-8 border-1 shadow-none rounded-md  animate-in fade-in-50 duration-300">
        <CardHeader>
          <CardTitle className="text-xl text-[#331d67] font-semibold">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="border-b pb-4">
                <p className="font-semibold text-[#331d67]">{payment.cardholderName}</p>
                <p className="text-gray-600">{payment.cardType} {payment.cardNumber}</p>
                <p className="text-gray-600">Expires {payment.expiry}</p>
              </div>
            ))}
            <Button
              variant="outline"
              className="mt-4 border-[#331d67] text-[#331d67] hover:bg-[#331d67]/10 rounded-md"
              disabled
            >
              Manage Payments
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Preferences */}
      <Card className="mb-8 border-1 shadow-none rounded-md  animate-in fade-in-50 duration-300">
        <CardHeader>
          <CardTitle className="text-xl text-[#331d67] font-semibold">Order Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start gap-2">
                <Label className="text-[#331d67] font-semibold">Email Notifications</Label>
                <p className="text-sm text-gray-500">Order updates via email</p>
              </div>
              <Switch checked={preferences.emailNotifications} disabled />
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex flex-col items-start gap-2">
                <Label className="text-[#331d67] font-semibold">SMS Notifications</Label>
                <p className="text-sm text-gray-500">Order updates via SMS</p>
              </div>
              <Switch checked={preferences.smsNotifications} disabled />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-[#331d67] font-semibold">Default Shipping Address</Label>
              <p className="text-sm text-gray-600">
                {addresses.find((a) => a.id === preferences.defaultAddressId)?.address ||
                  "No default address"}
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-4 text-[#331d67] rounded-md hover:from-[#2a1654] hover:to-[#4f2f96] transition-all duration-300"
              disabled
            >
              Edit Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}