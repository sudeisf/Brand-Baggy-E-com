"use client"
import { Plus } from "lucide-react"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Rubik } from "next/font/google"

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(5, "Zip code must be at least 5 characters").max(10, "Zip code is too long"),
  country: z.string().min(1, "Country is required"),
})

const countries = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "UK", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
  // Add more countries as needed
]

export function AddAddress() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    form.reset()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button className=" bg-[#331d67]/10 hover:bg-[#331d67]/5 text-sm text-[#7752cc] font-semibold rounded-md px-8"><Plus className="w-4 h-4" />Shipping Address</Button>
      </DialogTrigger>
      <DialogContent className={`${rubik.className} sm:max-w-lg w-[90vw] rounded-lg bg-white shadow-xl animate-in fade-in-50 duration-300`}>
        <DialogHeader>  
          <DialogTitle className="text-2xl text-[#331d67] font-bold">Shipping Address</DialogTitle>
          <DialogDescription className="text-gray-500">
            Enter a new shipping address for your account
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#331d67] font-medium">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Full Name"
                      className="border focus:ring-none rounded-sm outline-none "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#331d67] font-medium">Address</FormLabel>
                  <FormControl>
                  <Input
                    {...field}
                    placeholder="Street Address"
                    className="border shadow-none rounded-sm focus:ring-0 focus:border outline-none focus:outline-none focus:shadow-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#331d67] font-medium">City</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="City"
                        className="border shadow-none rounded-sm    focus:ring-0 focus:border outline-none focus:outline-none focus:shadow-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#331d67] font-medium">State</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="State"
                        className="border shadow-none rounded-sm    focus:ring-0 focus:border outline-none focus:outline-none focus:shadow-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#331d67] font-medium">Zip Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Zip Code"
                        className="border shadow-none rounded-sm    focus:ring-0 focus:border outline-none focus:outline-none focus:shadow-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#331d67] font-medium">Country</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="border shadow-none rounded-sm focus:ring-0 focus:border outline-none focus:outline-none focus:shadow-none">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                type="submit"
                className="bg-[#331d67] font-inter font-medium text-[.85rem] text-white hover:bg-[#603ab8] rounded-md border-none"
                onClick={form.handleSubmit(onSubmit)}
              >
                Save Address
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}