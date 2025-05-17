"use client"
import { Pencil } from "lucide-react"
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

type Address = z.infer<typeof formSchema> & { id: string }

interface EditAddressProps {
  address: Address
  onUpdate: (id: string, values: z.infer<typeof formSchema>) => void
}

export function EditAddress({ address, onUpdate }: EditAddressProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: address.name,
      address: address.address,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onUpdate(address.id, values)
    form.reset(values)
  }

  return (
    <Dialog>
      <DialogTrigger className="px-4 py-2" asChild>
       <div className="flex items-center gap-2">
       <Button
          variant="ghost"
          size="icon"
          className="border-[#331d67]  text-[#331d67] hover:bg-[#331d67]/10 rounded-md"
        >
          <Pencil className="w-4 h-4" />
        </Button>
       </div>
      </DialogTrigger>
      <DialogContent className={`${rubik.className} sm:max-w-lg w-[90vw] rounded-lg bg-white shadow-xl animate-in fade-in-50 duration-300`}>
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#331d67] font-bold">Edit Address</DialogTitle>
          <DialogDescription className="text-gray-500">
            Update your shipping address details
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#331d67] font-semibold">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Full Name"
                      className="border-gray-300 focus:ring-[#603ab8] focus:border-[#603ab8] rounded-md"
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
                  <FormLabel className="text-[#331d67] font-semibold">Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Street Address"
                      className="border-gray-300 focus:ring-[#603ab8] focus:border-[#603ab8] rounded-md"
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
                    <FormLabel className="text-[#331d67] font-semibold">City</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="City"
                        className="border-gray-300 focus:ring-[#603ab8] focus:border-[#603ab8] rounded-md"
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
                    <FormLabel className="text-[#331d67] font-semibold">State</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="State"
                        className="border-gray-300 focus:ring-[#603ab8] focus:border-[#603ab8] rounded-md"
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
                    <FormLabel className="text-[#331d67] font-semibold">Zip Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Zip Code"
                        className="border-gray-300 focus:ring-[#603ab8] focus:border-[#603ab8] rounded-md"
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
                    <FormLabel className="text-[#331d67] font-semibold">Country</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="border-gray-300 focus:ring-[#603ab8] focus:border-[#603ab8] rounded-md">
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
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#331d67] text-[#331d67] hover:bg-[#331d67]/10 rounded-md"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-[#331d67] text-white hover:bg-[#603ab8] rounded-md"
                onClick={form.handleSubmit(onSubmit)}
              >
                Update Address
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}