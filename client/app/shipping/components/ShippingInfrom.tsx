"use client";

import {z} from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const formSchema = z.object({
    full_name: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip_code: z.string().min(1, "Zip code is required"),
    country: z.string().min(1, "Country is required"),
});

type Props = {
    onChange: (data: z.infer<typeof formSchema>) => void;
}

export default function ShippingInformation({ onChange }: Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            full_name: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zip_code: "",
            country: "",
        }
    });
    const watchedValues = form.watch();
    useEffect(() => {
        const subscription = form.watch((value) => {
            if (value.full_name && value.email && value.phone && value.address && 
                value.city && value.state && value.zip_code && value.country) {
                onChange(value as z.infer<typeof formSchema>);
            }
        });
        return () => subscription.unsubscribe();
    }, [form, onChange]);

    return (
        <div className="w-full  md:p-4">
            <h1 className="text-lg font-medium text-[#331d67] p-2">Shipping Information</h1>
            <Form {...form}>
                <form className="space-y-4">
                    <div className="flex gap-4 justify-between w-full rounded-xl p-2">
                        <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input className="rounded-sm outline-none font-medium border-none text-gray-500 bg-slate-100 placeholder:text-gray-500 focus:ring-0" placeholder="Full Name" {...field} />
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
                            name="city"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormControl>
                                        <Input className="rounded-sm outline-none font-medium border-none text-gray-500 bg-slate-100 placeholder:text-gray-500 focus:ring-0" placeholder="City" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormControl>
                                        <Input className="rounded-sm outline-none font-medium border-none text-gray-500 bg-slate-100 placeholder:text-gray-500 focus:ring-0" placeholder="State" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex gap-4 justify-between w-full rounded-xl p-2">
                        <FormField
                            control={form.control}
                            name="zip_code"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormControl>
                                        <Input className="rounded-sm outline-none font-medium border-none text-gray-500 bg-slate-100 placeholder:text-gray-500 focus:ring-0" placeholder="Zip Code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormControl>
                                        <Input className="rounded-sm outline-none font-medium border-none text-gray-500 bg-slate-100 placeholder:text-gray-500 focus:ring-0" placeholder="Country" {...field} />
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
                                <FormItem className="w-1/2">
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
                                <FormItem className="w-1/2">
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
    
