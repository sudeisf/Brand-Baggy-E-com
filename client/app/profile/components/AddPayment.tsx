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
  cardNumber: z.string().min(16, "Card number must be 16 digits"),
  cardHolder: z.string().min(1, "Card holder name is required"),
  expiryDate: z.string().min(5, "Expiry date must be in the format MM/YY"),
  cvv: z.string().min(3, "CVV must be 3 digits"),
})



export function AddPayment() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        cvv: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    form.reset()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button className=" bg-[#331d67]/10 hover:bg-[#331d67]/5 text-sm text-[#7752cc] font-semibold rounded-md px-8"><Plus className="w-4 h-4" />Payment Method</Button>
      </DialogTrigger>
      <DialogContent className={`${rubik.className} sm:max-w-lg w-[90vw] rounded-lg bg-white shadow-xl animate-in fade-in-50 duration-300`}>
        <DialogHeader>  
            <DialogTitle className="text-2xl text-[#331d67] font-bold">Payment Method</DialogTitle>
          <DialogDescription className="text-gray-500">
            Enter a new payment method for your account
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#331d67] font-semibold">Card Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Card Number"
                      className="border-gray-300 focus:ring-[#603ab8] focus:border-[#603ab8] rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardHolder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#331d67] font-semibold">Card Holder</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Card Holder"
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
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel className="text-[#331d67] font-semibold">Expiry Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Expiry Date"
                        className="border-gray-300 focus:ring-[#603ab8] focus:border-[#603ab8] rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                            <FormLabel className="text-[#331d67] font-semibold">CVV</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="CVV"
                        className="border-gray-300 focus:ring-[#603ab8] focus:border-[#603ab8] rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#331d67] text-white font-semibold rounded-md px-8 py-2 hover:bg-[#2a1654] transition-all duration-300">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}