"use client";

import {z} from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function BillingInformation() {
    const [isEditable, setIsEditable] = useState(false);

    const formSchema = z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        address: z.string().min(1)
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    return (
        <div className="w-full rounded-t-xl p-4">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-lg font-medium text-[#331d67] p-2">Billing Information</h1>
                <button
                    type="button"
                    className={`px-5 py-1 rounded-full  ${isEditable ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"}`}
                    onClick={() => setIsEditable((prev) => !prev)}
                >
                    {isEditable ? "Disable" : "Enable"}
                </button>
            </div>
            <Form {...form}>
                <form className="space-y-4">
                    <div className="flex gap-4 justify-between w-full rounded-xl p-2">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="w-1/2">
                                    <FormControl>
                                        <Input
                                            className="rounded-sm outline-none font-medium border-none text-gray-500 bg-slate-100 placeholder:text-gray-500 focus:ring-0"
                                            placeholder="First Name"
                                            {...field}
                                            disabled={!isEditable}
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
                                <FormItem className="w-1/2">
                                    <FormControl>
                                        <Input
                                            className="rounded-sm outline-none font-medium border-none text-gray-500 bg-slate-100 placeholder:text-gray-500 focus:ring-0"
                                            placeholder="Last Name"
                                            {...field}
                                            disabled={!isEditable}
                                        />
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
                                        <Textarea
                                            className="rounded-sm outline-none font-medium border-none text-gray-500 bg-slate-100 placeholder:text-gray-500 focus:ring-0"
                                            placeholder="Address"
                                            {...field}
                                            disabled={!isEditable}
                                        />
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
                                        <Input
                                            className="rounded-sm outline-none font-medium border-none text-gray-500 bg-slate-100 placeholder:text-gray-500 focus:ring-0"
                                            placeholder="Phone"
                                            {...field}
                                            disabled={!isEditable}
                                        />
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
                                        <Input
                                            className="rounded-sm outline-none font-medium border-none text-gray-500 bg-slate-100 placeholder:text-gray-500 focus:ring-0"
                                            placeholder="Email"
                                            {...field}
                                            disabled={!isEditable}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* <div className="flex items-center gap-2">
                        <Checkbox disabled={!isEditable} />
                        <p className="font-roboto font-medium text-gray-500">Shipping to a different address</p>
                    </div> */}
                </form>
            </Form>
        </div>
    );
}
    
