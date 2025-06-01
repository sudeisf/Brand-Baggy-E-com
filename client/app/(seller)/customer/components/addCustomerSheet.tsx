"use client"

import { useState } from "react"
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
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, "Invalid phone number format"),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  billingAddress: z.string().min(1, "Billing address is required"),
  sameAsShipping: z.boolean(),
})

export function AddCustomerSheet() {
  const [open, setOpen] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      shippingAddress: "",
      billingAddress: "",
      sameAsShipping: false,
    },
  })

  const sameAsShipping = form.watch("sameAsShipping")

  // Update billing address when sameAsShipping is checked
  const handleSameAsShippingChange = (checked: boolean) => {
    form.setValue("sameAsShipping", checked)
    if (checked) {
      form.setValue("billingAddress", form.getValues("shippingAddress"))
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // TODO: Implement customer creation logic
      console.log(values)
      form.reset() // Reset form after successful submission
      setOpen(false)
    } catch (error) {
      console.error('Error creating customer:', error)
      // You might want to show an error message to the user here
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="ml-auto font-roboto rounded-sm bg-[#331d67] text-white shadow-none">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[640px] p-6">
        <SheetHeader>
          <SheetTitle className="text-gray-700 font-roboto font-medium">Add New Customer</SheetTitle>
          <SheetDescription className="font-roboto">
            Fill in the customer details below
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John" 
                        className="rounded-sm outline-none font-medium text-gray-500 bg-slate-50 placeholder:text-gray-500 focus:ring-0" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Doe" 
                        className="rounded-sm outline-none font-medium text-gray-500 bg-slate-50 placeholder:text-gray-500 focus:ring-0" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="john.doe@example.com" 
                        className="rounded-sm outline-none font-medium text-gray-500 bg-slate-50 placeholder:text-gray-500 focus:ring-0" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Phone</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+1 (555) 123-4567" 
                        className="rounded-sm outline-none font-medium text-gray-500 bg-slate-50 placeholder:text-gray-500 focus:ring-0" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="shippingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Shipping Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter shipping address" 
                      className="rounded-sm outline-none font-medium text-gray-500 bg-slate-50 placeholder:text-gray-500 focus:ring-0 min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sameAsShipping" 
                checked={sameAsShipping}
                onCheckedChange={handleSameAsShippingChange}
              />
              <label
                htmlFor="sameAsShipping"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Billing address same as shipping
              </label>
            </div>

            <FormField
              control={form.control}
              name="billingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Billing Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter billing address" 
                      className="rounded-sm outline-none font-medium text-gray-500 bg-slate-50 placeholder:text-gray-500 focus:ring-0 min-h-[100px]" 
                      {...field}
                      disabled={sameAsShipping}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline" className="font-roboto">Cancel</Button>
              </SheetClose>
              <Button 
                type="submit" 
                className="bg-[#331d67] hover:bg-[#331d67]/90 font-roboto"
              >
                Add Customer
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
