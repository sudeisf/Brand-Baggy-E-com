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

const formSchema = z.object({
  cardholderName: z.string().min(1, "Cardholder name is required"),
  cardNumber: z
    .string()
    .min(16, "Card number must be 16 digits")
    .max(16, "Card number must be 16 digits")
    .regex(/^\d{16}$/, "Card number must contain only digits"),
  expiry: z
    .string()
    .min(5, "Expiry must be in MM/YY format")
    .max(5, "Expiry must be in MM/YY format")
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be in MM/YY format"),
  cvv: z
    .string()
    .min(3, "CVV must be 3 or 4 digits")
    .max(4, "CVV must be 3 or 4 digits")
    .regex(/^\d{3,4}$/, "CVV must contain only digits"),
})

type Payment = z.infer<typeof formSchema> & { id: string }

interface EditPaymentProps {
  payment: Payment
  onUpdate: (id: string, values: z.infer<typeof formSchema>) => void
}

export function EditPayment({ payment, onUpdate }: EditPaymentProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardholderName: payment.cardholderName,
      cardNumber: payment.cardNumber,
      expiry: payment.expiry,
      cvv: payment.cvv,
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onUpdate(payment.id, values)
    form.reset(values)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="border-[#331d67] text-[#331d67] hover:bg-[#331d67]/10 rounded-md"
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg w-[90vw] rounded-lg bg-white shadow-xl animate-in fade-in-50 duration-300">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#331d67] font-bold">Edit Payment Method</DialogTitle>
          <DialogDescription className="text-gray-500">
            Update your payment method details
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardholderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#331d67] font-semibold">Cardholder Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Full Name on Card"
                      className="border-gray-300 focus:ring-[#603ab8] focus:border-[#603ab8] rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#331d67] font-semibold">Card Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
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
                name="expiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#331d67] font-semibold">Expiry (MM/YY)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="MM/YY"
                        maxLength={5}
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
                        placeholder="123"
                        maxLength={4}
                        className="border-gray-300 focus:ring-[#603ab8] focus:border-[#603ab8] rounded-md"
                      />
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
                Update Payment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}