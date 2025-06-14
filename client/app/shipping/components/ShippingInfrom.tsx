"use client";

import {z} from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";


const formSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    address: z.string().min(1)
});

export default function ShippingInformation() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    return (
        <div className="w-full border-t-2 border-gray-200 p-4">
            <h1 className="text-lg font-medium text-[#331d67] p-2">Shipping Information</h1>
            <Form {...form}>
                <form className="space-y-4">
                    <div className="flex gap-4 justify-between w-full rounded-xl p-2">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormControl>
                                        <Input className="rounded-sm outline-none font-medium border-none text-gray-500 bg-slate-100 placeholder:text-gray-500 focus:ring-0" placeholder="First Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormControl>
                                        <Input className="rounded-sm outline-none font-medium border-none text-gray-500 bg-slate-100 placeholder:text-gray-500 focus:ring-0" placeholder="Last Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />  
                    </div>
                    <div className="flex gap-4 justify-between w-full rounded-xl p-2">
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Textarea className="rounded-sm outline-none font-medium border-none text-gray-500 bg-slate-100 placeholder:text-gray-500 focus:ring-0" placeholder="Address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex gap-4 justify-between w-full rounded-xl p-2">
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input className="rounded-sm outline-none font-medium border-none text-gray-500 bg-slate-100 placeholder:text-gray-500 focus:ring-0" placeholder="Phone" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input className="rounded-sm outline-none font-medium border-none text-gray-500 bg-slate-100 placeholder:text-gray-500 focus:ring-0" placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
        </div>
    );
}
    
