"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    cardNumber: z.string().min(16, {
        message: "Card number must be 16 digits"
    }),
    cardHolderName: z.string().min(1, {
        message: "Card holder name is required"
    }),
    expirationDate: z.string().min(1, {
        message: "Expiration date is required"
    }),
    cvv: z.string().min(3, {
        message: "CVV is required"
    }),
    email: z.string().email({
        message: "Invalid email address"
    }),
    phone: z.string().min(10, {
        message: "Phone number must be 10 digits"
    }),
    address: z.string().min(1, {
        message: "Address is required"
    }),
    city: z.string().min(1, {
        message: "City is required"
    }),
    state: z.string().min(1, {
        message: "State is required"
    }),
    zip: z.string().min(1, {
        message: "Zip code is required"
    }), 
    

});



export function CardMethod() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cardNumber: "",
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
    }

    return (
        <div className="w-[700px] mx-auto mt-10">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="cardHolderName"
                        render={({ field }) => (
                            <FormItem className="w-full flex flex-col gap-2">
                                <FormLabel className="text-gray-500">Card Holder Name</FormLabel>
                            <FormControl>
                                <Input type="text" className="h-12 border-gray-400" placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                 <div className="flex gap-4 w-full">
                 <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                            <FormItem className=" flex flex-col gap-2 w-[70%]">
                                <FormLabel className="text-gray-500 font-medium">Card Number</FormLabel>
                                <FormControl>
                                    <Input type="text" className="h-12 border-gray-400" placeholder="1234 1234 1234 1234" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />  
                    <FormField
                        control={form.control}
                        name="expirationDate"
                        render={({ field }) => (
                            <FormItem className=" flex flex-col gap-2 w-[15%]">
                                <FormLabel className="text-gray-500 font-medium">Expiration Date</FormLabel>  
                                <FormControl className="p-2">
                                    <Input type="text" className="h-12 border-gray-400" placeholder="MM/YY" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cvv"
                        render={({ field }) => (
                            <FormItem className=" flex flex-col gap-2 w-[15%]">
                                <FormLabel className="text-gray-500 font-medium">CVV</FormLabel>
                                <FormControl>
                                    <Input type="text" className="h-12 border-gray-400" placeholder="123" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                 </div>
                </form>
            </Form>
        </div>
    )
}
