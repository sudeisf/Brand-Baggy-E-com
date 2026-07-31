"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
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

type ShippingFormValues = z.infer<typeof formSchema>;

type Props = {
  onChange: (data: ShippingFormValues) => void;
};

const fieldClassName =
  "h-11 rounded-md border border-gray-200 bg-gray-50 font-roboto text-gray-700 placeholder:text-gray-400 focus-visible:ring-[#331d67]/30";

export default function ShippingInformation({ onChange }: Props) {
  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      const parsed = formSchema.safeParse(value);
      if (parsed.success) {
        onChange(parsed.data);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  return (
    <div className="w-full">
      <div className="mb-5">
        <h2 className="text-lg md:text-xl font-roboto font-semibold text-[#331d67]">
          Shipping Information
        </h2>
        <p className="text-sm text-gray-500 font-roboto mt-1">
          Where should we deliver your order?
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600 font-roboto">Full name</FormLabel>
                <FormControl>
                  <Input className={fieldClassName} placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 font-roboto">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className={fieldClassName}
                      placeholder="you@example.com"
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
                  <FormLabel className="text-gray-600 font-roboto">Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      className={fieldClassName}
                      placeholder="+251..."
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
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600 font-roboto">Street address</FormLabel>
                <FormControl>
                  <Textarea
                    className={`${fieldClassName} min-h-[88px] py-3`}
                    placeholder="House number, street, landmark"
                    {...field}
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
                  <FormLabel className="text-gray-600 font-roboto">City</FormLabel>
                  <FormControl>
                    <Input className={fieldClassName} placeholder="Addis Ababa" {...field} />
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
                  <FormLabel className="text-gray-600 font-roboto">State / Region</FormLabel>
                  <FormControl>
                    <Input className={fieldClassName} placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="zip_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 font-roboto">Zip code</FormLabel>
                  <FormControl>
                    <Input className={fieldClassName} placeholder="1000" {...field} />
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
                  <FormLabel className="text-gray-600 font-roboto">Country</FormLabel>
                  <FormControl>
                    <Input className={fieldClassName} placeholder="Ethiopia" {...field} />
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
